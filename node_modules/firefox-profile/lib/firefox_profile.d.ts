import ProfileFinder = require('./profile_finder');

declare interface ConstructorOptions {
	profileDirectory?: string;
	destinationDirectory?: string;
}

declare interface CopyFromUserProfileOptions {
	name: string;
	userProfilePath?: string;
	destinationDirectory?: string;
}

declare interface NoProxySettings {
	proxyType: 'direct';
}

declare interface SystemProxySettings {
	proxyType: 'system';
}

declare interface AutomaticProxySettings {
	proxyType: 'pac';
	autoConfigUrl: string;
}

declare interface ManualProxySettings {
	proxyType: 'manual';
	ftpProxy?: string;
	httpProxy?: string;
	sslProxy?: string;
	socksProxy?: string;
}

declare type ProxySettings = NoProxySettings | SystemProxySettings | AutomaticProxySettings | ManualProxySettings;

declare interface AddonDetails {
	id: string;
	name: string;
	version: string;
	unpack: boolean;
	isNative: boolean;
}

declare class FirefoxProfile {
	static copy(options: ConstructorOptions | string | null | undefined, cb: (err: Error | null, profile?: FirefoxProfile) => void): void;
	static copyFromUserProfile(options: CopyFromUserProfileOptions, cb: (err: Error | null, profile?: FirefoxProfile) => void): void;
	static Finder: typeof ProfileFinder;
	constructor(options?: ConstructorOptions | string);
	defaultPreferences: any;
	deleteDir(cb: () => void): void;
	shouldDeleteOnExit(shouldDelete: boolean): void;
	willDeleteOnExit(): boolean;
	setPreference(key: string, value: boolean | string | number): void;
	addExtension(path: string, cb: (err: Error | null, addonDetails?: AddonDetails) => void): void;
	addExtensions(paths: string[], cb: (err?: Error) => void): void;
	updatePreferences(): void;
	path(): string;
	canAcceptUntrustedCerts(): boolean;
	setAcceptUntrustedCerts(acceptUntrusted: boolean): void;
	canAssumeUntrustedCertIssuer(): boolean;
	setAssumeUntrustedCertIssuer(assumeUntrusted: boolean): void;
	nativeEventsEnabled(): boolean;
	setNativeEventsEnabled(enabled: boolean): void;
	encoded(cb: (err: any, encodedProfile: string) => void): void;
	encode(cb: (err: any, encodedProfile: string) => void): void;
	setProxy(proxySettings: ProxySettings): void;
}

export = FirefoxProfile;
