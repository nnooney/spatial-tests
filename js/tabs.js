document.addEventListener('DOMContentLoaded', function(e) {
  var sections = document.querySelectorAll('section');
  sections[0].classList.add('active');

  var buttons = document.querySelectorAll('.nextSection');
  for (var i=0; i<buttons.length; ++i) {
    buttons[i].addEventListener('click', function(e) {
      var numSections = 15,
        cur = parseInt(e.target.id.split('-')[1], 10);

      sections[cur-1].classList.remove('active');
      sections[cur%numSections].classList.add('active');
    });
  }
});
