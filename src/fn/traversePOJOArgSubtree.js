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

import { PROPS } from "../constants";

/**
 * Traverses a POJO argument subtree.
 *
 * @param {Function} curriedFn The async effect curried function.
 * @param {Object} POJO The POJO argument.
 * @param {number} keysHash The hash of the keys of the POJO argument.
 * @param {Array} keys The array of the unique keys of the POJO argument.
 * @return {undefined}
 */
export function traversePOJOArgSubtree(curriedFn, POJO, keysHash, keys) {
  const { currentAsyncEffectTreeNode } = curriedFn[PROPS];
  currentAsyncEffectTreeNode.POJOArgSubtree =
    currentAsyncEffectTreeNode.POJOArgSubtree || new Map();
  let node;
  if (!currentAsyncEffectTreeNode.POJOArgSubtree.has(keysHash)) {
    node = {
      keys
    };
    currentAsyncEffectTreeNode.POJOArgSubtree.set(keysHash, node);
  } else {
    node = currentAsyncEffectTreeNode.POJOArgSubtree.get(keysHash);
  }
  const nodeKeys = node.keys;
  const l = nodeKeys.length;
  if (l) {
    node.POJOArgSubtreeSubtree = node.POJOArgSubtreeSubtree || new Map();
    let subtreeMap = node.POJOArgSubtreeSubtree;
    for (let i = 0; i < l - 1; i++) {
      const nodeKey = nodeKeys[i];
      const POJOValue = POJO[nodeKey];
      let node;
      if (!subtreeMap.has(POJOValue)) {
        node = {};
        subtreeMap.set(POJOValue, node);
      } else {
        node = subtreeMap.get(POJOValue);
      }
      node.POJOArgSubtreeSubtree = node.POJOArgSubtreeSubtree || new Map();
      subtreeMap = node.POJOArgSubtreeSubtree;
    }
    const lastPOJOArgKey = nodeKeys[l - 1];
    const POJOValue = POJO[lastPOJOArgKey];
    if (!subtreeMap.has(POJOValue)) {
      node = {};
      subtreeMap.set(POJOValue, node);
    } else {
      node = subtreeMap.get(POJOValue);
    }
  }
  curriedFn[PROPS].previousCurrentAsyncEffectTreeNode =
    curriedFn[PROPS].currentAsyncEffectTreeNode;
  curriedFn[PROPS].currentAsyncEffectTreeNode = node;
}
