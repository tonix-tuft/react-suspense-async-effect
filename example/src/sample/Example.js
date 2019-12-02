// Example.js
import React from "react";
import { useAsyncEffect, asyncEffect } from "react-suspense-async-effect";

// Create a promise factory.
const promiseFactory = (param1, param2, param3) =>
  new Promise(resolve => {
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
