# array-differ

> Create an array with values that are present in the first input array but not additional ones

## Install

```
$ npm install array-differ
```

## Usage

```js
import arrayDiffer from 'array-differ';

arrayDiffer([2, 3, 4], [3, 50]);
//=> [2, 4]
```

## API

### arrayDiffer(input, ...values)

Returns a new array.

#### input

Type: `unknown[]`

#### values

Type: `unknown[]`

Arrays of values to exclude.

---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-array-differ?utm_source=npm-array-differ&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>
