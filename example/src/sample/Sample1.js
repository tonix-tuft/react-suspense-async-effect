import React from "react";
import Component1 from "./Component1";
import { asyncEffect } from "react-suspense-async-effect";
import { timeout } from "js-utl";

const timeoutAsyncEffect = asyncEffect(
  (...params) =>
    timeout(300).then(() => ["timeoutAsyncEffect resolved", params, 123]),
  3
);

const Sample1 = () => {
  return (
    <div>
      <Component1 asyncEffect={timeoutAsyncEffect} />
    </div>
  );
};

export default Sample1;
