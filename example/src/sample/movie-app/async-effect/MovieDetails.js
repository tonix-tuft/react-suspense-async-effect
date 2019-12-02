import React from "react";
import { getMovieDetails } from "./data/async/movieDetails";
import {
  asyncEffect,
  useAsyncEffect,
  defaultAsyncEffectOptions
} from "react-suspense-async-effect";

defaultAsyncEffectOptions.shouldReturnReason = true;

const MovieDetails = ({ id }) => {
  const [movieDetails, reason] = useAsyncEffect(
    asyncEffect(getMovieDetails)(id)
  );
  return (
    <div>
      <div>Movie details</div>
      {(!reason && (
        <React.Fragment>
          <div>Title: {movieDetails.title}</div>
          <div>Rating: {movieDetails.rating}</div>
        </React.Fragment>
      )) || <div>{reason}</div>}
    </div>
  );
};

export default MovieDetails;
