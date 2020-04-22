const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title:   { type: String, required: true, max: 250 },
  created: { type: Date, required: true, default: Date.now() },
  body:    { type: String, required: true, max: 5000 },
  user:    { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

MessageSchema.virtual('url')
.get(function () {
  return `/message/${this._id}`;
});

MessageSchema.virtual('date')
.get(function () {
  return moment(this.created).format('MMMM Do YYYY, h:mm a');
});

module.exports = mongoose.model('Message', MessageSchema);