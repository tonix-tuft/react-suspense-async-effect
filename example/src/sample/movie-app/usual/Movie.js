import React from "react";
import MoviePage from "./MoviePage";

const Movie = ({ id, movieDetails, onGoBackClick }) => {
  return (
    <div>
      <button onClick={onGoBackClick}>Go back</button>
      <MoviePage id={id} movieDetails={movieDetails} />
    </div>
  );
};

export default Movie;
