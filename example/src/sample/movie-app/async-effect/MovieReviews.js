import React from "react";
import hardCodedMovieReviews from "./data/hard-coded/hardCodedMovieReviews.json";

const MovieReviews = ({ id }) => {
  const movieReviews = hardCodedMovieReviews[id];
  return (
    <div>
      <div>Movie reviews</div>
      <div>
        <ul>
          {movieReviews.map(movieReview => (
            <li key={movieReview.id}>{movieReview.comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MovieReviews;
