export type ExtensionFileOrCode = {
	code: string;
} | {
	file: string;
};

export type RunAt = 'document_start' | 'document_end' | 'document_idle';

export interface ContentScript {
	/**
	 * The list of CSS files to inject
	 */
	css?: string[] | ExtensionFileOrCode[];

	/**
	 * The list of JS files to inject
	 */
	js?: string[] | ExtensionFileOrCode[];

	/**
	 * @deprecated Prefer `allFrames`
	 */
	all_frames?: boolean;

	/**
	 * If allFrames is <code>true</code>, implies that the JavaScript or CSS should be injected into all frames of current page.
	 * By default, it's <code>false</code> and is only injected into the top frame.
	 */
	allFrames?: boolean;

	/**
	 * @deprecated Prefer `matchAboutBlank`
	 */
	match_about_blank?: boolean;

	/**
	 * If matchAboutBlank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has
	 * access to its parent document. Code cannot be inserted in top-level about:-frames. By default it is <code>false</code>.
	 */
	matchAboutBlank?: boolean;

	/**
	 * @deprecated Prefer `runAt`
	 */
	run_at?: string;

	/**
	 * The soonest that the JavaScript or CSS will be injected into the tab. Defaults to "document_idle".
	 */
	runAt?: RunAt;
}
