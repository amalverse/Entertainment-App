const formatRating = (rating) => {
  if (!rating) return "N/A";
  return rating.toFixed(1);
};

export default formatRating;
