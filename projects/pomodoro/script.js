//globals definition
var clockMin = 0;
var clockSec = 10;
var sessionDuration = 3;
var breakDuration = 2;
var isRunning = false;
var totalTime = 180;;
var interval;
var currentMode = "Session";
var currentWidth = -1;
//document ready
$(document).ready(function() {
  //updateDisplay()
  $(".clock").on("click",
    clockClicked);
  $("#reset").on("click",
    resetClicked);
  updateClock();
  $("#decreaseSessionLength").on("click",
    decreaseSessionLength);
  $("#increaseSessionLength").on("click",
    increaseSessionLength);
  $("#decreaseBreakLength").on("click",
    decreaseBreakLength);
  $("#increaseBreakLength").on("click",
    increaseBreakLength);
});

function resetClicked() {
  isRunning = false;
  resetIndicator();
  clearInterval(interval);
  totalTime = sessionDuration * 60;
  currentMode = "Session";
  updateClock();
}

function decreaseBreakLength() {
  changeBreakLength(function() {
    if (breakDuration > 1) {
      breakDuration -= 1;
    }
  });
}

function increaseBreakLength() {

  changeBreakLength(function() {
    if (breakDuration < 99) {
      breakDuration += 1;
    }
  });
}

function changeBreakLength(fun) {
  if (!isRunning) {
    console.log(breakDuration);
    fun();

    $("#breakLength").html(padString(breakDuration.toString()));
  }
}

function decreaseSessionLength() {
  changeSessionLength(function() {
    if (sessionDuration > 1) {
      sessionDuration -= 1;
    }
  });
}

function increaseSessionLength() {
  changeSessionLength(function() {
    if (sessionDuration < 99) {
      sessionDuration += 1;
    }
  });
}

function changeSessionLength(fun) {
  if (!isRunning) {
    currentMode = "Session";
    fun();
    currentWidth = -1;
    $("#sessionLength").html(padString(sessionDuration.toString()));
    resetClicked();
    totalTime = sessionDuration * 60;
    updateClock();
    animateClock();
  }
}

function clockClicked() {
  isRunning = !isRunning
  totalTime = clockMin * 60 + clockSec;
  //startIndicator();
  console.log("start with time =", totalTime)

  if (isRunning) {
    startIndicator();
    interval = setInterval(intervalFunction, 1000);
  } else {
    clearInterval(interval);
    pauseIndicator();

  }

}

function intervalFunction() {

  totalTime -= 1;
  updateClock();
  if (totalTime <= 0) {
    if (currentMode == "Session") {
      totalTime = breakDuration * 60;
      currentMode = "Break";
    } else {
      totalTime = sessionDuration * 60;
      currentMode = "Session";
    }
    currentWidth = -1;
    resetIndicator();
    startIndicator();

  }

}
//flipInX
function updateClock() {
  clockMin = Math.floor(totalTime / 60);
  clockSec = totalTime % 60;
 
  console.log("inside update clock ", clockMin, clockSec);
  $("#clock").html(padString(clockMin.toString()) + '<span class="smallText">m</span>' + padString(clockSec.toString())+'<span class="smallText">s</span>');
  

  $(".currentMode").html(currentMode);

}

function animateClock()
{
   $('#clock').removeClass('flipInX');
  setTimeout(
    function() {
      $("#clock").addClass("flipInX")
    }, 50);
}

function padString(str) {
  if (str.length < 2) {
    return "0" + str;
  }
  return str;
}

function startIndicator() {

  if (currentWidth == -1) {
    $("#indic").css({
      width: '10px',
      left: '20%',
      transition: '1s',
      opacity: '0.8'
    });
  }
  setTimeout(function() {
    console.log("totaltime = ", totalTime.toString() + 's');
    //$("#indic").removeClass("narrowLeft");
    //$("#indic").addClass("wide");
    $("#indic").css({
      width: '90px',
      transition: totalTime.toString() + 's linear'
    });

           

  }, 1000);

}

function resetIndicator() {

  element = document.getElementById("indic")
    //  stopAnimation(element)
    // element.style.webkitTransition = 'all 0s linear 0s';
  $('#indic').each(function() {
    stopAnimation(this);
  });

  $("#indic").css({
      width: '10px',
      left: '50%',
      opacity: '0.4',
      transition: '0s'
    })
    //   $("#indic").css({width:'10px',left:'20%',transition:'1s'})
    //  $("#indic").addClass("narrow");
animateClock();
}

function pauseIndicator() {
  currentWidth = $('#indic').css("width")
    //$("#indic").removeClass("wide");

  $("#indic").css({
    width: currentWidth,
    transition: '0s'
  })

}

function stopAnimation(element) {
  $(element).css("-webkit-transition", "none");
  $(element).css("-moz-transition", "none");
  $(element).css("-ms-transition", "none");
  $(element).css("transition", "none");
}