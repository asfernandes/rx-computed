import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { RxComputed }  from '../lib/rx-computed';

import * as assert from "power-assert";


describe("RxComputed", function() {
	it('sync without dependencies', () => {
		let counter = 0;

		let computed = RxComputed.sync<number>(() => {
			++counter;
			return 1;
		});

		assert.equal(counter, 1);
		assert.equal(computed.value, 1);
	});

	it('sync with two dependencies', () => {
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
	});

	it('sync with one dependency read two times', () => {
		let counter = 0;
		let n = new BehaviorSubject(10);

		let computed = RxComputed.sync<number>(context => {
			++counter;
			return context.get(n) + context.get(n);
		});

		assert.equal(counter, 1);
		assert.equal(computed.value, 20);

		n.next(11);
		assert.equal(counter, 2);
		assert.equal(computed.value, 22);

		n.next(13);
		assert.equal(counter, 3);
		assert.equal(computed.value, 26);
	});

	it('sync with one dependency used in two computeds', () => {
		let counter1 = 0, counter2 = 0;
		let n = new BehaviorSubject(10);

		let computed1 = RxComputed.sync<number>(context => {
			++counter1;
			return context.get(n);
		});

		let computed2 = RxComputed.sync<number>(context => {
			++counter2;
			return context.get(n);
		});

		assert.equal(counter1, 1);
		assert.equal(counter1, 1);
		assert.equal(computed1.value, 10);
		assert.equal(computed1.value, 10);

		n.next(20);
		assert.equal(counter1, 2);
		assert.equal(counter2, 2);
		assert.equal(computed1.value, 20);
		assert.equal(computed2.value, 20);

		n.next(30);
		assert.equal(counter1, 3);
		assert.equal(counter2, 3);
		assert.equal(computed1.value, 30);
		assert.equal(computed2.value, 30);
	});
});
