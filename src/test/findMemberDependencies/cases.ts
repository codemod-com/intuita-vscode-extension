/** old-001 **/
{
    class A {}
}
/** new-001 **/

/** old-002 **/
{
    class A {
        ma() {

        }
    }
}
/** new-002 **/


/** old-003 **/
{
    class A {
        readonly pa = 1;

        ma() {
            return this.pa;
        }
    }
}
/** new-003 **/

/** old-004 **/
{
    class A {
        pa = 1;

        ma() {
            console.log(this.pa);
        }
    }
}
/** new-004 **/

/** old-005 **/
{
    class A {
        readonly pa = 1;
        readonly pb = 2;
        readonly pc = 3;

        ma() {
            console.log(this.pa);
            console.log(this.pb);
            console.log(this.pc);
        }
    }
}
/** new-005 **/

/** old-006 **/
{
    class A {
        pa = 1;
        pb = 2;
        pc = 3;

        ma() {
            console.log(this.pa);
            console.log(this.pb);
            console.log(this.pc);
        }
    }
}
/** new-006 **/

/** old-007 **/
{
    class A {
        readonly pa = 1;
        pb = 2;
        pc = 3;

        ma() {
            console.log(this.pa);
            console.log(this.pb);
            console.log(this.pc);
        }
    }
}
/** new-007 **/

/** old-008 **/
{
    class A {
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
}
/** new-008 **/
