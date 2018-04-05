'use strict';

var topics = ["school shootings", "taxes", "gerrymandering", "bump stocks", "DACA",] 
$(document).ready(function(){


 $('#electedOfficialsPanel').click(function (){
    //console.log(addressString);
    let urlCiv = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyC5mPRvRl9aDc6c0fbeQVooykzgH6CaIQU&address=" + "794 Bayard Avenue, Saint Paul, MN, 55102~" + "&roles=legislatorLowerBody&roles=legislatorUpperBody";
        $.ajax({
            url: urlCiv,
            method: "GET"
            }).then(function(response){
            console.log(response);
            for (let i=0; i<5;i++){
            console.log(response.officials[i].address[0])
            let repName = response.officials[i].name;
            let repPhoto = response.officials[i].photoUrl;
            let repPhone = response.officials[i].phones;
            let repSteet = response.officials[i].address[0].line1;
            let repCity =  response.officials[i].address[0].city;
            let repState = response.officials[i].address[0].state;
            let repZip = response.officials[i].address[0].zip;
            console.log(repSteet, repCity, repState, repZip)
            let repAddress = repSteet + '<br>' + repCity + ", " + repState + ", " + repZip;
            $('#electedOfficialsPanel').append(`<div> <img src='${repPhoto}' style='height:200px'</img> <p>${repName}</p> <p>${repPhone}</p> <p> ${repAddress} </p> </div>`);
            };
        });
    });



//geolocation functions
// function success(pos){
//   let coords = pos.coords;
//   // console.log(coords.latitude);
//   // console.log(coords.longitude);
//   lat = coords.latitude;
//   long = coords.longitude;
//   // console.log(lat);
//   // console.log(long);

//   //convert lat and long to a string
//   $.ajax({
//   url: "https://www.mapquestapi.com/geocoding/v1/reverse?key=dvGY3tGwYi2vg1NIbCfJFG3w96p4MhgJ&location="+ lat + "%2C" + long + "&outFormat=json&thumbMaps=false",
//   method: 'GET'
//   }).then(function(response){
//       let street = response.results[0].locations[0].street
//       let city = response.results[0].locations[0].adminArea5
//       let state = response.results[0].locations[0].adminArea3
//       let zip = response.results[0].locations[0].postalCode
//       //console.log(street,city,state,zip);
//       addressString = (street + "," + city + "," + state + ","+ zip);
//       console.log(addressString)
//   }).catch(function(error){
//       console.error('oh boy its broken', error);
// });

// };

//display div to ask for address explaining need for it
// function error (err){
//   $('#target').append(`<div>Please enter your info so we can show you relevant info</div>`)
//   // have pop up screen asking for location then in order to 
//   // display relevant results
// };

//trigger geolocation on 'get involved' click ?
// $('#searchTopicButton').click(function() {
//   navigator.geolocation.getCurrentPosition(success, error);
// });

// target elements with the "draggable" class
interact('.draggable')
.draggable({
  // enable inertial throwing
  inertia: true,
  // keep the element within the area of it's parent
  restrict: {
    restriction: "parent",
    endOnly: true,
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
  },
  // enable autoScroll
  autoScroll: true,
  // call this function on every dragmove event
  onmove: dragMoveListener,
});

function dragMoveListener (event) {
  var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
  target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
// Require a 50% element overlap for a drop to be possible
overlap: 0.50,

// listen for drop related events:

ondropactivate: function (event) {
  // add active dropzone feedback
  event.target.classList.add('drop-active');
  
},
ondragenter: function (event) {
  var draggableElement = event.relatedTarget,
      dropzoneElement = event.target;

  // feedback the possibility of a drop
  dropzoneElement.classList.add('drop-target');
},
ondragleave: function (event) {
  // remove the drop feedback style
  event.target.classList.remove('drop-target');
},
ondrop: function (event) {
  //scoping issue needs resolution
  
  billValue = event.relatedTarget.getAttribute('value');
  console.log(billInfoArray);
  //Empty dropzone content and append bill info to dropzone
  $('#dropzone').empty().append(billInfoArray[billValue].party);
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

  // creating initial search buttons on doc ready
  for (var i = 0; i < topics.length; i++) {
    var a = $("<button class='btn-styling topic-btn-style providedSearchButton'>"); 
    a.attr('data-name', topics[i]); 
    a.text(topics[i]); 
    a.attr('id', 'butt'); 
    $("#buttonsPanel1").append(a);

  }

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
const buttonsPanel2 = $('#buttonsPanel2');
let button;
let searchTopicInput1 = $("#searchTopicInput1");
let issueSearch;

// Function Declarations

// Function Calls

database.ref().orderByChild('dateAdded').limitToLast(3).once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    button = $('<button>');
    button.addClass('btn-styling topic-btn-style providedSearchButton');
    button.attr('data-name', `${childSnapshot.val().query}`);
    button.text(childSnapshot.val().query);
    buttonsPanel2.append(button);
  });
});

