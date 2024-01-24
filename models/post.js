const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  text: String,
  serving: String,
  prepTime: String,
  calories: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  // array of comment objects
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  ingredients: [String],
  steps: [String]
});
module.exports = mongoose.model('Post', PostSchema);
