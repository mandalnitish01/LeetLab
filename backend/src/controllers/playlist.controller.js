import {db} from "../libs/db.js";


//create playlist
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
//get all playlists of user with problems
export const getAllListDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where:{
        userId:req.user.id
      },
      include:{
        problems:{
          include:{
            problem:true
          }
        }
      }
    });
    return res.status(200).json({
      success: true,
      message: "Playlists Fetched Successfully",
      playlists,
    });
  } catch (error) {
    
  }
};
//get single playlist details
export const getPlayListDetails = async (req, res) => {
   const { playlistId } = req.params;
  try {
    const playlist = await db.playlist.findUnique({
      where:{
        id:playlistId,
        userId:req.user.id
      },
      include:{
        problems:{
          include:{
            problem:true
          }
        }
      }
    });

    if(!playlist){
      return res.status(404).json({
        success: false,
        message: "Playlist Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Playlist Fetched Successfully",
      playlist,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error While Fetching Playlist" });
  }
};
//add problem to playlist
export const addProblemToPlaylist = async (req, res) => {
   const {playlistId} = req.params;
    const {problemIds} = req.body;

    try {
      if(!Array.isArray(problemIds)||problemIds.length===0){
        return res.status(400).json({
          success:false,
          message:"Invalid Problem Ids"
        });
      }
      //check if playlist exists
      const problemsInPlaylist = await db.problemInPlaylist.createMany({
        data:problemIds.map((problemId)=>{
          return {
            playlistId,
            problemId
          }
        })
      })
      return res.status(200).json({
        success:true,
        message:"Problems Added to Playlist Successfully",
        problemsInPlaylist
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error While Adding Problems to Playlist" });
      
    }
};
//delete playlist
export const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const deletePlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
        // userId: req.user.id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Playlist Deleted Successfully",
      deletePlaylist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "failed to Deleting Playlist" });
  }
};
//remove problem from playlist
export const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing ProblemId",
      });
    }
    //check if playlist exists
    const deleteProblem = await db.problemInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Problems Removed from Playlist Successfully",
      deleteProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error While Removing Problems from Playlist" });
  }
};
