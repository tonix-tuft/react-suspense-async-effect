import { timeout } from "js-utl";
import config from "./config";
import hardCodedMovieDetails from "../hard-coded/hardCodedMovieDetails.json";

export const getMovieDetails = id =>
  timeout(config.MOVIE_DETAILS_PROMISE_TIMEOUT).then(() => {
    // throw new Error("AAAAAH! " + id);
    return hardCodedMovieDetails[id];
  });
