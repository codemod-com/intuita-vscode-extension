/** oldA-001 **/
/* @ts-ignore */
export class A {
    static a = 1;
}

/** oldB-001 **/
/* @ts-ignore */
import { A } from './a';
console.log(A.a);

/** newA-001 **/
/* @ts-ignore */
export let a = 1;

/** newB-001 **/
/* @ts-ignore */
import { a } from "./a";

console.log(a);
