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
/* @ts-ignore */
export class A0 {
    pa = 1;

    ma(): void {
        console.log(this.pa);
    }
}

/* @ts-ignore */
export class A1 {
    pb = 2;

    mb(): void {
        console.log(this.pb);
    }
}

/* @ts-ignore */
export class A2 {
    pc = 3;

    mc(): void {
        console.log(this.pc);
    }
}

/** newB-001 **/
/* @ts-ignore */
import { A0, A1, A2 } from './a';

{
    const a0 = new A0();
    const a1 = new A1();
    const a2 = new A2();

    a0.ma();
    a1.mb();
    a2.mc();
}