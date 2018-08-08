var mongoose = require('mongoose'), Schema = mongoose.Schema;

var ChatSchema = new mongoose.Schema({
  room : { type: Schema.Types.ObjectId, ref: 'Room' },
  nickname: String,
  message: String,
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', ChatSchema);
