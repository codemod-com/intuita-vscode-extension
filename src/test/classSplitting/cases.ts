/** old-001 **/
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
/** new-001 **/
{
    class A0 {
        pa = 1;

        ma(): void {
            console.log(this.pa);
        }
    }

    class A1 {
        pb = 2;

        mb(): void {
            console.log(this.pb);
        }
    }

    class A2 {
        pc = 3;

        mc(): void {
            console.log(this.pc);
        }
    }
}