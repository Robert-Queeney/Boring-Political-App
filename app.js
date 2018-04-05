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
  let searchTopicInput1 = $('#searchTopicInput1');
  let searchTopicInput2 = $('#searchTopicInput2');
  let searchTopicInput3 = $('#searchTopicInput3');
  let issueSearch;
  let databaseHasTopic;
  let title;
  let id;
  let party;
  let summary;
  let status;
  let branch;
  let billsPanel = $('#billsPanel');
  let page1 = $('#page1');
  let page2 = $('#page2');
  let page3 = $('#page3');
  let billInfoObject = {};

  // Function Declarations

  const propublicaAPICall = function() {
    $.ajax({
      url: "https://api.propublica.org/congress/v1/bills/search.json?query=" + issueSearch,
      type: "GET",
      dataType: 'json',
      headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
    }).then(function(results){
      // console.log(results); 
      for(let i = 0 ; i  < results.results[0].bills.length; i++ ){
        // creating const to use bill data for second page
        title = results.results[0].bills[i].short_title; 
        id = results.results[0].bills[i].bill_id; 
        party = results.results[0].bills[i].sponsor_party;  
        summary = results.results[0].bills[i].title; 
        status = results.results[0].bills[i].latest_major_action; 
        branch = results.results[0].bills.sponsor_title;
        billsPanel.append(`<div id=billWrapper${i}/>`);
        $(`#billWrapper${i}`).append(
            `<p class="rating">Title :${title}</p>`
        );
        
      };
    });
    // append info on bills to new element on second page
    // Bill name, voting date, summary
  };

  const saveSearchAndGetBillInfo = function(input, page) {
    issueSearch = input.val().trim(); 
    input.val('');
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
    if (page !== page1) {
      billsPanel.empty();
    };
    if (page !== page2) {
      page.hide();
      page2.show();
    };
    propublicaAPICall();
  };
    
  // Function Calls

  // Create Hot Topic search buttons (on load)

  for (let i = 0; i < hotTopics.length; i++) {
    let button = $("<button>"); 
    button.addClass('btn-styling topic-btn-style providedSearchButton');
    button.attr('data-name', hotTopics[i]); 
    button.text(hotTopics[i]); 
    button.attr('id', 'butt'); // What?
    $("#buttonsPanel1").append(button);
  };

  // Create buttons for the three (different) most recent searches (on load)

  database.ref().orderByChild('dateAdded').limitToLast(3).once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      button = $('<button>');
      button.addClass('btn-styling topic-btn-style providedSearchButton');
      button.attr('data-name', `${childSnapshot.val().query}`);
      button.text(childSnapshot.val().query);
      $('#buttonsPanel2').append(button);
    });
  });

  // On click of search button (first page), save the topic searched for 
  // in Firebase if it is not already one of the three most recent searches 
  // there AND hide 'Page 1' div AND display 'Page 2' div AND use the topic 
  // in the Propublica API call 

  $("#searchTopicButton1").on("click", function(event) {
    event.preventDefault(); 
    saveSearchAndGetBillInfo(searchTopicInput1, page1);
  });

  // On click of a Hot Topic or Recent Search button, hide 'Page 1' div AND 
  // display 'Page 2' div AND use the value of that button in the Propublica 
  // API call

  $(document).on("click", ".providedSearchButton", function() {
    issueSearch = $(this).attr("data-name");
    page1.hide();
    page2.show();
    propublicaAPICall();
  });

  // On click of search button (second page), save the topic searched for 
  // in Firebase if it is not already one of the three most recent searches 
  // there AND empty billsPanel of content AND use the topic in the Propublica 
  // API call 

  $("#searchTopicButton2").on("click", function(event) {
    event.preventDefault(); 
    saveSearchAndGetBillInfo(searchTopicInput2, page2);
  });

  // On click of search button (third page), save the topic searched for 
  // in Firebase if it is not already one of the three most recent searches 
  // there AND hide 'Page 3' div AND display 'Page 2' div AND empty the 
  // billsPanel of content AND use the topic in the Propublica API call 

  $("#searchTopicButton3").on("click", function(event) {
    event.preventDefault(); 
    saveSearchAndGetBillInfo(searchTopicInput3, page3);
  });
  
});