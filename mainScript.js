$(function(){
  //The objects that hold all the question sets
  var questionSetOne = {
      matchStrings: ["abc", "abcc", "abccd"],
      skipStrings: ["ape", "ale", "aye"]
  };
  var questionSetTwo = {
      matchStrings: ["cat.", "896.", "?=+."],
      skipStrings: ["cork1", "cashew17", "dog4"]
  };
  var questionSetThree = {
      matchStrings: ["can", "pan", "fan"],
      skipStrings: ["dan", "ran", "man"]
  };
  var questionSetFour = {
      matchStrings: ["sos", "lol", "pop"],
      skipStrings: ["ssy", "lla", "pps"]
  };
  var questionSetFive = {
      matchStrings: ["regggex", "reggggex", "reggex"],
      skipStrings: ["regex"]
  };
  var questionSetSix = {
      matchStrings: ["Code: coolest"],
      skipStrings: ["Free Food: not coolest", "What coolest is cool?"]
  };
  var questionSetSeven = {
      matchStrings: ["I eat pizza", "I eat chicken"],
      skipStrings: ["I eat burritos", "I eat sauce"]
  };
  var questionSetEight = {
      matchStrings: ["pit", "spot", "spate", "slap", "respite"],
      skipStrings: ["pt", "pot", "peat"]
  };
  var questionSetNine = {
      matchStrings: ["rap them", "tapeth", "atph", "wrap", "87ap9th", "apothecary"],
      skipStrings: ["aleht", "tarpth", "peth", "apples", "shape the"]
  };
  var questionSetTen = {
      matchStrings: ["affgjkin", "rafgkahe", "bafghk", "baffgkit", "baffg kit"],
      skipStrings: ["fgok", "affgm", "afg.K", "afffhgk"]
  };
  var questionSetEleven = {
      matchStrings: ["file_record_integer.pdf", "file_07198230.pdf", "testfile_boo.pdf.tmp"],
      skipStrings: ["string_file.pdf.tmp"]
  };
  var questionSetTwelve = {
      matchStrings: ["assumes word sense. Within does the clustering. In the but when? 'It was hard to tell he arrive. After she had mess! He did not let it wasn't hers!' She replied always thought so.) Then"],
      skipStrings: ["in the U.S.A., people often John?', he often thought, but weighed 17.5 grams well ... they'd better not A.I. has long been a very like that' he thought but W. G. Grace never had much"]
  };
  var questionSetEnd = {
      matchStrings: ["person@thing.com", "first.last@otherthing.org", "user-name@lol.ca"],
      skipStrings: ["almost", "there", ";)"]
  };

  //Global array variables
  var questionArray = [questionSetOne, questionSetTwo, questionSetThree, questionSetFour, questionSetFive, questionSetSix, questionSetSeven, questionSetEight, questionSetNine, questionSetTen, questionSetEleven, questionSetTwelve]; //Array to get an index of all questions
  var counter = -1; //Counter to loop through the array above

  //Global score calculator variables
  var previous_length = 0; //this variable holds the previous length of user input
  var current_length = 0; //this variable holds the current length of user input
  var points = 1000; //this variable holds the final score for the user after changes
  var costTimer = 0; //this variable holds counter for power: remove character costs

  //When play button is clicked, present the next question set
  $('.playButton').click(function(){
     $('.hero-buttons').addClass('play-fade');
     $('.rules-section').addClass('rules-fade');
     $('.screen').css('display','flex');
     setTimeout(function(){
        $('.rules-section').css('display', 'none');
        $('.hero-buttons').css('display','none');
        $('.screen').css('opacity', '1');
        $('.screen').css('visibility', 'visible');
     }, 1500);
      nextQuestionSet();
  });

  $('.nextButton').click(function(){
     nextQuestionSet();
     $('.message').removeClass('message-fixed');
     $('.inputArea').removeAttr('disabled');
     $('.inputArea').val('');
     $('.skip-section').css('display', 'flex');
     $('.skip-section').removeClass('skip-clear');
 })

  //When input is changed....update score and test for correctness
  $('.inputArea').on('input', function(e){
      scoreCalc(); //update score
      $('.scoreBoard').html(`${points}`); //update score
      var user_regex_input = new RegExp($('.inputArea').val()); //convert string to regex
      regexTest(questionArray[counter].matchStrings, questionArray[counter].skipStrings, user_regex_input);
      $('.scoreBoard').removeClass('shakeAnimation');
      setTimeout(function(){
         $('.scoreBoard').addClass('shakeAnimation');
      }, 1);
      if (points == 500) {
         $('.match-section').addClass('fade-slide-left');
         $('.skip-section').addClass('fade-slide-right');
         $('.score-title').addClass('fade-slide-right');
         $('.user-bar').addClass('fade-slide-left');
         $('.end-screen').css('display', 'flex');
         $('.inputArea').attr('disabled','disabled');
         setTimeout(function(){
            $('.match-section, .skip-section, .score-title, .user-bar').css('display', 'none');
            $('.end-screen').addClass('end-screen-fix');
         },1800);
         // $('.end-screen').css('display', 'block');
         // setTimeout(function(){
         //    $('.end-screen').addClass('end-screen-fix');
         // }, 500);
      }
  });

  //When user diverts focus from page, decrease score
  $(window).blur(function(){
      scoreFocus();
  });

  //when clicked, remove skip requiremenets
  $('.powerNoSkip').click(function() {
     $('.skip-section').addClass('skip-clear');
     $('.powerNoSkip').addClass('powerSkip-clear');
     setTimeout(function(){
        clearSkip();
        $('.skip-section').css('display', 'none');
     }, 1200)
  });

  //when clicked, remove letter costs/gains
  $('.powerNoCost').click(function(){
      costTimer = 15;
      setInterval(costCounter, 1000);
      $('.powerNoCost').addClass('powerCost-clear');
  });

  //Local functions to be called when triggered
  function scoreCalc() {
      var regex_input = $('.inputArea').val().split(''); //split user's input into an array of letters
      current_length = regex_input.length; //this variable will equal the input length

      if (current_length > previous_length) { //if user has typed a character, decrease points by 10
          var increment = current_length - previous_length;
          for (i = 0; i < increment; i++) { //to account for copy and pasting regex
              points -= 10;
              if (costTimer > 0) { //while power is active, counteract point loss
                  points += 10;
              }

          }
      } else if (current_length < previous_length) { //if user has removed a character, increase points by 5
          var decrement = previous_length - current_length;
          for (i = 0; i < decrement; i++) { //to account for highlight deleting
              points += 5;
              if (costTimer > 0) { //while power is active, counteract point gain
                  points -= 5;
              }
          }
      }
      previous_length = current_length; //give previous_length a new value = current_length so tracking can start over
  }
  function regexTest(match_array, skip_array, input) {
      var match = 0; //this variable tracks the number of match errors
      var skip = 0; //this variable tracks the number of skip errors

      for (var x = 0, y = match_array.length; x < y; x++) {
          if (input.test(match_array[x]) == false) { //if any of the strings_to_match are false, increase match error count
              match += 1;
          }
      }

      for (var x = 0, y = skip_array.length; x < y; x++) {
          if (input.test(skip_array[x]) == true) { //if any of the strings_to_skip are true, increase skip error count
              skip += 1;
          }
      }

      if (match > 0 || skip > 0) { //if any errors occurred, regex isn't correct
          console.log('number of match errors: ' + match);
          console.log('number of skip errors: ' + skip);
          console.log('Regex does not meet requirements');
      } else { //no errors means regex is correct
          console.log('Regex meets all requirements');
          $('.messageContent').html('You win!');
         //  $('.message').css('opacity', '1').css('z-index', '1');
         //  $('.message').html('You win!')
         $('.message').addClass('message-fixed');
          $('.inputArea').attr('disabled','disabled');
      }
  }
  function nextQuestionSet() {
      counter += 1;
      $('.matchArea').empty();
      $('.skipArea').empty();
      //append all the match strings to the textarea
      for (i = 0; i < questionArray[counter].matchStrings.length; i++) {
          $(`<li>${questionArray[counter].matchStrings[i]}</li>`).appendTo('.matchArea');
      }
      //append all the skip strings to the textarea
      for (i = 0; i < questionArray[counter].skipStrings.length; i++) {
          $(`<li>${questionArray[counter].skipStrings[i]}</li>`).appendTo('.skipArea');
      }
  }
  function scoreFocus() {
      points -= 50; //decrease points by 50
      $('.scoreBoard').html(`${points}`); //update score
  }
  function clearSkip() {
      $('.skipArea').empty();
      questionArray[counter].skipStrings.length = 0;
  }
  function costCounter() {
      costTimer -= 1;
  }
});

//regex input history
