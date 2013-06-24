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
  //This script extracts parameters from the URL
  //from jquery-howto.blogspot.com
  
      $.extend({
        getUrlVars : function() {
            var vars = [], hash;
            var hashes = window.location.href.slice(
                    window.location.href.indexOf('?') + 1).split('&');
            for ( var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },
        getUrlVar : function(name) {
            return $.getUrlVars()[name];
        }
    });


$(function() {

var WORKOUT_TIME, BREAK_TIME, EXERCISES;
// determine exercise program
program = $.getUrlVar('program');
if(program == 'debug'){
  WORKOUT_TIME = 5;
  BREAK_TIME = 2;
  EXERCISES = ["Jumping Jacks", "Wall sit", "Push Up"];
}else if (program == 'booty'){
  // STOMACH, LOWER BODY WORKOUT
  BREAK_TIME = 10;  
  WORKOUT_TIME = 30;
  EXERCISES = ["Jumping Jacks", "Wall sit", "wall climb", "Abdominal Crunch", "leg lifts", "Squats", "ab twists", "Plank", "High Knees", "Lunges", "butt lifts", "Side Planks"];
}else{
  WORKOUT_TIME = 30;
  BREAK_TIME = 10;
  EXERCISES = ["Jumping Jacks", "Wall sit", "Push Up", "Abdominal Crunch", "Step-up onto Chair", "Squats", "Triceps dip on chair", "Plank", "High Knees", "Lunges", "Push-up and Rotation", "Side Planks"];
}

  var State = {
              START:0,
              ACTIVE:1,
              REST:2,
              PAUSED:3,
              COMPLETE:4
              };
              
  var state = State.START;
  var timer = setInterval(function(){update()}, 1000);
  var workout_time = WORKOUT_TIME;
  var total = 0;
  var exercise_ptr = 0;
  var pause_active = false; 
  
  $("#bottom_frame").hide();
  $("#next_exercise").hide();
   
  function update(){
    switch(state){
      case(State.ACTIVE):
        if(workout_time==0){
          state = State.REST;
          workout_time= BREAK_TIME;
          update_time();
          start_rest();
        }else{
          workout_time--;
          total++;
          update_time();
        }
        break;
      case(State.REST):
        console.log("resting, time is" + workout_time);
        if(workout_time==0){
          state=State.ACTIVE;
          workout_time = WORKOUT_TIME;
          exercise_ptr++;
          start_exercise();
        }else{
          workout_time--;
          total++;
          update_time();
          }
          
      break;
      case(State.PAUSED):
          console.log("paused, exercise pointer is " + exercise_ptr);
          break;
      default:
        console.log("default case" + state);
        break;
        
      }
      
    }
  $("#main_frame").click(function(){
    pause_active = (state == State.ACTIVE);
    state = State.PAUSED;
    console.log("state is  : " + state);
    $("#transparent_overlay").show().text("Paused.  Click to Resume");
    
    });
    

  $("#transparent_overlay").click(function(){
    switch(state){
      case(State.START):
        state = State.ACTIVE;
       $("#top_header").show();
       $("#exercise_name").show();  
       start_exercise();    
      break;
      case(State.PAUSED):
        if (pause_active){
          console.log("return to active state");
          state = State.ACTIVE;
        }else{
          console.log("return to rest state");
          state = State.REST;
          }
      break;
      case(State.COMPLETE):
        state = State.ACTIVE;
        exercise_ptr = 0;
        start_exercise();
      break;
      default:
        console.log("transparent overaly default");
        break;
        }
        $("#transparent_overlay").hide();
    });
    
  function start_exercise(){
    if(exercise_ptr == EXERCISES.length){
      state = State.COMPLETE;
      $("#transparent_overlay").show().html("You have finished your exercise! <br> Total Workout Time: " + getTimeString(1000*total) + " <br> Click the screen to restart the workout");
      }
    workout_time =WORKOUT_TIME;
    $("#countdown").text(""+workout_time);
    $("#exercise_name").text(EXERCISES[exercise_ptr]);
    $("#next_exercise").hide();
    //$("#exercise_graphic").text(EXERCISES[exercise_ptr] + " graphic" );
  }
  
  function start_rest(){
    $("#exercise_name").text("Rest");
   // $("#exercise_graphic").text("Rest graphic");
   if(exercise_ptr == EXERCISES.length -1)
    next_exercise_str = "You're done!"
   else 
   next_exercise_str = "Next Exercise: " + EXERCISES[exercise_ptr + 1];
   $("#next_exercise").show().text(next_exercise_str);
  
  }
  function getTimeString(date){
    d = new Date(date);
    sec = d.getSeconds();
    min = d.getMinutes();
    hr = d.getHours() - 19;
    total_str = (hr < 10? "0":"")+hr+":"+(min < 10? "0":"")+min +":"+ (sec < 10 ? "0":"")+sec;
    return total_str;
  }
  function update_time(){
    $("#countdown").text(""+workout_time);
    total_str = getTimeString(1000*total);
    console.log(total_str);
    $("#total_time").text(total_str);
    
  }
  

});


