// Provides button validation for searching for users.

document.addEventListener('DOMContentLoaded', function(e) {

  // Global Variables
  var pid = '';

  // Button 2: Register / Login
  var btn2msg = document.querySelector('#btn-2-msg');
  var btn2 = document.querySelector('#btn-2');
  var sec2fields = document.querySelectorAll('.participantID');

  // Don't allow entry of Button 2 until all fields are filled in
  for (var i=0; i<sec2fields.length; i++) {
    sec2fields[i].addEventListener('input', function(e) {
      for (var j=0; j<sec2fields.length; j++) {
        if (sec2fields[j].value == "") {
          btn2.setAttribute("disabled", "disabled");
          btn2msg.style.visibility = "visible";
          return;
        }
      }
      btn2.removeAttribute("disabled");
      btn2msg.style.visibility = "hidden";
    });
  }

  // Button 2 needs to perform a lookup to create a registration
  btn2.addEventListener('click', function(e) {
    // Assemble the participantID
    for (var i=0; i<sec2fields.length; i++) {
      pid += sec2fields[i].value;
    }
    pid = pid.toLowerCase();
    var userID = document.querySelector('#userID');
    userID.innerHTML = "Participant: " + pid;

    // A helper function for changing the active section
    function changeActiveSection(num) {
      var sections = document.querySelectorAll('section');
      for (var i=0; i<sections.length; i++) {
        sections[i].classList.remove('active');
      }
      sections[num-1].classList.add('active');
    }

    // Check to see if this user has already created an account
    if (localStorage[pid + '.pre.completed'] == 'T') {
      // Take them to the most recent uncompleted section
      if (localStorage[pid + '.mrt.completed'] != 'T') {
        changeActiveSection(4);
      } else if (localStorage[pid + '.bldg.completed'] != 'T') {
        changeActiveSection(7);
      } else if (localStorage[pid + '.stry.completed'] != 'T') {
        changeActiveSection(9);
      } else if (localStorage[pid + '.img.completed'] != 'T') {
        changeActiveSection(11);
      } else if (localStorage[pid + '.post.completed'] != 'T') {
        changeActiveSection(13);
      } else {
        changeActiveSection(15);
      }
    }
  });

  // Button 15 (Start Over) should clear the participant ID in the header
  var btn15 = document.querySelector('#btn-15');
  btn15.addEventListener('click', function(e) {
    var userID = document.querySelector('#userID');
    userID.innerHTML = '';
  });
});
