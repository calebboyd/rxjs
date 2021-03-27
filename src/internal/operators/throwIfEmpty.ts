import { EmptyError } from '../util/EmptyError.js';
import { MonoTypeOperatorFunction } from '../types';
import { operate } from '../util/lift.js';
import { OperatorSubscriber } from './OperatorSubscriber.js';

/**
 * If the source observable completes without emitting a value, it will emit
 * an error. The error will be created at that time by the optional
 * `errorFactory` argument, otherwise, the error will be {@link EmptyError}.
 *
 * ![](throwIfEmpty.png)
 *
 * ## Example
 * ```ts
 * import { fromEvent, timer } from 'rxjs';
 * import { throwIfEmpty, takeUntil } from 'rxjs/operators';
 *
 * const click$ = fromEvent(document, 'click');
 *
 * click$.pipe(
 *   takeUntil(timer(1000)),
 *   throwIfEmpty(
 *     () => new Error('the document was not clicked within 1 second')
 *   ),
 * )
 * .subscribe({
 *   next() { console.log('The button was clicked'); },
 *   error(err) { console.error(err); }
 * });
 * ```
 *
 * @param errorFactory A factory function called to produce the
 * error to be thrown when the source observable completes without emitting a
 * value.
 * @return A function that returns an Observable that throws an error if the
 * source Observable completed without emitting.
 */
export function throwIfEmpty<T>(errorFactory: () => any = defaultErrorFactory): MonoTypeOperatorFunction<T> {
  return operate((source, subscriber) => {
    let hasValue = false;
    source.subscribe(
      new OperatorSubscriber(
        subscriber,
        (value) => {
          hasValue = true;
          subscriber.next(value);
        },
        undefined,
        () => (hasValue ? subscriber.complete() : subscriber.error(errorFactory()))
      )
    );
  });
}

function defaultErrorFactory() {
  return new EmptyError();
}
