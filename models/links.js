var mongoose = require('mongoose'),
    shortId = require('shortid');

var linksSchema = mongoose.Schema({
    shortLink: { type: String , unique: true, 'default': shortId.generate() },
    fullLink: { type: String, required: true},
    description: String,
    tags: [{ type: String, lowercase: true }],
    _creator : { type:  String, ref: 'Users' },
    counter: { type: Number, default : 0 },
    updated_at: {type: Date, default: Date.now }
});

module.exports = mongoose.model('links', linksSchema);