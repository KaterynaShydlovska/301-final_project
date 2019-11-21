let beg = 1;

let swap = function () {
  if (beg === 4) {
    beg = 1;
  }
  $('div.one').css('background-image', 'url(\'img/example' + beg + '.jpeg\')');
  beg++;
  // console.log($(beg));
  setTimeout(swap, 4000);
};

$(document).ready(swap());
