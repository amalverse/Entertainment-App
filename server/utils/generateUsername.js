const User = require("../models/User");

/**
 * Generates a clean username from a given name
 * Converts to lowercase and removes spaces
 * @param {string} name - The original name
 * @returns {string} - The cleaned username
 */
const cleanUsername = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ""); // Remove all spaces
};

/**
 * Generates a unique username by checking if it exists
 * If the username exists, appends a random number
 * @param {string} name - The original name
 * @returns {Promise<string>} - A unique username
 */
const generateUniqueUsername = async (name) => {
  let baseUsername = cleanUsername(name);

  // If baseUsername is empty, generate a default one
  if (!baseUsername) {
    baseUsername = "user";
  }

  // Check if username already exists
  let username = baseUsername;
  let userExists = await User.findOne({ username });

  // If username exists, append a random number until we find an available one
  let attempts = 0;
  while (userExists && attempts < 100) {
    const randomSuffix = Math.floor(Math.random() * 10000);
    username = `${baseUsername}${randomSuffix}`;
    userExists = await User.findOne({ username });
    attempts++;
  }

  if (attempts >= 100) {
    throw new Error("Could not generate a unique username after multiple attempts");
  }

  return username;
};

module.exports = {
  cleanUsername,
  generateUniqueUsername,
};
