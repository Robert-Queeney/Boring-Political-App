'use strict';
$(document).ready(function(){

$.ajax({
    url: "https://api.propublica.org/congress/v1/bills/search.json?query=taxes",
    type: "GET",
    dataType: 'json',
    headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
    }).then(function(results){
    console.log("results====>", results); 


    for(let i = 0 ; i  < 8; i++ ){
        // creating const to use bill data for second page
        let title = results.results[0].bills[i].short_title; 
        let id = results.results[0].bills[i].bill_id; 
        let party = results.results[0].bills[i].sponsor_party;  
        let summary = results.results[0].bills.title; 
        let status = results.results[0].bills.latest_major_action;
        // added branch to be able to determine congress vs senate Rep = congress and Sen = senate
        let branch = results.results[0].bills.sponsor_title;  
    
        const billInfo = {
        title: title, 
        id: id, 
        party: party, 
        summary: summary, 
        status: status
        }; 
    
// senate call example
// need to dynamically add senate vs congress via bill info and state via geo locator
$.ajax({
    url: "https://api.propublica.org/congress/v1/members/senate/RI/current.json",
    type: "GET",
    dataType: 'json',
    headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
  }).then(function(results){
    console.log("results====>", results); 


    for(let i = 0 ; i  < 8; i++ ){
      // creating const to use bill data for second page
      let senName = results.results[0].name; 
      let senParty = results.results[0].party; 
      let senName2 = results.results[1].name; 
      let senParty2 = results.results[1].party; 
      console.log("moreresults======>", senName, senParty, senName2, senParty2);  
    }
    
})}})})  