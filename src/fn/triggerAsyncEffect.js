/*
 * Copyright (c) 2019 Anton Bagdatyev (Tonix-Tuft)
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

import { performAsyncEffect } from "./performAsyncEffect";
import { resetCurrentAsyncEffectTreeNodeIfNeeded } from "./resetCurrentAsyncEffectTreeNodeIfNeeded";
import { PROPS } from "../constants";

/**
 * Returns the cache of an async effect or throws the reason if the corresponding promise
 * rejected and the corresponding "asyncEffectOptions.shouldReturnReason" option
 * preventing the throwing is not set.
 *
 * @param {Array} cache The cache array.
 * @param {Object} asyncEffectOptions The async effect options.
 * @return {Array} An array with the value of the fulfilled promise at index 0 if the promise resolved.
 *                 An array with the reason of the rejected promise at index 1 if the promise rejected
 *                 and the "shouldReturnReason" async effect option is "true".
 *                 The array will also have a "isFulfilled" boolean flag at index 2 indicating whether the promise
 *                 is fulfilled or not and a "hasRejected" boolean flag at index 3 indicating whether the promise
 *                 has rejected or not.
 *                 If the underlying promise rejected and the "shouldReturnReason" option is "false",
 *                 then this function will throw the reason.
 * @throws {*} If the "shouldReturnReason" option is "false" and the promise has rejected with a reason.
 */
function returnOrThrow(cache, asyncEffectOptions) {
  const [, reason, isFulfilled, hasRejected] = cache;
  if (!isFulfilled && hasRejected && !asyncEffectOptions.shouldReturnReason) {
    throw reason;
  }
  return cache;
}

/**
 * Triggers an async effect, eventually returing its cached value synchronously.
 *
 * @param {Function} curriedFn The async effect curried function.
 * @param {Function} fn The promise factory function.
 * @param  {...*} args The arguments of the promise factory function.
 * @return {Function} The async effect resource function.
 */
export function triggerAsyncEffect(curriedFn, fn, ...args) {
  const { currentAsyncEffectTreeNode, asyncEffectOptions } = curriedFn[PROPS];
  resetCurrentAsyncEffectTreeNodeIfNeeded(curriedFn);
  if (
    !Object.prototype.hasOwnProperty.call(
      currentAsyncEffectTreeNode,
      "cache"
    ) &&
    !Object.prototype.hasOwnProperty.call(currentAsyncEffectTreeNode, "promise")
  ) {
    const promise = fn(...args).then(
      value => {
        delete currentAsyncEffectTreeNode.promise;
        currentAsyncEffectTreeNode.cache = [value, void 0, true, false];
        return currentAsyncEffectTreeNode.cache;
      },
      reason => {
        delete currentAsyncEffectTreeNode.promise;
        currentAsyncEffectTreeNode.cache = [void 0, reason, false, true];
        return currentAsyncEffectTreeNode.cache;
      }
    );
    currentAsyncEffectTreeNode.promise = promise;
    currentAsyncEffectTreeNode.resourceFn = () => {
      return (
        (currentAsyncEffectTreeNode.cache &&
          returnOrThrow(
            currentAsyncEffectTreeNode.cache,
            asyncEffectOptions
          )) ||
        performAsyncEffect(currentAsyncEffectTreeNode.promise)
      );
    };
  }
  return currentAsyncEffectTreeNode.resourceFn;
}
