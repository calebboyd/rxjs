import { ObservableInput, ObservableInputTuple, OperatorFunction, SchedulerLike } from '../types';
import { operate } from '../util/lift.js';
import { argsOrArgArray } from '../util/argsOrArgArray.js';
import { internalFromArray } from '../observable/fromArray.js';
import { mergeAll } from './mergeAll.js';
import { popNumber, popScheduler } from '../util/args.js';

/** @deprecated use {@link mergeWith} or static {@link merge} */
export function merge<T, A extends readonly unknown[]>(...sources: [...ObservableInputTuple<A>]): OperatorFunction<T, T | A[number]>;
/** @deprecated use {@link mergeWith} or static {@link merge} */
export function merge<T, A extends readonly unknown[]>(
  ...sourcesAndConcurrency: [...ObservableInputTuple<A>, number]
): OperatorFunction<T, T | A[number]>;
/** @deprecated use {@link mergeWith} or static {@link merge} */
export function merge<T, A extends readonly unknown[]>(
  ...sourcesAndScheduler: [...ObservableInputTuple<A>, SchedulerLike]
): OperatorFunction<T, T | A[number]>;
/** @deprecated use {@link mergeWith} or static {@link merge} */
export function merge<T, A extends readonly unknown[]>(
  ...sourcesAndConcurrencyAndScheduler: [...ObservableInputTuple<A>, number, SchedulerLike]
): OperatorFunction<T, T | A[number]>;

export function merge<T>(...args: unknown[]): OperatorFunction<T, unknown> {
  const scheduler = popScheduler(args);
  const concurrent = popNumber(args, Infinity);
  args = argsOrArgArray(args);

  return operate((source, subscriber) => {
    mergeAll(concurrent)(internalFromArray([source, ...(args as ObservableInput<T>[])], scheduler)).subscribe(subscriber as any);
  });
}
