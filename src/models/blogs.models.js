import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    addedOn: { type: Date, default: Date.now }
  });

const Posts = mongoose.model('posts', postSchema);

export default Posts;