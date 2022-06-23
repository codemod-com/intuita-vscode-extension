import {ClassDeclaration} from "ts-morph";

export const getClassInstanceMethodsName = (
    classDefinition: ClassDeclaration
): ReadonlyArray<string> => {
    return classDefinition
        .getInstanceMethods()
        .map((im) => im.getName());
};