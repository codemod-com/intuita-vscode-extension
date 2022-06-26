export type ClassInstanceProperty = Readonly<{
    name: string;
    initializer: string | null
    readonly: boolean;
    methodNames: ReadonlyArray<string>
}>;
