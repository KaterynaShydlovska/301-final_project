let beg = 1;

let swap = function () {
  if (beg === 4) {
    beg = 1;
  }
  $('#search-form').css('background-image', 'url(\'img/example' + beg + '.jpg\')');
  $('#search-form').css('background-repeat', 'no-repeat');
  $('#search-form').css('background-size', '100%');
  beg++;
  // console.log($(beg));
  setTimeout(swap, 4000);
};

$(document).ready(swap());
