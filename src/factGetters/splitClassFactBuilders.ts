import {ClassInstanceProperty, ClassInstancePropertyKind} from "../intuitaExtension/classInstanceProperty";
import {uniquify} from "../intuitaExtension/getGroupMap";
import {AccessorFact} from "./splitClassFacts";

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