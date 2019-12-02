import React from "react";

const MovieListItem = ({ movie, onMovieListItemClick }) => {
  return (
    <li>
      <span>{movie.title}</span>
      <button onClick={() => onMovieListItemClick(movie.id)}>
        Show movie info
      </button>
    </li>
  );
};

export default MovieListItem;
