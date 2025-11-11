const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  originalName: String,
  filename: String, // stored name on disk
  mimeType: String,
  size: Number,
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);
