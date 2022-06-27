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
        public pa = 1;

        public ma() {
            console.log(this.pa);
        }
    }

    class A1 {
        public pb = 2;

        public mb() {
            console.log(this.pb);
        }
    }

    class A2 {
        public pc = 3;

        public mc() {
            console.log(this.pc);
        }
    }
}
/** old-002 **/
{
    class A<T> {
        readonly pa = 1;
        readonly pb = 2;

        ma<U, V>(a: number): number {
            console.log(a, this.pa);

            return 1;
        }

        mb<U, V, R>(b: string): T | null {
            console.log(b, this.pb);

            return null;
        }
    }
}
/** new-002 **/
{
    class A0<T> {
        public readonly pa = 1;

        public ma<U, V>(a: number): number {
            console.log(a, this.pa);

            return 1;
        }
    }

    class A1<T> {
        public readonly pb = 2;

        public mb<U, V, R>(b: string): T | null {
            console.log(b, this.pb);

            return null;
        }
    }
}
/** old-003 **/
{
    class A {
        _pa = 1;
        _pb = 2;

        public get pa(): number {
            return this._pa;
        }

        public set pa(_pa: number) {
            this._pa = _pa;
        }

        protected get pb(): number {
            return this._pb;
        }

        protected set pb(_pb: number) {
            this._pb = _pb;
        }

        ma() {
            return this.pa;
        }

        mb() {
            return this.pb;
        }
    }
}

/** new-003 **/
{
    class A0 {
        public _pa = 1;

        public get pa(): number {
            return this._pa;
        }

        public set pa(_pa: number) {
            this._pa = _pa;
        }

        public ma() {
            return this.pa;
        }
    }

    class A1 {
        public _pb = 2;

        protected get pb(): number {
            return this._pb;
        }

        protected set pb(_pb: number) {
            this._pb = _pb;
        }

        public mb() {
            return this.pb;
        }
    }
}

/** old-004 **/
{
    class A<T, U> {
        private _pa: T | null = null;
        private _pb: U | null = null;

        public get pa(): T | null {
            return this._pa;
        }

        public set pa(_pa: T | null) {
            this._pa = _pa;
        }

        protected get pb(): U | null {
            return this._pb;
        }

        protected set pb(_pb: U | null) {
            this._pb = _pb;
        }

        public ma(): T | null {
            return this.pa;
        }

        public mb(): U | null {
            return this.pb;
        }
    }
}

/** new-004 **/
{
    class A0<T, U> {
        private _pa: T | null = null;

        public get pa(): T | null {
            return this._pa;
        }

        public set pa(_pa: T | null) {
            this._pa = _pa;
        }

        public ma(): T | null {
            return this.pa;
        }
    }

    class A1<T, U> {
        private _pb: U | null = null;

        protected get pb(): U | null {
            return this._pb;
        }

        protected set pb(_pb: U | null) {
            this._pb = _pb;
        }

        public mb(): U | null {
            return this.pb;
        }
    }
}
