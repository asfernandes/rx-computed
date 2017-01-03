/// <reference types="core-js" />
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
export interface RxComputedContext {
    track<T>(observable: Observable<T>): void;
    get<T>(observable: BehaviorSubject<T>): T;
}
export interface SyncCallbackType<T> {
    (context: RxComputedContext): T;
}
export interface AsyncCallbackType<T> {
    (context: RxComputedContext): Promise<T>;
}
export declare type CallbackType<T> = SyncCallbackType<T> | AsyncCallbackType<T>;
export declare class RxComputed<T> extends BehaviorSubject<T> {
    private context;
    static sync<T>(func: SyncCallbackType<T>): RxComputed<T>;
    static async<T>(func: AsyncCallbackType<T>): RxComputed<T>;
    private constructor(func);
    dispose(): void;
}
