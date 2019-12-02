import React from "react";
import hardCodedMoviesData from "./data/hard-coded/hardCodedMoviesData.json";
import MovieListItem from "./MovieListItem";

const MovieList = ({ onMovieListItemClick }) => {
  const movies = hardCodedMoviesData;
  return (
    <div>
      <div>MovieList</div>
      <ul>
        {movies.map(movie => (
          <MovieListItem
            key={movie.id}
            movie={movie}
            onMovieListItemClick={onMovieListItemClick}
          />
        ))}
      </ul>
    </div>
  );
};

export default MovieList;
