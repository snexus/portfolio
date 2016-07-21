// Some globals
var display = "";
var answer = "";
var maxCharOnScreen = 16;
// Ready function
$(document).ready(function() {
  //updateDisplay()
  $(".button").on("click",
      buttonClicked);
});

function buttonClicked()
{ 
  var isDisplayed = ".01234566789*+-()/"
  var keyPressed = $(this).attr('id');
  console.log(keyPressed);
  answer="";
  if (isDisplayed.indexOf(keyPressed)!=-1)
    {   
      display+=keyPressed;
    }
  else
    {
      switch (keyPressed) {
          case "=":
              try {
                      answer = eval(display); 
                  } 
               catch (e) {
                      if (e instanceof SyntaxError) {
                          answer="ERROR"; }
                    
                  }
                console.log(answer);
                break;
          case "C":
             display="";
       
             break;
          case "BCK":
             if (display.length>0)
               {
                 display = display.slice(0,-1);
               }        
      }            
    }
  updateDisplay();
}

function updateDisplay()
{
  displayString = display;
  if (displayString.length > maxCharOnScreen)
    {
      displayString = display.slice(displayString.length - maxCharOnScreen)
    }
  $("#disp").html(displayString);
  $(".answer").html(answer);
}
