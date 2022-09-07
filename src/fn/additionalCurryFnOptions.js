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

import { initialAsyncEffectTreeNodeForPromiseFactory } from "./initialAsyncEffectTreeNodeForPromiseFactory";
import { resetCurrentAsyncEffectTreeNodeIfNeeded } from "./resetCurrentAsyncEffectTreeNodeIfNeeded";
import { PROPS } from "../constants";

/**
 * @type {boolean}
 */
let onNewCurriedFnCallbackJustCalled = false;

/**
 * Returns the additional options of the curried function of an async effect.
 *
 * @param {Object} obj An object with parameters.
 * @param {Function} obj.curryFn The curry function which was used to create the curried function of the async effect.
 * @param {Function} obj.promiseFactory The promise factory function.
 * @param {Object} obj.baseCurryFnOptions The base options of the curry function.
 * @param {Function} obj.asyncEffectFn The async effect function.
 * @param {Object} obj.asyncEffectOptions The async effect options.
 * @param {Array} obj.asyncEffectFnArgs The async effect function arguments.
 * @param {Function} obj.asyncEffectCurriedFnCallbacks The callbacks of the async effect curried function.
 * @param {Function|undefined} [obj.onNewCurriedFnAlwaysCallback] An optional callback to execute always whenever a new curried function is created.
 *                                                                The callback will receive an object as argument with the same properties
 *                                                                as for the "onNewCurriedFn" callback of the async effect curried function.
 * @return {Object} An object with the additional options.
 */
export function additionalCurryFnOptions({
  curryFn,
  promiseFactory,
  baseCurryFnOptions,
  asyncEffectFn,
  asyncEffectOptions,
  asyncEffectFnArgs,
  asyncEffectCurriedFnCallbacks,
  onNewCurriedFnAlwaysCallback = void 0,
}) {
  const {
    onCurriedFnFirstCall = ({ curriedFn }) => {
      curriedFn[PROPS].currentAsyncEffectTreeNode.withoutContext =
        curriedFn[PROPS].currentAsyncEffectTreeNode.withoutContext || {};
      curriedFn[PROPS].currentAsyncEffectTreeNode =
        curriedFn[PROPS].currentAsyncEffectTreeNode.withoutContext;
    },
    onNewCurriedFn: onNewCurriedFnCallback,
    ...rest
  } = asyncEffectCurriedFnCallbacks;

  const onNewCurriedFn = function onNewCurriedFn({
    newCurriedFn,
    curriedFn,
    ...props
  }) {
    if (
      !onNewCurriedFnCallbackJustCalled &&
      newCurriedFn !== curriedFn &&
      onNewCurriedFnCallback
    ) {
      onNewCurriedFnCallbackJustCalled = true;
      onNewCurriedFnCallback({
        newCurriedFn,
        curriedFn,
        ...props,
      });
      return;
    }
    onNewCurriedFnCallbackJustCalled = false;

    onNewCurriedFnAlwaysCallback &&
      onNewCurriedFnAlwaysCallback({ newCurriedFn, curriedFn, ...props });

    let currentAsyncEffectTreeNode = void 0;
    if (curriedFn[PROPS]) {
      currentAsyncEffectTreeNode = curriedFn[PROPS].currentAsyncEffectTreeNode;
      resetCurrentAsyncEffectTreeNodeIfNeeded(curriedFn);
    }
    newCurriedFn[PROPS] = {
      ...(newCurriedFn[PROPS] || {}),
      curryFn,
      promiseFactory,
      baseCurryFnOptions,
      asyncEffectFn,
      asyncEffectOptions,
      asyncEffectFnArgs,
      currentAsyncEffectTreeNode:
        currentAsyncEffectTreeNode ||
        initialAsyncEffectTreeNodeForPromiseFactory(promiseFactory),
      previousCurrentAsyncEffectTreeNode: void 0,
      asyncEffectCurriedFnCallbacks: {
        onCurriedFnFirstCall,
        onNewCurriedFn,
        ...rest,
      },
      onNewCurriedFnAlwaysCallback,
    };
  };

  return {
    onCurriedFnFirstCall,
    onNewCurriedFn,
    ...rest,
  };
}
