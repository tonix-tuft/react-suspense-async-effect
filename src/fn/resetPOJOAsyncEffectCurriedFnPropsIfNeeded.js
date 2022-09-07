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

import { PROPS } from "../constants";

/**
 * Resets some of props of the current POJO async effect tree node
 * of a POJO async effect curried function if a reset is needed
 * (i.e. when there is a previous keys map and a previous keys hash).
 *
 * @param {Function} curriedFn The async effect curried function.
 * @return {undefined}
 */
export function resetPOJOAsyncEffectCurriedFnPropsIfNeeded(curriedFn) {
  if (curriedFn[PROPS].previousKeysMap) {
    curriedFn[PROPS].keysMap = curriedFn[PROPS].previousKeysMap;
    curriedFn[PROPS].keysHash = curriedFn[PROPS].previousKeysHash;
    curriedFn[PROPS].previousKeysMap = void 0;
    curriedFn[PROPS].previousKeysHash = void 0;
  }
}
