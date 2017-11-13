var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var teams = require('./teams');

var baseUrl = 'https://www.basketball-reference.com/';


app.get('/scrape/teams', function(req, res){
  url = baseUrl + 'teams/' + 'POR';
  console.log(url);

  request(url, function(error, response, html){
    if(!error){
      console.log('testt');
      var $ = cheerio.load(html);
      var name;
      var json = { name: "" };

      $('#meta').filter(function(){
        var data = $(this);
        name = data.children().last().children().first().children().first().text();
        json.name = name;
      })
    }
    

    fs.writeFile('teams.json', JSON.stringify(json, null, 4), function(err){
      console.log('Teams written to output.json!');
    })

    res.send('Check your console!!');
  })
})



app.get('/scrape', function(req, res){

  url = 'https://www.basketball-reference.com/players/s/swanica01.html';

      testurl = baseUrl + 'teams/' + 'POR';
      console.log(testurl);

  request(url, function(error, response, html){

    if(!error){
      var $ = cheerio.load(html);

      var name, number;
      var json = { name: "", number: "" };

      $('#meta').filter(function(){
        var data = $(this);
        name = data.children().last().children().first().text();
        json.name = name;
      })

      $('.uni_holder').filter(function(){
        var data = $(this);
        number = data.children().first().children().first().children().last().text();
        json.number = number;
      })
    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    res.send('Check your console!')
    console.log(json.name);
    console.log(teams.teams.length);
  })

})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
