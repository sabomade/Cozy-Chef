// VARIABLES
//=======================
var ingredient;
var p = "1";
var arrofRecipes = [];

//trivia variables
var catNum;

// FUNCTIONS
//=======================
function displayRecipe(ingredient) {
  /*
    recipe puppy
    example call:  http://www.recipepuppy.com/api/?i=onions,garlic&q=omelet&p=3
    Optional Parameters:
    i : comma delimited ingredients
    q : normal search query
    p : page 

    */

  // url used to search recipe puppy api
  var queryURL =
    "https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?i=" +
    ingredient +
    "&p=" +
    p;

  //ajax call used for recipe puppy api
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // recipe puppy api response
    var recipes = JSON.parse(response);
    arrofRecipes = recipes.results;

    for (let index = 0; index < arrofRecipes.length; index++) {
      // variables used for recipe puppy api
      const recipe = arrofRecipes[index];
      const recipeName = recipe.title;
      const recipeURL = recipe.href;
      const recipeIMG = recipe.thumbnail;

      //create div with class card for recipe results
      let card = $("<div>");
      card.addClass("card recipe");

      //create recipeIMG tag with class rImg & hotlinked to recipeURL
      let rImg = $("<img>");
      rImg.attr("src", recipeIMG).addClass("rImg");

      //create <a> tag for img
      let link = $("<a>");
      link.attr("href", recipeURL).attr("target", "_blank");

      //appends img to <a> tag
      let pic = link.append(rImg);

      //create <p> for recipeName with class title
      let rTitle = $("<p>");
      rTitle.addClass("title").text(recipeName);

      //append img & p tags to DOM
      card.append(pic).append(rTitle);
      $("#recipe-results").append(card);
      //console.log("card should be added to DOM");
    }
  });
}

function funnyFacts() {
  var settings = {
    async: true,
    crossDomain: true,
    url: "https://joke3.p.rapidapi.com/v1/joke",
    method: "GET",
    headers: {
      "x-rapidapi-host": "joke3.p.rapidapi.com",
      "x-rapidapi-key": "75ed2bc80amsh952e0bb4ee2170dp105942jsn797a7158557b",
    },
  };

  $.ajax(settings).done(function (response) {
    //variable to hold response from joke api
    var funnyJoke = response.content;

    //create <p> tag & append joke content
    var pTag = $("<p>");
    pTag.addClass("joke").append(funnyJoke);

    //write joke to DOM
    $("#funnyJoke").append(pTag);
    console.log("joke api response", response);
  });
}

function displayTrivia(triviaCategory) {
  //empty div
  $(".card-text").empty();

  //api url
  var triviaURL =
    "https://opentdb.com/api.php?amount=1&type=multiple&category=" +
    triviaCategory;

  $.ajax({
    url: triviaURL,
    method: "GET",
  }).then(function (response) {
    //array containing trivia data
    var questArr = response.results;

    for (let index = 0; index < questArr.length; index++) {
      var question = questArr[index].question;
      //console.log(question);
      var answer = questArr[index].correct_answer;
      //console.log(answer);

      //create <p> tag for question & add class question
      var q = $("<p>");
      q.addClass("question").append(question);

      //create <p> tag for answer & add class answer text-muted
      var a = $("<p>");
      a.addClass("answer text-muted").append(answer);

      //write question & answer to DOM
      $(".card-text").append(q).append(a);
    }
  });
}

async function topicChooser() {
  const { num: conversation } = await Swal.fire({
    title: "Do you want an opener?",
    input: "select",
    inputOptions: {
      9: "General Knowledge",
      17: "Science & Nature",
      11: "Film",
      12: "Music",
      10: "Books",
      26: "Celebrities",
      27: "Animals",
    },
    inputPlaceholder: "Select a conversation",
    showCancelButton: true,
    confirmButtonText: "Get Opener",
    showLoaderOnConfirm: true,
    inputValidator: (num) => {
      return new Promise((resolve) => {
        if (num) {
          catNum = num;
          resolve();
        }
      });
    },
    preConfirm: (catNum) => {
      return fetch(
        "https://opentdb.com/api.php?amount=1&type=multiple&category=" + catNum
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          //console.log(response);
          return response.json();
        })
        .catch((error) => {
          Swal.showValidationMessage(`Request failed: ${error}`);
        });
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.value) {
      var questArr = result.value.results;
      console.log(questArr);
      for (let index = 0; index < questArr.length; index++) {
        var question = questArr[index].question;
        //console.log(question);
        var answer = questArr[index].correct_answer;
        //console.log(answer);

        //write question & answer to sweet alert
        Swal.fire({
          title: question,
          text: answer,
          //showCancelButton:true,
          //cancelButtonText: "Get new Opener",
        });
      }
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      //lets you choose a new topic & gets new opener
    }
  });
}

// MAIN PROCESS
//=======================
//when submit button for recipe clicked...do this
$(document).on("click", ".submitRecipe", function () {
  //clear div
  $("#recipe-results").empty();

  // Preventing the button from trying to submit the form
  event.preventDefault();
  //console.log('here');

  //gets ingredient from user input
  ingredient = $("#get-recipe").val().trim();
  //check if user input recipe searchTerm
  if (!ingredient) {
  } else {
    //calls displayRecipe function, passing user given ingredient
    displayRecipe(ingredient);
  }
});

$(document).on("click", ".convoStarter", function () {
  //display sweetAlert - ask if user wants a convo starter
  topicChooser();
});
