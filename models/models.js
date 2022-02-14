import mongoose, {model} from "mongoose";

const Post = mongoose.Schema({
        author: {type: String, required: true},
        title: {type: String, required: true},
        content: {type: String, required: true}
    }
)
const exportPost = mongoose.model("Post", Post)
module.exports = {
    exportPost
};
