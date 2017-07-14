const mongoose = require("mongoose");
const Schema = mongoose.Schema;



//mongoose Schema for snippets
const snippetSchema = new Schema({
 id:Number,
 title:String,
 body: String,
 optNotes: String,
 lang: String,
 snippetTag: String
});

const userSchema = new Schema({
  username: String,
  password: String
});

//Activity is the collection name; mongoose will lowercase and pluralize it
const snippets = mongoose.model('snippets', activitySchema);
const users = mongoose.model('users', userSchema);

module.exports = {snippets, users};
