import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { fetchWatched } from "../redux/features/watched/watchedSlice";
import MovieCard from "../components/cards/MovieCard";
import TVCard from "../components/cards/TVCard";
import SearchBar from "../components/common/SearchBar";

// Watched content page
const Watched = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items: watchedList, loading } = useSelector((state) => state.watched);

  // Sync watched list on load
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWatched());
    }
  }, [dispatch, isAuthenticated]);

  const movieWatched = watchedList.filter((b) => b.type === "movie");
  const tvWatched = watchedList.filter((b) => b.type === "tv");

  return (
    <div className="space-y-8">
      <section>
        <SearchBar />
      </section>

      {!isAuthenticated && (
        <div className="bg-red-500/10 border border-red-500/50 text-white p-6 rounded-lg mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-lg">
            Please log in to view and manage your watched list.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition shadow-lg"
          >
            Go to Login
          </button>
        </div>
      )}

      <h1 className="text-2xl md:text-3xl font-light text-white tracking-tight">
        Watched Items
      </h1>

      {isAuthenticated ? (
        <>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading watched list...</p>
            </div>
          ) : (
            <>
              {movieWatched.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl mb-4 text-gray-300">Movies You've Watched</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {movieWatched.map((item) => (
                      <MovieCard
                        key={item._id}
                        movie={{
                          id: item.tmdbId,
                          title: item.title,
                          poster_path: item.poster,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {tvWatched.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl mb-4 text-gray-300">TV Shows You've Watched</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {tvWatched.map((item) => (
                      <TVCard
                        key={item._id}
                        tv={{
                          id: item.tmdbId,
                          name: item.title,
                          poster_path: item.poster,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {movieWatched.length === 0 && tvWatched.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  <p>You haven't marked any items as watched yet.</p>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="text-center text-gray-400 py-12">
          <p className="text-lg">Sign in to start tracking what you've watched</p>
        </div>
      )}
    </div>
  );
};

export default Watched;
