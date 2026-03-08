const User = require("../models/User");

/**
 * @desc    Get all bookmarks
 * @route   GET /api/bookmarks
 * @access  Private
 */
const getBookmarks = async (req, res) => {
  res.status(200).json(req.user.bookmarks);
};

/**
 * @desc    Add a bookmark
 * @route   POST /api/bookmarks
 * @access  Private
 */
const addBookmark = async (req, res) => {
  try {
    const { tmdbId, type, title, poster } = req.body;

    console.log("Adding bookmark:", { tmdbId, type, title });

    if (!tmdbId || !type || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const id = Number(tmdbId);

    // Check limit
    if (req.user.bookmarks.length >= 500) {
      return res.status(400).json({ message: "Bookmark limit of 500 reached" });
    }

    // Check if duplicate
    const exists = req.user.bookmarks.find(
      (item) => item.tmdbId === id && item.type === type,
    );

    if (exists) {
      console.log("Bookmark already exists");
      return res.status(400).json({ message: "Already bookmarked" });
    }

    req.user.bookmarks.push({ tmdbId: id, type, title, poster });
    await req.user.save();

    console.log("Bookmark saved successfully");
    res.status(201).json(req.user.bookmarks.at(-1));
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({ message: "Server error adding bookmark" });
  }
};

/**
 * @desc    Remove a bookmark
 * @route   DELETE /api/bookmarks/:id
 * @access  Private
 */
const removeBookmark = async (req, res) => {
  try {
    const bookmarkId = req.params.id;
    console.log("Removing bookmark ID:", bookmarkId);

    // Use pull to remove specific subdocument by _id
    req.user.bookmarks.pull({ _id: bookmarkId });
    await req.user.save();

    console.log("Bookmark removed successfully");
    res.status(200).json({ message: "Bookmark removed" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({ message: "Server error removing bookmark" });
  }
};

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark,
};
