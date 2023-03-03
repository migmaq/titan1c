export function createSchema(): object {
    let schema = {};
    schema.Entry = [];
    schema.Entry.push ({key:'_id',type:'string'});
    schema.Entry.push ({key:'public_id',type:'string'});
    schema.Entry.push ({key:'part_of_speech',type:'string'});
    schema.Entry.push ({key:'internal_note',type:'string'});
    schema.Entry.push ({key:'public_note',type:'string'});
    schema.Entry.push ({key:'last_modified_date',type:'string'});

    schema.Entry.push ({key:'spellings',type:'object',class:'OrthoText',array:true});
    schema.Entry.push ({key:'definitions',type:'object',class:'Definition',array:true});
    schema.Entry.push ({key:'glosses',type:'object',class:'Gloss',array:true});
    schema.Entry.push ({key:'examples',type:'object',class:'Example',array:true});

    schema.Entry.push ({key:'pronunciation_guide',class:'OrthoText',type:'object',array:true});
    
    schema.Entry.push ({key:'categories',class:'Category',type:'object',array:true});
    schema.Entry.push ({key:'related_entries',class:'RelatedEntry',type:'object',array:true});

    schema.Entry.push ({key:'alternate_grammatical_forms',class:'AlternateGrammaticalForm',type:'object',array:true});
    schema.Entry.push ({key:'other_regional_forms',class:'OtherRegionalForm',type:'object',array:true});
    schema.Entry.push ({key:'other_attrs',class:'OtherAttrs',type:'object',array:true});

    schema.Entry.push ({key:'status',class:'Status',type:'object',array:true});

    schema.OrthoText = [];
    schema.OrthoText.push ({key:'variant',type:'string'});
    schema.OrthoText.push ({key:'text',type:'string'});

    schema.Definition = [];
    schema.Definition.push ({key:'definition',type:'string'});

    schema.Gloss = [];
    schema.Gloss.push ({key:'gloss',type:'string'});

    schema.Example = [];
    schema.Example.push ({key:'translation',type:'string'});
    schema.Example.push ({key:'text',class:'OrthoText',type:'object',array:true});

    schema.AlternateGrammaticalForm = [];
    schema.AlternateGrammaticalForm.push ({key:'gloss',type:'string'});
    schema.AlternateGrammaticalForm.push ({key:'grammatical_form',type:'string'});
    schema.AlternateGrammaticalForm.push ({key:'text',class:'OrthoText',type:'object',array:true});

    schema.Category = [];
    schema.Category.push ({key:'category',type:'string'});

    schema.RelatedEntry = [];
    schema.RelatedEntry.push ({key:'unresolved_text',type:'string'});

    schema.OtherRegionalForm = [];
    schema.OtherRegionalForm.push ({key:'text',type:'string'});

    schema.OtherAttrs = [];
    schema.OtherAttrs.push ({key:'attr',type:'string'});
    schema.OtherAttrs.push ({key:'value',type:'string'});

    schema.Status = [];
    schema.Status.push ({key:'variant',type:'string'});
    schema.Status.push ({key:'status',type:'string'});
    schema.Status.push ({key:'details',type:'string'});

    return schema;
}

createSchema();