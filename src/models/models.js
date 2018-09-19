var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
///////////////////////////////////////////////////////////////////////
var userSchema = new mongoose.Schema({
    discordID: { type: String, default: "" },
    username: { type: String, default: "" },
    admin: { type: Boolean, default: false },
    lootboxes: { type: Number, default: 0 },
    inventory: {},
})

var User = mongoose.model('User', userSchema);
///////////////////////////////////////////////////////////////////////
module.exports = {
    User: User,
};