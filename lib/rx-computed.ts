import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


export interface RxComputedContext<T>
{
	track<T>(observable: Observable<T>): void;
	get<T>(observable: BehaviorSubject<T>): T;
}

export interface SyncCallbackType<T>
{
	(context: RxComputedContext<T>): T;
}

export interface AsyncCallbackType<T>
{
	(context: RxComputedContext<T>): Promise<T>;
}

export type CallbackType<T> = SyncCallbackType<T> | AsyncCallbackType<T>;

class RxComputedContextImpl<T> implements RxComputedContext<T>
{
	private subscriptions: Subscription[] = [];

	constructor(private func: CallbackType<T>, private subject: BehaviorSubject<T>)
	{
		this.update();
	}

	track<T>(observable: Observable<T>)
	{
		let first = true;

		this.subscriptions.push(observable.subscribe(val => {
			// Ignore the first notification.

			//// TODO: should not only ignore the first for BehaviorSubject?
			if (first)
				first = false;
			else
				this.update();
		}));
	}

	get<T>(observable: BehaviorSubject<T>)
	{
		this.track(observable);
		return observable.value;
	}

	dispose()
	{
		this.subscriptions.forEach(sub => sub.unsubscribe());
		this.subscriptions.splice(0);
	}

	private update()
	{
		this.dispose();

		let updatedVal = this.func(this);

		if (updatedVal instanceof Promise)
			updatedVal.then(val => this.subject.next(val));
		else
			this.subject.next(updatedVal);
	}
}

export class RxComputed<T> extends BehaviorSubject<T>
{
	private context: RxComputedContextImpl<T>;

	static sync<T>(func: SyncCallbackType<T>)
	{
		return new RxComputed<T>(func);
	}

	static async<T>(func: AsyncCallbackType<T>)
	{
		return new RxComputed<T>(func);
	}

	private constructor(func: CallbackType<T>)
	{
		super(null)
		this.context = new RxComputedContextImpl<T>(func, this);
	}

	dispose()
	{
		this.context.dispose();
	}
}
