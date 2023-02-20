import { parse as toml_parse, stringify as toml_stringify } from "https://deno.land/std@0.177.0/encoding/toml.ts";
import {Entry, OrthoText} from "./entry.ts";


async function round_trip_test(entry_toml_path: string) {
    const entry_toml_text = await Deno.readTextFile(entry_toml_path);
    const entry = toml_parse(entry_toml_text);
    console.info(toml_stringify(entry));
    super_toml_stringify(entry);
}

function super_toml_stringify(data: any): string {

    for (const key in data) {
        console.info ("key:",key);
        const value = data[key];
        console.info("value:", typeof value);
    }

    return "cat";
}

function toml_entry(entry): string {
    
    toml_key_and_value("_id",entry._id,"");   
    toml_key_and_value("public_id",entry.public_id,"");
    toml_key_and_value("part_of_speech",entry.part_of_speech,"");   
    
}

function toml_key_and_value (key:string, value:any, indent:string) :string
{
    switch (typeof value) {
        case "string":
            return indent + key + " = " + toml_string(value) + "\n";
        default:
            throw new Error (`Unhandled type ${value}`);
    }
}

function toml_string (text:string): string {
    if (typeof text !== 'string')
        throw new Error (`expected sting, got: "${text}"`);

    if (text.indexof("'''") !== -1)
        return toml_single_line_string(text);
    else if (text.indexof("\n") !== -1)
        return toml_multi_line_string(text);
    else
        return toml_single_line_string(text);
}

function toml_single_line_string(text:string): string {
    let newtext = text.replaceAll("\\","\\\\");
    newtext = newtext.replaceAll('"','\\"');
    newtext = newtext.replaceAll("\n","\\\n");
    return '"'+newtext+'"';
}

function toml_multi_line_string(text:string): string {
    if (text.indexOf("'''") !== -1)
        throw new Error (`too many quotes :"${text}"`);
    return "'''\n" + text + "'''";
}

await round_trip_test("../lexbuilder/entries/a/ajipjutoq/data.toml");