$("#searchTopicButton1").on("click", function(event) {
  event.preventDefault(); 
  issueSearch = searchTopicInput1.val().trim(); 
  searchTopicInput1.val('');
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
  // Code for hiding 'Page 1' div goes here
  // Code for displaying 'Page 2' div goes here
  // Code for API Call goes here
});

$(document).on("click", ".providedSearchButton", function() {
  issueSearch = $(this).attr("data-name");
  console.log(issueSearch);
  // Code for hiding 'Page 1' div goes here
  // Code for displaying 'Page 2' div goes here
  // Code for API Call goes here
});

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

 var billInfoArray = [];

 $("#searchTopicButton").on("click", function(event){
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
      let committee = results.results[0].bills[i].committees;
    
      const billInfo = {
        title: title, 
        id: id, 
        party: party, 
        summary: summary, 
        status: status,
        committee: committee,
      }
      $('#billHolder').append(`<div value=${i} class="draggable"> <p> ${title} </p> </div> `);
      billInfoArray.push(billInfo);
    
    console.log("bill-info", billInfo);
    
  }});
 });
  return billInfoArray;

  // $("#searchTopicButton").on("click", function(event){
  //   event.preventDefault(); 
  //   let issueSearch = $("#searchTopicInput").val(); 
  //   console.log(issueSearch); 
  //   $.ajax({
  //     url: "https://api.propublica.org/congress/v1/bills/search.json?query="+issueSearch,
  //     type: "GET",
  //     dataType: 'json',
  //     headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
  //   }).then(function(results){
  //     console.log(results); 
  //     for(let i = 0 ; i  < results.results[0].bills.length; i++ ){
  //       // creating const to use bill data for second page
  //       let title = results.results[0].bills[i].short_title; 
  //       let id = results.results[0].bills[i].bill_id; 
  //       let party = results.results[0].bills[i].sponsor_party;  
  //       let summary = results.results[0].bills[i].title; 
  //       let status = results.results[0].bills[i].latest_major_action; 
        
      
  //       const billInfo = {
  //         title: title, 
  //         id: id, 
  //         party: party, 
  //         summary: summary, 
  //         status: status,
  //       }

  //       console.log(billInfo);

  //        window.location.assign("page2.html")

  //       // appending the bills to a new element surrently set to the div on pg 2 (not working) but it
  //       // worked in a test div on pg 1
  //       $('#billsPanel').append(`<div id=billWrapper${i}/>`);
  //       $(`#billWrapper${i}`).append(
  //           `<div class="theBill"/>
  //           <p class="rating">Title :${title}</p>
  //           <p class="rating">Bill id =${id}</p>
  //           <p class="rating">Party that introduced it :${party}</p>
  //           <p class="rating">Summary :${summary}</p>
  //           <p class="rating">Status :${status}</p>`
  //       ); 

        

    
  //   }});
  // })
  // append info on bills to new element on second page
  // Bill name, voting date, summary

}); 