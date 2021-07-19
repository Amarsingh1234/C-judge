var express = require("express");
var router = express.Router();
const middlewares = require("../middleware/auth");
const run = require("../cplusplus/cplusplus").run;
const questionController = require("../controllers/question");
const userController = require("../controllers/user");
const testcaseController = require("../controllers/testcase");


router.get("/:id/viewtestcase",function(req, res){
    let filter = {_id: req.params.id}
    questionController.getOne(filter).then((question)=>{
        res.render("viewtestcase",{question: question});
    }).catch((err)=>{
        console.log(err);
        res.redirect("back")
    })
})


router.get("/:id/addtestcase", middlewares.isLoggedIn, function(req, res){
    res.render("addtestcase",{question: req.params.id});
})
router.post("/:id/addtestcase", middlewares.isLoggedIn, function(req, res){
    var input = req.body.input;
    var output = req.body.output;
    var testcase = {input, output};
    // console.log(testcase);
    testcaseController.addtestcase(testcase, req.params.id).then(()=>{
        req.flash("success", "Testcase added successfully !")
        res.redirect("/problems/" + req.params.id + "/viewtestcase")
    }).catch((err)=>{
        console.log(err);
        res.redirect("back")
    })
})

router.get("/:id", function(req, res){
    let filter = {_id:req.params.id};
    questionController.getOne(filter).then((questions)=>{
        res.render("solve", {question: questions})
    }).catch((err)=>{
        console.log(err);
        res.redirect("back")
    })
})

router.post("/:id/submit", middlewares.isLoggedIn, function(req, res){
    var code = req.body.code;
    let filter = {_id: req.params.id};
    questionController.getOne(filter).then((question)=>{
        run(question.testcases, code, req.user.username).then((verdict)=>{
            var question_id = question._id;
            var submission = {question_id, code, verdict};
            userController.addSubmission(submission, req.user).then((user)=>{
                if(verdict[0] == 'W')
                    req.flash("error", verdict);
                else
                    req.flash("success", verdict);
                res.redirect("/problems/"+ req.params.id);
            }).catch((err)=>{
                console.log(err)
                res.redirect("back");
            })
        }).catch((err)=>{
            console.log(err);
            req.flash("error", "Compilation error !");
            res.redirect("back");
        })
    }).catch((err)=>{
        console.log(err);
        res.redirect("back");
    })
})
module.exports = router;