
function makeChart(values, labels){
    var ctx = document.getElementById('transactionChart');
    let lineChart = new Chart(ctx, {
        type: 'line',
        fill: false,
        data: {
        labels: labels,
        datasets: [{
            label: 'Spending History',
            borderColor: 'rgb(255, 0, 100)',
            data: values
        }]}
    });
    return lineChart;
}

function makeBudgetChart(spendingValues, allConstraints, budgetNames, labels){
    var ctx = document.getElementById('transactionChart');
    var budgetCount = 0;
    var budgetValues = [];
    var allConstraints2D = new Array(allConstraints.length);
    var colors = ["#1966FF","#5CF713","#F8FF0E",
                  "#D500FF","#FDA204","#CEDC00",
                  "#257C38","#002A9C","#00DF8A"];

    var x = new Array(spendingValues.length);
    for (var i = 0; i < spendingValues.length; i++){
         x[i] = allConstraints[budgetCount];
         allConstraints2D[budgetCount] = x;
    }

    var maxValue = Math.max.apply(Math, allConstraints);
    var label = 'Budget '.concat(budgetNames[budgetCount]);
    let lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
              label: 'Spending History',
              borderColor: 'rgb(255, 0, 100)',
              data: spendingValues},{
              label: label,
              strokeColor: colors[budgetCount],
              borderColor: colors[budgetCount],
              data: allConstraints2D[0]
          }]
        },
        options: {
            scales: {
              yAxes: [{
                ticks: {
                    maxDataValue: maxValue
                }
              }]
            }
        }
    });

    for (budgetCount = 1; budgetCount < allConstraints.length; budgetCount++){
        label = 'Budget '.concat(budgetNames[budgetCount]);
        if (budgetCount > colors.length){
            color = colors[budgetCount%5];
        } else {
            color = colors[budgetCount];
        }

        var x = new Array(spendingValues.length);
        for (var i = 0; i < spendingValues.length; i++){
             x[i] = allConstraints[budgetCount];
             allConstraints2D[budgetCount] = x;
        }
        lineChart.data.datasets.push({
            label: label,
            strokeColor: color,
            borderColor: colors[budgetCount],
            data: allConstraints2D[budgetCount]});
        lineChart.update();
    }
    return lineChart;
}

var allTransactions = document.getElementById('transactionContainer').textContent;
var allBudgets = document.getElementById('budgetContainer').textContent;

allTransactions = JSON.parse(allTransactions);
allBudgets = JSON.parse(allBudgets);

var b = allBudgets[0];
var amountConstraint = b["amountConstraint"];
var values = [];
var names = [];
var dates = [];
var categories = [];
var uniqueCategories = [];
var fullSpending = [];
var allConstraints = [];
var budgetNames = [];
var hasBudget = true;

if (allBudgets.length == 0){
    hasBudget = false;
}

allTransactions.sort(function(a, b){
return (new Date(a["created"]) - new Date(b["created"]))});

for (var i = 0; i < allTransactions.length; i++){
    values.push(allTransactions[i]["amount"]);
    names.push(allTransactions[i]["name"]);
    monthDate = allTransactions[i]["created"].slice(5,10);
    year = allTransactions[i]["created"].slice(2,4);
    outDate = monthDate.concat('-',year);
    dates.push(outDate);

    //category view stuff
    cat = allTransactions[i]["category"];
    categories.push(cat);
    if (!uniqueCategories.includes(cat)){
        uniqueCategories.push(cat);
    }

    //full view stuff
    if (i == 0){
        fullSpending.push(values[0]);
    } else {
        fullSpending.push(fullSpending[i-1] + values[i]);
    }
}

for (var i = 0; i < allBudgets.length; i++){
    allConstraints.push(allBudgets[i]["amountConstraint"]);
    budgetNames.push(allBudgets[i]["name"]);
}
var chart = makeChart(values, dates);

var catValues = new Array(uniqueCategories.length);

for (var i = 0; i < categories.length; i++){
    index = uniqueCategories.indexOf(categories[i]);
    if (catValues[index] == undefined){
        catValues[index] = 0;
    }

    catValues[uniqueCategories.indexOf(categories[i])] += values[i];
}

var dateViewBtn = document.getElementById('dateViewBtn');
dateViewBtn.addEventListener("click", function(){
    chart.destroy();
    chart = makeChart(values, dates);
});

var catViewBtn = document.getElementById('catViewBtn');
catViewBtn.addEventListener("click", function(){
    chart.destroy();
    chart = makeChart(catValues, uniqueCategories);
});

var completeViewBtn = document.getElementById('completeViewBtn');
completeViewBtn.addEventListener("click", function(){
    chart.destroy();
    if (hasBudget){
        chart = makeBudgetChart(fullSpending, allConstraints, budgetNames, dates);
    } else {
        chart = makeChart(fullSpending, dates);
      }
});
