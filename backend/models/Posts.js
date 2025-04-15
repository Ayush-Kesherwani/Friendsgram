import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    mediaPath: {
      type: String,
    //   required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
    //   required: true,
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default model("Post", postSchema);
