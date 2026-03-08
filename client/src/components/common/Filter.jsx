import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Filter = ({ onFilterChange, genres, mediaType, currentFilters }) => {
  const [sortOpen, setSortOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(true);

  // Initialize state based on passed props
  const [selectedSort, setSelectedSort] = useState(
    currentFilters?.sort_by || "popularity.desc",
  );

  const [selectedGenres, setSelectedGenres] = useState(
    currentFilters?.with_genres
      ? currentFilters.with_genres.split(",").map(Number)
      : [],
  );

  const [selectedLanguage, setSelectedLanguage] = useState(
    currentFilters?.with_original_language || "",
  );

  // Sync local state when parent filters change
  React.useEffect(() => {
    if (currentFilters) {
      setSelectedSort(currentFilters.sort_by);
      setSelectedGenres(
        currentFilters.with_genres
          ? currentFilters.with_genres.split(",").map(Number)
          : [],
      );
      setSelectedLanguage(currentFilters.with_original_language || "");
    }
  }, [currentFilters]);

  const sortOptions = [
    { label: "Popularity", value: "popularity.desc" },
    { label: "Rating", value: "vote_average.desc" },
    { label: "Latest Release", value: "primary_release_date.desc" },
    { label: "Oldest Release", value: "primary_release_date.asc" },
  ];

  const languages = [
    { label: "All Languages", value: "" },
    { label: "English", value: "en" },
    { label: "Hindi", value: "hi" },
    { label: "Tamil", value: "ta" },
    { label: "Telugu", value: "te" },
    { label: "Malayalam", value: "ml" },
    { label: "Kannada", value: "kn" },
    { label: "Marathi", value: "mr" },
    { label: "Bengali", value: "bn" },
    { label: "Punjabi", value: "pa" },
    { label: "Spanish", value: "es" },
    { label: "French", value: "fr" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "German", value: "de" },
    { label: "Chinese", value: "zh" },
    { label: "Italian", value: "it" },
    { label: "Arabic", value: "ar" },
  ];

  if (mediaType === "tv") {
    sortOptions[2].value = "first_air_date.desc";
    sortOptions[3].value = "first_air_date.asc";
  }

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSelectedSort(newSort);
    onFilterChange({
      sort_by: newSort,
      with_genres: selectedGenres.join(","),
      with_original_language: selectedLanguage,
    });
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    onFilterChange({
      sort_by: selectedSort,
      with_genres: selectedGenres.join(","),
      with_original_language: newLang,
    });
  };

  const handleGenreToggle = (genreId) => {
    let newGenres;
    if (selectedGenres.includes(genreId)) {
      newGenres = selectedGenres.filter((id) => id !== genreId);
    } else {
      newGenres = [...selectedGenres, genreId];
    }
    setSelectedGenres(newGenres);
    onFilterChange({
      sort_by: selectedSort,
      with_genres: newGenres.join(","),
      with_original_language: selectedLanguage,
    });
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0 space-y-4">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
        <div
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-700/50"
          onClick={() => setSortOpen(!sortOpen)}
        >
          <h3 className="font-semibold text-white">Sort</h3>
          {sortOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {sortOpen && (
          <div className="p-4 border-t border-gray-700">
            <label className="text-gray-400 text-sm mb-2 block">
              Sort Results By
            </label>
            <select
              value={selectedSort}
              onChange={handleSortChange}
              className="w-full bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-red-500 mb-4"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
        <div
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-700/50"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <h3 className="font-semibold text-white">Filters</h3>
          {filterOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {filterOpen && (
          <div className="p-4 border-t border-gray-700 space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Original Language
              </label>
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="w-full bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="text-gray-400 text-sm mb-3">Genres</h4>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreToggle(genre.id)}
                    className={`px-3 py-1 rounded-full text-xs transition ${
                      selectedGenres.includes(genre.id)
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition shadow-lg mt-4 disabled:opacity-50"
        onClick={() =>
          onFilterChange({
            sort_by: selectedSort,
            with_genres: selectedGenres.join(","),
            with_original_language: selectedLanguage,
          })
        }
      >
        Search
      </button>
    </div>
  );
};

export default Filter;
