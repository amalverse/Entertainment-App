import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrendingMovies } from "../redux/features/movies/moviesSlice";
import { fetchTrendingTV } from "../redux/features/tv/tvSlice";
import MovieCard from "../components/cards/MovieCard";
import TVCard from "../components/cards/TVCard";
import TrendingCard from "../components/cards/TrendingCard";
import SearchBar from "../components/common/SearchBar";
import Loader from "../components/common/Loader";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

// Dashboard component showing trending and recommended items
const Home = () => {
  const dispatch = useDispatch();
  const trendingRef = useRef(null);

  const {
    trending: movies,
    loading: moviesLoading,
    error: moviesError,
    lastFetchedTrending: lastFetchedMovies,
  } = useSelector((state) => state.movies);

  const {
    trending: tvShows,
    loading: tvLoading,
    error: tvError,
    lastFetchedTrending: lastFetchedTV,
  } = useSelector((state) => state.tv);

  // Cache data for 5 minutes to avoid redundant requests
  useEffect(() => {
    const CACHE_DURATION = 5 * 60 * 1000;
    const now = Date.now();

    if (!lastFetchedMovies || now - lastFetchedMovies > CACHE_DURATION) {
      dispatch(fetchTrendingMovies());
    }

    if (!lastFetchedTV || now - lastFetchedTV > CACHE_DURATION) {
      dispatch(fetchTrendingTV());
    }
  }, [dispatch, lastFetchedMovies, lastFetchedTV]);

  // Merge items for trending carousel
  const combinedTrending = useMemo(() => {
    return [...movies.slice(0, 10), ...tvShows.slice(0, 10)];
  }, [movies, tvShows]);

  // Combine items for recommended grid
  const recommendedItems = useMemo(() => {
    return [...movies.slice(10), ...tvShows.slice(10)];
  }, [movies, tvShows]);

  const isLoading = moviesLoading || tvLoading;

  useEffect(() => {
    console.log("Home State Debug:", {
      movies: movies.length,
      tv: tvShows.length,
      loading: isLoading,
    });
  }, [movies, tvShows, isLoading]);

  const scrollLeft = () => {
    if (trendingRef.current) {
      trendingRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (trendingRef.current) {
      trendingRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <section className="mt-2 md:mt-4">
        <SearchBar />
      </section>

      {/* Initial Loading Screen */}
      {isLoading && movies.length === 0 && tvShows.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Loader />
        </div>
      ) : (
        <>
          {/* Trending Carousel */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight">
                Trending
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors text-white"
                >
                  <MdChevronLeft className="text-2xl" />
                </button>
                <button
                  onClick={scrollRight}
                  className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors text-white"
                >
                  <MdChevronRight className="text-2xl" />
                </button>
              </div>
            </div>

            <div className="relative group">
              <div
                ref={trendingRef}
                className="flex gap-4 md:gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
              >
                {combinedTrending.map((item) => (
                  <div
                    key={`${item.id}-${item.title ? "mv" : "tv"}`}
                    className="snap-start shrink-0 min-w-[300px] md:min-w-[470px]"
                  >
                    <TrendingCard
                      item={item}
                      type={item.title ? "movie" : "tv"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recommended Grid */}
          <section>
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-white tracking-tight">
              Recommended for you
            </h2>

            {moviesError || tvError ? (
              <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg text-red-500 text-center">
                ⚠️ Failed to load recommendations. Please try again.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-8">
                {recommendedItems.map((item) => (
                  <div key={`${item.id}-${item.title ? "mv" : "tv"}`}>
                    {item.title ? (
                      <MovieCard movie={item} />
                    ) : (
                      <TVCard tv={item} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && recommendedItems.length === 0 && (
              <div className="text-center text-gray-500 py-20">
                No items found. Please check your connection.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
