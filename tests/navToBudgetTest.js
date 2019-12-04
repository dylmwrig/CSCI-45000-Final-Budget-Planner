module.exports = {
  'New Budget UI Test' : function (client) {
    client
      .url('http://budgetplannerv1.herokuapp.com/graphs')
      .pause(1000)
      .assert.visible('button[id=catViewBtn]')
      .click('button[id=catViewBtn]')
      .useXpath()
      .click("//a[normalize-space()='Budgets']")
      .useCss()
      .assert.containsText(".header","Budget Calculator")
      .assert.visible('div[class=amountConstraint]')
      .pause(1000);
  }
};
