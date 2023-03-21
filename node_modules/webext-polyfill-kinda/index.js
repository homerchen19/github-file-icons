function NestedProxy(target) {
	return new Proxy(target, {
		get(target, prop) {
			if (typeof target[prop] !== 'function') {
				return new NestedProxy(target[prop]);
			}

			return (...arguments_) =>
				new Promise((resolve, reject) => {
					target[prop](...arguments_, result => {
						if (chrome.runtime.lastError) {
							reject(new Error(chrome.runtime.lastError.message));
						} else {
							resolve(result);
						}
					});
				});
		}
	});
}

const chromeP = globalThis.chrome && new NestedProxy(globalThis.chrome);

export default chromeP;
