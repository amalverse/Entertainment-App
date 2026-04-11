import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdBookmark,
  MdOutlineBookmarkAdd,
  MdMovie,
  MdTv,
  MdCheckCircle,
  MdOutlineCheckCircle,
} from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import {
  addBookmark,
  removeBookmark,
} from "../../redux/features/bookmarks/bookmarksSlice";
import {
  addWatched,
  removeWatched,
} from "../../redux/features/watched/watchedSlice";

// Large landscape card for trending carousel
const TrendingCard = ({ item, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const bookmarks = useSelector((state) => state.bookmarks.items);
  const watchedList = useSelector((state) => state.watched.items);

  const isBookmarked = bookmarks.some(
    (b) => b.tmdbId === item.id && b.type === type,
  );

  const isWatched = watchedList.some(
    (b) => b.tmdbId === item.id && b.type === type,
  );

  const bookmarkHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isBookmarked) {
      const bookmark = bookmarks.find(
        (b) => b.tmdbId === item.id && b.type === type,
      );
      if (bookmark) dispatch(removeBookmark(bookmark._id));
    } else {
      dispatch(
        addBookmark({
          tmdbId: item.id,
          type,
          title: item.title || item.name,
          poster: item.poster_path,
        }),
      );
    }
  };

  const watchedHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isWatched) {
      const watched = watchedList.find(
        (b) => b.tmdbId === item.id && b.type === type,
      );
      if (watched) dispatch(removeWatched(watched._id));
    } else {
      dispatch(
        addWatched({
          tmdbId: item.id,
          type,
          title: item.title || item.name,
          poster: item.poster_path,
        }),
      );
    }
  };

  const releaseYear =
    (item.release_date || item.first_air_date || "").split("-")[0] || "N/A";

  return (
    <div className="relative w-full h-[140px] md:h-[230px] rounded-lg overflow-hidden group cursor-pointer shadow-xl bg-gray-800">
      <Link to={`/${type === "movie" ? "movies" : "tv"}/${item.id}`}>
        <img
          src={
            item.backdrop_path
              ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
              : "https://via.placeholder.com/1280x720?text=No+Backdrop"
          }
          alt={item.title || item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        {/* Info Overlay */}
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300 mb-1">
            <span>{releaseYear}</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span className="flex items-center gap-1">
              {type === "movie" ? <MdMovie /> : <MdTv />}
              {type === "movie" ? "Movie" : "TV Series"}
            </span>
          </div>
          <h3 className="text-white text-lg md:text-xl font-bold truncate max-w-[200px] md:max-w-[400px]">
            {item.title || item.name}
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col gap-2 z-10">
          <button
            onClick={bookmarkHandler}
            className={`p-2 md:p-3 rounded-full transition-all duration-300 ${
              isBookmarked 
                ? "bg-red-600 text-white" 
                : "bg-black/50 text-white hover:bg-white hover:text-black"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          >
            {isBookmarked ? (
              <MdBookmark className="text-xl" />
            ) : (
              <MdOutlineBookmarkAdd className="text-xl" />
            )}
          </button>
          <button
            onClick={watchedHandler}
            className={`p-2 md:p-3 rounded-full transition-all duration-300 ${
              isWatched 
                ? "bg-green-600 text-white" 
                : "bg-black/50 text-white hover:bg-white hover:text-black"
            }`}
            title={isWatched ? "Unmark as Watched" : "Mark as Watched"}
          >
            {isWatched ? (
              <MdCheckCircle className="text-xl" />
            ) : (
              <MdOutlineCheckCircle className="text-xl" />
            )}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default TrendingCard;
