import * as sourceMapSupport from 'source-map-support';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { RxComputed } from '..';

import * as assert from "power-assert";


sourceMapSupport.install();


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
		let n1 = new BehaviorSubject(0);
		let n2 = new BehaviorSubject(100);

		// The computed will start with the latest n1 value.
		n1.next(9);
		n1.next(10);

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

		computed.dispose();

		n1.next(12);
		n2.next(300);
		assert.equal(counter, 3);
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

		computed.dispose();

		n.next(14);
		assert.equal(counter, 3);
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

		computed1.dispose();
		computed2.dispose();

		n.next(40);
		assert.equal(counter1, 3);
		assert.equal(counter2, 3);
	});

	it('sync with one track dependency to BehaviorSubject', () => {
		let counter = 0;
		let n = new BehaviorSubject(1);

		let computed = RxComputed.sync<number>(context => {
			++counter;
			context.track(n);
			return counter;
		});

		assert.equal(counter, 1);
		assert.equal(computed.value, 1);

		assert.equal(counter, 1);
		assert.equal(computed.value, 1);

		n.next(n.value + 1);

		assert.equal(counter, 2);
		assert.equal(computed.value, 2);

		computed.dispose();
	});

	it('async with one dependency', async () => {
		let counter = 0;
		let n1 = new BehaviorSubject(10);

		let computed = RxComputed.async<number>(context => {
			++counter;

			let val1 = context.get(n1);

			return new Promise<number>(resolve => {
				setTimeout(() => {
					resolve(val1 + 1);
				}, 10);
			});
		});

		assert.equal(counter, 1);
		assert.equal(computed.value, null);

		let resolve: (value: number[]) => void;
		let promise = new Promise<number[]>(resolver => resolve = resolver);

		let emit = [20, 30, 40];

		computed
			.take(2 + emit.length)
			.toArray()
			.subscribe(array => resolve(array));

		emit.forEach(n => n1.next(n));

		let numbers = await promise;

		assert.equal(numbers.length, 2 + emit.length);
		assert.equal(numbers[0], null);
		assert.equal(numbers[1], 11);

		emit.forEach((n, index) => assert.equal(numbers[2 + index], n + 1));

		computed.dispose();
	});
});
