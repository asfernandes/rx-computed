# RxComputed

Make it possible to use RxJS in a manner similar to [Knockout computed observables](http://knockoutjs.com/documentation/computedObservables.html).

## Installation

`npm install --save rx-computed`

## Usage in TypeScript (sync)

```ts
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RxComputed }  from 'rx-computed';
import * as assert from "power-assert";

// debug how many times the computed function is called
let counter = 0;

// variables that our computed will depend on
let n1 = new BehaviorSubject(10);
let n2 = new BehaviorSubject(100);

let computed = RxComputed.sync<number>(context => {
	++counter;
	return context.get(n1) + context.get(n2);
});

// the computed function is called when creating the object
assert.equal(counter, 1);
assert.equal(computed.value, 110);

// changing n1 will re-evaluate the computed
n1.next(11);
assert.equal(counter, 2);
assert.equal(computed.value, 111);

// changing n2 will re-evaluate the computed
n2.next(200);
assert.equal(counter, 3);
assert.equal(computed.value, 211);

// dispose the computed
computed.dispose();

// changing n2 will not re-evaluate the disposed computed
n2.next(300);
assert.equal(counter, 3);
```

## Usage in TypeScript (async)

```ts
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RxComputed }  from 'rx-computed';

// variable that our computed will depend on
let n1 = new BehaviorSubject(10);

let computed = RxComputed.async<number>(context => {
	let val1 = context.get(n1);

	return new Promise<number>(resolve => {
		setTimeout(() => {
			resolve(val1 + 1);
		}, 10);
	});
});

// ...

// dispose the computed
computed.dispose();
```
