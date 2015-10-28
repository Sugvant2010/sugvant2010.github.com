var Link = require('../models/links.js');
var shortId = require('shortid');
module.exports = {
    my: function(req, res, next) {
        Link.find({ _creator : req.user._id }, function (err, links) {
            if (err) { return next(err); }
            res.json({result: true, links : links });
        });
    },
    one:  function(req, res, next) {
        Link.findById(req.params.id).populate('_creator', 'username').exec( function (err, link) {
            if (err) { return next(err); }
            res.json({result: true, link : link });
        });
    },
    create: function(req, res, next) {
        var link = {
            _creator : req.user._id,
            fullLink: req.body.fullLink,
            description : req.body.description,
            shortLink : shortId.generate(),
            tags : req.body.tags
        };
        Link.create(link, function (err, link) {
            if (err) { return next(err); }
            res.json({ result : true , link : link , note : "Ваша ссылка успешно создана" });
        });
    },
    update:  function(req, res, next) {
        Link.findOne(req.params.id, function(err, link){
            if (err) { return next(err); }

            link.fullLink = req.body.fullLink ;
            link.description = req.body.description ;
            link.tags = req.body.tags ;

            link.save(function(err, link) {
                if (err) { return next(err); }
                res.json({result : true, link : link, note: "Данные успешно обновлены"});
            });
        });
    },
    list: function(req, res, next) {
        Link.find({}, "shortLink fullLink tags _creator description").populate('_creator', 'username').exec(function (err, links) {
            if (err) { return next(err); }
            res.json({result: true, links : links });
        });
    },
    delete: function(req, res, next) {
        Link.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) { return next(err); }
            res.json(post);
        });
    },
    shortLink: function(req,res, next){
        Link.findOne({ shortLink : req.params.shortLink }, function(err, link){
            if (err) { return next(err); }
            if(link) {
                link.counter++;
                link.save(function (err, link) {
                    if (err) { return next(err); }
                    res.redirect(link.fullLink);
                });
            }else{
                next();
            }

        });
    },
    tags: function(req, res, next){
        Link.find({ tags : req.params.tags },"shortLink fullLink tags _creator description").populate('_creator', 'username').exec(function(err,links){
            if (err) { return next(err); }
            res.json({result: true, links : links });
        });
    }
};