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
  let page1 = $('#page1');
  let page2 = $('#page2');
  let page3 = $('#page3');
  let billInfoObject = {};
  let coords;
  let lat;
  let long;
  let street;
  let city;
  let state;
  let zip;
  let addressString;
  let urlCiv;
  let repName;
  let repPhoto;
  let repPhone;
  let repSteet;
  let repCity;
  let repState;
  let repZip;
  let repAddress;
  let inputAddressString;
  let row;
  let col;
  let tableBody = $('#tableBody');
  let table = $('#table');
  let inputA;
  let inputC;
  let inputS;
  let billValue;

  // Function Declarations

  const propublicaAPICall = function() {
    $.ajax({
      url: "https://api.propublica.org/congress/v1/bills/search.json?query=" + issueSearch,
      type: "GET",
      dataType: 'json',
      headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
    }).then(function(results){
      for(let i = 0 ; i  < results.results[0].bills.length; i++ ){
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
    }).catch(function(error){
      console.error('Oh boy, its broken:', error);
    });
  };

  const saveSearchAndGetBillInfo = function(input, page) {
    if (input.val().trim() !== '') {
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
        billHolder.empty();
      };
      if (page !== page2) {
        page.hide();
        page2.show();
      };
      propublicaAPICall();
    };
  };

  const onGeolocationSuccess = function(pos){
    coords = pos.coords;
    lat = coords.latitude;
    long = coords.longitude;
    $.ajax({
      url: "https://www.mapquestapi.com/geocoding/v1/reverse?key=dvGY3tGwYi2vg1NIbCfJFG3w96p4MhgJ&location="+ lat + "%2C" + long + "&outFormat=json&thumbMaps=false",
      method: 'GET'
    }).then(function(response){
      street = response.results[0].locations[0].street;
      city = response.results[0].locations[0].adminArea5;
      state = response.results[0].locations[0].adminArea3;
      zip = response.results[0].locations[0].postalCode;
      addressString = (street + "," + city + "," + state + ","+ zip);
      urlCiv = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyC5mPRvRl9aDc6c0fbeQVooykzgH6CaIQU&address=" + addressString + "&roles=legislatorLowerBody&roles=legislatorUpperBody";
      $.ajax({
        url: urlCiv,
        method: "GET"
      }).then(function(response){
        row = $('<tr>');
        for (let i=0; i< 3; i++){
          repName = response.officials[i].name;
          repPhoto = response.officials[i].photoUrl;
          repPhone = response.officials[i].phones;
          repSteet = response.officials[i].address[0].line1;
          repCity =  response.officials[i].address[0].city;
          repState = response.officials[i].address[0].state;
          repZip = response.officials[i].address[0].zip;
          repAddress = repSteet + '<br>' + repCity + ", " + repState + ", " + repZip;
          col = $(`<td><img src='${repPhoto}' style='height:200px'><p>${repName}</p><p>${repPhone}</p><p>${repAddress}</p></td>`);
          row.append(col);
        };
        tableBody.empty();
        tableBody.append(row);
        table.show();
      }).catch(function(error){
        console.error('Oh boy, its broken:', error);
      });
    }).catch(function(error){
      console.error('Oh boy, its broken:', error);
    });
  };

  const onGeolocationError = function(){
    $('#getInvolvedHeader').text('Please Enter Your Address To Proceed');
    $('#addressPopup').show();
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
      // Empty dropzone content and append bill info to dropzone
      $('#dropzone').empty().append(`${billInfoObject[`summary${billValue}`]} <br> Sponsor: ${billInfoObject[`sponsor${billValue}`]}<br> Party: ${billInfoObject[`party${billValue}`]} 
      <br> URL: <a href="${billInfoObject[`govtrack_url${billValue}`]}" target="_blank"> Govtrack</a> <br> Latest Action: ${billInfoObject[`latest_major_action${billValue}`]} <br> 
      Latest Action Date: ${billInfoObject[`date${billValue}`]} <br> <button class="btn-styling topic-btn-style getInvolvedButton">Get Involved</button>`);
      // Remove draggable after drop
      $(event.relatedTarget).remove();
      // Reappend

    },
    ondropdeactivate: function (event) {
      // Remove active dropzone feedback
      event.target.classList.remove('drop-active');
      event.target.classList.remove('drop-target');
    }
  });

  // On click of "Get Involved" button, navigate to page 3 and call the geolocation 
  // API

  $(document).on("click", ".getInvolvedButton", function() {
    page2.hide();
    page3.show();
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);
  });

  // On click of search button (third page), save the topic searched for 
  // in Firebase if it is not already one of the three most recent searches 
  // there AND hide 'Page 3' div AND display 'Page 2' div AND empty the 
  // billsPanel of content AND use the topic in the Propublica API call 

  $("#searchTopicButton3").on("click", function(event) {
    event.preventDefault(); 
    saveSearchAndGetBillInfo(searchTopicInput3, page3);
    table.hide();
  });

  // Submit Address Button

  $('#button11111').click(function () {
    event.preventDefault();
    inputA = $('#inputAddress1').val();
    inputC = $('#inputCity1').val();
    inputS = $('#inputState1').val();
    $('#inputAddress1').val('');
    $('#inputCity1').val('');
    $('#inputState1').val('');
    $('#addressPopup').hide();
    $('#getInvolvedHeader').text('Contact Your Legislative Representatives');
    inputAddressString = (inputA + ", " + inputC + ", " + inputS);
    $.ajax({
      url: "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyC5mPRvRl9aDc6c0fbeQVooykzgH6CaIQU&address=" + inputAddressString + "&roles=legislatorLowerBody&roles=legislatorUpperBody",
      method: "GET"
    }).then(function(response){
      row = $('<tr>');
      for (let i=0; i< 3; i++){
        repName = response.officials[i].name;
        repPhoto = response.officials[i].photoUrl;
        repPhone = response.officials[i].phones;
        repSteet = response.officials[i].address[0].line1;
        repCity =  response.officials[i].address[0].city;
        repState = response.officials[i].address[0].state;
        repZip = response.officials[i].address[0].zip;
        repAddress = repSteet + '<br>' + repCity + ", " + repState + ", " + repZip;
        col = $(`<td><img src='${repPhoto}' style='height:200px'><p>${repName}</p><p>${repPhone}</p><p>${repAddress}</p></td>`);
        row.append(col);
      };
      tableBody.empty();
      tableBody.append(row);
      table.show();
    }).catch(function(error){
      console.error('Oh boy, its broken:', error);
    });
  });
  
});