let remoteControlled = false;

export type RemoteControlOptions = {
    workingDirectory: string;
    optionValues: Record<string, any>;
};

export function enable() {
    remoteControlled = true;
}

export function isRemoteControlled() {
    return remoteControlled;
}

export function disable() {
    remoteControlled = false;
}
