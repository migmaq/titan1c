/**
 * An example 'end user' deep 'subclassing' of titan1c.
 *
 * The user could create a file like this sample in a text editor,
 * download 'deno', then this command:
 *
 * $ deno run -A mytitan1c.ts
 *
 * Would start the end-user customized dictionary editor.
 *
 * While there are limits to this technique 
 */

//import {Titan1c} from 'https://titan1c.org/@1.0/titan1c.ts';
import {Titan1c} from './titan1c.ts';

export class MyTitan1c extends Titan1c {}
export namespace MyTitan1c {
    export class SiteGenerator extends Titan1c.SiteGenerator {}
    export namespace SiteGenerator {
        export class DictionarySearchPage extends Titan1c.SiteGenerator.DictionarySearchPage {
            greet(): string { return 'my greeting'; }
        }
    }
}

if (import.meta.main)
    new MyTitan1c().cli();

