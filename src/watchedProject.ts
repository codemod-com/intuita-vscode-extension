import { Project } from "ts-morph";
import { FSWatcher } from "chokidar";

export const watchProject = (
    _project: Project
) => {
    const watcher = new FSWatcher({});

    _project
        .getRootDirectories()
        .map((rootDirectory) => rootDirectory.getPath())
        .forEach(
            (path) => {
                watcher.add(path);
            }
        );

    const addPath = (path: string) => {
        _project.addSourceFileAtPath(path);
    }

    const changePath = (path: string) => {
        const sourceFile = _project.getSourceFile(path);

        if (!sourceFile) {
            console.error(`The source file "${path}" could not have been found.`);
            return;
        }
        
        sourceFile.refreshFromFileSystemSync();
    }

    const unlinkPath = (path: string) => {
        const sourceFile = _project.getSourceFile(path);

        if (!sourceFile) {
            console.error(`The source file "${path}" could not have been found.`);
            return;
        }

        _project.removeSourceFile(sourceFile);
    }
    
    watcher.on("ready", () => {    
        watcher.on("add", (path) => {
            addPath(path);
        });
    
        watcher.on("change", (path) => {
            changePath(path);
        });
    
        watcher.on("unlink", (path) => {
            unlinkPath(path);
        });
    
        watcher.on("error", error => {
            console.error(error);
        });
    });
}