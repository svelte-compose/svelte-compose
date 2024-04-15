import { Workspace } from "../composer/config.js";
import { ArgType } from "../composer/options.js";
import { commonFilePaths, readFile } from "../files/utils.js";

export type Package = {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
};

export async function getPackageJson<Args extends ArgType>(workspace: Workspace<Args>) {
    const packageText = await readFile(workspace, commonFilePaths.packageJsonFilePath);
    if (!packageText) {
        return {
            dependencies: {},
            devDependencies: {},
            name: "",
            version: "",
        };
    }

    const packageJson: Package = JSON.parse(packageText);
    return packageJson;
}
