export class A {
    static a<T extends boolean, U extends number, V extends string, R>(p1: T, p2: U, p3: V): R | null {
        return null;
    }
}

A.a<boolean, number, string, null>(false, 0, "");

const variable = A.a(false, 0, "");