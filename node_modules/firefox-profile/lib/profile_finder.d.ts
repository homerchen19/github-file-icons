declare class ProfileFinder {
	static locateUserDirectory(platform?: string): string | undefined;
	constructor(directory?: string);
	directory: string;
	hasReadProfiles: boolean;
	profiles: string[];
	readProfiles(cb: (err: Error | null, profiles?: string[]) => void): void;
	getPath(name: string, cb: (err: Error | null, path: string | undefined) => void): string | undefined;
}

export = ProfileFinder;
