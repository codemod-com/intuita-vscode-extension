import {ClassInstanceProperty} from "./classInstanceProperty";
import {Mutability} from "./mutability";

export type Method = Readonly<{
    propertyNames: ReadonlyArray<string>,
    mutability: Mutability,
}>;

export const getMethodMap = (
    properties: ReadonlyArray<ClassInstanceProperty>
): ReadonlyMap<string, Method> => {
    const methodMap = new Map<string, Method>;

    properties.forEach(
        (property) => {
            property.methodNames.forEach(
                (methodName) => {
                    const method = methodMap.get(methodName);

                    const propertyNames = method?.propertyNames.slice() ?? [];
                    propertyNames.push(property.name);

                    const mutability = property.readonly && ((method?.mutability ?? Mutability.READING_READONLY) === Mutability.READING_READONLY)
                        ? Mutability.READING_READONLY
                        : Mutability.WRITING_WRITABLE

                    methodMap.set(
                        methodName,
                        {
                            propertyNames,
                            mutability,
                        },
                    );
                }
            );
        }
    );

    return methodMap;
};



