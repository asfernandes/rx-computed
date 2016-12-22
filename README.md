# RxComputed

Make it possible to use RxJS in a manner similar to [Knockout computed observables](http://knockoutjs.com/documentation/computedObservables.html).

## Installation

`npm install --save rx-computed`

## Usage

```ts
let counter = 0;
let n1 = new BehaviorSubject(10);
let n2 = new BehaviorSubject(100);

let computed = RxComputed.sync<number>(context => {
	++counter;
	return context.get(n1) + context.get(n2);
});

assert.equal(counter, 1);
assert.equal(computed.value, 110);

n1.next(11);
assert.equal(counter, 2);
assert.equal(computed.value, 111);

n2.next(200);
assert.equal(counter, 3);
assert.equal(computed.value, 211);
```
