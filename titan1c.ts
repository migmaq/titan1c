/**
 *
 */
import * as generator from './site-generator/site-generator.ts';
import * as cli from './cli.ts';

export class Titan1c {

    async cli(): Promise<void> {
        return this.cli_factory().cli();
    }
    
    cli_factory() {
        return new (<typeof Titan1c>this.constructor).Cli(this);
    }
    site_generator_factory(publish_root_dir: string) {
        return new (<typeof Titan1c>this.constructor).SiteGenerator(publish_root_dir);
    }
}

export namespace Titan1c {
    export class Cli extends cli.Cli {}
    export class SiteGenerator extends generator.SiteGenerator {}
}

if (import.meta.main)
    await new Titan1c().cli();
