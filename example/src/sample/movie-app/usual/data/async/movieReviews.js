import { timeout } from "js-utl";
import config from "./config";
import hardCodedMovieReviews from "../hard-coded/hardCodedMovieReviews.json";

export const getMovieReviews = id =>
  timeout(config.MOVIE_REVIEWS_PROMISE_TIMEOUT).then(
    () => hardCodedMovieReviews[id]
  );
