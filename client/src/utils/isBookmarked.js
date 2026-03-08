const isBookmarked = (bookmarks, tmdbId, type) => {
  return bookmarks.some((item) => item.tmdbId === tmdbId && item.type === type);
};

export default isBookmarked;
