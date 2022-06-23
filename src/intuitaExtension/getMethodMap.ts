import {ClassInstanceProperty} from "./classInstanceProperty";
import {Mutability} from "./mutability";

type Method = Readonly<{

}>;

const methodNameToPropertyNamesMap = new Map<string, string[]>();
const methodNameToMutabilityMap = new Map<string, Mutability>();

export const getMethodMap = (
    properties: ReadonlyArray<ClassInstanceProperty>
) => {
    properties.forEach(
        (property) => {
            property.methodNames.forEach(
                (methodName) => {
                    const propertyNames = methodNameToPropertyNamesMap.get(methodName) ?? [];
                    propertyNames.push(property.name);

                    methodNameToPropertyNamesMap.set(methodName, propertyNames);

                    let mutability = methodNameToMutabilityMap.get(methodName)

                    mutability = property.readonly && ((mutability ?? Mutability.READING_READONLY) === Mutability.READING_READONLY)
                        ? Mutability.READING_READONLY
                        : Mutability.WRITING_WRITABLE;

                    // does not support RW
                    methodNameToMutabilityMap.set(methodName, mutability)
                }
            )
        }
    )
}

console.log(methodNameToPropertyNamesMap);
console.log(methodNameToMutabilityMap);


