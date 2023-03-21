// https://www.typescriptlang.org/docs/handbook/namespaces.html#aliases
/* globals browser */
import CS = browser.contentScripts;

declare namespace chrome.contentScripts {
	function register(
		contentScriptOptions: CS.RegisteredContentScriptOptions,
		callback?: (contentScript: CS.RegisteredContentScript) => void
	): Promise<CS.RegisteredContentScript>;
}
