import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


export interface RxComputedContext<T>
{
	track<T>(observable: Observable<T>): void;
	get<T>(observable: BehaviorSubject<T>): T;
}

export interface CallbackType<T>
{
	(context: RxComputedContext<T>): T;
}

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
			// Ignora a primeira notificação.

			if (first)	//// FIXME: não deveria ignorar apenas para BehaviorSubject?
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
		this.subject.next(this.func(this));
	}
}

export class RxComputed<T> extends BehaviorSubject<T>
{
	private context: RxComputedContextImpl<T>;

	static sync<T>(func: CallbackType<T>)
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
