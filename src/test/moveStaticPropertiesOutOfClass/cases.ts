/** old-001 **/
{
    class A {
        private static a = 1;
    }
}
/** new-001 **/
{
}
/** old-002 **/
{
    class A {
        protected static a = 1;
    }
}
/** new-002 **/
{
}
/** old-003 **/
{
    class A {
        public static a = 1;
    }
}
/** new-003 **/
{
}
/** old-004 **/
{
    class A {
        static a = 1;
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
        static a = 1;
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