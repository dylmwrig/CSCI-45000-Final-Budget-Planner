var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();
var jsdom = require('mocha-jsdom');

//var chartTest = require('/public/js/graphs.js')

/*
beforeEach('Setting up the userList', function(){
  console.log('beforeEach');
  loginController.loadUserList(['abc123','xyz321']);
});
describe('LoginController', function () {
...
}
*/


it('should return true if mmya', function(){
    expect("wow".length, 'noooo').to.equal(4);
})

describe('mocha tests', function () {

  jsdom()

  it('has document', function () {
    var div = document.createElement('div')
    expect(div.nodeName).eql('DIV')
  })

})
