import { join } from "node:path";
import { EventEmitter, MarkdownString, ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState, Uri, workspace } from "vscode";
import { MoveTopLevelNodeJobManager } from "../features/moveTopLevelNode/moveTopLevelNodeJobManager";
import { buildFileNameHash } from "../features/moveTopLevelNode/fileNameHash";
import { JobHash } from "../features/moveTopLevelNode/jobHash";
import { buildFileUri, buildJobUri } from "../fileSystems/uris";
import { buildHash, IntuitaRange, isNeitherNullNorUndefined } from "../utilities";
import {RepairCodeJobManager} from "../features/repairCode/repairCodeJobManager";

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

export const buildTreeDataProvider = (
    moveTopLevelNodeJobManager: MoveTopLevelNodeJobManager,
    repairCodeJobManager: RepairCodeJobManager,
): TreeDataProvider<Element> & { _onDidChangeTreeData: EventEmitter<Element | undefined | null | void> } => {
    const _onDidChangeTreeData = new EventEmitter<Element | undefined | null | void>();

    return {
        getChildren(element: Element | undefined): ProviderResult<Element[]> {
            if (element === undefined) {
                const rootPath = workspace.workspaceFolders?.[0]?.uri.path ?? '';

                const fileNames = new Set<string>([
                    ...moveTopLevelNodeJobManager.getFileNames(),
                    ...repairCodeJobManager.getFileNames(),
                ])

                return Array.from(fileNames).map(
                    (fileName) => {
                        const uri = Uri.parse(fileName);
                        const label: string = fileName.replace(rootPath, '');

                        const fileNameHash = buildFileNameHash(fileName);

                        const jobs = [
                            ...moveTopLevelNodeJobManager._getFileJobs(
                                fileNameHash
                            ),
                            ...repairCodeJobManager._getFileJobs(
                                fileNameHash
                            ),
                        ];

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
        },
        getTreeItem(element: Element): TreeItem | Thenable<TreeItem> {
            const treeItem = new TreeItem(
                element.label,
            );

            treeItem.id = buildHash(element.label);

            console.log(treeItem.id, element.label);

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
        },
        onDidChangeTreeData: _onDidChangeTreeData.event,
        _onDidChangeTreeData,
    };
}

