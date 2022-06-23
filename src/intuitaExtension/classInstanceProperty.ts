namespace IntuitaExtension {
    export type ClassInstanceProperty = Readonly<{
        name: string;
        readonly: boolean;
        methodNames: ReadonlyArray<string>,
    }>;
}

