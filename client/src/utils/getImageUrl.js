const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";
  return `${BASE_IMAGE_URL}${path}`;
};

export default getImageUrl;
