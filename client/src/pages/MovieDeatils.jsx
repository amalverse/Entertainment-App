import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails } from "../redux/features/movies/moviesSlice";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { 
  addBookmark, 
  removeBookmark 
} from "../redux/features/bookmarks/bookmarksSlice";
import { 
  addWatched, 
  removeWatched 
} from "../redux/features/watched/watchedSlice";
import getImageUrl from "../utils/getImageUrl";
import MovieCard from "../components/cards/MovieCard";
import { FaStar, FaGlobe, FaImdb, FaBookmark, FaRegBookmark, FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";
import Loader from "../components/common/Loader";

const MovieDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const { selectedMovie: movie, loading } = useSelector(
    (state) => state.movies,
  );
  const bookmarks = useSelector((state) => state.bookmarks.items);
  const watchedList = useSelector((state) => state.watched.items);

  const isBookmarked = bookmarks.some(
    (b) => Number(b.tmdbId) === Number(id) && b.type === "movie",
  );
  const isWatched = watchedList.some(
    (b) => Number(b.tmdbId) === Number(id) && b.type === "movie",
  );

  useEffect(() => {
    dispatch(fetchMovieDetails(id));
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  if (!movie || loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const director = movie.credits?.crew.find((p) => p.job === "Director");
  const cast = movie.credits?.cast.slice(0, 10);
  const similar =
    movie.recommendations?.results.length > 0
      ? movie.recommendations.results.slice(0, 10)
      : movie.similar?.results.slice(0, 10);

  // Convert minutes to e.g. "1h 30m"
  const formatRuntime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const handleBookmark = () => {
    if (!isAuthenticated) return navigate("/login");
    
    if (isBookmarked) {
      const bookmark = bookmarks.find(
        (b) => Number(b.tmdbId) === Number(id) && b.type === "movie"
      );
      if (bookmark) dispatch(removeBookmark(bookmark._id));
    } else {
      dispatch(addBookmark({
        tmdbId: movie.id,
        type: "movie",
        title: movie.title,
        poster: movie.poster_path
      }));
    }
  };

  const handleWatched = () => {
    if (!isAuthenticated) return navigate("/login");
    
    if (isWatched) {
      const watched = watchedList.find(
        (b) => Number(b.tmdbId) === Number(id) && b.type === "movie"
      );
      if (watched) dispatch(removeWatched(watched._id));
    } else {
      dispatch(addWatched({
        tmdbId: movie.id,
        type: "movie",
        title: movie.title,
        poster: movie.poster_path
      }));
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white pb-20">
      {/* Hero Section */}
      <div
        className="relative w-full h-[50vh] md:h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 1)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Optional: big play button or just styling */}
        </div>

        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-end pb-12 gap-8">
          {/* Poster - hidden on small screens, shown on medium up */}
          <div className="hidden md:block w-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {movie.title}{" "}
              <span className="text-gray-400 font-light text-3xl">
                ({movie.release_date?.split("-")[0]})
              </span>
            </h1>

            <p className="text-xl text-gray-300 italic mb-4">{movie.tagline}</p>

            <div className="flex flex-wrap gap-4 items-center text-sm md:text-base text-gray-300 mb-6">
              <span className="border border-gray-600 px-2 py-1 rounded">
                {movie.status}
              </span>
              <span>{movie.release_date}</span>
              <span>•</span>
              <div className="flex gap-2">
                {movie.genres?.map((g) => (
                  <span key={g.id} className="text-red-400 font-semibold">
                    {g.name}
                  </span>
                ))}
              </div>
              <span>•</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-full">
                <FaStar className="text-yellow-400" />
                <span className="font-bold text-lg">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">/ 10</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all shadow-lg ${
                    isBookmarked 
                      ? "bg-red-600 text-white hover:bg-red-700" 
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>

                <button
                  onClick={handleWatched}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all shadow-lg ${
                    isWatched 
                      ? "bg-green-600 text-white hover:bg-green-700" 
                      : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-600"
                  }`}
                >
                  {isWatched ? <FaCheckCircle /> : <FaRegCheckCircle />}
                  {isWatched ? "Watched" : "Mark Watched"}
                </button>
              </div>
            </div>

            <div className="md:hidden w-48 rounded-lg overflow-hidden shadow-xl mb-6">
              <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-gray-300 leading-relaxed max-w-3xl">
                {movie.overview}
              </p>
            </div>

            {director && (
              <div className="mt-6">
                <span className="font-bold">Director: </span>
                <span className="text-gray-300">{director.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {/* Cast */}
        {cast && cast.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-4">
              Top Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="bg-gray-800 rounded-lg overflow-hidden"
                >
                  <img
                    src={
                      actor.profile_path
                        ? getImageUrl(actor.profile_path)
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={actor.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-3">
                    <p className="font-semibold text-sm truncate">
                      {actor.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="font-bold mb-4 text-lg">Detailed Info</h3>
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-gray-400 block">Original Title</span>{" "}
                {movie.original_title}
              </p>
              <p>
                <span className="text-gray-400 block">Status</span>{" "}
                {movie.status}
              </p>
              <p>
                <span className="text-gray-400 block">Budget</span> $
                {movie.budget?.toLocaleString()}
              </p>
              <p>
                <span className="text-gray-400 block">Revenue</span> $
                {movie.revenue?.toLocaleString()}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <FaGlobe size={20} />
                </a>
              )}
              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <FaImdb size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Similar Movies */}
        {similar && similar.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-4">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {similar.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
