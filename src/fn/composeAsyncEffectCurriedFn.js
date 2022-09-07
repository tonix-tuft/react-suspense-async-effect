/*
 * Copyright (c) 2022 Anton Bagdatyev (Tonix)
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

import { curryAsyncEffect } from "./curryAsyncEffect";
import { PROPS } from "../constants";

/**
 * Given an async effect curried function, this function composes a new async effect curried function
 * letting the caller to tweak the async effect curried function callbacks.
 *
 * @param {Function} asyncEffectCurriedFn The async effect curried function.
 * @param {Object} asyncEffectCurriedFnCallbacks The async effect curried function callbacks.
 * @return {Function} The new async effect curried function.
 */
export function composeAsyncEffectCurriedFn(
  asyncEffectCurriedFn,
  asyncEffectCurriedFnCallbacks
) {
  const {
    curryFn,
    promiseFactory,
    baseCurryFnOptions,
    asyncEffectFn,
    asyncEffectOptions,
    asyncEffectFnArgs,
    asyncEffectCurriedFnCallbacks: currentAsyncEffectCurriedFnCallbacks,
    onNewCurriedFnAlwaysCallback,
  } = asyncEffectCurriedFn[PROPS];

  return curryAsyncEffect({
    curryFn,
    promiseFactory,
    baseCurryFnOptions,
    asyncEffectFn,
    asyncEffectOptions,
    asyncEffectFnArgs,
    asyncEffectCurriedFnCallbacks: {
      ...currentAsyncEffectCurriedFnCallbacks,
      ...asyncEffectCurriedFnCallbacks,
    },
    onNewCurriedFnAlwaysCallback,
  });
}
