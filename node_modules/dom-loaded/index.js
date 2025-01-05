const hasLoaded = () => document.readyState === 'interactive' || document.readyState === 'complete';

const controller = new AbortController();

const domLoaded = new Promise(resolve => {
	if (hasLoaded()) {
		resolve();
		controller.abort();
	} else {
		document.addEventListener('DOMContentLoaded', () => {
			resolve();
			controller.abort();
		}, {
			capture: true,
			once: true,
			passive: true,
		});
	}
});

export default domLoaded;

Object.defineProperty(domLoaded, 'hasLoaded', {
	get: hasLoaded,
});

Object.defineProperty(domLoaded, 'signal', {
	get: () => controller.signal,
});
