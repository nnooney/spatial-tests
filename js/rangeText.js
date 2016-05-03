document.addEventListener('DOMContentLoaded', function(e) {
  var dirText = document.querySelector('#dirText'),
    yearText = document.querySelector('#yearText'),
    courseText = document.querySelector('#courseText'),
    dirRange = document.querySelector('#dirRange'),
    yearRange = document.querySelector('#yearRange'),
    courseRange = document.querySelector('#courseRange');

  dirRange.addEventListener('input', function(e) {
    var text;
    switch (e.target.value) {
      case '1':
        text ='very poor';
        break;
      case '2':
        text = 'poor';
        break;
      case '3':
        text = 'average';
        break;
      case '4':
        text = 'good';
        break;
      case '5':
        text = 'very good';
        break;
    }
    dirText.innerHTML = text;
  });
});
