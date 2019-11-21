'use strict';

$('li').hover(function () {
  $(this).css('background-color', 'rgba(171, 205, 239, 0.5)');
}, function () {
  $(this).css('background-color', '');
});

$(document).ready(function(){
  let liWidth = $('.eventList').width();
  $('.eventList').mouseenter(function(){
    $(this).animate({
      width: '600',
    });
  }).mouseleave(function(){
    $(this).animate({
      width: liWidth,
    });
  });
});
