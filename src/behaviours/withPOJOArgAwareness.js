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

import { isPlainObject, stringHashArray } from "js-utl";
import { composeAsyncEffectCurriedFn } from "../fn/composeAsyncEffectCurriedFn";
import { traversePOJOArgSubtree } from "../fn/traversePOJOArgSubtree";
import { PROPS } from "../constants";

/**
 * A function to compose an async effect giving it POJO args awareness.
 *
 * This function can be used only with "asyncEffect",
 * where some of the positional arguments of the promise factory
 * of the asynchronous effect accept a POJO argument and in order to cache
 * the result of the promise the client's code wants to check against the properties
 * of the POJO argument (shallowly), instead of the reference of the POJO object
 * given as argument.
 *
 * @return {Function} The composed async effect.
 */
export default function withPOJOArgAwareness(asyncEffectCurriedFn) {
  const newAsyncEffectFn = composeAsyncEffectCurriedFn(asyncEffectCurriedFn, {
    onEffectiveArgAdded: ({ curriedFn, addedArg, ...rest }) => {
      if (isPlainObject(addedArg)) {
        const keys = Object.keys(addedArg);
        const keysHash = stringHashArray(keys);
        traversePOJOArgSubtree(curriedFn, addedArg, keysHash, keys);
        return;
      }
      const onEffectiveArgAdded =
        asyncEffectCurriedFn[PROPS].asyncEffectCurriedFnCallbacks
          .onEffectiveArgAdded;
      onEffectiveArgAdded({ curriedFn, addedArg, ...rest });
    },
  });
  return newAsyncEffectFn;
}
