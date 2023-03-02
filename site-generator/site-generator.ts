import {CustomError} from "../utils/errors.ts";
import {typeof_extended} from "../utils/utils.ts";
import {DictionarySnapshot} from "../model/dictionary-data.ts";
import * as liquid from "https://esm.sh/liquidjs@10.6.0";
//import * as liquid_loader from "https://esm.sh/liquidjs@10.6.0/fs/loader";

export class SiteGenerator {
    template_engine: liquid.Liquid;
    
    constructor(public dictionary: DictionarySnapshot,
                public publish_root_dir: string) {
        const templates_root = 'site-templates';
        this.template_engine = new liquid.Liquid({
            strictFilters: true,
            strictVariables: true,
            outputEscape: 'escape',
            root: `${templates_root}/pages`,
            partials: `${templates_root}/partials`,
            layouts: `${templates_root}/layouts`,
            cache: true,
        });
    }

    async publish() {
        console.info(`Publishing to ${this.publish_root_dir}`)
        console.time('publishing');

        // --- If directory does not exist, create it and put
        //     the special marker file in it.
        await Deno.mkdir(this.publish_root_dir, { recursive: true });
        console.info('made dir', this.publish_root_dir);

        // --- TODO If the directory does exist, confirm that it has
        //     the special marker file.

        // TODO: figure out how to remove files that are no longer
        //       part of the output set.

        ///console.info(`Entries for location ${this.dictionary.entries.entries_for_category('location')}`);


        
        // --- Publish all entry pages

        //await this.template_engine.parseFile('filename');
        

        

        // --- Publish search page
        // const search_page_template =
        //     await Deno.readTextFile(
        //         './site-generator/dictionary-search-page.liquid');
        const search_page = this.dictionary_search_page_factory(
            this.dictionary, 'dictionary-search-page.liquid');
        const scope = search_page.create_scope();
        const output = await search_page.generate(scope);
        console.info('SEARCH PAGE', output);
        console.timeEnd('publishing');
        console.info('...Done');
    }
    
    dictionary_search_page_factory(dictionary: DictionarySnapshot,
                                   template_text: string) {
        return new (<typeof SiteGenerator>this.constructor).
            DictionarySearchPage(this, dictionary, template_text);
    }
    
    dictionary_entry_page_factory(dictionary: DictionarySnapshot,
                                  template_text: string) {
        return new (<typeof SiteGenerator>this.constructor).
            DictionaryEntryPage(this, dictionary, template_text);
    }

    dictionary_category_page_factory(dictionary: DictionarySnapshot,
                                     template_text: string) {
        return new (<typeof SiteGenerator>this.constructor).
            DictionaryCategoryPage(this, dictionary, template_text);
    }
}

export namespace SiteGenerator {

    export abstract class Page {
        constructor(public site_generator: SiteGenerator,
                    public dictionary: DictionarySnapshot,
                    public template_name: string) {
        }

        /**
         *
         * Note: we have the liquid.js cache enabled, so we don't mind
         * 'loading' the template on every render.
         */
        async load_template(): Promise<liquid.Template[]> {
            return await this.site_generator.template_engine.parseFile(this.template_name);        }
        
        async generate(scope: object): Promise<any> {
            const template = await this.load_template();
            return this.site_generator.template_engine.render(template, scope);
        }
    }
    
    export class DictionarySearchPage extends Page {
        create_scope(): object {
            return {
                dictionary: this.dictionary,
                name: 'alice',
                enemy: {
                    name: 'barry<>',
                    foo: [1,2,3],
                },
                parents: [
                    { name: 'bob' },
                    { name: 'noodle' },
                ],
            };
        }
    }

    export class DictionaryEntryPage extends Page {
        create_scope(entry_id: string): object {
            return {}
        }
    }

    export class DictionaryCategoryPage extends Page {
        create_scope(): object {
            return {};
        }
    }
}
