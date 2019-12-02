import React from "react";
import {
  asyncEffect,
  POJOAsyncEffect,
  withContext,
  withCacheInvalidation,
  withPOJOArgAwareness,
  plug,
  useAsyncEffect,
  _
} from "react-suspense-async-effect";
import Code from "./Code";
import { compose } from "js-utl";

const aPromiseFactory = (param1, param2) => {
  return new Promise(resolve =>
    setTimeout(() => resolve(["Component1 resolved", param1, param2]), 200)
  );
};

function anotherPromiseFactory({ param1, param2, ...rest } = {}) {
  return new Promise(resolve =>
    setTimeout(() => resolve({ param1, param2, rest }), 3000)
  );
}

const yetAnotherPromiseFactory = (...args) => {
  return new Promise(resolve => setTimeout(() => resolve(args), 3000));
};

const aPromiseFactoryAsyncEffect = asyncEffect(aPromiseFactory);
const aPromiseFactoryAsyncEffectWithContext = withContext(
  "a1",
  "b2",
  "c3"
)(aPromiseFactoryAsyncEffect);
const aPromiseFactoryAsyncEffectWithContextAndWithPOJOArgAwareness = withPOJOArgAwareness(
  aPromiseFactoryAsyncEffectWithContext
);

export const Component1 = props => {
  // Curried basic promise factory function.
  const [data1] = useAsyncEffect(asyncEffect(aPromiseFactory)("a", "b"));
  const [data12] = useAsyncEffect(asyncEffect(aPromiseFactory)(_, _)("a")("b")); // Same as above.
  const [data13] = useAsyncEffect(asyncEffect(aPromiseFactory)("a")("b")); // Same as above.

  // Curried basic promise factory function with async effect context.
  const [data2] = useAsyncEffect(asyncEffect(aPromiseFactory)("c", "d"));

  // Curried promise factory function which accepts a single POJO object as argument.
  const [data3] = useAsyncEffect(
    POJOAsyncEffect(anotherPromiseFactory)({
      param1: "param1_value",
      param2: "param2_value"
    })(plug)
  );

  // Async effect from props (curried promise factory function from props).
  const [data4] = useAsyncEffect(
    props.asyncEffect("props.asyncEffect param 1")(_)(
      "props.asyncEffect param 2",
      "props.asyncEffect param 3"
    )
  );

  // Async effect augmented behaviour through composition.
  const partialApplication = compose(
    withContext(
      "asyncEffect_context_key_depth_0",
      "asyncEffect_context_key_depth_1",
      "asyncEffect_context_key_depth_2",
      "asyncEffect_context_key_depth_3"
    ),
    withPOJOArgAwareness,
    withCacheInvalidation(
      (true && false) ||
        ((/* { cache } */) => {
          return false;
        })
    )
  )(asyncEffect(yetAnotherPromiseFactory, 3))(1, 2);

  const [data5] = useAsyncEffect(
    partialApplication({
      a: 123,
      b: 456,
      c: 789
    })
  );
  const [data51] = useAsyncEffect(
    partialApplication({
      b: 654,
      c: 987,
      a: 321
    })
  );
  const [data52] = useAsyncEffect(
    partialApplication({
      d: 999,
      b: 654,
      c: 987,
      a: 321
    })
  );

  // POJO Async effect augmented behaviour through composition.
  const [data6] = useAsyncEffect(
    compose(withContext("nested", "context", "keys"))(
      POJOAsyncEffect(anotherPromiseFactory)
    )({
      param1: "param1_withContext(POJOAsyncEffect)",
      param2: "param2_withContext(POJOAsyncEffect)"
    })(plug)
  );

  // Async effect created outside of the rendering function.
  const [data7] = useAsyncEffect(
    aPromiseFactoryAsyncEffectWithContextAndWithPOJOArgAwareness(
      "data7_param1"
    )("data7_param2")
  );

  // Partial application of a POJO async effect.
  const POJOPartialApplication = POJOAsyncEffect(anotherPromiseFactory)({
    param1: "partial_application_param1_value"
  });
  const POJOPartialApplication1 = POJOPartialApplication({
    param2: "POJOPartialApplication1_partial_application_param2_value",
    param999: "partial_application_param999_value"
  });
  const [data8] = useAsyncEffect(
    POJOPartialApplication({
      param2: "data8_partial_application_param2_value",
      param3: "data8_partial_application_param3_value"
    })(plug)
  );

  const [data82] = useAsyncEffect(
    POJOPartialApplication({
      param2: "data_82_partial_application_param2_value"
    })({
      param3: "data_82_partial_application_param3_value",
      param4: "data_82_partial_application_param4_value",
      ...plug
    })
  );

  const [data83] = useAsyncEffect(
    POJOPartialApplication1({
      param3: "data_83_partial_application_param3_value",
      ...plug
    })
  );

  const [data84] = useAsyncEffect(
    POJOPartialApplication1({
      param1: "data_84_partial_application_param1_value",
      param3: "data_84_partial_application_param3_value"
    })(plug)
  );

  const res = {
    data1,
    "data1.2": data12,
    "data1.3": data13,
    data2,
    data3,
    data4,
    data5,
    "data5.1": data51,
    "data5.2": data52,
    data6,
    data7,
    data8,
    "data8.2": data82,
    "data8.3": data83,
    "data8.4": data84
  };
  // eslint-disable-next-line no-console
  console.log(props, res);
  return (
    <div>
      <Code>{JSON.stringify(res, void 0, 4)}</Code>
    </div>
  );
};

export default Component1;
