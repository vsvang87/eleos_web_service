const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
  },
  password: {
    type: String,
    require: true,
  },
  is_team_driver_login: {
    type: Boolean,
  },
  full_name: {
    type: String,
    lowercase: true,
  },
  api_token: String,
  id: {
    type: Boolean,
  },
  display_identifier: String,
  sort: Boolean,
  order_number: Boolean,
  load_status: String,
  load_status_label: String,
  active: Boolean,
  current: Boolean,
});

module.exports = mongoose.model("user", userSchema);
