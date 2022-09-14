import {join} from "node:path";
import {
    Diagnostic, DiagnosticCollection,
    DiagnosticSeverity,
    Event,
    EventEmitter,
    MarkdownString,
    Position,
    ProviderResult,
    Range,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState,
    Uri,
    workspace
} from "vscode";
import {buildFileNameHash} from "../features/moveTopLevelNode/fileNameHash";
import {JobHash} from "../features/moveTopLevelNode/jobHash";
import {buildHash, IntuitaRange} from "../utilities";
import {JobManager} from "./jobManager";
import {buildFileUri, buildJobUri} from "./intuitaFileSystem";
import {MessageBus, MessageKind} from "./messageBus";

type Element =
    | Readonly<{
        kind: 'FILE',
        label: string,
        children: ReadonlyArray<Element>,
    }>
    | Readonly<{
        kind: 'DIAGNOSTIC',
        label: string,
        uri: Uri,
        hash: JobHash,
        fileName: string,
        range: IntuitaRange,
    }>;

export class IntuitaTreeDataProvider implements TreeDataProvider<Element> {
    public readonly eventEmitter = new EventEmitter<void>();
    public readonly onDidChangeTreeData: Event<void>;

    public constructor(
        protected readonly _messageBus: MessageBus,
        protected readonly _jobManager: JobManager,
        protected readonly _diagnosticCollection: DiagnosticCollection,
    ) {
        this.onDidChangeTreeData = this.eventEmitter.event;

        this._messageBus.subscribe(
            (message) => {
                if (message.kind === MessageKind.updateDiagnostics) {
                    setImmediate(
                        () => {
                            this._setDiagnosticEntry(message.fileName);
                        }
                    );
                }
            }
        );
    }

    public getChildren(element: Element | undefined): ProviderResult<Element[]> {
        if (element?.kind === 'DIAGNOSTIC') {
            return [];
        }

        if (element?.kind === 'FILE') {
            return element.children.slice();
        }

        const rootPath = workspace.workspaceFolders?.[0]?.uri.path ?? '';

        const fileNames = new Set<string>(this._jobManager.getFileNames());

        return Array.from(fileNames).map(
            (fileName) => {
                const uri = Uri.parse(fileName);
                const label: string = fileName.replace(rootPath, '');

                const fileNameHash = buildFileNameHash(fileName);

                const jobs = this._jobManager.getFileJobs(
                    fileNameHash
                );

                const children: Element[] = jobs
                    .map(
                        (diagnostic) => {
                            return {
                                kind: 'DIAGNOSTIC' as const,
                                label: diagnostic.title,
                                fileName,
                                uri,
                                range: diagnostic.range,
                                hash: diagnostic.hash,
                            };
                        }
                    );

                return {
                    kind: 'FILE' as const,
                    label,
                    children,
                };
            }
        );
    }

    public getTreeItem(element: Element): TreeItem | Thenable<TreeItem> {
        const treeItem = new TreeItem(
            element.label,
        );

        treeItem.id = buildHash(element.label);

        treeItem.collapsibleState = element.kind === 'FILE'
            ? TreeItemCollapsibleState.Collapsed
            : TreeItemCollapsibleState.None;

        treeItem.iconPath = join(
            __filename,
            '..',
            '..',
            'resources',
            element.kind === 'FILE' ? 'ts2.svg' : 'bluelightbulb.svg'
        );

        if (element.kind === 'DIAGNOSTIC') {
            treeItem.contextValue = 'intuitaJob';

            const tooltip = new MarkdownString(
                'Adhere to the code organization rules [here](command:intuita.openTopLevelNodeKindOrderSetting)'
            );

            tooltip.isTrusted = true;

            treeItem.tooltip = tooltip;

            const fileNameHash = buildFileNameHash(
                element.fileName,
            );

            treeItem.command = {
                title: 'Diff View',
                command: 'vscode.diff',
                arguments: [
                    buildFileUri(fileNameHash),
                    buildJobUri(element.hash),
                    'Proposed change',
                ]
            };
        }

        return treeItem;
    }

    protected _setDiagnosticEntry(
        fileName: string,
    ) {
        const uri = Uri.parse(fileName);

        const jobs = this._jobManager.getFileJobs(buildFileNameHash(fileName));

        const diagnostics = jobs
            .map(
                ({ kind, title, range: intuitaRange }) => {
                    const startPosition = new Position(
                        intuitaRange[0],
                        intuitaRange[1],
                    );

                    const endPosition = new Position(
                        intuitaRange[2],
                        intuitaRange[3],
                    );

                    const vscodeRange = new Range(
                        startPosition,
                        endPosition,
                    );

                    const diagnostic = new Diagnostic(
                        vscodeRange,
                        title,
                        DiagnosticSeverity.Information
                    );

                    diagnostic.code = kind.valueOf();
                    diagnostic.source = 'intuita';

                    return diagnostic;
                }
            );

        this._diagnosticCollection.clear();

        this._diagnosticCollection.set(
            uri,
            diagnostics,
        );

        this.eventEmitter.fire();
    }
}
