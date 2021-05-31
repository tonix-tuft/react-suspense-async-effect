/*
 * Copyright (c) 2021 Anton Bagdatyev (Tonix)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import { composeAsyncEffectCurriedFn } from "../fn/composeAsyncEffectCurriedFn";
import { PROPS } from "../constants";

/**
 * A function to compose an async effect with a cache invalidation condition.
 *
 * @param {boolean|Function} cacheInvalidationCondition A boolean condition indicating whether or not to invalidate the cache ("true" if the cache should be invalidated, "false" otherwise)
 *                                                      or a function returning a boolean "true" to indicate that the cache has to be invalidated ("false" otherwise).
 *                                                      If a function is provided, the function will receive an object as parameter.
 *                                                      The properties of the object will vary depending on whether the async effect was created with
 *                                                      "asyncEffect" or with "POJOAsyncEffect".
 *                                                      If the async effect was created with "asyncEffect", then the object given as parameter will have the following properties:
 *
 *                                                          - args: The arguments that will be passed to "fn" (the promise factory function) if the result of the promise was not cached yet;
 *                                                          - fn: The "fn" promise factory function;
 *                                                          - curriedFn: The current curried function;
 *                                                          - cache: The current cached result, i.e. an array with the current fulfillment value at index 0
 *                                                                   (or "undefined" if the underlying promise rejected) and the current rejection reason at index 1
 *                                                                   (or "undefined" if the underlying promise resolved);
 *
 *                                                      If the async effect was created with "POJOAsyncEffect", then the object given as parameter will have the following properties:
 *
 *                                                          - POJO: The POJO argument that will be passed to "fn" (the promise factory function) if the result of the promise was not cached yet;
 *                                                          - fn: The "fn" promise factory function;
 *                                                          - curriedFn: The current curried function;
 *                                                          - cache: The current cached result, i.e. an array with the current fulfillment value at index 0
 *                                                                   (or "undefined" if the underlying promise rejected) and the current rejection reason at index 1
 *                                                                   (or "undefined" if the underlying promise resolved);
 *
 * @return {Function} A function accepting an async effect to change its behaviour through composition.
 */
export default function withCacheInvalidation(cacheInvalidationCondition) {
  return asyncEffectCurriedFn => {
    const newAsyncEffectFn = composeAsyncEffectCurriedFn(asyncEffectCurriedFn, {
      onFnCall: ({ curriedFn, ...rest }) => {
        if (
          Object.prototype.hasOwnProperty.call(
            curriedFn[PROPS].currentAsyncEffectTreeNode,
            "cache"
          )
        ) {
          // Async effect's promise was resolved at least once.
          let mustInvalidateCache = cacheInvalidationCondition;
          if (typeof mustInvalidateCache === "function") {
            mustInvalidateCache = cacheInvalidationCondition({
              curriedFn,
              ...rest,
              cache: curriedFn[PROPS].currentAsyncEffectTreeNode.cache
            });
          }
          if (mustInvalidateCache) {
            delete curriedFn[PROPS].currentAsyncEffectTreeNode.cache;
          }
        }
        const onFnCall =
          asyncEffectCurriedFn[PROPS].asyncEffectCurriedFnCallbacks.onFnCall;
        return onFnCall({ curriedFn, ...rest });
      }
    });
    return newAsyncEffectFn;
  };
}
