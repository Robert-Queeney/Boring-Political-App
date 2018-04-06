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
  let billHolder = $('#billHolder');
  let billValue;
  let value;
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
        billInfoObject[`title${i}`] = results.results[0].bills[i].short_title; 
        billInfoObject[`id${i}`] = results.results[0].bills[i].bill_id; 
        billInfoObject[`party${i}`] = results.results[0].bills[i].sponsor_party;  
        billInfoObject[`summary${i}`] = results.results[0].bills[i].title; 
        billInfoObject[`status${i}`] = results.results[0].bills[i].latest_major_action; 
        billInfoObject[`branch${i}`] = results.results[0].bills[i].sponsor_title;
        billInfoObject[`govtrack_url${i}`] = results.results[0].bills[i].govtrack_url;
        billInfoObject[`latest_major_action${i}`] = results.results[0].bills[i].latest_major_action;
        billInfoObject[`date${i}`] = results.results[0].bills[i].latest_major_action_date;
        billInfoObject[`sponsor${i}`] = results.results[0].bills[i].sponsor_name;
        billHolder.append(`<p  value=${i} class="draggable">${billInfoObject[`title${i}`]}</p>`);
      };
    });
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

  // Code for dropzone

  interact.dynamicDrop(true);
  // Target elements with the "draggable" class
  interact('.draggable')
    .draggable({
      // Enable inertial throwing
      inertia: true,
      // Keep the element within the area of it's parent
      restrict: {
        restriction: "#billContainer",
        endOnly: true,
        elementRect: {
          top: 0,
          left: 0,
          bottom: 1,
          right: 1
        }
      },
      // Enable autoScroll
      // AutoScroll: false,
      // Call this function on every dragmove event
      onmove: dragMoveListener,
    });

  function dragMoveListener(event) {

    var target = event.target,

      // Keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;


    // Translate the element
    target.style.webkitTransform =
      target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // Update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

  };

  // Enable draggables to be dropped into this
  interact('.dropzone').dropzone({
    // Require a 50% element overlap for a drop to be possible
    overlap: 0.50,

    // Listen for drop related events:

    ondropactivate: function (event) {
      // Add active dropzone feedback
      event.target.classList.add('drop-active');

    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

      // Feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target');
    },
    ondragleave: function (event) {
      // Remove the drop feedback style
      event.target.classList.remove('drop-target');
    },
    ondrop: function (event) {


      billValue = event.relatedTarget.getAttribute('value');
      //Empty dropzone content and append bill info to dropzone
      $('#dropzone').empty().append(`${billInfoObject[`summary${billValue}`]} <br> Sponsor: ${billInfoObject[`sponsor${billValue}`]}<br> Party: ${billInfoObject[`party${billValue}`]} 
      <br> URL: <a href="${billInfoObject[`govtrack_url${billValue}`]}" target="_blank"> Govtrack</a> <br> Latest Action: ${billInfoObject[`latest_major_action${billValue}`]} <br> 
      Latest Action Date: ${billInfoObject[`date${billValue}`]} <br> <button class="btn-styling topic-btn-style providedSearchButton">Get Involved</button>`);
      //remove draggable after drop
      $(event.relatedTarget).remove();
      //Reappend

    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove('drop-active');
      event.target.classList.remove('drop-target');
    }
  });
  
});