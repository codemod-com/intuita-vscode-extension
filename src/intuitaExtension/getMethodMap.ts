import {ClassInstanceProperty} from "./classInstanceProperty";
import {concatMutabilities, Mutability} from "./mutability";
import {InstanceMethod} from "../tsMorphAdapter/getClassInstanceMethods";

export type Method = Readonly<{
    methodNames: ReadonlyArray<string>,
    propertyNames: ReadonlyArray<string>,
    propertyMutability: Mutability,
}>;

export const getMethodMap = (
    properties: ReadonlyArray<ClassInstanceProperty>,
    methods: ReadonlyArray<InstanceMethod>,
): ReadonlyMap<string, Method> => {
    const methodMap = new Map<string, Method>(
        methods.map(({ name, calleeNames}) => ([
            name,
            {
                propertyNames: [],
                methodNames: calleeNames,
                propertyMutability: Mutability.READING_READONLY,
            }
        ]))
    );

    properties.forEach(
        (property) => {
            const accessorNames = properties
                .filter(
                    (otherProperty) => {
                        return otherProperty.setAccessorNames.includes(property.name) ||
                            otherProperty.getAccessorNames.includes(property.name);
                    }
                )
                .map((otherProperty) => otherProperty.name);

            property.methodNames.forEach(
                (methodName) => {
                    const method = methodMap.get(methodName);

                    if (!method) {
                        return;
                    }

                    const propertyNames = method.propertyNames.slice();
                    propertyNames.push(property.name);
                    propertyNames.push(...accessorNames);

                    const propertyMutability = concatMutabilities(
                        [
                            ('readonly' in property ? property.readonly : false)
                                ? Mutability.READING_READONLY
                                : Mutability.WRITING_WRITABLE,
                            method.propertyMutability,
                        ]
                    );

                    methodMap.set(
                        methodName,
                        {
                            propertyNames,
                            propertyMutability,
                            methodNames: method.methodNames,
                        },
                    );
                }
            );
        }
    );

    return methodMap;
};



