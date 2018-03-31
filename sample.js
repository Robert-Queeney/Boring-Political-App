

$.ajax({
    url: "https://api.propublica.org/congress/v1/members/senate/MN/current.json",
    type: "GET",
    dataType: 'json',
    headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
  }).done(function(data){
  console.log(data)
  });

// searching for upcoming bills
// search terms
// "https://api.propublica.org/congress/v1/bills/search.json?query=${input}"

  $.ajax({
    url: "https://api.propublica.org/congress/v1/bills/search.json?query=school",
    type: "GET",
    dataType: 'json',
    headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
  }).done(function(data){
  console.log(data)
  });

  // append info on bills to new element on second page
  // Bill name, voting date, summary

  //   https://projects.propublica.org/api-docs/congress-api/bills/#search-bills
