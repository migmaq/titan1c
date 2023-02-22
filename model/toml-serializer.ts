import { parse as toml_parse, stringify as toml_stringify } from "https://deno.land/std@0.177.0/encoding/toml.ts";
 import {CEntry as Entry} from "./entry.ts";


async function round_trip_test(entry_toml_path: string) {
    const entry_toml_text = await Deno.readTextFile(entry_toml_path);
    const entry = toml_parse(entry_toml_text);
    //console.info(toml_stringify(entry));
    super_toml_stringify(entry);
}

function super_toml_stringify(data: any): string {
    // console.info(Object.getOwnPropertyNames((new Entry()).categories[0]));
    // console.info(typeof(new Entry()).categories[0]);
    for (const key in data) {    
        toml_stringify_data("",key,data[key],0,false);
    }
    return "";
}

function toml_stringify_data(parent_key: string, key: string, data: any,tabs: number,arr: boolean): string {
    const tab = "   ";
    const tab_text = tab.repeat(tabs);
    let type = "";
    let full_key = key;
    if (parent_key !=="") { full_key = `${parent_key}.${key}` ; }
    if (Array.isArray(data)) { type = "array";}
    else { type = typeof(data); }
    // console.info(tab_text, "Type:", type);
    
    switch (type)
    {
        case "object":
            // console.info(tab_text, "{");
            for (const curkey in data) {
                // console.info (tab + tab_text, "key:",key);
                toml_stringify_data(full_key,curkey, data[curkey],tabs+1,arr);
            }
            // console.info(tab_text, "}");
            break;
        case "array":
            if (data.length === 0) {
                console.info(`${tab.repeat(tabs)}${full_key}= []`);
            }
            else {
                // console.info(tab_text, key, "= [");
                for (const element of data){
                    // console.info("\n",tab_text, "[[",key, "]]");
                    console.info(`\n${tab.repeat(tabs)}[[${full_key}]]`);
                    toml_stringify_data("",full_key,element,tabs,true);
                }
                // console.info(tab_text, "]");
            }
            break;
        case "string":
            if (arr) {
                tabs--;
                full_key = key
            }
            console.info(`${tab.repeat(tabs)}${full_key} = ${toml_string(data)}`);
            break;
        default:
            if (arr) {
                tabs--;
                full_key = key
            }
            console.info(`${tab.repeat(tabs)}${full_key} = ${data}`);
    }

    return "";
}

function toml_entry(entry): string {
    
    toml_key_and_value("_id",entry._id,"");   
    toml_key_and_value("public_id",entry.public_id,"");
    toml_key_and_value("part_of_speech",entry.part_of_speech,"");   

    return "";
    
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

    if (text.indexOf("'''") !== -1)
        return toml_single_line_string(text);
    else if (text.indexOf("\n") !== -1)
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
    return "'''" + text + "'''";
}

await round_trip_test("./model/sample-data.toml");
