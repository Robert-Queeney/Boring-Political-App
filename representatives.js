'use strict';
$(document).ready(function(){

  $.ajax({
    url: "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyC5mPRvRl9aDc6c0fbeQVooykzgH6CaIQU&address=" + "2900 Thomas Ave South, Minneapolis, MN, 55416" + "&roles=legislatorLowerBody&roles=legislatorUpperBody",
    method: "GET"
  }).then(function(response){
      for (let i=0; i< 3; i++){
        let repName = response.officials[i].name;
        let repPhoto = response.officials[i].photoUrl;
        let repPhone = response.officials[i].phones;
        let repSteet = response.officials[i].address[0].line1;
        let repCity =  response.officials[i].address[0].city;
        let repState = response.officials[i].address[0].state;
        let homeState = response.normalizedInput.state; 
        console.log(homeState); 
        let repZip = response.officials[i].address[0].zip;
        // gives us the ability to seperate by house or senate
        let repDistrict = response.offices[i].name;
        // console.log(typeof(repDistrict), repDistrict);
        // console.log(repDistrict); 
        // an if loop that goes through the array and 
        if(repDistrict.includes("United States Senate")){
          $.ajax({
              url:`https://api.propublica.org/congress/v1/members/senate/${homeState}/current.json`, 
              type: "GET", 
              dataType: 'json', 
              headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
            }).then(function(results){
              // console.log("results====>", results);
              for  (let i=0; i<2; i++){
                let senId = results.results[i].id; 
                console.log(senId); 
              }
        })} else { 
              let lastTwoDistrict = repDistrict.split("-").pop(); 
              $.ajax({
                url:`https://api.propublica.org/congress/v1/members/house/${homeState}/${lastTwoDistrict}/current.json`, 
                type: "GET", 
                dataType: 'json', 
                headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
              }).then(function(results){
                // console.log("results====>", results);
                // console.log(repName, lastTwoDistrict); 
                // for  (let i=0; i<2; i++){
                  let houseId = results.results[0].id; 
                  console.log(houseId); 
                // }
        });  
          
      }}})})  
      
      


        // $.ajax({
        //   url:`https://api.propublica.org/congress/v1/members/{chamber}/${repState}/${lastTwoDistrict}/current.json`, 
        //   type: "GET", 
        //   dataType: 'json', 
        //   headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
        // }).then(function(results){
        //   console.log("results====>", results);
        // })

      // }}}); 

      // $.ajax({
      //   url: "https://api.propublica.org/congress/v1/members/{chamber}/{state}/{district}/current.json",
      //   type: "GET",
      //   dataType: 'json',
      //   headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
      //   }).then(function(results){
      //     console.log("results====>", results);
      //   })

  

// $.ajax({
//     url: "https://api.propublica.org/congress/v1/members/K000388/votes.json",
//     type: "GET",
//     dataType: 'json',
//     headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
//     }).then(function(results){
//     console.log("results====>", results); 


//     for(let i = 0 ; i  < 8; i++ ){
//         // creating const to use bill data for second page
//         let billId = results.results[0].votes[i].bill.bill_id; 
//         let billTitle = results.results[0].votes[i].bill.title; 
//         let party = results.results[0].votes[i].position;  
  
//     console.log(billId, billTitle, party); 
         
    
// // senate call example
// // need to dynamically add senate vs congress via bill info and state via geo locator
// // this will be used from the bill objects
// // need to add branch to bill info and create a variable (if statement?) that creates senate or congress call 
// $.ajax({
//     url: "https://api.propublica.org/congress/v1/members/senate/RI/current.json",
//     type: "GET",
//     dataType: 'json',
//     headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
//   }).then(function(results){
//     console.log("results====>", results); 


//     for(let i = 0 ; i  < 8; i++ ){
//       // creating const to use bill data for second page
//       let senName = results.results[0].name; 
//       let senParty = results.results[0].party; 
//       let senName2 = results.results[1].name; 
//       let senParty2 = results.results[1].party; 
//       console.log("moreresults======>", senName, senParty, senName2, senParty2);  
//     }
//     // https://api.propublica.org/congress/v1/members/{chamber}/{state}/{district}/current.json
// })}})})  