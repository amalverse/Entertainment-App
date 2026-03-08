import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookmarks,
  addBookmark,
  removeBookmark,
} from "../redux/features/bookmarks/bookmarksSlice";

const useBookmarks = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.bookmarks);

  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  const add = (data) => dispatch(addBookmark(data));
  const remove = (id) => dispatch(removeBookmark(id));

  return {
    bookmarks: items,
    addBookmark: add,
    removeBookmark: remove,
  };
};

export default useBookmarks;
