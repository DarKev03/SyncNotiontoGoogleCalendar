const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  notion_access_token: { type: String, required: true },
  notion_refresh_token: { type: String },
  notion_user_id: { type: String },
  notion_token_expires_at: { type: Date },

  google_access_token: { type: String, required: true },
  google_refresh_token: { type: String },
  google_user_id: { type: String },
  google_token_expires_at: { type: Date },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
