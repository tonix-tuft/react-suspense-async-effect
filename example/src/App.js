import React, { Suspense } from "react";
import MovieApp from "./sample/movie-app/async-effect/MovieApp";
import Sample1 from "./sample/Sample1";
import Sample2 from "./sample/Sample2";
import Example from "./sample/Example";

function App() {
  return (
    <div>
      <div className="spacing">
        <Suspense fallback={<div>Loading...</div>}>
          <Example />
        </Suspense>
      </div>
      <div className="spacing">
        <Suspense fallback={<div>Loading MovieApp...</div>}>
          <MovieApp />
        </Suspense>
      </div>
      <div className="spacing">
        <Suspense fallback={<div>Loading Sample1...</div>}>
          <Sample1 />
        </Suspense>
      </div>
      <div className="spacing">
        <Suspense fallback={<div>Loading Sample2...</div>}>
          <Sample2 />
        </Suspense>
      </div>
    </div>
  );
}
export default App;
