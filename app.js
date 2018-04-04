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

  const hotTopics = ["School shootings", "Taxes", "Gerrymandering", "Bump Stocks", "DACA",]; 
  const database = firebase.database();
  let button;
  let searchTopicInput = $("#searchTopicInput");
  let issueSearch;
  let databaseHasTopic;
  let billInfoArray = [];

  // Function Declarations

  // ---nothing here yet---

  // Function Calls

  // Create Hot Topic search buttons

  for (let i = 0; i < hotTopics.length; i++) {
    let button = $("<button>"); 
    button.addClass('btn-styling topic-btn-style providedSearchButton');
    button.attr('data-name', hotTopics[i]); 
    button.text(hotTopics[i]); 
    button.attr('id', 'butt'); // What?
    $("#buttonsPanel1").append(button);
  };

  // Create buttons for the three (different) most recent searches

  database.ref().orderByChild('dateAdded').limitToLast(3).once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      button = $('<button>');
      button.addClass('btn-styling topic-btn-style providedSearchButton');
      button.attr('data-name', `${childSnapshot.val().query}`);
      button.text(childSnapshot.val().query);
      $('#buttonsPanel2').append(button);
    });
  });

  // On click of search button, save the topic searched for in Firebase 
  // if it is not already one of the three most recent searches there AND 
  // hide 'Page 1' div AND display 'Page 2' div AND use the topic in the 
  // Propublica API call 

  $("#searchTopicButton").on("click", function(event) {
    event.preventDefault(); 
    issueSearch = searchTopicInput.val().trim(); 
    searchTopicInput.val('');
    databaseHasTopic = false;
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
    // Code for hiding 'Page 1' div goes here
    // Code for displaying 'Page 2' div goes here
    // Below is the code for the API call (unfinished?)
    $.ajax({
      url: "https://api.propublica.org/congress/v1/bills/search.json?query="+issueSearch,
      type: "GET",
      dataType: 'json',
      headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
    }).then(function(results){
      // console.log(results); 
      for(let i = 0 ; i  < results.results[0].bills.length; i++ ){
        // creating const to use bill data for second page
        let title = results.results[0].bills[i].short_title; 
        let id = results.results[0].bills[i].bill_id; 
        let party = results.results[0].bills[i].sponsor_party;  
        let summary = results.results[0].bills[i].title; 
        let status = results.results[0].bills[i].latest_major_action; 

      
        const billInfo = {
          title: title, 
          id: id, 
          party: party, 
          summary: summary, 
          status: status
        }

        // appending the bills to a new element surrently set to the div on pg 2 (not working) but it
        // worked in a test div on pg 1
        $('#billsPanel').append(`<div id=billWrapper${i}/>`);
        $(`#billWrapper${i}`).append(
            `<div class="theBill"/>
            <p class="rating">Title :${title}</p>
            <p class="rating">Bill id =${id}</p>
            <p class="rating">Party that introduced it :${party}</p>
            <p class="rating">Summary :${summary}</p>
            <p class="rating">Status :${status}</p>`
        );
      };
    });
    // append info on bills to new element on second page
    // Bill name, voting date, summary
  });

  // On click of a Hot Topic or Recent Search button, hide 'Page One' div AND 
  // display 'Page 2' div AND use the value of that button in the Propublica 
  // API call

  $(document).on("click", ".providedSearchButton", function() {
    issueSearch = $(this).attr("data-name");
    // Code for hiding 'Page 1' div goes here
    // Code for displaying 'Page 2' div goes here
    // Below is the code for the API call (unfinished?)
    $.ajax({
      url: "https://api.propublica.org/congress/v1/bills/search.json?query="+issueSearch,
      type: "GET",
      dataType: 'json',
      headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
    }).then(function(results){
      // console.log(results); 
      for(let i = 0 ; i  < results.results[0].bills.length; i++ ){
        // creating const to use bill data for second page
        let title = results.results[0].bills[i].short_title; 
        let id = results.results[0].bills[i].bill_id; 
        let party = results.results[0].bills[i].sponsor_party;  
        let summary = results.results[0].bills[i].title; 
        let status = results.results[0].bills[i].latest_major_action; 

      
        const billInfo = {
          title: title, 
          id: id, 
          party: party, 
          summary: summary, 
          status: status
        }

        // appending the bills to a new element surrently set to the div on pg 2 (not working) but it
        // worked in a test div on pg 1
        $('#billsPanel').append(`<div id=billWrapper${i}/>`);
        $(`#billWrapper${i}`).append(
            `<div class="theBill"/>
            <p class="rating">Title :${title}</p>
            <p class="rating">Bill id =${id}</p>
            <p class="rating">Party that introduced it :${party}</p>
            <p class="rating">Summary :${summary}</p>
            <p class="rating">Status :${status}</p>`
        );
      };
    });
    // append info on bills to new element on second page
    // Bill name, voting date, summary
  });
  
});