'use strict';

$(document).ready(function() {

  // Initialize Firebase

  const config = {
    apiKey: 'AIzaSyC_dXl43FWL5hA8u0-W-hozb1zTrmBJ3Tw',
    authDomain: 'boringpoliticalapp.firebaseapp.com',
    databaseURL: 'https://boringpoliticalapp.firebaseio.com',
    projectId: 'boringpoliticalapp',
    storageBucket: '',
    messagingSenderId: '944272526743',
  };

  firebase.initializeApp(config);

  // Variables

  const hotTopics = ['School shootings', 'Taxes', 'Gerrymandering', 'Bump Stocks', 'DACA'];
  const database = firebase.database();
  let button;
  const searchTopicInput1 = $('#searchTopicInput1');
  const searchTopicInput2 = $('#searchTopicInput2');
  const searchTopicInput3 = $('#searchTopicInput3');
  let issueSearch;
  let databaseHasTopic;
  const billHolder = $('#billHolder');
  const dropZone = $('#dropzone');
  const accordianBillHolder = $('#accordianBillHolder');
  let acc;
  let arr;
  const page1 = $('#page1');
  const page2 = $('#page2');
  const page3 = $('#page3');
  let billIndex;
  const billInfoObject = {};
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
  let body;
  const inputRequired = $('#inputRequired');
  let inputAddressString;
  let rep;
  const reps = $('#reps');
  let inputA;
  let inputC;
  let inputS;
  let billValue;

  // Function Declarations

  const propublicaAPICall = function() {
    billHolder.append('<div class="loader center-block"></div>');
    accordianBillHolder.append('<div class="loader center-block"></div>');
    $.ajax({
      url: `https://api.propublica.org/congress/v1/bills/search.json?query=${issueSearch}`,
      type: 'GET',
      dataType: 'json',
      headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
    }).then(function(results){
      billHolder.empty();
      accordianBillHolder.empty();
      billIndex = 0;
      for (let i = 0 ; i  < results.results[0].bills.length; i++ ) {
        billInfoObject[`title${i}`] = results.results[0].bills[i].short_title; 
        billInfoObject[`id${i}`] = results.results[0].bills[i].bill_id; 
        billInfoObject[`party${i}`] = results.results[0].bills[i].sponsor_party;  
        billInfoObject[`summary${i}`] = results.results[0].bills[i].title;  
        billInfoObject[`branch${i}`] = results.results[0].bills[i].sponsor_title;
        billInfoObject[`govtrack_url${i}`] = results.results[0].bills[i].govtrack_url;
        billInfoObject[`latest_major_action${i}`] = results.results[0].bills[i].latest_major_action;
        billInfoObject[`date${i}`] = results.results[0].bills[i].latest_major_action_date;
        billInfoObject[`sponsor${i}`] = results.results[0].bills[i].sponsor_name;
        billInfoObject[`date_intro${i}`] = results.results[0].bills[i].introduced_date;
        billHolder.append(`<div value=${i} class="col-md-5 col-xs-11 draggable">
        <div class="block-with-text">${billInfoObject[`title${i}`]}</div></div>`);
        accordianBillHolder.append(`<button class="accordion">${billInfoObject[`title${i}`]}</button><div class="accordionPanel">
        <p class="accordion-panel-subheaders">Summary:</p><p>${billInfoObject[`summary${i}`]}<br><hr>
        <p class="accordion-panel-subheaders">Sponsor:</p>${billInfoObject[`sponsor${i}`]}<br><br>
        <p class="accordion-panel-subheaders">Party:</p>${billInfoObject[`party${i}`]}<br><br>
        <p class="accordion-panel-subheaders">Latest Action:</p>${billInfoObject[`latest_major_action${i}`]}<br><br>
        <p class="accordion-panel-subheaders">Latest Action Date:</p>${billInfoObject[`date${i}`]}</p>
        <p class="accordion-panel-subheaders">URL:</p><a href="${billInfoObject[`govtrack_url${i}`]}" target="_blank">Govtrack <i class="fas fa-external-link-alt"></i></a>
        <br><div class="row"><div class="col-md-12 text-center">
        <button class="btn-styling get-involved-btn-style getInvolvedButton">Get Involved</button></div></div>`);
        billIndex++;
      };
      if (billIndex > 0) {
        billHolder.append(`<div class="col-sm-12 text-center"><button class="btn-styling get-involved-btn-style refreshBills">Refresh Bills</button></div>`);
      } else {
        billHolder.append('<p style="color:black; font-size:30px">No Search Results Found</p>');
        accordianBillHolder.append('<p style="color:black; font-size:30px">No Search Results Found</p>');
      };
        // Accordian Bill Functionality for Mobile
      acc = $(".accordion");
      arr = Array.prototype.slice.call(acc);
      for (let i = 0; i < results.results[0].bills.length; i++) {
          arr[i].addEventListener("click", function() {
              /* Toggle between adding and removing the "active" class,
              to highlight the button that controls the panel */
              this.classList.toggle("active");
              /* Toggle between hiding and showing the active panel */
              let panel = this.nextElementSibling;
              if (panel.style.display === "block") {
                  panel.style.display = "none";
              } else {
                  panel.style.display = "block";
              }
          });
      };
    }).catch(function(error){
      billHolder.empty();
      accordianBillHolder.empty();
      billHolder.append(`<p style="color:black; font-size:30px">Something went 
      wrong with the API call. See console for error.</p>`);
      accordianBillHolder.append(`<p style="color:black; font-size:30px">Something went 
      wrong with the API call. See console for error.</p>`);
      console.error('Oh boy, its broken:', error);
    });
  };

  const saveSearchAndGetBillInfo = function(input, page) {
    if (input.val().trim() !== '') {
      issueSearch = input.val().trim();
      input.val('');
      databaseHasTopic = false;
      database.ref().orderByChild('dateAdded').limitToLast(3).once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          if (childSnapshot.val().query === issueSearch) {
            databaseHasTopic = true;
          };
        });
        setTimeout(function() {
          if (!databaseHasTopic) {
            database.ref().push({
              query: issueSearch,
              dateAdded: firebase.database.ServerValue.TIMESTAMP,
            });
          };
        }, 1000);
      });
      if (page !== page1) {
        billHolder.empty();
        accordianBillHolder.empty();
        dropZone.empty().append($('<div class="drop-here-text text-center">Drag &amp; Drop <br>Bills Here</div>'));
      };
      if (page !== page2) {
        page.hide();
        page2.show();
      };
      propublicaAPICall();
    };
  };

  const onGeolocationSuccess = function(pos) {
    coords = pos.coords;
    lat = coords.latitude;
    long = coords.longitude;
    $.ajax({
      url: `https://www.mapquestapi.com/geocoding/v1/reverse?key=dvGY3tGwYi2vg1NIbCfJFG3w96p4MhgJ&location=${lat}%2C${long}&outFormat=json&thumbMaps=false`,
      method: 'GET',
    }).then(function(response) {
      street = response.results[0].locations[0].street;
      city = response.results[0].locations[0].adminArea5;
      state = response.results[0].locations[0].adminArea3;
      zip = response.results[0].locations[0].postalCode;
      addressString = (`${street},${city},${state},${zip}`);
      urlCiv = `https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyC5mPRvRl9aDc6c0fbeQVooykzgH6CaIQU&address=${addressString}&roles=legislatorLowerBody&roles=legislatorUpperBody`;
      $.ajax({
        url: urlCiv,
        method: 'GET',
      }).then(function(response) {
        reps.empty();
        for (let i = 0; i < 3; i++) {
          repName = response.officials[i].name;
          repPhoto = response.officials[i].photoUrl;
          repPhone = response.officials[i].phones;
          repSteet = response.officials[i].address[0].line1;
          repCity = response.officials[i].address[0].city;
          repState = response.officials[i].address[0].state;
          repZip = response.officials[i].address[0].zip;
          repAddress = `${repSteet  }<br>${  repCity  }, ${  repState  }, ${  repZip}`;
          if (i < 2) {
            body = 'Senate';
          } else {
            body = 'House';
          }
          rep = $(`<div class="col-xs-12 col-sm-6 col-md-4"><p style='font-weight:bold'>${body}</p>
          <img src='${repPhoto}' style='height:200px'><p>${repName}</p><p>${repPhone}</p>
          <p>${repAddress}</p></div>`);
          reps.append(rep);
        }
      }).catch(function(error) {
        reps.empty();
        reps.append(`<p style="color:black; font-size:30px">Something went 
        wrong with the API call. See console for error.</p>`);
        console.error('Oh boy, its broken:', error);
      });
    }).catch(function(error) {
      reps.empty();
      reps.append(`<p style="color:black; font-size:30px">Something went 
      wrong with the API call. See console for error.</p>`);
      console.error('Oh boy, its broken:', error);
    });
  };

  const onGeolocationError = function() {
    reps.empty();
    $('#getInvolvedHeader').text('Please Enter Your Address To Proceed');
    $('#addressPopup').show();
  };

  // Function Calls

  // Create Hot Topic search buttons (on load)

  for (let i = 0; i < hotTopics.length; i++) {
    const button = $('<button>');
    button.addClass('btn-styling topic-btn-style providedSearchButton');
    button.attr('data-name', hotTopics[i]);
    button.text(hotTopics[i]);
    $('#buttonsPanel1').append(button);
  }

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

  $('#searchTopicButton1').on('click', function(event) {
    event.preventDefault();
    saveSearchAndGetBillInfo(searchTopicInput1, page1);
  });

  // On click of a Hot Topic or Recent Search button, hide 'Page 1' div AND
  // display 'Page 2' div AND use the value of that button in the Propublica
  // API call

  $(document).on('click', '.providedSearchButton', function() {
    issueSearch = $(this).attr('data-name');
    page1.hide();
    searchTopicInput1.val('');
    page2.show();
    propublicaAPICall();
  });

  // On click of search button (second page), save the topic searched for
  // in Firebase if it is not already one of the three most recent searches
  // there AND empty billsPanel of content AND use the topic in the Propublica
  // API call

  $('#searchTopicButton2').on('click', function(event) {
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
        restriction: '#billContainer',
        endOnly: true,
        elementRect: {
          top: 0,
          left: 0,
          bottom: 1,
          right: 1,
        },
      },
      // Enable autoScroll
      // AutoScroll: false,
      // Call this function on every dragmove event
      onmove: dragMoveListener,
    });

  function dragMoveListener(event) {
    let target = event.target,

      // Keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;


    // Translate the element
    target.style.webkitTransform =
      target.style.transform =
      `translate(${x}px, ${y}px)`;

    // Update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

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
      let draggableElement = event.relatedTarget,
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
      dropZone.empty().append(`
      <div class="row">
        <div class="col-md-12">
            <div class="bill-title-style" id="billTitle">
              ${billInfoObject[`title${billValue}`]}
            </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
            <div class="bill-info-mini-panel text-center">
                <div class="mini-panel-heading-style">Sponsor Party</div>
                <div class="panel-body" id="billSponsorParty">
                  ${billInfoObject[`party${billValue}`]}
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="bill-info-mini-panel text-center">
                <div class="mini-panel-heading-style">Introduced</div>
                <div class="panel-body" id="billIntroDate">
                  ${billInfoObject[`date_intro${billValue}`]}
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="bill-info-mini-panel text-center">
                <div class="mini-panel-heading-style">Last Action</div>
                <div class="panel-body" id="billLastActionDate">
                  ${billInfoObject[`date${billValue}`]}
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-4">
            <div class="bill-author-panel">
                <h3>Sponsor</h3>
                <hr>
                <div class="bill-detail-text-style" id="billAuthorInfo">
                  ${billInfoObject[`sponsor${billValue}`]}
                </div>
            </div>
        </div>
        <div class="col-md-8">
            <div class="bill-extended-summary-panel">
                <h3>Summary</h3>
                <hr>
                <div class="bill-detail-text-style" id="billExtendedSummary">
                  ${billInfoObject[`summary${billValue}`]}
                  </br>
                  </br>
                  Latest Action: ${billInfoObject[`latest_major_action${billValue}`]}
                  </br>
                  </br>
                  URL: <a href="${billInfoObject[`govtrack_url${billValue}`]}" target="_blank">Govtrack <i class="fas fa-external-link-alt"></i></a>
                </div>
            </div>
        </div>
    </div>
    </br>
    </br>
    <div class="row">        
      <div class="col-md-12 text-center"><button class="btn-styling get-involved-btn-style getInvolvedButton">
      Get Involved</button></div>
    </div>`);
      // Remove draggable after drop
      $(event.relatedTarget).remove();
      // Reappend
    },
    ondropdeactivate: function (event) {
      // Remove active dropzone feedback
      event.target.classList.remove('drop-active');
      event.target.classList.remove('drop-target');
    },
  });

  // Dropzone affix

  // $('#sidebar').affix({
  //   offset: {
  //     top: 85,
  //     bottom: 85
  //   },
  // });

  // On click of "Refresh" button, the bills will be reappended to the page 

  $(document).on('click', '.refreshBills', function() {
    billHolder.empty();
    for (let i = 0; i < billIndex; i++) {
      billHolder.append(`<div value=${i} class="col-md-5 col-xs-11 draggable">
      <div class="block-with-text">${billInfoObject[`title${i}`]}</div></div>`);
    };
    billHolder.append(`<div class="col-sm-12 text-center">
    <button class="btn-styling get-involved-btn-style refreshBills">Refresh Bills</button></div>`);
  });

  // On click of "Get Involved" button, navigate to page 3 and call the geolocation
  // API

  $(document).on('click', '.getInvolvedButton', function() {
    page2.hide();
    page3.show();
    reps.append('<div class="loader center-block"></div>');
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);
  });

  // On click of search button (third page), save the topic searched for
  // in Firebase if it is not already one of the three most recent searches
  // there AND hide 'Page 3' div AND display 'Page 2' div AND empty the
  // billsPanel of content AND use the topic in the Propublica API call

  $('#searchTopicButton3').on('click', function(event) {
    event.preventDefault();
    saveSearchAndGetBillInfo(searchTopicInput3, page3);
    reps.empty();
  });

  // Submit Address Button

  $('#button11111').click(function () {
    event.preventDefault();
    inputA = $('#inputAddress1').val();
    inputC = $('#inputCity1').val();
    inputS = $('#inputState1').val();
    if (inputA === '' || inputC === '' || inputS === '') {
      inputRequired.append('<p style="color:black; font-size:30px">Input Required</p>');
    } else {
      inputRequired.empty();
      $('#inputAddress1').val('');
      $('#inputCity1').val('');
      $('#inputState1').val('');
      $('#addressPopup').hide();
      $('#getInvolvedHeader').text('Contact Your Legislative Representatives');
      reps.append('<div class="loader center-block"></div>');
      inputAddressString = (`${inputA  }, ${  inputC  }, ${  inputS}`);
      $.ajax({
        url: 'https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyC5mPRvRl9aDc6c0fbeQVooykzgH6CaIQU&address=' + inputAddressString + '&roles=legislatorLowerBody&roles=legislatorUpperBody',
        method: 'GET',
      }).then(function(response) {
        reps.empty();
        for (let i = 0; i < 3; i++) {
          repName = response.officials[i].name;
          repPhoto = response.officials[i].photoUrl;
          repPhone = response.officials[i].phones;
          repSteet = response.officials[i].address[0].line1;
          repCity = response.officials[i].address[0].city;
          repState = response.officials[i].address[0].state;
          repZip = response.officials[i].address[0].zip;
          repAddress = `${repSteet  }<br>${  repCity  }, ${  repState  }, ${  repZip}`;
          if (i < 2) {
            body = 'Senate';
          } else {
            body = 'House';
          };
          rep = $(`<div class="col-xs-12 col-sm-6 col-md-4"><p style='font-weight:bold'>${body}</p><img src='${repPhoto}' alt='Congress Member Headshot' style='height:200px'><p>${repName}</p><p>${repPhone}</p><p>${repAddress}</p></div>`);
          reps.append(rep);
        };
      }).catch(function(error){
        reps.empty();
        reps.append(`<p style="color:black; font-size:30px">Something went 
        wrong with the API call. See console for error.</p>`);
        console.error('Oh boy, its broken:', error);
      });
    }
  });
});