import {ClassInstanceProperty, ClassInstancePropertyKind} from "../intuitaExtension/classInstanceProperty";
import {uniquify} from "../intuitaExtension/getGroupMap";
import {
    AccessorFact,
    CallableFact,
    CallableFactKind,
    MethodFact,
    NonCallableFact,
    NonCallableKind
} from "./splitClassFacts";
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
                            fact: {
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
                            fact: {
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
                    empty: false,
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
                    empty: false,
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
): ReadonlyMap<string, MethodFact> => {
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
                    empty: method.empty,
                }
            );
        }
    );

    return map;
};

export const getCallableFactMap = (
    accessorFactMap: ReadonlyMap<string, AccessorFact>,
    methodFactMap: ReadonlyMap<string, MethodFact>,
): ReadonlyMap<string, CallableFact> => {
    const accessorFactEntries = [...accessorFactMap.entries()]
        .map(([name, fact]) => {
             return [
                 name,
                 <CallableFact>{
                     kind: CallableFactKind.ACCESSOR_FACT,
                     fact,
                 },
             ] as const;
        });

    const methodFactEntries = [...methodFactMap.entries()]
        .map(([name, fact]) => {
            return [
                name,
                <CallableFact>{
                    kind: CallableFactKind.METHOD_FACT,
                    fact,
                },
            ] as const;
        });

    return new Map<string, CallableFact>([
        ...accessorFactEntries,
        ...methodFactEntries,
    ]);
};