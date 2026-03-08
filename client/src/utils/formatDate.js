const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default formatDate;
