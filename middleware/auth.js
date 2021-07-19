var middlewares = {};

middlewares.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please! Login First.")
    res.redirect("/login");
}

middlewares.isLogged = function(req, res, next){
    if(req.isAuthenticated()){
        console.log("err")
        req.flash("error", "Please! Logout First.")
        res.redirect("/dashboard")
    }
    return next();
}

module.exports = middlewares;