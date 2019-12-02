import React from "react";
import { asyncEffect, useAsyncEffect } from "react-suspense-async-effect";
import Code from "./Code";
import { timeout } from "js-utl";

const promiseFactory = value =>
  timeout(1000).then(() => {
    return value;
  });

export const Component2 = () => {
  const [value] = useAsyncEffect(
    asyncEffect(promiseFactory)("A promise value given as parameter")
  );
  return (
    <div>
      <Code>{JSON.stringify(["Component2 rendered", value])}</Code>
    </div>
  );
};

export default Component2;
