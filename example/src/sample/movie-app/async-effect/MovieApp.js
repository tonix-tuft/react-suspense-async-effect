import React, { useState } from "react";
import Movie from "./Movie";
import MovieList from "./MovieList";

const MovieApp = () => {
  const [currentMovieId, setCurrentMovieId] = useState(void 0);
  return (
    <div>
      {currentMovieId ? (
        <Movie
          id={currentMovieId}
          onGoBackClick={() => {
            setCurrentMovieId(void 0);
          }}
        />
      ) : (
        <MovieList
          onMovieListItemClick={movieId => setCurrentMovieId(movieId)}
        />
      )}
    </div>
  );
};

export default MovieApp;
