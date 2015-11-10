$(function(){
var substringMatcher = function(strs) {
return function findMatches(q, cb) {
var matches, substringRegex;

  matches = [];

 substrRegex = new RegExp(q, 'i');
 $.each(strs, function(i, str) {
       if (substrRegex.test(str)) {
                matches.push(str);
          }
       });

       cb(matches);
           };
       };

var stations = [
"3rd Ave & Broad St",
"2nd Ave & Vine St",
"6th Ave & Blanchard St",
"2nd Ave & Blanchard St",
"2nd Ave & Pine St",
"7th Ave & Union St",
"City Hall / 4th Ave & James St",
"Pine St & 9th Ave",
"2nd Ave & Spring St",
"Summit Ave & E Denny Way",
"E Harrison St & Broadway Ave E",
"Summit Ave E & E Republican St",
"15th Ave E & E Thomas St",
"12th Ave & E Denny Way",
"E Pine St & 16th Ave",
"Cal Anderson Park / 11th Ave & Pine St",
"Harvard Ave & E Pine St",
"Bellevue Ave & E Pine St",
"12th Ave & E Mercer St",
"9th Ave N & Mercer St",
"Children's Hospital / Sandpoint Way NE & 40th Ave NE",
"Fred Hutchinson Cancer Research Center / Fairview Ave N & Ward St",
"E Blaine St & Fairview Ave E",
"Eastlake Ave E & E Allison St",
"Frye Art Museum / Terry Ave & Columbia St",
"Seattle University / E Columbia St & 12th Ave",
"6th Ave S & S King St",
"King Street Station Plaza / 2nd Ave Extension S & S Jackson St",
"Occidental Park / Occidental Ave S & S Washington St",
"REI / Yale Ave N & John St",
"Dexter Ave N & Aloha St",
"Republican St & Westlake Ave N",
"PATH / 9th Ave & Westlake Ave",
"Westlake Ave & 6th Ave",
"Lake Union Park / Valley St & Boren Ave N",
"Dexter Ave & Denny Way",
"Key Arena / 1st Ave N & Harrison St",
"Burke-Gilman Trail / NE Blakeley St & 24th Ave NE",
"NE 42nd St & University Way NE",
"12th Ave & NE Campus Pkwy",
"NE 47th St & 12th Ave NE",
"UW McCarty Hall / Whitman Ct",
"Burke Museum / E Stevens Way NE & Memorial Way NE",
"15th Ave NE & NE 40th St",
"UW Engineering Library / E Stevens Way NE & Jefferson Rd",
"UW Intramural Activities Building",
"UW Magnuson Health Sciences Center Rotunda / Columbia Rd & San Juan Rd",
"Pier 69 / Alaskan Way & Clay St",
"Seattle Aquarium / Alaskan Way S & Elliott Bay Trail",
"1st Ave & Marion St",
"12th Ave & E Yesler Way",
"Terry Ave & Stewart St",
"Union St & 4th Ave",
"Mercer St & 9th Ave N"];

$('#start-stations .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
    {
      name: 'starts',
      source: substringMatcher(stations)
    });
$('#end-stations .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
    {
      name: 'ends',
      source: substringMatcher(stations)
    });
});
