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
/* @ts-ignore */
    const a = new A();

    a.ma();
    a.mb();
    a.mc();
}
/** newA-001 **/
/* @ts-ignore */
export class A0 {
    public pa = 1;

    public ma() {
        console.log(this.pa);
    }
}

/* @ts-ignore */
export class A1 {
    public pb = 2;

    public mb() {
        console.log(this.pb);
    }
}

/* @ts-ignore */
export class A2 {
    public pc = 3;

    public mc() {
        console.log(this.pc);
    }
}

/** newB-001 **/
/* @ts-ignore */
import { A0, A1, A2 } from './a';

{
    /* @ts-ignore */
    const a0 = new A0();
    /* @ts-ignore */
    const a1 = new A1();
    /* @ts-ignore */
    const a2 = new A2();

    a0.ma();
    a1.mb();
    a2.mc();
}
/** oldA-002 **/
/* @ts-ignore */
export class A {
    constructor(
        public readonly pa: number,
        public readonly pb: number,
        public readonly pc: number,
    ) {
        console.log('A::constructor');
        console.log('in constructor', this.pa);
        console.log('in constructor', this.pb);
        console.log('in constructor', this.pc);
    }

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
/** oldB-002 **/
/* @ts-ignore */
import { A } from './a';

{
    /* @ts-ignore */
    const a = new A(1, 2, 3);

    a.ma();
    a.mb();
    a.mc();
}
/** newA-002 **/
/* @ts-ignore */
export class A0 {
    public constructor(public readonly pa: number) {
        console.log('in constructor', this.pa);
    }

    public ma() {
        console.log(this.pa);
    }
}

/* @ts-ignore */
export class A1 {
    public constructor(public readonly pb: number) {
        console.log('in constructor', this.pb);
    }

    public mb() {
        console.log(this.pb);
    }
}

/* @ts-ignore */
export class A2 {
    public constructor(public readonly pc: number) {
        console.log('in constructor', this.pc);
    }

    public mc() {
        console.log(this.pc);
    }
}

/** newB-002 **/
/* @ts-ignore */
import { A0, A1, A2 } from './a';

{
    /* @ts-ignore */
    const a0 = new A0(1);
    /* @ts-ignore */
    const a1 = new A1(2);
    /* @ts-ignore */
    const a2 = new A2(3);

    a0.ma();
    a1.mb();
    a2.mc();
}