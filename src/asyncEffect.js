/*
 * Copyright (c) 2020 Anton Bagdatyev (Tonix-Tuft)
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

import { _ as curry_, curry } from "js-utl";
import { curryAsyncEffect } from "./fn/curryAsyncEffect";
import { triggerAsyncEffect } from "./fn/triggerAsyncEffect";
import { PROPS } from "./constants";
import { makeAsyncEffectOptions } from "./asyncEffectOptions";

/**
 * @type {Object}
 */
export const _ = curry_;

/**
 * Performs an asynchronous effect.
 *
 * @param {Function} promiseFactory A promise factory function.
 * @param {number|Object} [promiseFactoryArity] If an int is given, it will be treated as the optional arity
 *                                              of the promise factory function, to be used if e.g.
 *                                              the promise factory function is variadic (i.e. it uses "...args").
 *                                              If an object is given, it will be treated as an object of options
 *                                              to use for the async effect. The object's shape is the following
 *                                              (default values are shown):
 *
 *                                                  {
 *                                                      shouldReturnReason: false, // True to return reason if the promise rejects instead of throwing it.
 *                                                      promiseFactoryArity: void 0 // Arity of the promise factory function.
 *                                                  }
 *
 * @return {Function} A curried function representing the promise factory function.
 */
export function asyncEffect(promiseFactory, promiseFactoryArity = void 0) {
  const hasOptions =
    typeof promiseFactoryArity !== "number" &&
    typeof promiseFactoryArity !== "undefined";
  let options = {};
  if (hasOptions) {
    options = promiseFactoryArity;
    promiseFactoryArity = options.promiseFactoryArity;
  }
  const asyncEffectOptions = makeAsyncEffectOptions(options);
  return curryAsyncEffect({
    curryFn: curry,
    promiseFactory,
    baseCurryFnOptions: {
      arity: promiseFactoryArity
    },
    asyncEffectFn: asyncEffect,
    asyncEffectOptions,
    asyncEffectFnArgs: [promiseFactory, promiseFactoryArity],
    asyncEffectCurriedFnCallbacks: {
      onEffectiveArgAdded: ({ addedArg, curriedFn }) => {
        const { currentAsyncEffectTreeNode } = curriedFn[PROPS];
        currentAsyncEffectTreeNode.argSubtree =
          currentAsyncEffectTreeNode.argSubtree || new Map();
        let subtreeNode;
        if (!currentAsyncEffectTreeNode.argSubtree.has(addedArg)) {
          subtreeNode = {};
          currentAsyncEffectTreeNode.argSubtree.set(addedArg, subtreeNode);
        } else {
          subtreeNode = currentAsyncEffectTreeNode.argSubtree.get(addedArg);
        }
        curriedFn[PROPS].previousCurrentAsyncEffectTreeNode =
          curriedFn[PROPS].currentAsyncEffectTreeNode;
        curriedFn[PROPS].currentAsyncEffectTreeNode = subtreeNode;
      },
      onFnCall: ({ args, fn, curriedFn }) => {
        return triggerAsyncEffect(curriedFn, fn, ...args);
      }
    }
  });
}
