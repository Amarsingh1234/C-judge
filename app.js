const express = require("express");
const app = express();
const methodOverride = require("method-override")
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
var User = require("./models/user")
const userRoutes= require("./routes/authentication");
const QuestionRoutes= require("./routes/question");
const problemRoutes= require("./routes/solve");

const passport=require("passport");
const LocalStrategy = require("passport-local");
var flash = require("connect-flash");
app.use(flash());

app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))


app.use(require("express-session")({
    secret:"Hi",
    resave:false,
    saveUniitialized:true
}))


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

const { DB_URL, PORT } = require("./config");

connectDB(DB_URL).then(() => {
    listen(PORT);
});
  

app.get("/",function(req,res){
    res.redirect("login");
})

app.get("/dashboard",function(req,res){
    res.redirect("/problems")
})
app.use("/",userRoutes);
app.use("/",QuestionRoutes);
app.use("/problems",problemRoutes);

function listen(PORT) {
    app.listen(PORT, (err) => {
        if (err) {
            console.error("Could not start the server.");
        return;
        }
        console.log("Server is running at http://localhost:" + PORT);
    });
}
  
function connectDB(DB_URL) {
    mongoose.connection.on("error", (err) => {
        console.error("Could not connect to the Database.");
    });
    mongoose.connection.once("open", () => {
        console.log("Connected to Database.");
    });

    return mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}