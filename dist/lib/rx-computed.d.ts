import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
export interface RxComputedContext<T> {
    track<T>(observable: Observable<T>): void;
    get<T>(observable: BehaviorSubject<T>): T;
}
export interface CallbackType<T> {
    (context: RxComputedContext<T>): T;
}
export declare class RxComputed<T> extends BehaviorSubject<T> {
    private context;
    static sync<T>(func: CallbackType<T>): RxComputed<T>;
    private constructor(func);
    dispose(): void;
}
