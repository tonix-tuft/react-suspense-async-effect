import React, { useState, Suspense } from "react";
import Movie from "./Movie";
import MovieList from "./MovieList";

const MovieApp = () => {
  const [currentMovieId, setCurrentMovieId] = useState(void 0);
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
};

export default MovieApp;
