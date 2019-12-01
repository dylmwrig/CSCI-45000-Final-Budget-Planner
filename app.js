//App setup
var express = require("express");
var request = require("request");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var dotenv = require("dotenv");
var port = parseInt(process.env.PORT,10) || 3000;
app = express();

//For secure access to DB
dotenv.config();
var url = "mongodb+srv://oramadan:mQ9lYoCNPHmEddFr@cluster0-6hntz.mongodb.net/test?retryWrites=true&w=majority;"

//DB setup
mongoose.connect(url,
{ useNewUrlParser: true }).then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log("ERROR", err.message);
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//DB initialisation
var transactionSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    category: String,
    created: {type: Date, default: Date.now}
});

var budgetSchema = new mongoose.Schema({
    name: String,
    amountConstraint: Number,
    startDate: {type: Date, default: Date.now},
    endDate: {type: Date, default: Date.now}
    //fixedCosts: [transactionSchema]
});

var Transaction = mongoose.model("Transaction", transactionSchema);
var Budget = mongoose.model("Budget", budgetSchema);

//Home Page (redirects to transactions page)
app.get("/",function(req,res){
    res.redirect("/transactions");
});


//index page
app.get("/transactions",function(req,res){
    Transaction.find({}, function(err,transactions){
        if (err){
            console.log("ERROR!");
        }
        else{
            res.render("index",{transactions: transactions});
        }
    });
});

//new
app.get("/transactions/new",function(req,res){
    res.render("new");
});

//create route
app.post("/transactions",function(req,res){
    //Make sure user input doesn't have script tags (may be malicious)
    req.body.transaction.body = req.sanitize(req.body.transaction.name);
    //create transaction
    Transaction.create(req.body.transaction, function(err,newTransaction){
        if (err)
            res.render("new");
        //redirect to index
        else
        res.redirect("/transactions");
    });
});

//Show route
app.get("/transactions/:id",function(req,res){
    Transaction.findById(req.params.id, function(err, foundTransaction){
        if (err)
            res.redirect("/transactions");
        else
            res.render("show",{transaction: foundTransaction});
    });
});

//Edit route
app.get("/transactions/:id/edit",function(req,res){
    Transaction.findById(req.params.id, function(err, foundTransaction){
        if (err)
            res.redirect("/transactions");
        else
            res.render("edit",{transaction: foundTransaction});
    });
});


//Update route
app.put("/transactions/:id",function(req,res){
    //Make sure user input doesn't have script tags (may be malicious)
    req.body.transaction.name = req.sanitize(req.body.transaction.name);
    Transaction.findByIdAndUpdate(req.params.id, req.name.transaction ,function(err, updatedTransaction){
        if (err)
            res.redirect("/transactions");
        else
            res.redirect("/transactions/" + req.params.id);
    });
});

//Delete route
app.delete("/transactions/:id",function(req,res){
    Transaction.findByIdAndRemove(req.params.id, function(err){
        if (err)
            res.redirect("/transactions");
        else
            res.redirect("/transactions");
    });
});

app.get('/budgets', function(req,res) {
    Budget.find({}, function(err,budgets){
          if (err){
              console.log("ERROR!");
          }
          else{
              res.render("budgets",{budgets: budgets});
          }
      });
});

//new
app.get("/budgets/new",function(req,res){
    res.render("newBudget");
});

app.post("/budgets/new",function(req,res){
  //Make sure user input doesn't have script tags (may be malicious)
  req.body.budget.name = req.sanitize(req.body.budget.name);
  //create budget
  Budget.create(req.body.budget, function(err,newBudget){
      if (err){
          console.log(err);
          res.render("newBudget");
      }
      //redirect to budget page
      else{
          res.render("budgets");
      }
  });
})

//Show route
app.get("/budgets/:id",function(req,res){
    Budget.findById(req.params.id, function(err, foundBudget){
        if (err)
            res.redirect("/budgets");
        else
            res.render("showBudget",{budget: foundBudget});
    });
});

//Edit route
app.get("/budgets/:id/edit",function(req,res){
    Budget.findById(req.params.id, function(err, foundBudget){
        if (err)
            res.redirect("/budgets");
        else
            res.render("editBudget",{budget: foundBudget});
    });
});

//Update route
app.put("/budgets/:id",function(req,res){
    //Make sure user input doesn't have script tags (may be malicious)
    req.body.budget.body = req.sanitize(req.body.budget.body);
    Budget.findByIdAndUpdate(req.params.id, req.body.budget ,function(err, updatedBudget){
        if (err)
            res.redirect("/budgets");
        else
            res.redirect("/budgets" + req.params.id);
    });
});

//Delete route
app.delete("/budgets/:id",function(req,res){
    Budget.findByIdAndRemove(req.params.id, function(err){
        if (err)
            res.redirect("/budgets");
        else
            res.redirect("/budgets");
    });
});

app.listen(port, function(){
    console.log("App started on " + port);
});
