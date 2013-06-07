/*
  index.js
  Author: ariel anders
  
  The MIT License (MIT)

Copyright (c) 2013 Ariel Anders 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
$(function() {


var DEBUG  = false;

// constants
var WORKOUT_TIME, BREAK_TIME, EXCERSIZES;
if(DEBUG){
  WORKOUT_TIME = 2;
  BREAK_TIME = 1;
  EXCERSIZES = ["Jumping Jacks", "Wall sit", "Push Up"];
}else{
  WORKOUT_TIME = 30;
  BREAK_TIME = 10;
  EXCERSIZES = ["Jumping Jacks", "Wall sit", "Push Up", "Abdominal Crunch", "Step-up onto Chair", "Squats", "Triceps dip on chair", "Plank", "High Knees", "Lunges", "Push-up and Rotation", "Side Planks"];
}

// globals
var timer, total=0, execution_time, excersize_ptr=-1, break_mode=false, paused=true, started=false;
var timer_text = $("#workout_timer");
var total_text = $("#total_time");
var workout_image = $("#workout_image");

$("#workout_container").hide();
//$("#reset").hide();

$("#start_workout").click(function(){
  $(".text_container").remove();
  $("#workout_container").show();
  timer = setInterval(function(){tick()}, 100); // Call tick every second
  mode_change();
  $("#back").attr('disabled', 'disabled');

});

$("#play").click(function(e){
 /* if(!started){
    $("#reset").show();
    started = true;
  }*/
  if(paused){
    e.target.textContent = "pause"
  }else{
    e.target.textContent = "resume"
    }
    
    
  paused = !paused;
});

$("#restart").click(function(){
  execution_time = WORKOUT_TIME;
  excersize_ptr = -1;
  break_mode= false;
  mode_change();
  paused = true;
  $("#play").text("start");

});

function mode_change(){
  if(!started){
    timer_text.show();
    started=true;
    }
  timer_text.text("");
  clearInterval(timer);
  
  if (break_mode){
    execution_time = BREAK_TIME;
    workout_image.text("REST");
    timer_text.text(BREAK_TIME +"");
    
    timer_text.switchClass("active","rest");
    workout_image.switchClass("active","rest");
    
  }else{
    $("#back").removeAttr('disabled');
    $("#forward").removeAttr('disabled');


    excersize_ptr++;
    execution_time = WORKOUT_TIME;
    timer_text.switchClass("rest","active");
    workout_image.switchClass("rest","active");
    workout_image.text(EXCERSIZES[excersize_ptr]);
    timer_text.text(WORKOUT_TIME +"");
    if(excersize_ptr == EXCERSIZES.length ){
      break_mode = true;
      paused = true;
      excersize_ptr = -1;
      workout_ended();
      $("#forward").attr('disabled', 'disabled');
    }else if(excersize_ptr == 0)
      $("#back").attr('disabled', 'disabled');
    }
    
    
    
      timer = setInterval(function(){tick()}, 1000); // Call tick every second
       console.log("mode change, pointer is" + excersize_ptr);
     
  }



function tick(){
if(!paused){
    // increment count
    total++;
    execution_time--;
    
    // print counts to screen
    timer_text.text(execution_time +"");
    d = new Date(total*1000);
    if (d.getMinutes() == 0)
      total_text.text("Total Workout time: " + d.getSeconds() +" seconds");
    else
      total_text.text("Total Workout time: " + d.getMinutes() + " minutes");
      
    // change mode if necessary
    if(execution_time == -1){
      break_mode = !break_mode;
      mode_change();
      }
    }
}


function workout_ended(){
  workout_image.text("Yo done!");
  $("#play").attr("disabled","disabled");
  timer_text.hide();
  started=false;
  }

$("#back").click(function(){
  console.log(excersize_ptr)
  if(excersize_ptr == -1)
    excersize_ptr = EXCERSIZES.length -2;
  else
    excersize_ptr-=2; 
  navigate();
  if(!started){
    timer_text.show();
    started = true;
    }
  $("#play").removeAttr('disabled');
  });

$("#forward").click(function(){
    navigate();
  });
  
  function navigate(){
    break_mode = false;
    mode_change();
  }

$("#reset").click(function(){
  total = 0;
  total_text.text("Total Workout time: 0 seconds");
  execution_time = WORKOUT_TIME;
  excersize_ptr = -1;
  break_mode= false;
  mode_change();
  paused = true;
  $("#play").text("start");
  });
});


