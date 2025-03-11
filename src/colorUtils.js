// colorUtils.js
export const generateColor = (id) => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#33FFF3"];
  return colors[id % colors.length]; // Ensures different colors for different IDs
};
