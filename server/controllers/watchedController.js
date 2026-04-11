const User = require("../models/User");

/**
 * @desc    Get all watched items
 * @route   GET /api/watched
 * @access  Private
 */
const getWatched = async (req, res) => {
  res.status(200).json(req.user.watchedList);
};

/**
 * @desc    Mark an item as watched
 * @route   POST /api/watched
 * @access  Private
 */
const addWatched = async (req, res) => {
  try {
    const { tmdbId, type, title, poster } = req.body;

    console.log("Marking as watched:", { tmdbId, type, title });

    if (!tmdbId || !type || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const id = Number(tmdbId);

    // Check limit
    if (req.user.watchedList.length >= 1000) {
      return res
        .status(400)
        .json({ message: "Watched list limit of 1000 reached" });
    }

    // Check if duplicate
    const exists = req.user.watchedList.find(
      (item) => item.tmdbId === id && item.type === type,
    );

    if (exists) {
      console.log("Already in watched list");
      return res.status(400).json({ message: "Already marked as watched" });
    }

    req.user.watchedList.push({ tmdbId: id, type, title, poster });
    await req.user.save();

    console.log("Marked as watched successfully");
    res.status(201).json(req.user.watchedList.at(-1));
  } catch (error) {
    console.error("Error marking as watched:", error);
    res.status(500).json({ message: "Server error marking as watched" });
  }
};

/**
 * @desc    Remove an item from watched list
 * @route   DELETE /api/watched/:id
 * @access  Private
 */
const removeWatched = async (req, res) => {
  try {
    const watchedId = req.params.id;
    console.log("Removing watched ID:", watchedId);

    req.user.watchedList.pull({ _id: watchedId });
    await req.user.save();

    console.log("Watched item removed successfully");
    res.status(200).json({ message: "Removed from watched list" });
  } catch (error) {
    console.error("Error removing watched item:", error);
    res.status(500).json({ message: "Server error removing watched item" });
  }
};

module.exports = {
  getWatched,
  addWatched,
  removeWatched,
};
