import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdBookmark, MdOutlineBookmarkAdd, MdMovie } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import {
  addBookmark,
  removeBookmark,
} from "../../redux/features/bookmarks/bookmarksSlice";

// Displays movie poster and info
const MovieCard = ({ movie }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const bookmarks = useSelector((state) => state.bookmarks.items);

  const isAdded = bookmarks.some(
    (b) => b.tmdbId === movie.id && b.type === "movie",
  );

  const bookmarkHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isAdded) {
      const bookmark = bookmarks.find(
        (b) => b.tmdbId === movie.id && b.type === "movie",
      );
      if (bookmark) dispatch(removeBookmark(bookmark._id));
    } else {
      dispatch(
        addBookmark({
          tmdbId: movie.id,
          type: "movie",
          title: movie.title,
          poster: movie.poster_path,
        }),
      );
    }
  };

  const releaseYear = (movie.release_date || "").split("-")[0];

  return (
    <div className="relative group cursor-pointer">
      {/* Image Container */}
      <Link to={`/movies/${movie.id}`}>
        <div className="aspect-[2/3] relative rounded-lg overflow-hidden mb-2">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Bookmark Button Overlay */}
          <button
            onClick={bookmarkHandler}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-all duration-300 z-10"
          >
            {isAdded ? (
              <MdBookmark className="text-lg" />
            ) : (
              <MdOutlineBookmarkAdd className="text-lg" />
            )}
          </button>
        </div>
      </Link>

      {/* Info Below Image */}
      <div className="px-1">
        <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400 mb-1">
          <span>{releaseYear}</span>
          <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
          <span className="flex items-center gap-1 uppercase tracking-tight">
            <MdMovie /> Movie
          </span>
        </div>
        <h3 className="text-white text-sm md:text-md font-medium truncate group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>
      </div>
    </div>
  );
};

export default MovieCard;
