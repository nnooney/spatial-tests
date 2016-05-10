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
  var ratio;
  function showBuilding() {
    bldgName.innerHTML = BLDG_DATA[bldgArray[0]-1].name;
    currentBuilding.setAttribute('src', BLDG_DATA[bldgArray[0]-1].imgPath);
    bldgStartTime = Date.now();
    bldgRot = Math.floor(Math.random() * 8) * 45;
    drawBuilding();
  }

  // The function that repositions the image of the building based upon the
  // mouse movement
  var bldgName = document.querySelector('#bldgName');
  var currentBuilding = document.querySelector('#currentBuilding');
  function drawBuilding() {

    // Calculate the scaled ratio for the buildings
    var imgStyle = window.getComputedStyle(currentBuilding);
    var style = window.getComputedStyle(bldgMap);
    ratio = parseInt(style.width) / 700; // 700 is the width of the regular image

    // Reposition the current building image
    currentBuilding.style.transform = 'scale(' + ratio + ') rotate(' + bldgRot + 'deg)';
    currentBuilding.style.left = (bldgX - parseInt(imgStyle.width)*ratio) + 'px';
    currentBuilding.style.top = (bldgY - parseInt(imgStyle.height)*ratio) + 'px';
  }

  function moveBuilding(e) {
    var boundingRect = bldgContainer.getBoundingClientRect();
    bldgX = e.pageX - boundingRect.left;
    bldgY = e.pageY - boundingRect.top;
    drawBuilding();
  }

  function rotateBuilding(e) {
    if (e.keyCode == 82) {
      bldgRot = (bldgRot + 45) % 10800;
      drawBuilding();
    }
  }

  // Function to record to local storage the data
  function recordBldg(guessX, guessY) {
    var time = Date.now() - bldgStartTime;
    var trialNum = bldgArray.shift();

    localStorage[pid + '.bldg.' + trialNum + '.guess.rot'] = Math.floor(bldgRot/45) % 8;
    localStorage[pid + '.bldg.' + trialNum + '.guess.x'] = guessX;
    localStorage[pid + '.bldg.' + trialNum + '.guess.y'] = guessY;

    localStorage[pid + '.bldg.' + trialNum + '.actual.x'] = Math.floor(BLDG_DATA[trialNum-1].locX * ratio);
    localStorage[pid + '.bldg.' + trialNum + '.actual.y'] = Math.floor(BLDG_DATA[trialNum-1].locY * ratio);

    localStorage[pid + '.bldg.' + trialNum + '.time'] = time;

    if (bldgArray.length == 0) {
      document.body.removeEventListener('mousemove', moveBuilding);
      document.body.removeEventListener('keydown', rotateBuilding);
      btn8.removeAttribute('disabled');
      currentBuilding.style.display = 'none';
      bldgName.innerHTML = 'Finished!';
    } else {
      showBuilding();
    }
  }

  // Add an event listener to the map for the buildings
  var bldgMap = document.querySelector('#bldgMap');
  var bldgContainer = document.querySelector('#bldgContainer');
  bldgContainer.addEventListener('mousedown', placeBuilding);

  function placeBuilding(e) {
    var boundingRect = bldgContainer.getBoundingClientRect();
    var placedImg = document.createElement('img');
    placedImg.src = currentBuilding.src;
    placedImg.style.position = 'absolute';
    placedImg.style.top = currentBuilding.style.top;
    placedImg.style.left = currentBuilding.style.left;
    placedImg.style.transform = currentBuilding.style.transform;
    placedImg.style.transformOrigin = 'left top';
    placedImg.classList.add('placedBldg');

    bldgContainer.insertBefore(placedImg, bldgName);

    recordBldg(e.offsetX, e.offsetY);
  };

  // Button 8 (Building Task) should be disabled until the test is over.
  var btn8 = document.querySelector('#btn-8');
  btn8.addEventListener('click', function(e) {
    localStorage[pid + '.bldg.completed'] = 'T';
  })

  // Button 9 (Story Info) should begin the story collection process
  var btn9 = document.querySelector('#btn-9');
  btn9.addEventListener('click', function(e) {

    var stryArray = [];
    for (var i=1; i<=5; i++) {
      stryArray.push(i);
    }
    shuffle(stryArray);

    var storyScreen = document.querySelector('#storyScreen');
    var mapScreen = document.querySelector('#mapScreen');
    var traceBtn = document.querySelector('#beginTrace');
    var clearBtn = document.querySelector('#clearCanvas');
    var nextBtn = document.querySelector('#stryButton');
    var storyText = document.querySelector('#storyText');
    var stryMap = document.querySelector('#stryMap');
    var stryCanvas = document.querySelector('#stryCanvas');
    var context = stryCanvas.getContext('2d');

    var readTime, drawTime;
    var tracePath = [];
    var renderID;

    function showStory() {
      mapScreen.style.display = 'none';
      storyScreen.style.display = 'block';
      storyText.innerHTML = STORY_DATA[stryArray[0]-1].story;
      readTime = Date.now();
    }

    function recordStory() {
      var time = Date.now() - drawTime;
      cancelAnimationFrame(renderID);
      var trialNum = stryArray.shift();

      localStorage[pid + '.stry.' + trialNum + '.guess.path'] = tracePath;
      localStorage[pid + '.stry.' + trialNum + '.actual.path'] = STORY_DATA[trialNum-1].path;
      localStorage[pid + '.stry.' + trialNum + '.drawTime'] = time;

      tracePath = [];

      if (stryArray.length == 0) {
        mapScreen.style.display = 'none';
        btn10.removeAttribute('disabled');
      } else {
        showStory();
      }
    }

    function render() {
      context.clearRect(0, 0, 9999, 9999);

      for (var i=0; i<tracePath.length; i++) {
        context.beginPath();
        context.fillStyle = 'red';
        context.arc(tracePath[i][0], tracePath[i][1], 5, 0, 2 * Math.PI, false);
        context.fill();

        if (i != 0) {
          context.beginPath();
          context.moveTo(tracePath[i-1][0], tracePath[i-1][1]);
          context.lineTo(tracePath[i][0], tracePath[i][1]);
          context.strokeStyle = 'blue';
          context.stroke();
        }
      }

      renderID = requestAnimationFrame(render);
    }

    traceBtn.addEventListener('click', function(e) {
      mapScreen.style.display = 'block';
      storyScreen.style.display = 'none';

      var time = Date.now() - readTime;
      localStorage[pid + '.stry.' + stryArray[0] + '.readTime'] = time;

      stryCanvas.width = stryMap.offsetWidth;
      stryCanvas.height = stryMap.offsetHeight;

      renderID = requestAnimationFrame(render);
      drawTime = Date.now();
    });

    clearBtn.addEventListener('click', function(e) {
      tracePath = [];
    });

    nextBtn.addEventListener('click', recordStory);

    stryCanvas.addEventListener('click', function(e) {
      tracePath.push([e.offsetX, e.offsetY]);
    });

    showStory();
  });

  // Button 10 (Story Task) should be disabled until the test is over.
  var btn10 = document.querySelector('#btn-10');
  btn10.addEventListener('click', function(e) {
    localStorage[pid + '.stry.completed'] = 'T';
  });

  // Button 11 (Image Instructions)
  var btn11 = document.querySelector('#btn-11');
  btn11.addEventListener('click', function(e) {

    var imgArray = [];
    for (var i=1; i<=10; i++) {
      imgArray.push(i);
    }
    shuffle(imgArray);

    var qImage = document.querySelector('#qImage');
    var question = document.querySelector('.question');
    var imgAnswer = document.querySelector('#imgAnswer');
    var imgSubmit = document.querySelector('#imgSubmit');

    var startTime;

    function showImage() {
      qImage.setAttribute('src', IMG_DATA[imgArray[0]-1].imgPath);
      question.innerHTML = IMG_DATA[imgArray[0]-1].question;

      imgAnswer.value = '';

      startTime = Date.now();
    }

    function recordImage() {
      var time = Date.now() - startTime;
      var trialNum = imgArray.shift()

      localStorage[pid + '.img.' + trialNum + '.question'] = question.innerHTML;
      localStorage[pid + '.img.' + trialNum + '.answer'] = imgAnswer.value;
      localStorage[pid + '.img.' + trialNum + '.time'] = time;

      if (imgArray.length == 0) {
        qImage.style.display = 'none';
        imgSubmit.style.display = 'none';
        imgAnswer.style.display = 'none';
        question.innerHTML = 'Finished!';

        btn12.removeAttribute('disabled');
      } else {
        showImage();
      }
    }

    imgSubmit.addEventListener('click', recordImage);

    showImage();
  });

  // Button 12 (Image Task) should be disabled until the test is over.
  var btn12 = document.querySelector('#btn-12');
  btn12.addEventListener('click', function(e) {
    localStorage[pid + '.img.completed'] = 'T';
  });

  // Button 14 collects the results of the post survey then sends all of the
  // data to the server
  var btn14 = document.querySelector('#btn-14');
  btn14.addEventListener('click', function(e) {

    var easyRadio = document.querySelectorAll('input[name="easyTask"]');
    for (var i=0; i<easyRadio.length; i++) {
      if (easyRadio[i].checked) {
        localStorage[pid + '.post.easy'] = easyRadio[i].value;
      }
    }

    var hardRadio = document.querySelectorAll('input[name="hardTask"]');
    for (var i=0; i<hardRadio.length; i++) {
      if (hardRadio[i].checked) {
        localStorage[pid + '.post.hard'] = hardRadio[i].value;
      }
    }

    var skillRadio = document.querySelectorAll('input[name="postBelief"]');
    for (var i=0; i<skillRadio.length; i++) {
      if (skillRadio[i].checked) {
        localStorage[pid + '.post.skill'] = skillRadio[i].value;
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
