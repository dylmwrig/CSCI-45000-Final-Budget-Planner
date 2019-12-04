module.exports = {
  'Database Test' : function (client) {
    client
      .url('http://budgetplannerv1.herokuapp.com/budgets')
      .pause(1000)
      .click('#addBudget a')
      .waitForElementVisible('#budgetSubmit')
      .assert.visible('#budgetSubmit')
      .waitForElementVisible()
      .useXpath()
      .assert.visible("//a[text()='August']")
      .useCss()

      .setValue('input[type=text]', 'nightwatch.js')
      .click('button[type=submit]', function(result) {
        this.assert.strictEqual(result.status, 0);
      })
  }
};
