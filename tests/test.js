module.exports = {
  'Budget Calculator Test' : function (client) {
    client
      .url('http://budgetplannerv1.herokuapp.com/graphs')
      .pause(1000)
      .assert.visible('button[id=catViewBtn]')
      .click('button[id=catViewBtn]')
      .useXpath()
      .click("//a[normalize-space()='Budgets']")
      .pause(5000);
  }
};
