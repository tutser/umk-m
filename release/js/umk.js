$(document).ready(function () {
  // $('#tab1').prop('checked', true);

  // document.querySelector('.menu-icon-wrapper').onclick = function () {
  //   document.querySelector('.menu-icon').classList.toggle('menu-icon-active');
  //   document.querySelector('.wrap_sidebar_menu-hidden').classList.toggle('wrap_sidebar_menu-visible');
  //   document.querySelector('.index_p').classList.toggle('index_p-transparent');

  // }


  $('.menu-icon-wrapper').on('click', function () {
    // $(".list_docs").css("opacity", "0.5");
    $('.list_docs').toggleClass('list_docs-opacity');

    $('.menu-icon').toggleClass('menu-icon-active');
    $('.wrap_sidebar_menu-hidden').toggleClass('wrap_sidebar_menu-visible');
    $('.index_p').toggleClass('index_p-transparent');
    $('.display_off').toggleClass('.display_on');



    // console.log("eevev");
    // $('.wrap_unit_login').toggleClass('wrap_unit_login-hidden');
    // $('.unit_login').toggleClass('unit_login-hidden');
    // $('.sidebar_menu_list').toggleClass('menu_list-hidden');
    // $('.menu_btn').toggleClass('menu_btn-close');
    // $('.wrap_menu_btn').toggleClass('wrap_menu_btn-close');
    // $('.menu-lable_hidden').toggleClass('menu-lable_visible');
    // $('.content_unit').toggleClass('content_unit-ext');
  });


  //   $('#sub_menu_1-1').on('click', function () {
  //     $('#tab1').prop('checked', true);
  //   });
  //   $('#sub_menu_1-2').on('click', function () {
  //     $('#tab2').prop('checked', true);
  //   });
  //   $('#sub_menu_1-3').on('click', function () {
  //     $('#tab3').prop('checked', true);
  //   });


  //   $('#sub_menu_2-1').on('click', function () {
  //     $('#tab1').prop('checked', true);
  //   });
  //   $('#sub_menu_2-2').on('click', function () {
  //     $('#tab2').prop('checked', true);
  //   });


  //   $('#sub_menu_3-1').on('click', function () {
  //     $('#tab1').prop('checked', true);
  //   });
  //   $('#sub_menu_3-2').on('click', function () {
  //     $('#tab2').prop('checked', true);
  //   });


  //   $('#sub_menu_4-1').on('click', function () {
  //     $('#tab1').prop('checked', true);
  //   });
  //   $('#sub_menu_4-2').on('click', function () {
  //     $('#tab2').prop('checked', true);
  //   });


});








