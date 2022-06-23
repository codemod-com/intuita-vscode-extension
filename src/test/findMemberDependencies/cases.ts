/** old-001 **/
{
    class A {}
}
/** new-001 **/

/** old-002 **/
{
    class A {
        public ma() {

        }
    }
}
/** new-002 **/


/** old-003 **/
{
    class A {
        private readonly pa = 1;

        public ma() {
            return this.pa;
        }
    }
}
/** new-003 **/

/** old-004 **/
{
    class A {
        private pa = 1;

        public ma() {
            return this.pa;
        }
    }
}
/** new-004 **/

/** old-005 **/
{
    class A {
        private readonly pa = 1;
        private readonly pb = 2;
        private readonly pc = 3;

        public ma() {
            console.log(this.pa);
            console.log(this.pb);
            console.log(this.pc);
        }
    }
}
/** new-005 **/
