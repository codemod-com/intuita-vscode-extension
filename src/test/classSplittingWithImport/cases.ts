/** oldA-001 **/
/* @ts-ignore */
export class A {
    pa = 1;
    pb = 2;
    pc = 3;

    ma() {
        console.log(this.pa);
    }

    mb() {
        console.log(this.pb);
    }

    mc() {
        console.log(this.pc);
    }
}
/** oldB-001 **/
/* @ts-ignore */
import { A } from './a';

{
    const a = new A();

    a.ma();
    a.mb();
    a.mc();
}
/** newA-001 **/
export class A0 {
    pa = 1;

    ma(): void {
        console.log(this.pa);
    }
}

export class A1 {
    pb = 2;

    mb(): void {
        console.log(this.pb);
    }
}

export class A2 {
    pc = 3;

    mc(): void {
        console.log(this.pc);
    }
}
/** newB-001 **/
/* @ts-ignore */
import { A } from './a';

{
    const a = new A();

    a.ma();
    a.mb();
    a.mc();
}
