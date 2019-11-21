'use strict';

$('.parades').hide();
$('.parades').next().on('click', function () {
  $(this).prev().toggle();
  $(this).prev().prev().prev().toggle();
})

// $(document).ready(function(){
//   let liWidth = $('.eventList').width();
//   $('.eventList').mouseenter(function(){
//     $(this).animate({
//       width: '600',
//     });
//   }).mouseleave(function(){
//     $(this).animate({
//       width: liWidth,
//     });
//   });
// });
