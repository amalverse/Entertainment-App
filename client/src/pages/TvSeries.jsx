import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  discoverTV,
  setPage,
  setFilterParams,
} from "../redux/features/tv/tvSlice";
import TVCard from "../components/cards/TVCard";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import Filter from "../components/common/Filter";
import SearchBar from "../components/common/SearchBar";

// TV Genres
const genres = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

const TVSeries = () => {
  const dispatch = useDispatch();

  const {
    tvSeries,
    loading,
    currentPage,
    totalPages,
    filterParams,
    error,
    lastFetchedDiscover,
  } = useSelector((state) => state.tv);

  // Track last fetched filter state
  const lastFiltersRef = useRef({
    page: null,
    sort_by: null,
    with_genres: null,
    with_original_language: null,
  });

  useEffect(() => {
    console.log("TV Series Page State:", {
      tvSeriesLength: tvSeries.length,
      loading,
      error,
      currentPage,
      filterParams,
    });
  }, [tvSeries, loading, error, currentPage, filterParams]);

  useEffect(() => {
    const CACHE_DURATION = 5 * 60 * 1000;
    const now = Date.now();

    // Check if anything actually changed
    const filtersChanged =
      lastFiltersRef.current.page !== currentPage ||
      lastFiltersRef.current.sort_by !== filterParams.sort_by ||
      lastFiltersRef.current.with_genres !== filterParams.with_genres ||
      lastFiltersRef.current.with_original_language !==
        filterParams.with_original_language;

    // Fetch if: invalid cache, no data, or new filters
    const shouldFetch =
      filtersChanged ||
      !lastFetchedDiscover ||
      now - lastFetchedDiscover > CACHE_DURATION;

    if (shouldFetch) {
      lastFiltersRef.current = {
        page: currentPage,
        sort_by: filterParams.sort_by,
        with_genres: filterParams.with_genres,
        with_original_language: filterParams.with_original_language,
      };

      dispatch(
        discoverTV({
          page: currentPage,
          sort_by: filterParams.sort_by,
          with_genres: filterParams.with_genres,
          with_original_language: filterParams.with_original_language,
        }),
      );
    }
  }, [dispatch, currentPage, filterParams, lastFetchedDiscover]);

  const handlePageChange = (page) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newParams) => {
    dispatch(setFilterParams(newParams));
    dispatch(setPage(1)); // Reset to page 1 on filter change
  };

  return (
    <div className="space-y-8">
      <section>
        <SearchBar />
      </section>

      <h1 className="text-2xl md:text-3xl font-light text-white tracking-tight">
        TV Series
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Filter */}
        <Filter
          onFilterChange={handleFilterChange}
          genres={genres}
          mediaType="tv"
          currentFilters={filterParams}
        />

        {/* Content */}
        <div className="flex-1 w-full relative min-h-[500px]">
          {loading && tvSeries.length === 0 ? (
            <div className="flex justify-center pt-20 h-96">
              <Loader />
            </div>
          ) : (
            <>
              {loading && (
                <div className="absolute inset-0 bg-gray-900/50 z-10 flex justify-center pt-20">
                  <Loader />
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
                  ⚠️ {error}
                  {tvSeries.length > 0 && (
                    <span className="text-gray-400 text-sm ml-2">
                      (Showing cached data)
                    </span>
                  )}
                </div>
              )}
            </>
          )}

          {tvSeries.length > 0 ? (
            <div
              className={
                loading
                  ? "opacity-50 transition-opacity duration-300"
                  : "transition-opacity duration-300"
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {tvSeries.map((tv) => (
                  <TVCard key={tv.id} tv={tv} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages > 500 ? 500 : totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            !loading && (
              <div className="text-center text-gray-500 mt-10">
                No TV series found matching your filters.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TVSeries;
