import { CustomError} from './utils/errors.ts';
import { parse as parse_args } from 'https://deno.land/std@0.175.0/flags/mod.ts';
import { Titan1c } from './titan1c.ts';
import {DictionaryData, DictionarySnapshot} from "./model/dictionary-data.ts";

/**
 * Titan1c command line
 */
export class Cli {

    constructor(public titan1c: Titan1c) {
    }

    /**
     * Command line processing entry point.
     *
     * At the bottom of titan1c.ts, or user-overrides, we have:
     *
     * if (import.meta.main)
     *    new Titan1c().cli();
     *
     * Which dispatches here.
     *
     * This mostly just reads the Deno.args, picking out the command
     * and command-args, and forwards onward.
     *
     * This factoring is done both to isolate the Deno args processing in
     * one place, and to make it cleaner to for example add a new command.
     * (override dispatch_command())
     *
     * TODO: factor the Deno args getting out somehow, for when
     *       we want to run the system in other enviroments etc.
     * TODO: probably should factor all the system interaction stuff
     *       (like arg processing) into some sort of system inteface
     *       anyway.
     */
    async cli(): Promise<void> {
        if(Deno.args.length < 1)
            throw new UsageError('no arguments provided');
        const command = Deno.args[0];
        const command_args = Deno.args.slice(1);
        return this.dispatch_command(command, command_args);
    }

    /**
     * Dispatch commands to their various handlers by command name.
     */
    async dispatch_command(command:string, command_args: string[]): Promise<void> {
        switch(command) {
            case 'publish':
                return this.publish_cli(command_args);
            case 'test':
                return this.test_cli(command_args);
            default:
                throw new UsageError(`unknown command ${command}`);
        }
    }

    /**
     *
     */
    async publish_cli(args: string[]): Promise<void> {

        // XXX should be using some 3rd party arg processor - not
        //     the Deno std one (unless we can extract it) - will
        //     make it harder to run in other environments.
        const flags = parse_args(args, {
            boolean: ["help", "color"],
            string: ["out_dir"],
            default: { color: true, out_dir: 'published' },
        });

        // TODO XXX: loading the dictionary data directly here is
        //           maybe a bit skeezy ???  At least the config
        //           for it needs from somewhere else.
        const dictionary_data = new DictionaryData(".");
        console.time("loading dictionary");
        await dictionary_data.load();
        console.timeEnd("loading dictionary");
        const dictionary_snapshot = dictionary_data.snapshot();
        return this.titan1c.site_generator_factory(dictionary_snapshot,
                                                   flags.out_dir).publish();
    }

    async test_cli(args: string[]): Promise<void> {
        // console.info(this.titan1c.site_generator_factory("published").dictionary_search_page_factory().greet());
        //this.test();

        const dictionary_data = new DictionaryData(".");
        console.time("loading dictionary");
        await dictionary_data.load();
        console.timeEnd("loading dictionary");


        for(let i=0; i<100; i++) {
            console.time("snapshot");
            const dictionary_snapshot = dictionary_data.snapshot_factory();
            console.timeEnd("snapshot");
        }
            


        
        return Promise.resolve();
    }
}

export class UsageError extends CustomError {
    public constructor(
	message?: string,
    ) {
	super(message)
    }
}
