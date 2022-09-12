import { join } from "node:path";
import {
    Event,
    EventEmitter,
    MarkdownString,
    ProviderResult,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState,
    Uri,
    workspace
} from "vscode";
import { buildFileNameHash } from "../features/moveTopLevelNode/fileNameHash";
import { JobHash } from "../features/moveTopLevelNode/jobHash";
import { buildFileUri, buildJobUri } from "../fileSystems/uris";
import { buildHash, IntuitaRange } from "../utilities";
import {JobManager} from "../components/jobManager";

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
        protected readonly _jobManager: JobManager
    ) {
        this.onDidChangeTreeData = this.eventEmitter.event;
    }

    public getChildren(element: Element | undefined): ProviderResult<Element[]> {
        if (element === undefined) {
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

        if (element.kind === 'DIAGNOSTIC') {
            return [];
        }

        return element.children.slice();
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
}
