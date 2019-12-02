import React from "react";

function Code(props) {
  return (
    <code
      style={{
        whiteSpace: "pre",
        textAlign: "left"
      }}
    >
      {props.children}
    </code>
  );
}

export default Code;
