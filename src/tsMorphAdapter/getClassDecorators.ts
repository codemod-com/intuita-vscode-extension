import {ClassDeclaration} from "ts-morph";

export const getClassDecorators = (
    classDeclaration: ClassDeclaration,
) => {
    return classDeclaration
        .getDecorators()
        .map(
            (decorator) => decorator.getStructure()
        );
};