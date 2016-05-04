// Provides button validation for searching for users.

document.addEventListener('DOMContentLoaded', function(e) {

  // Global Variables
  var pid = '';

  // Button 2: Register / Login
  var btn2msg = document.querySelector('#btn-2-msg');
  var btn2 = document.querySelector('#btn-2');
  var sec2fields = document.querySelectorAll('.participantID');

  // A Helper Function to Shuffle an Array
  function shuffle(arr) {
    var cIndex = arr.length,
      temp,
      rIndex;

    while (cIndex !== 0) {
      rIndex = Math.floor(Math.random() * cIndex);
      cIndex -= 1;

      temp = arr[cIndex];
      arr[cIndex] = arr[rIndex];
      arr[rIndex] = temp;
    }
  }

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

  // Button 3 (Pre Survey) needs to store the results of the survey data
  var btn3 = document.querySelector('#btn-3');
  btn3.addEventListener('click', function(e) {
    // Save the completed state to localStorage
    localStorage[pid + '.pre.completed'] = 'T';

    // Save the parts of the pre-test survey
    localStorage[pid + '.pre.directions'] = document.querySelector('#dirRange').value;
    localStorage[pid + '.pre.years'] = document.querySelector('#yearRange').value;
    localStorage[pid + '.pre.course'] = document.querySelector('#courseRange').value;
    localStorage[pid + '.pre.building'] = document.querySelector('#bldgSelect').value;
    localStorage[pid + '.pre.gender'] = document.querySelector('#genderSelect').value;

    var roles = document.querySelectorAll('input[name="participantCategory"]');
    for (var i=0; i<roles.length; i++) {
      localStorage[pid + '.pre.role.' + roles[i].value] = (roles[i].checked ? 'T' : 'F');
    }

    var races = document.querySelectorAll('input[name="participantRace"]');
    for (var i=0; i<races.length; i++) {
      localStorage[pid + '.pre.race.' + races[i].value] = (races[i].checked ? 'T' : 'F');
    }
  });

  // The mental rotation task begin button facilitates running the test
  var mrtbtn = document.querySelector('#mrtBegin');
  mrtbtn.addEventListener('click', function(e) {

    // Handle to the image that shows the trial
    var mrtImage = document.querySelector('#mrtImage');

    // Timer to keep track of the time each trial took
    var startTime;

    // Build the random order of trials that will be seen
    var trialArray = [];
    for (var i=1; i<=30; i++) {
      trialArray.push(i);
    }
    shuffle(trialArray);
    localStorage[pid + '.mrt.order'] = trialArray.join();


    function showTrial() {
      mrtImage.setAttribute('src', MRT_DATA[trialArray[0]-1].imgPath);
      startTime = Date.now();
    }

    function record(letter) {
      var time = Date.now() - startTime;
      var trialNum = trialArray.shift();

      localStorage[pid + '.mrt.' + trialNum + '.guess'] = letter;
      localStorage[pid + '.mrt.' + trialNum + '.actual'] = MRT_DATA[trialNum-1].actual;
      localStorage[pid + '.mrt.' + trialNum + '.time'] = time;

      if (trialArray.length == 0) {
        document.body.removeEventListener('keydown', submitAnswer);
        btn6.removeAttribute('disabled');
        mrtImage.style.display = 'none';
      } else {
        showTrial();
      }
    }

    function submitAnswer(e) {
      switch (e.keyCode) {
        case 70: // F
          record('f');
          break;
        case 74: // J
          record('j');
          break;
      }
    }

    document.body.addEventListener('keydown', submitAnswer);

    mrtbtn.style.display = 'none';
    showTrial();
  });

  // Button 6 (Mental Rotation Task) should be disabled until the test is over.
  var btn6 = document.querySelector('#btn-6');
  btn6.addEventListener('click', function(e) {
    localStorage[pid + '.mrt.completed'] = 'T';
  });

  // Button 7 (Start of Building Task) should add a listener for mousemove
  var btn7 = document.querySelector('#btn-7');
  btn7.addEventListener('click', function(e) {
    document.body.addEventListener('mousemove', moveBuilding);
    document.body.addEventListener('keydown', rotateBuilding);
    localStorage[pid + '.bldg.order'] = bldgArray.join();
    showBuilding();
  });

  // Build the random order of trials that will be seen
  var bldgArray = [];
  for (var i=1; i<=15; i++) {
    bldgArray.push(i);
  }
  shuffle(bldgArray);

  // The function that chooses the next building to show
  var bldgStartTime;
  var bldgRot, bldgX, bldgY;
  function showBuilding() {
    currentBuilding.setAttribute('src', BLDG_DATA[bldgArray[0]-1].imgPath);
    bldgStartTime = Date.now();
    bldgRot = Math.floor(Math.random() * 8) * 45;
    drawBuilding();
  }

  // The function that repositions the image of the building based upon the
  // mouse movement
  var currentBuilding = document.querySelector('#currentBuilding');
  function drawBuilding(e) {

    // Calculate the scaled ratio for the buildings
    var imgStyle = window.getComputedStyle(currentBuilding);
    var style = window.getComputedStyle(bldgMap);
    var ratio = parseInt(style.width) / 700; // 700 is the width of the regular image
    console.log(bldgRot);
    // Reposition the current building image
    currentBuilding.style.transform = 'scale(' + ratio + ') rotate(' + bldgRot + 'deg)';
    currentBuilding.style.left = (bldgX - parseInt(imgStyle.width)) + 'px';
    currentBuilding.style.top = (bldgY - parseInt(imgStyle.height)) + 'px';
  }

  function moveBuilding(e) {
    bldgX = e.clientX;
    bldgY = e.clientY;
    drawBuilding();
  }

  function rotateBuilding(e) {
    if (e.keyCode == 82) {
      bldgRot = (bldgRot + 45) % 360;
      drawBuilding();
    }
  }

  // Add an event listener to the map for the buildings
  var bldgMap = document.querySelector('#bldgMap');
  bldgMap.addEventListener('mousedown', function(e) {
    // Offset X and Y are the coordinates of the mouse click in the image
    console.log('placed!', e.offsetX, e.offsetY);
  });

  // Button 8 (Building Task) should be disabled until the test is over.
  var btn8 = document.querySelector('#btn-8');
  btn8.addEventListener('click', function(e) {
    document.body.removeEventListener('mousemove', moveBuilding);
    document.body.removeEventListener('keydown', rotateBuilding);
    localStorage[pid + '.bldg.completed'] = 'T';
  })

  // Button 15 (Start Over) should clear the participant ID in the header
  var btn15 = document.querySelector('#btn-15');
  btn15.addEventListener('click', function(e) {
    var userID = document.querySelector('#userID');
    userID.innerHTML = '';
  });
});
