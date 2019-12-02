import React from "react";
import MoviePage from "./MoviePage";

const Movie = ({ id, onGoBackClick }) => {
  return (
    <div>
      <button onClick={onGoBackClick}>Go back</button>
      <MoviePage id={id} />
    </div>
  );
};

export default Movie;
