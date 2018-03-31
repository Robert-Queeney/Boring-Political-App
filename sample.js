

$.ajax({
    url: "https://api.propublica.org/congress/v1/members/senate/MN/current.json",
    type: "GET",
    dataType: 'json',
    headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
  }).done(function(data){
  console.log(data)
  });

  $.ajax({
    url: "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyC5mPRvRl9aDc6c0fbeQVooykzgH6CaIQU&address=1263%20Pacific%20Ave.%20Kansas%20City%20KS",
    method: "GET"
  }).then(function(response){
  console.log(response)
  });