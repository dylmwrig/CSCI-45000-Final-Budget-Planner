module.exports = {
  'Add New Transaction Test' : function (browser) {
    browser
      .url('https://budgetplannerv1.herokuapp.com/transactions/new')
      .waitForElementVisible('input[type=text]')
	  .setValue('input[type=text]', 'test name')
	  .setValue('input[type=number]', '100')
	  .click('input[type=submit]')
	  .useXpath()
      .assert.visible("//a[text()='test name']")
      .useCss()  
  }
}