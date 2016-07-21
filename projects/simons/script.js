$(document).ready(function() {
  //updateDisplay()
  var poweredOn = false;
  var lightButtonsComp = [];
  var lightButtonsPlayer = [];
  var countNumber = 0;
  var possibleColors = ['Yellow', 'Green', 'Red', 'Blue']
  var playerCanClick = false;
  var playerClickCount = 0;
  var isPlaying = false;
  var strictOn = false;
  var maxCount = 20;
  var Queue = [];

  $("#toggleSwitch").on("click",
    powerOnClicked);
  $("#startButton").on("click",
    startClicked);
  $(".button").on("click",
    buttonClicked);
  $("#strictButton").on("click",
    strictClicked);
  //$(".button").on("mouseup",
  //buttonMouseUp);

  //lighButton object
  var lightButton = function(color) {
    this.color = color;
    this.playAudio = function() {
      $("#audio" + this.color).trigger('play');
    }
    this.holdTime = 500;
    this.playButton = function() {

      $(".button" + this.color).css({
        opacity: '1.0'
      });

      $("#audio" + this.color).trigger('play');
      var that = this; //save this, setTimeOut has problem with this
      setTimeout(function() {
        console.log(that.color);
        $(".button" + that.color).css({
          opacity: '0.5'
        });
      }, this.holdTime);
    }
  }

  function stopPlaying(color) {

    $("#audio" + color).trigger('pause');
    $("#audio" + color).attr("currentTime", "0");
    $.each($('.button'), function() {
      $(this).css({
        opacity: '0.5'
      });
    });

  }

  function buttonClicked() {

    if (!playerCanClick) {
      return;
    }

    var buttonColor = $(this).attr("class").split(" ")[1].slice(6);
    stopPlaying(buttonColor);
    var button = new lightButton(buttonColor);
    button.playButton();

    if (lightButtonsComp[playerClickCount].color == buttonColor) {
      playerClickCount += 1;
      if (playerClickCount == lightButtonsComp.length) {
        if (playerClickCount == maxCount) {
          $(".countLetters").html("WIN");
          setTimeout(function() {
            startClicked();
          }, 2000);
        } else {
          setTimeout(function() {
            nextTurnComputer();
          }, 800);
        }
      }
    } else {
      $(".countLetters").html("!!");
      if (strictOn) {
        setTimeout(function() {
          startClicked();
        }, 1000);
      } else {
        setTimeout(function() {
          playAll(lightButtonsComp);
          playerClickCount = 0;
          updateDisplay();
        }, 2000);
      }
    }

  }

  function powerOnClicked() {
    var button1 = new lightButton("Yellow");
    poweredOn = !poweredOn;

    if (poweredOn) {
      $(".countLetters").html("--");
      $(".button").css({
        opacity: '1.0'
      });
      setTimeout(function() {
        $(".button").css({
          opacity: '0.5'
        });
      }, 400);

    } else {
      $(".countLetters").html("");
      $(".confirmLight").css({ opacity: '0.2'});
      reset();
    }
  }

  function reset() {
    countNumber = 0;
    lightButtonsComp = [];
    playerCanClick = false;
  }

  function strictClicked() {
    if (poweredOn) {
      strictOn = !strictOn;
      if (strictOn) {
        $(".confirmLight").css({
          opacity: '1.0'
        });
      } else {
        $(".confirmLight").css({
          opacity: '0.2'
        });
      }
    }
  }

  function startClicked() {

    if (poweredOn) {
      $(".countLetters").html("--");
      setTimeout(function() {
        reset();
        nextTurnComputer();
      }, 400);

    }
  }

  function nextTurnComputer() {
    playerCanClick = false;
    countNumber += 1;
    var n = Math.floor(Math.random() * 4);
    var lb = new lightButton(possibleColors[n])
    lightButtonsComp.push(lb);
    //  console.log(lightButtonsComp);
    playAll(lightButtonsComp);
    setTimeout(function() {
       playerCanClick = true;
        
      }, lightButtonsComp.length*800);
    
    playerClickCount = 0;
    updateDisplay();
  }

  function playAll(lbArray) {
    Queue = [];
    for (var i = 0; i < lbArray.length; i++) {
      console.log(lbArray[i]);
      // due to asynchronous nature of setTimeout
      // we organize lightButtons in queue.
      playQueue(lbArray[i]);
    }
  }

  function playQueue(button) {
    if (isPlaying) {
      Queue.push(button);
    } else {
      isPlaying = true;
      setTimeout(function() {
        button.playButton();
        isPlaying = false;
        var nextButton = Queue.shift();
        if (nextButton) {
          playQueue(nextButton);
        }
      }, 800);
    }
  }

  function updateDisplay() {
 $(".countLetters").html(padString(countNumber.toString()));
  }
  
  function padString(str) {
    if (str.length < 2) {
      return "0" + str;
    }
    return str;
  }
});