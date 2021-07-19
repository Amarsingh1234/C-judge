const router = require("express").Router();
const passport=require("passport");
var User = require("../models/user")
var flash = require("connect-flash");
const middlewares = require("../middleware/auth");
const questionController = require("../controllers/question");
const userController = require("../controllers/user");
router.use(flash());

router.get("/problems", middlewares.isLoggedIn, function(req, res){
    let filter = {};
    questionController.getAll(filter).then((questions)=>{
        res.render("problems", {questions: questions})
    }).catch((err)=>{
        console.log(err);
        res.redirect("back")
    })
})

router.get("/addquestion",middlewares.isLoggedIn, function(req,res){
    res.render("addquestion");
})

router.post("/addquestion", middlewares.isLoggedIn, function(req, res){
    var title = req.body.title;
    var problem_statement = req.body.desc;
    var input_format = req.body.input;
    var output_format = req.body.output;
    var difficulty = req.body.difficulty;
    var author = req.user._id;
    var question = {title, problem_statement, input_format, output_format, difficulty ,author};

    questionController.addquestion(question).then((question)=>{
        req.flash("success", "Problem added successfully !")
        res.redirect("/dashboard")
    }).catch((err)=>{
        console.log(err);
        res.redirect("back")
    })
})

router.get("/solve",middlewares.isLoggedIn, function(req, res){
    res.render("solve");
})


router.get("/submission", middlewares.isLoggedIn, function(req, res){
    let filter = {_id: req.user._id};
    let qfilter = {};
    userController.getOne(filter).then((user)=>{
        questionController.getAll(qfilter).then((questions)=>{
            res.render("submission", {submissions:user.submissions, questions:questions});
        })
    }).catch((err)=>{
        console.log(err);
        res.redirect("back");
    })
})
router.get("/submission/:id", middlewares.isLoggedIn, function(req, res){
    let filter = {_id: req.params.id};
    userController.getSubmission(filter).then((submission)=>{
        res.render("viewcode", {submission:submission});
    }).catch((err)=>{
        console.log(err);
        res.redirect("back");
    })
})

router.get("/solved", middlewares.isLoggedIn, function(req, res){
    let filter = {_id: req.user._id};
    userController.getOne(filter).then((user)=>{
        res.render("solved", {questions:user.solved});
    }).catch((err)=>{
        console.log(err);
        res.redirect("back");
    })
})

module.exports = router;