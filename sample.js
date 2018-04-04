'use strict';

$(document).ready(function(){

// Initialize Firebase

let config = {
  apiKey: "AIzaSyC_dXl43FWL5hA8u0-W-hozb1zTrmBJ3Tw",
  authDomain: "boringpoliticalapp.firebaseapp.com",
  databaseURL: "https://boringpoliticalapp.firebaseio.com",
  projectId: "boringpoliticalapp",
  storageBucket: "",
  messagingSenderId: "944272526743"
};

firebase.initializeApp(config);

// Variables

const database = firebase.database();
const buttonsPanel = $('#buttonsPanel');
let button;
let searchTopicInput = $("#searchTopicInput");
let issueSearch;

// Function Declarations

// Function Calls

database.ref().orderByChild('dateAdded').limitToLast(3).once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    button = $('<button>');
    button.addClass('btn btn-primary');
    button.attr('data-name', `topic${childSnapshot.val().query}`);
    button.text(childSnapshot.val().query);
    buttonsPanel.append(button);
  });
});

$("#searchTopicButton").on("click", function(event) {
  event.preventDefault(); 
  issueSearch = searchTopicInput.val().trim(); 
  searchTopicInput.val('');
  let databaseHasTopic = false;
  database.ref().orderByChild('dateAdded').limitToLast(3).once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot){
      if (childSnapshot.val().query === issueSearch) {
        databaseHasTopic = true;
      };
    });
    setTimeout(function() {
      if (!databaseHasTopic) {
        database.ref().push({
          query: issueSearch,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
      };
    }, 1000);
  });
  // $.ajax({
  //   url: "https://api.propublica.org/congress/v1/bills/search.json?query="+issueSearch,
  //   type: "GET",
  //   dataType: 'json',
  //   headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
  // }).then(function(results){
  //   console.log(results); 
  //   for(let i = 0 ; i  < results.results[0].bills.length; i++ ){
  //     // creating const to use bill data for second page
  //     let title = results.results[0].bills[i].short_title; 
  //     let id = results.results[0].bills[i].bill_id; 
  //     let party = results.results[0].bills[i].sponsor_party;  
  //     let summary = results.results[0].bills.title; 
  //     let status = results.results[0].bills.latest_major_action; 

    
  //     const billInfo = {
  //       title: title, 
  //       id: id, 
  //       party: party, 
  //       summary: summary, 
  //       status: status
  //     }

  //   console.log("bill-info", billInfo); 
  
  // }});
});
// append info on bills to new element on second page
// Bill name, voting date, summary

//   https://projects.propublica.org/api-docs/congress-api/bills/#search-bills

// API notes, tests, misc.

// senator search
// $.ajax({
//     url: "https://api.propublica.org/congress/v1/members/senate/MN/current.json",
//     type: "GET",
//     dataType: 'json',
//     headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
//   }).done(function(data){
//   // console.log(data)
//   });


// $.ajax({
//   url: "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyC5mPRvRl9aDc6c0fbeQVooykzgH6CaIQU&address=1890 Buford Ave., St. Paul, MN",
//   method: "GET"
// }).then(function(response){
//   console.log(response)
// });




// searching for upcoming bills
// search terms
// "https://api.propublica.org/congress/v1/bills/search.json?query=${input}"


  // $.ajax({
  //   url: "https://api.propublica.org/congress/v1/bills/search.json?query=taxes",
  //   type: "GET",
  //   dataType: 'json',
  //   headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
  // }).then(function(results){
  //   console.log(results); 
  //   for(let i = 0 ; i  < results.results[0].bills.length; i++ ){
  //     // creating const to use bill data for second page
  //     let title = results.results[0].bills[i].short_title; 
  //     let id = results.results[0].bills[i].bill_id; 
  //     let party = results.results[0].bills[i].sponsor_party;  
  //     let summary = results.results[0].bills.title; 
  //     let status = results.results[0].bills.latest_major_action; 
    
  //     const billInfo = {
  //       title: title, 
  //       id: id, 
  //       party: party, 
  //       summary: summary, 
  //       status: status
  //     }

  //    console.log("bill-info", billInfo); 
  
  // }});

}); 
