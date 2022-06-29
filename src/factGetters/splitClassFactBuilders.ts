import {ClassInstanceProperty, ClassInstancePropertyKind} from "../intuitaExtension/classInstanceProperty";
import {uniquify} from "../intuitaExtension/getGroupMap";
import {AccessorFact, MethodFact, NonCallableFact, NonCallableKind} from "./splitClassFacts";
import {InstanceMethod} from "../tsMorphAdapter/getClassInstanceMethods";

export const getNonCallableFactMap = (
    properties: ReadonlyArray<ClassInstanceProperty>
): ReadonlyMap<string, NonCallableFact> => {
    const map = new Map<string, NonCallableFact>();

    properties
        .forEach(
            (property) => {
                const callerNames = uniquify([
                    ...property.methodNames,
                    ...property.setAccessorNames,
                    ...property.getAccessorNames,
                ]);

                const { name } = property;

                if (property.kind === ClassInstancePropertyKind.PARAMETER) {
                    map.set(
                        name,
                        {
                            kind: NonCallableKind.PARAMETER,
                            parameter: {
                                name,
                                readonly: property.readonly,
                                callerNames,
                            },
                        },
                    );
                }

                if (property.kind === ClassInstancePropertyKind.PROPERTY) {
                    map.set(
                        name,
                        {
                            kind: NonCallableKind.PROPERTY,
                            property: {
                                name,
                                readonly: property.readonly,
                                callerNames,
                            },
                        },
                    );
                }
            }
        );

    return map;
};

export const getAccessorFactMap = (
    properties: ReadonlyArray<ClassInstanceProperty>
): ReadonlyMap<string, AccessorFact> => {
    const accessorFactMap = new Map<string, AccessorFact>;

    properties.forEach(
        (property) => {
            const { name } = property;

            if (property.kind === ClassInstancePropertyKind.GET_ACCESSOR) {
                const oldAccessorFact = accessorFactMap.get(name);

                const callerNames = uniquify([
                    ...(oldAccessorFact?.callerNames ?? []),
                    ...property.methodNames,
                    ...property.setAccessorNames,
                    ...property.getAccessorNames,
                ]);

                const newAccessorFact: AccessorFact = {
                    name,
                    getAccessorExists: true,
                    setAccessorExists: oldAccessorFact?.setAccessorExists ?? false,
                    callerNames,
                };

                accessorFactMap.set(
                    name,
                    newAccessorFact,
                );

                return;
            }

            if (property.kind === ClassInstancePropertyKind.SET_ACCESSOR) {
                const oldAccessorFact = accessorFactMap.get(name);

                const callerNames = uniquify([
                    ...(oldAccessorFact?.callerNames ?? []),
                    ...property.methodNames,
                    ...property.setAccessorNames,
                    ...property.getAccessorNames,
                ]);

                const newAccessorFact: AccessorFact = {
                    name,
                    getAccessorExists: oldAccessorFact?.getAccessorExists ?? false,
                    setAccessorExists: true,
                    callerNames,
                };

                accessorFactMap.set(
                    name,
                    newAccessorFact,
                );

                return;
            }
        }
    );

    return accessorFactMap;
};

export const getMethodFactMap = (
    methods: ReadonlyArray<InstanceMethod>
) => {
    const map = new Map<string, MethodFact>();

    methods.map(
        (method) => {
            const { name } = method;

            const callerNames = uniquify([
                ...method.methodNames,
                ...method.setAccessorNames,
                ...method.getAccessorNames,
            ]);

            map.set(
                name,
                {
                    name,
                    callerNames,
                }
            );
        }
    );

    return map;
};