export class A {
    static a<T extends boolean, U extends number, V extends string>(p1: T, p2: U, p3: V): null {
        return null;
    }
}

A.a(false, 0, "");