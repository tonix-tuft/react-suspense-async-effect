# react-suspense-async-effect

_Asynchronous, feels synchronous._

A library to perform asynchronous effects in React following the Suspense API principles providing asynchronous curried functions with a synchronous feel.

[![NPM](https://img.shields.io/npm/v/react-suspense-async-effect.svg)](https://www.npmjs.com/package/react-suspense-async-effect)

## Installation

```bash
npm install --save react-suspense-async-effect
```

Install peer dependencies:

```bash
npm install --save react react-dom
```

## Usage

```jsx
// Example.js
import React from "react";
import { useAsyncEffect, asyncEffect } from "react-suspense-async-effect";

// Create a promise factory.
const promiseFactory = (param1, param2, param3) =>
  new Promise((resolve) => {
    setTimeout(resolve, 3000, { param1, param2, param3 });
  });

// Preload the asynchronous effect (Render-as-you-fetch).
const preloadedAsyncEffect = asyncEffect(promiseFactory)("param1 value")(
  "param2 value",
  "param3 value"
);

function Example() {
  // Use the asynchronous effect.
  // If the asynchronous data is available at this point,
  // render the component, otherwise suspend.
  const [data] = useAsyncEffect(preloadedAsyncEffect);
  return (
    <div>
      <pre>
        <code>{JSON.stringify(data, void 0, 4)}</code>
      </pre>
    </div>
  );
}
export default Example;

// App.js
import React, { Suspense } from "react";
import Example from "./Example";

function App() {
  return (
    <div>
      <Suspense fallback="Loading...">
        <Example />
      </Suspense>
    </div>
  );
}
export default App;
```

## License

MIT © [Anton Bagdatyev (Tonix)](https://github.com/tonix-tuft)
