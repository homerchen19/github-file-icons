export default browser;

// Adds some types that are missing or are incorrect
declare global {
	namespace browser.runtime {
		/**
		 * Requests an update check for this app/extension.
		 */
		function requestUpdateCheck(): Promise<RequestUpdateCheckStatus>;
	}

	/**
	 * Gets an OAuth2 access token using the client ID and scopes specified in the oauth2 section of manifest.json.
	 */
	namespace browser.identity {
		/**
		 * Gets an OAuth2 access token using the client ID and scopes specified in the oauth2 section of manifest.json.
		 */
		function getAuthToken(details?: _GetAuthTokenDetails): Promise<string>;

		/**
		 * Removes an OAuth2 access token from the Identity API's token cache.
		 */
		function removeCachedAuthToken(
			details: _RemoveCachedAuthTokenDetails
		): Promise<_RemoveCachedAuthTokenReturnUserinfo>;
	}
}
