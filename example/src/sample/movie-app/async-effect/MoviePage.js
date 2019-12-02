import React from "react";
import MovieDetails from "./MovieDetails";
import MovieReviews from "./MovieReviews";

const MoviePage = ({ id }) => {
  return (
    <div>
      <MovieDetails id={id} />
      <MovieReviews id={id} />
    </div>
  );
};

export default MoviePage;
