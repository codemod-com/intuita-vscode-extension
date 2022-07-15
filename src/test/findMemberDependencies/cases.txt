/** old-001 **/
{
    class A {}
}
/** old-002 **/
{
    class A {
        ma() {
            console.log('ma');
        }
    }
}
/** old-003 **/
{
    class A {
        readonly pa = 1;

        ma() {
            return this.pa;
        }
    }
}
/** old-004 **/
{
    class A {
        pa = 1;

        ma() {
            console.log(this.pa);
        }
    }
}
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
/** old-009 **/
{
    class A {
        ma() {
            this.mb();
        }

        mb() {
            this.mc();
        }

        mc() {
            console.log('mc');
        }
    }
}
/** old-010 **/
{
    class A {
        ma() {
            this.ma();
        }
    }
}
/** old-011 **/
{
    class A {
        ma() {
            this.mb();
        }

        mb() {
            this.ma();
        }
    }
}

/** old-012 **/
{
    class A {
        ma() {
            this.mb();
        }

        mb() {
            this.ma();
        }

        mc() {
            this.md();
        }

        md() {
            console.log('md');
        }
    }
}

/** old-013 **/
{
    class A {
        pa = 1;
        pb = 2;

        ma() {
            ++this.pa;
            this.mb();
        }

        mb() {
            --this.pb;
            this.ma();
        }
    }
}

/** old-013 **/
{
    class A {
        pa = 1;
        private _pb: number = 2;

        ma() {
            ++this.pa;
            this.mb();
        }

        mb() {
            console.log(this.pa);
        }

        mc() {
            return this.pb;
        }

        md() {
            this.pb = 3;
        }

        get pb(): number {
            this.mb();

            return this._pb;
        }

        set pb(pb: number) {
            this.mb();

            this._pb = pb;
        }
    }
}