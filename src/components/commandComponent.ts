import { ExtensionStateManager, JobOutput } from "../features/moveTopLevelNode/extensionStateManager";
import { JobHash } from "../features/moveTopLevelNode/jobHash";
import { IntuitaFileSystem } from "../fileSystems/intuitaFileSystem";
import { buildJobUri } from "../fileSystems/uris";
import { calculateLastPosition, IntuitaRange } from "../utilities";

export class CommandComponent {
    public constructor(
        protected _intuitaFileSystem: IntuitaFileSystem,
        protected _extensionStateManager: ExtensionStateManager,
    ) {

    }

    public getJobOutput(
        jobHash: JobHash,
    ): JobOutput | null {
        const content = this._intuitaFileSystem.readNullableFile(
            buildJobUri(jobHash as JobHash),
        );

        if (!content) {
            return this._extensionStateManager
                .executeJob(
                    jobHash,
                    0,
                );
        }

        const text = content.toString();

        const position = calculateLastPosition(text, '\n');

        const range: IntuitaRange = [
            0,
            0,
            position[0],
            position[1],
        ];
        

        return {
            text,
            position,
            range,
        };
    }
}