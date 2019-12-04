module.exports = {
  'Database Test' : function (client) {
    client
      .url('http://budgetplannerv1.herokuapp.com/budgets')
      .pause(1000)
      .click('#addBudget a')
      .waitForElementVisible('#budgetSubmit')
      .assert.visible('#budgetSubmit')
      .setValue('input[placeholder="Budget Name"]', "Nightwatch Budget")
      .setValue('input[placeholder="How much can you spend"]', 33)
      .click("#budgetSubmit")

      .useXpath()
      .assert.visible("//a[text()='Nightwatch Budget']")
      .useCss()
      .pause(1000);
  }
};
