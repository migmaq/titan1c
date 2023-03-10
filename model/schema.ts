import {CustomError} from "../utils/errors.ts";
import {typeof_extended} from "../utils/utils.ts";

/**
 * A field in a record.  subclassed by field type, including subrelation fields.
 */
export abstract class Field {
    constructor(public name: string) {
        this.name = name;
    }
    
    abstract validate(locus: string, data: any): void;

    abstract schema_to_json(): any;
}

/**
 *
 */
export abstract class ScalarField extends Field {
    constructor(name: string, public optional: boolean) {
        super(name);
        this.optional = optional;
    }

    abstract typename(): string;

    /**
     * Validate a value against this schema node.
     *
     * If the value does not validate, throws a ValidationError
     */
    validate(locus: string, value: any) {
        if(value == null || value == undefined) {
            if(this.optional)
                return;
            else
                throw new ValidationError(locus, 'missing required value');
        } else {
            return this.validate_required(locus, value);
        }
    }

    /**
     *
     */
    validate_required(locus: string, value: any) {
        let expected_typename = this.typename();
        let actual_typename = typeof_extended(value);
        if (actual_typename != expected_typename)
            throw new ValidationError(locus, `expected ${expected_typename} value - got value ${value} with type ${actual_typename}`);
    }

    /**
     * Returns this schema node in it's JSON serialization.
     */
    schema_to_json(): any {
        return this.build_schema_to_json(this.typename(), null);
    }

    /**
     * Factoring of the common parts of the schema_to_json() method
     * to make per-type field implementations less bulky.
     */
    build_schema_to_json(typ: string, extra_fields: any): any {
        let json = { $type: this.typename() } as any; // XXX fix typing
        if (this.optional)
            json.$optional = true;
        if (extra_fields)
            Object.assign(json, extra_fields)
        return json;
    }
}

/**
 *
 */
export class StringField extends ScalarField {
    constructor(name: string, optional: boolean) {
        super(name, optional);
    }

    typename(): string { return 'string'; }

    static parse_schema(locus: string, name: string, schema: any): StringField {
        
        const {$type, optional, ...field_schema} = schema;
        if($type !== 'string')
            throw new ValidationError(locus, `expected string type`);
        return new StringField(name, !!optional);
    }
}

/**
 *
 */
export class BooleanField extends ScalarField {
    constructor(name: string, optional: boolean) {
        super(name, optional);
    }

    typename(): string { return 'boolean'; }
    
    static parse_schema(locus: string, name: string, schema: any): BooleanField {
        // TODO: clean and refactor
        const {$type, optional, ...field_schema} = schema;
        if($type !== 'boolean')
            throw new ValidationError(locus, `expected boolean type`);
        return new BooleanField(name, !!optional);
    }
}

// Relation vs SubRelation - top level etc.
export class RelationField extends Field {
    //fields: any; //{[name: string]: Field}; // TODO: fix this typing

    constructor(name: string, public fields: any) {
        super(name);
        this.fields = fields;
    }

    non_relation_fields() {
        return this.fields.filter(f=>!(f instanceof RelationField));
    }

    relation_fields() {
        return this.fields.filter(f=>f instanceof RelationField);
    }

    validate(locus: string, value: any) {
        const relation_locus = locus + '/' + this.name;
        for(const field_name of this.fields) {
            const field = this.fields[field_name];
            const field_value = value[field_name];
            field.validate(relation_locus, field_value);
        }
    }

    /**
     * Returns this schema node in it's JSON serialization.
     */
    // TODO: 'relation'/'subrelation' split is BAD!
    schema_to_json(): any {
        let json = {} as any; // fix typing
        json.$type = 'relation';
        for(const field_name of Object.getOwnPropertyNames(this.fields)) {
            json[field_name] = this.fields[field_name].schema_to_json();
        }
        return json;
    }
    
    static parse_schema(locus: string, name: string, schema: any): RelationField {
        const {$type, ...field_schema} = schema;
        if($type !== 'relation' && $type !== 'subrelation')
            throw new ValidationError(locus, `expected relation or subrelation type`);
        let fields = {} as any;
        //console.info("field_schema", typeof field_schema, field_schema, field_schema.part_of_speech);
        
        for(const field_name of Object.getOwnPropertyNames(field_schema)) {
            const field_body = field_schema[field_name];
            // TODO: locus is wrong here.
            fields[field_name] = parse_field(locus, name, field_body);
        }

        return new RelationField(name, fields);
    }
}

export function parse_field(locus: string, name: string, schema: any): Field {
    const typ = schema.$type;
    switch(typ) {
        case 'relation':
        case 'subrelation':
            return RelationField.parse_schema(locus, name, schema);
        case 'string':
            return StringField.parse_schema(locus, name, schema);
        case 'boolean':
            return BooleanField.parse_schema(locus, name, schema);
        default:
            throw new ValidationError(locus, `unknown field type ${schema.$type}`);
    }
}

/**
 * Thrown by validate methods to report a validation error.
 */
export class ValidationError extends CustomError {
    constructor(locus: string, message: string) {
        super(`${locus}: ${message}`);
    }
}

const sample_entry_schema = {
    $type: 'relation',
    part_of_speech: {$type: 'string'},
    internal_note: {$type: 'string'},
    public_note: {$type: 'string' },
    subentry: {
        $type: 'relation',
        spelling: {
            $type: 'relation',
            text: {$type: 'string'},
            variant: {$type: 'string'}
        },
        definition: {
            $type: 'relation',
            definition: {$type: 'string'},
            variant: {$type: 'string'}
        },
        gloss: {
            $type: 'relation',
            gloss: {$type: 'string'}
        },
        example: {
            $type: 'relation',
        },
        recording: {
            $type: 'subrelation',
            speaker: {$type: 'string'},
            recording: {$type: 'string'},
            variant: {$type: 'string'}
        },
        pronunciation_guide: {
            $type: 'subrelation',
            text: {$type: 'string'},
            variant: {$type: 'string'},
        },
    }
}

// [[part_of_speech]]
//    $type: 'string'
// [[subentry]]
//    $type: 'relation'
//    [[spelling]]
//      $type: 'relation'
//      [[text]]
//        $type: 'string'
//      [[variant]]
//        $type: 'string'
//    [[definition]]
//      $type: 'relation'
//      [[definition]]
//        $type: 'string',
//      [[variant]]
//        $type: 'string',


function main() {
    console.info('Hello.');
    let schema = RelationField.parse_schema('entry', 'entry', sample_entry_schema);
    console.info('Schema', schema);
    let dumped_schema_json = schema.schema_to_json();
    console.info('Schema again', dumped_schema_json);
}

if (import.meta.main)
    main();
