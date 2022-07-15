/** old-001 **/
{
    class A {
        private static readonly a = 1;
    }
}
/** new-001 **/
{
}
/** old-002 **/
{
    class A {
        protected static readonly a = 1;
    }
}
/** new-002 **/
{
}
/** old-003 **/
{
    class A {
        public static readonly a = 1;
    }
}
/** new-003 **/
{
}
/** old-004 **/
{
    class A {
        static readonly a = 1;
    }

    A.a
}
/** new-004 **/
{
    const a = 1;
    a
}
/** old-005 **/
{
    class A {
        static readonly a = 1;
    }

    function fnc(b: number) {}

    fnc(A.a)
}
/** new-005 **/
{
    const a = 1;

    function fnc(b: number) {}

    fnc(a)
}
/** old-006 **/
{
    class A {
        static a = 1;
    }

    A.a = 2;
}
/** new-006 **/
{
    let a = 1;
    a = 2;
}