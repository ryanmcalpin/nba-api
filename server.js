var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var endpoints = require('./endpoints');

var teams = endpoints.teams;

var baseUrl = 'https://www.basketball-reference.com/';

// replace with dateTime function
var currentSeason = '2018';

var team = 'POR';


app.get('/scrape/teams/' + team, function(req, res){
  teamUrl = baseUrl + 'teams/' + team + '/' + currentSeason + '.html';
  console.log(teamUrl);
  var json = {
    team: {
      season: "",
      name: "",
      wins: "",
      losses: "",
      players: {

      }
    }
  };

  request(teamUrl, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      // team
      $('#meta').filter(function(){
        var data = $(this);

        // grab from DOM
        var season = data.children().last().children().first().children().first().text();
        var name = data.children().last().children().first().children().eq(1).text();

        // write as JSON
        json.team['name'] = name;
        json.team['season'] = season;
      })

      // players
      $('.stats_table').filter(function(){
        var data = $(this);

        // grab from DOM
        var playersTable = data.children().last().children();

        // write as JSON
        for(let i = 0; i < playersTable.length; i++) {
          let number = playersTable.eq(i).children().first().text();
          let name = playersTable.eq(i).children().eq(1).children().first().text();
          let position = playersTable.eq(i).children().eq(2).text();
          console.log(number);
          json.team.players[number] = {
            number: number,
            name: name,
            position: position
          }
        }
      })

      $('#team_misc').filter(function(){
        var data = $(this);
        console.log(data.children().last().children().first().children().eq(1));

        // var wins = data.children().last().children().first().children().eq(1).text();
        // var losses = data.children().last().children().first().children().eq(2).text();
        //
        // console.log(wins + '/' + losses);
        //
        // json.team['wins'] = wins;
        // json.team['losses'] = losses;
      })

    }

    fs.writeFile('team.json', JSON.stringify(json, null, 4), function(err){
      console.log('Team written to team.json!');
    })

    res.send('Woo!!');
  })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
