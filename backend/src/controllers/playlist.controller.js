import db from "../utils/db.server.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    //validation
    if (!name) {
      return res.status(400).json({ error: "Playlist name is required" });
    }
    //create playlist
    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });
    //send response
    return res
      .status(201)
      .json({
        success: true,
        message: "Playlist Created Successfully",
        playlist
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error While Creating Playlist" });
  }
};
export const getAllListDetails = async (req, res) => {
  
};
export const getPlayListDetails = async (req, res) => {};
export const addProblemToPlaylist = async (req, res) => {};
export const deletePlaylist = async (req, res) => {};
export const removeProblemFromPlaylist = async (req, res) => {};
