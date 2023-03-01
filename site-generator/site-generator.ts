import {CustomError} from "../utils/errors.ts";
import {typeof_extended} from "../utils/utils.ts";

export class SiteGenerator {
    constructor(public publish_root_dir: string) {
    }

    async publish() {
        console.info(`Publishing to ${this.publish_root_dir}`)
        console.time('publishing');

        // --- If directory does not exist, create it and put
        //     the special marker file in it.
        await Deno.mkdir(this.publish_root_dir, { recursive: true });
        console.info('made dir', this.publish_root_dir);

        // --- If the directory does exist, confirm that it has
        //     the special marker file.

        // TODO: figure out how to remove files that are no longer
        //       part of the output set.

        console.timeEnd('publishing');
        console.info('...Done');
    }
    
    dictionary_search_page_factory() {
        return new (<typeof SiteGenerator>this.constructor).DictionarySearchPage("88");
    }
    
    dictionary_entry_page_factory() {
        return new (<typeof SiteGenerator>this.constructor).DictionaryEntryPage();
    }

    dictionary_category_page_factory() {
        return new (<typeof SiteGenerator>this.constructor).DictionaryCategoryPage();
    }
    
    greet(): string {
        return this.dictionary_search_page_factory().greet();
    }
}
export namespace SiteGenerator {

    // Provides the context for the dictionary search page liquid.js temlate.
    // The template will move into the datastore - but for now is in filesystem.
    export class DictionarySearchPage {
        constructor(public name: string) {}
        greet(): string { return 'hi'; }
    }

    export class DictionaryEntryPage {
    }

    export class DictionaryCategoryPage {
        boo(): string { return '7'; }
    }
}


export class MySiteGenerator extends SiteGenerator {
    greet2(): string {
        return new MySiteGenerator.DictionarySearchPage("99").puppy();
    }
}
export namespace MySiteGenerator {
    export class DictionarySearchPage extends SiteGenerator.DictionarySearchPage {
        puppy(): string { return 'puppy'; }
    }
}







function main() {
    const site_generator = new SiteGenerator('a');
    console.info(site_generator.greet());
    console.info('ss2', SiteGenerator.DictionarySearchPage);

    const my_site_generator = new MySiteGenerator('a');
    console.info(my_site_generator.greet());

}

if (import.meta.main)
    main();
