import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchMulti, setQuery } from "../../redux/features/search/searchSlice";
import { useState } from "react";
import { MdSearch } from "react-icons/md";

// Main search input
const SearchBar = () => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(setQuery(text));
      dispatch(searchMulti(text));
      navigate("/search");
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex items-center gap-4 w-full group"
    >
      <MdSearch className="text-3xl text-white group-focus-within:text-red-500 transition-colors" />
      <input
        type="text"
        placeholder="Search for movies or TV series"
        className="flex-1 bg-transparent text-xl md:text-2xl font-light text-white outline-none border-b border-transparent focus:border-red-500/30 py-2 transition-all placeholder:text-gray-500"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;
