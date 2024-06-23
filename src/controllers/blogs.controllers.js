import Posts from "../models/blogs.models";
import { uploadToCloud } from "../helper/cloud";

// controller to create a post
export const createPost = async (req, res) => {
  try {
    // checking if post already exits
    const { title, description, image } = req.body;
    const postExist = await Posts.findOne({ title: title });
    if (postExist) {
      return res.status(403).json({
        status: "403",
        message: "Post already exists",
      });
    }
    let savedPostImage;
    if (req.file) savedPostImage = await uploadToCloud(req.file, res);
    const createdPost = await Posts.create({
      description,
      title,
      image: savedPostImage?.secure_url,
    });
    return res.status(201).json({
      status: "201",
      message: "Post created successfully",
      data: createdPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "500",
      message: "Failed to create a post",
      error: error.message,
    });
  }
};

// constroller to retrieve all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Posts.find();
    return res.status(200).json({
      status: "200",
      message: "Posts are retrieve successfully",
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve posts",
      error: error.message,
    });
  }
};

// controller to retrieve single post by id
export const getOnePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Posts.findById(postId);

    if (!post) {
      return res.status(404).json({
        status: "404",
        message: "Post not found",
      });
    }

    res.status(200).json({
      status: "200",
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve post",
      error: error.message,
    });
  }
};

// controller to update post by id
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const findId = await Posts.findById(id);
    if (!findId) {
      return res.status(404).json({
        status: "404",
        message: "Post not found",
      });
    }
    const postExist = await Posts.findOne({ title: title });
    if (postExist) {
      if (postExist._id != id) {
        return res.status(403).json({
          status: "403",
          message: "Post already exists",
        });
      }
    }
    let savedPostImage;
    if (req.file) savedPostImage = await uploadToCloud(req.file, res);
    const createdPost = await Posts.findByIdAndUpdate(id, {
      description,
      title,
      image: savedPostImage?.secure_url,
    },{ new: true } );
    return res.status(201).json({
      status: "201",
      message: "Post Data Updated",
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to Update Post Data",
      error: error.message,
    });
  }
};

// controller to delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const findId = await Posts.findById(id);
    if (!findId) {
      return res.status(404).json({
        status: "404",
        message: "Post not found",
      });
    }
    const deletedPost = await Posts.findByIdAndDelete(id);
    return res.status(200).json({
      status: "200",
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to delete post",
      error: error.message,
    });
  }
};
