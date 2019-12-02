import React, { useState } from "react";
import Movie from "./Movie";
import MovieList from "./MovieList";
import { getMovieDetails } from "./data/async/movieDetails";

const initialCurrentMovieState = {
  id: void 0,
  movieDetails: void 0,
  isLoading: false
};

const MovieApp = () => {
  const [currentMovie, setCurrentMovie] = useState(initialCurrentMovieState);
  const { isLoading, id: currentMovieId, movieDetails } = currentMovie;
  return (
    <React.Fragment>
      {isLoading ? (
        "Loading..."
      ) : (
        <div>
          {currentMovieId ? (
            <Movie
              id={currentMovieId}
              movieDetails={movieDetails}
              onGoBackClick={() => {
                setCurrentMovie(initialCurrentMovieState);
              }}
            />
          ) : (
            <MovieList
              onMovieListItemClick={movieId => {
                setCurrentMovie(prevState => ({
                  ...prevState,
                  isLoading: true
                }));
                getMovieDetails(movieId).then(movieDetails => {
                  setCurrentMovie(prevState => ({
                    ...prevState,
                    isLoading: false,
                    id: movieId,
                    movieDetails
                  }));
                });
              }}
            />
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default MovieApp;
