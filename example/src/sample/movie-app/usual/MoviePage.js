import React from "react";
import MovieDetails from "./MovieDetails";
import MovieReviews from "./MovieReviews";

const MoviePage = ({ id, movieDetails }) => {
  return (
    <div>
      <MovieDetails id={id} movieDetails={movieDetails} />
      <MovieReviews id={id} />
    </div>
  );
};

export default MoviePage;
