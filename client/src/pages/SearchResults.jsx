import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import getImageUrl from "../utils/getImageUrl";
import truncateText from "../utils/truncateText";

// Search results display page
const SearchResults = () => {
  const { results, query } = useSelector((state) => state.search);

  if (!query) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <p>Search for a movie or TV series</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <p>No results found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <h1 className="text-2xl mb-6">
        Search results for "<span className="text-red-500">{query}</span>"
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {results.map((item) => {
          if (item.media_type !== "movie" && item.media_type !== "tv") {
            return null;
          }

          const title = item.media_type === "movie" ? item.title : item.name;
          const link =
            item.media_type === "movie"
              ? `/movies/${item.id}`
              : `/tv/${item.id}`;

          return (
            <Link
              to={link}
              key={`${item.media_type}-${item.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition"
            >
              <img
                src={getImageUrl(item.poster_path)}
                alt={title}
                className="h-64 w-full object-cover"
              />

              <div className="p-2">
                <p className="text-sm font-semibold truncate">{title}</p>
                <p className="text-xs text-gray-400">
                  {item.media_type.toUpperCase()}
                </p>
                <p className="text-xs mt-1 text-gray-300">
                  {truncateText(item.overview, 80)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
