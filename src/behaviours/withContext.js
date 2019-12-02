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

import { composeAsyncEffectCurriedFn } from "../fn/composeAsyncEffectCurriedFn";
import { PROPS } from "../constants";

/**
 * A function to compose an async effect giving it a context.
 *
 * @param {...*} asyncEffectContextKeys The context's keys. Each key can be of any type.
 * @return {Function} A function accepting an async effect to change its behaviour through composition.
 */
export default function withContext(...asyncEffectContextKeys) {
  return asyncEffectCurriedFn => {
    const newAsyncEffectFn = composeAsyncEffectCurriedFn(asyncEffectCurriedFn, {
      onCurriedFnFirstCall: ({ curriedFn, ...rest }) => {
        const { currentAsyncEffectTreeNode } = curriedFn[PROPS];
        const l = asyncEffectContextKeys.length;
        if (!l) {
          asyncEffectCurriedFn[
            PROPS
          ].asyncEffectCurriedFnCallbacks.onCurriedFnFirstCall({
            curriedFn,
            ...rest
          });
          return;
        }
        currentAsyncEffectTreeNode.withContext =
          currentAsyncEffectTreeNode.withContext || new Map();
        let subtreeMap = currentAsyncEffectTreeNode.withContext;
        for (let i = 0; i < l - 1; i++) {
          const asyncEffectContextKey = asyncEffectContextKeys[i];
          let node;
          if (!subtreeMap.has(asyncEffectContextKey)) {
            node = {};
            subtreeMap.set(asyncEffectContextKey, node);
          } else {
            node = subtreeMap.get(asyncEffectContextKey);
          }
          node.contextSubtree = node.contextSubtree || new Map();
          subtreeMap = node.contextSubtree;
        }
        let node;
        const lastContextKey = asyncEffectContextKeys[l - 1];
        if (!subtreeMap.has(lastContextKey)) {
          node = {};
          subtreeMap.set(lastContextKey, node);
        } else {
          node = subtreeMap.get(lastContextKey);
        }
        node.contextEndedSubtree = node.contextEndedSubtree || {};
        curriedFn[PROPS].currentAsyncEffectTreeNode = node.contextEndedSubtree;
      }
    });
    return newAsyncEffectFn;
  };
}
