$(document).ready(function () {
  $('#tab1').prop('checked', true);


  $('.menu-btn').on('click', function () {
    $('.sidebar').toggleClass('sidebar-hidden');
    $('.right_unit').toggleClass('right_unit-hidden');
    // console.log("eevev");
    $('.wrap_unit_login').toggleClass('wrap_unit_login-hidden');
    // $('.unit_login').toggleClass('unit_login-hidden');
    $('.sidebar_menu_list').toggleClass('menu_list-hidden');
    $('.menu-btn').toggleClass('menu-btn_active');
    // $('.wrap_menu-btn').toggleClass('wrap_menu-btn_active');
    // $('.menu-lable_hidden').toggleClass('menu-lable_visible');
    // $('.content_unit').toggleClass('content_unit-ext');
  });


  $('#sub_menu_1-1').on('click', function () {
    $('#tab1').prop('checked', true);
  });
  $('#sub_menu_1-2').on('click', function () {
    $('#tab2').prop('checked', true);
  });
  $('#sub_menu_1-3').on('click', function () {
    $('#tab3').prop('checked', true);
  });


  $('#sub_menu_2-1').on('click', function () {
    $('#tab1').prop('checked', true);
  });
  $('#sub_menu_2-2').on('click', function () {
    $('#tab2').prop('checked', true);
  });


  $('#sub_menu_3-1').on('click', function () {
    $('#tab1').prop('checked', true);
  });
  $('#sub_menu_3-2').on('click', function () {
    $('#tab2').prop('checked', true);
  });


  $('#sub_menu_4-1').on('click', function () {
    $('#tab1').prop('checked', true);
  });
  $('#sub_menu_4-2').on('click', function () {
    $('#tab2').prop('checked', true);
  });


});








