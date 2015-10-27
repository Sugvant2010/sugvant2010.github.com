module.exports = {
    auth: function (req, res, next) {
        req.isAuthenticated()
            ? next()
            : res.redirect('/');
    }
}
