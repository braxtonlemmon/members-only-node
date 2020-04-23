const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName:  { type: String, required: true, max: 100 },
  lastName:   { type: String, required: true, max: 100 },
  username:   { type: String, required: true, max: 70 },
  password:   { type: String, required: true, max: 50},
  membership: { type: Boolean, default: false },
  avatar:     { type: String },
  admin:      { type: Boolean, default: false }
})

UserSchema.virtual('url')
.get(function () {
  return `/user/${this._id}`;
});

UserSchema.virtual('name')
.get(function () {
  return `${this.firstName} ${this.lastName}`;
})

module.exports = mongoose.model('User', UserSchema);