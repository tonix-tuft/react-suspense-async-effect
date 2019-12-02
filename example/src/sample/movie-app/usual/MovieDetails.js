import React from "react";

const MovieDetails = ({ movieDetails }) => {
  return (
    <div>
      <div>Movie details</div>
      <div>Title: {movieDetails.title}</div>
      <div>Rating: {movieDetails.rating}</div>
    </div>
  );
};

export default MovieDetails;
