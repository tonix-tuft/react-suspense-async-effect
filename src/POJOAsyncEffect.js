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

import { POJOCurry, onePassStringHash } from "js-utl";
import { curryAsyncEffect } from "./fn/curryAsyncEffect";
import { traversePOJOArgSubtree } from "./fn/traversePOJOArgSubtree";
import { resetPOJOAsyncEffectCurriedFnPropsIfNeeded } from "./fn/resetPOJOAsyncEffectCurriedFnPropsIfNeeded";
import { triggerAsyncEffect } from "./fn/triggerAsyncEffect";
import { PLUG_CURRIED_ASYNC_EFFECT_PROPERTY_NAME, PROPS } from "./constants";
import { makeAsyncEffectOptions } from "./asyncEffectOptions";

/**
 * @type {Object}
 */
export const plug = { [PLUG_CURRIED_ASYNC_EFFECT_PROPERTY_NAME]: true };

/**
 * Perform an asynchronous effect as "asyncEffect", but using a promise factory function
 * which only takes a single POJO (Plain Old JavaScript Object) as its argument.
 *
 * @param {Function} promiseFactory A promise factory function which takes a single POJO as its argument.
 * @param {Object} [options] Async effect options. An optional object with the following shape (default values are shown):
 *
 *                               {
 *                                   shouldReturnReason: false, // True to return reason if the promise rejects instead of throwing it.
 *                               }
 *
 * @return {Function} A POJO curried function representing the promise factory function.
 *                    The POJO curried function would need to be plugged before being called,
 *                    because each call to the curried function will just shallowly merge
 *                    the final object with the object passed to the returned curried function.
 */
export function POJOAsyncEffect(promiseFactory, options) {
  const asyncEffectOptions = makeAsyncEffectOptions(options);
  return curryAsyncEffect({
    curryFn: POJOCurry,
    promiseFactory,
    baseCurryFnOptions: {
      plugPropertyName: PLUG_CURRIED_ASYNC_EFFECT_PROPERTY_NAME,
      plugPropertyMustBeTruthy: true
    },
    asyncEffectFn: POJOAsyncEffect,
    asyncEffectOptions,
    asyncEffectFnArgs: [promiseFactory],
    asyncEffectCurriedFnCallbacks: {
      onPOJOArgMerged: ({ POJOArg, curriedFn }) => {
        const { keysHash, keysMap } = curriedFn[PROPS];
        const newKeys = Object.keys(POJOArg).filter(
          key => !Object.prototype.hasOwnProperty.call(keysMap, key)
        );
        const mergeKeysMap = {};
        let newKeysHash = keysHash;
        const l = newKeys.length;
        for (let i = 0; i < l; i++) {
          const key = newKeys[i];
          mergeKeysMap[key] = true;
          newKeysHash = onePassStringHash(key, newKeysHash);
        }
        if (l) {
          curriedFn[PROPS].previousKeysHash = keysHash;
          curriedFn[PROPS].previousKeysMap = keysMap;
          curriedFn[PROPS].keysHash = newKeysHash;
          curriedFn[PROPS].keysMap = {
            ...keysMap,
            ...mergeKeysMap
          };
        }
      },
      onFnCall: ({ POJO, fn, curriedFn }) => {
        const { currentAsyncEffectTreeNode, keysHash } = curriedFn[PROPS];
        currentAsyncEffectTreeNode.POJOArgSubtree =
          currentAsyncEffectTreeNode.POJOArgSubtree || new Map();
        const keys = Object.keys(POJO);
        traversePOJOArgSubtree(curriedFn, POJO, keysHash, keys);
        resetPOJOAsyncEffectCurriedFnPropsIfNeeded(curriedFn);
        return triggerAsyncEffect(curriedFn, fn, POJO);
      }
    },
    onNewCurriedFnAlwaysCallback: ({ newCurriedFn, curriedFn }) => {
      newCurriedFn[PROPS] = newCurriedFn[PROPS] || {};
      if (curriedFn[PROPS]) {
        newCurriedFn[PROPS].keysHash = curriedFn[PROPS].keysHash || 0;
        newCurriedFn[PROPS].keysMap = curriedFn[PROPS].keysMap || {};
        resetPOJOAsyncEffectCurriedFnPropsIfNeeded(curriedFn);
      } else {
        newCurriedFn[PROPS].keysHash = 0;
        newCurriedFn[PROPS].keysMap = {};
      }
      newCurriedFn[PROPS].previousKeysHash = void 0;
      newCurriedFn[PROPS].previousKeysMap = void 0;
    }
  });
}
