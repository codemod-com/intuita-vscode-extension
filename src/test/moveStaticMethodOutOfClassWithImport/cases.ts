/** oldA-001 **/
/* @ts-ignore */
export class A {
    static a() {};
}

/** oldB-001 **/
/* @ts-ignore */
import { A } from './a';
console.log(A.a());

/** newA-001 **/
/* @ts-ignore */
export function a() {}

/** newB-001 **/
/* @ts-ignore */
import { a } from "./a";

console.log(a());
