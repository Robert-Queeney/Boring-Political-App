

$.ajax({
    url: "https://api.propublica.org/congress/v1/members/senate/MN/current.json",
    type: "GET",
    dataType: 'json',
    headers: {'X-API-Key': 'um0ROEiltrFHkDwAqWjHR1es1j2wmaz8KekzLuDZ'}
  }).done(function(data){
  console.log(data)
  });