/**
 *
 */
import * as generator from './site-generator/site-generator.ts';
import * as cli from './cli.ts';
import {DictionarySnapshot} from "./model/dictionary-data.ts";

export class Titan1c {

    async cli(): Promise<void> {
        return this.cli_factory().cli();
    }
    
    cli_factory() {
        return new (<typeof Titan1c>this.constructor).Cli(this);
    }
    site_generator_factory(dictionary: DictionarySnapshot,
                           publish_root_dir: string) {
        return new (<typeof Titan1c>this.constructor).SiteGenerator(
            dictionary, publish_root_dir);
    }
}

export namespace Titan1c {
    export class Cli extends cli.Cli {}
    export class SiteGenerator extends generator.SiteGenerator {}
}

if (import.meta.main)
    await new Titan1c().cli();
