import minimatch from 'minimatch';
import arrayUnion from 'array-union';
import arrayDiffer from 'array-differ';

export default function multimatch(list, patterns, options = {}) {
	list = [list].flat();
	patterns = [patterns].flat();

	if (list.length === 0 || patterns.length === 0) {
		return [];
	}

	let result = [];
	for (const item of list) {
		for (let pattern of patterns) {
			let process = arrayUnion;

			if (pattern[0] === '!') {
				pattern = pattern.slice(1);
				process = arrayDiffer;
			}

			result = process(result, minimatch.match([item], pattern, options));
		}
	}

	return result;
}
