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

//For access to DB
dotenv.config();
var url = "mongodb+srv://oramadan:mQ9lYoCNPHmEddFr@cluster0-6hntz.mongodb.net/test?retryWrites=true&w=majority"

//DB setup
mongoose.connect(url,
{ useNewUrlParser: true }).then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log("ERROR", err.message);
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//App setup
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
    endDate: {type: Date, default: Date.now},
    fixedCosts:[
            {
                description: String,
                amount: Number
            }]
});

//DB model creation
var Transaction = mongoose.model("Transaction", transactionSchema);
var Budget = mongoose.model("Budget", budgetSchema);

//Home Page (redirects to transactions page)
app.get("/",function(req,res){
    res.redirect("/transactions");
});


//index page: displays transactions incurred
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

//new transaction page
app.get("/transactions/new",function(req,res){
    res.render("new");
});

//create route
app.post("/transactions",function(req,res){
    //Make sure user input doesn't have script tags (may be malicious)
    req.body.transaction.body = req.sanitize(req.body.transaction.name);

    var input = req.body.transaction;

    //Conversion from UTC to local time
   // input.created = input.created.ToLocalTime();

    //create transaction
    Transaction.create(req.body.transaction, function(err,newTransaction){
        //If error, render new transaction page again
        if (err)
            res.render("new");
        //redirect to index
        else
        res.redirect("/transactions");
    });
});

//Show route
app.get("/transactions/:id",function(req,res){
    //Find transaction in DB by id and display it
    Transaction.findById(req.params.id, function(err, foundTransaction){
        if (err)
            res.redirect("/transactions");
        else
        //Display the transaction that was found
            res.render("show",{transaction: foundTransaction});
    });
});

//Edit route
app.get("/transactions/:id/edit",function(req,res){
    //Find transaction in DB by id and display it in an editable format
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

    //Update the transaction in the DB with user input
    Transaction.findByIdAndUpdate(req.params.id, req.body.transaction ,function(err, updatedTransaction){
        if (err)
            res.redirect("/transactions");
        else
            res.redirect("/transactions/" + req.params.id);
    });
});

//Delete route
app.delete("/transactions/:id",function(req,res){
    //Find transaction in DB and delete it
    Transaction.findByIdAndRemove(req.params.id, function(err){
        if (err)
            res.redirect("/transactions/" +  req.params.id);
        else
            res.redirect("/transactions");
    });
});

/* BUDGET ROUTES (Similar to the transactions routes above) */

//Get all budgets and display
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
  
  var input = req.body.budget;

  // Validation for start and end dates
  if(input.endDate  <= input.startDate){
      res.render('newBudget', { error: 'Please ensure end date is after start date'});
  }
  else{
        //create budget
        Budget.create(req.body.budget, function(err,newBudget){
            if (err){
                
                res.render("newBudget");
            }
            //redirect to budget page
            else{
                res.redirect("/budgets");
            }
        });
    }
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
   
    var input = req.body.budget;

    //Validation
    if(input.endDate<= input.startDate){
        res.redirect("/budgets");
    }
    else{
        Budget.findByIdAndUpdate(req.params.id, req.body.budget ,{new: true},function(err, updatedBudget){
            if (err)
                res.redirect("/budgets");
            else
                res.redirect("/budgets/" + req.params.id);
        });
    }

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

app.get("/graphs",function(req,res){
    //Load all transactions
    Transaction.find({}, function(err,transactions){
        if (err){
            console.log("ERROR!");
        }
        else{
            Budget.find({}, function(err2, budgets){
                res.render("graphs",{transactions: JSON.stringify(transactions),
                                     budgets: JSON.stringify(budgets)});
            })
        }
    });
});

//Start app
app.listen(port, function(){
    console.log("App started on " + port);
});
