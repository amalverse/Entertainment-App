import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTVDetails } from "../redux/features/tv/tvSlice";
import { useParams, useNavigate } from "react-router-dom";
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
import TVCard from "../components/cards/TVCard";
import { FaStar, FaGlobe, FaImdb, FaBookmark, FaRegBookmark, FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";
import Loader from "../components/common/Loader";

// TV show details page
const TVDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { selectedTV: tv, loading } = useSelector((state) => state.tv);
  const bookmarks = useSelector((state) => state.bookmarks.items);
  const watchedList = useSelector((state) => state.watched.items);

  const isBookmarked = bookmarks.some(
    (b) => b.tmdbId === Number(id) && b.type === "tv"
  );
  const isWatched = watchedList.some(
    (b) => b.tmdbId === Number(id) && b.type === "tv"
  );

  useEffect(() => {
    dispatch(fetchTVDetails(id));
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  if (!tv || loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const creators = tv.created_by;
  const cast = tv.credits?.cast.slice(0, 10);
  const similar =
    tv.recommendations?.results.length > 0
      ? tv.recommendations.results.slice(0, 10)
      : tv.similar?.results.slice(0, 10);

  const handleBookmark = () => {
    if (!isAuthenticated) return navigate("/login");
    
    if (isBookmarked) {
      const bookmark = bookmarks.find(
        (b) => b.tmdbId === Number(id) && b.type === "tv"
      );
      if (bookmark) dispatch(removeBookmark(bookmark._id));
    } else {
      dispatch(addBookmark({
        tmdbId: tv.id,
        type: "tv",
        title: tv.name,
        poster: tv.poster_path
      }));
    }
  };

  const handleWatched = () => {
    if (!isAuthenticated) return navigate("/login");
    
    if (isWatched) {
      const watched = watchedList.find(
        (b) => b.tmdbId === Number(id) && b.type === "tv"
      );
      if (watched) dispatch(removeWatched(watched._id));
    } else {
      dispatch(addWatched({
        tmdbId: tv.id,
        type: "tv",
        title: tv.name,
        poster: tv.poster_path
      }));
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white pb-20">
      {/* Hero Section */}
      <div
        className="relative w-full h-[50vh] md:h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 1)), url(https://image.tmdb.org/t/p/original${tv.backdrop_path})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-end pb-12 gap-8">
          {/* Poster */}
          <div className="hidden md:block w-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            <img
              src={getImageUrl(tv.poster_path)}
              alt={tv.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {tv.name}{" "}
              <span className="text-gray-400 font-light text-3xl">
                ({tv.first_air_date?.split("-")[0]})
              </span>
            </h1>

            <p className="text-xl text-gray-300 italic mb-4">{tv.tagline}</p>

            <div className="flex flex-wrap gap-4 items-center text-sm md:text-base text-gray-300 mb-6">
              <span className="border border-gray-600 px-2 py-1 rounded">
                {tv.status}
              </span>
              <span>{tv.number_of_seasons} Seasons</span>
              <span>•</span>
              <div className="flex gap-2">
                {tv.genres?.map((g) => (
                  <span key={g.id} className="text-red-400 font-semibold">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-full">
                <FaStar className="text-yellow-400" />
                <span className="font-bold text-lg">
                  {tv.vote_average.toFixed(1)}
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
              <img src={getImageUrl(tv.poster_path)} alt={tv.name} />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-gray-300 leading-relaxed max-w-3xl">
                {tv.overview}
              </p>
            </div>

            {creators && creators.length > 0 && (
              <div className="mt-6">
                <span className="font-bold">Created By: </span>
                <span className="text-gray-300">
                  {creators.map((c) => c.name).join(", ")}
                </span>
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

        {/* Similar Shows */}
        {similar && similar.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 border-l-4 border-red-500 pl-4">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {similar.map((t) => (
                <TVCard key={t.id} tv={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVDetails;
