$(document).ready(function () {
  // $('#tab1').prop('checked', true);

  // document.querySelector('.menu-icon-wrapper').onclick = function () {
  //   document.querySelector('.menu-icon').classList.toggle('menu-icon-active');
  //   document.querySelector('.wrap_sidebar_menu-hidden').classList.toggle('wrap_sidebar_menu-visible');
  //   document.querySelector('.index_p').classList.toggle('index_p-transparent');

  // }

  function HideTest(display_style) {

    // current_style = document.getElementById("current-style").style.display;
    // element = document.getElementById('current-style');
    // display_style = window.getComputedStyle(element).display;

    element = $('#current-style');
    d_style = element.css('display');

    if (d_style == "block") element.css("display", "none");
    else element.css("display", "block");
    // return display_style;
    console.log(d_style);

    // if (Element.
    //   style.color == 'green') Element.style.color = 'red';
    // else Element.style.color = 'green';
    // return false;
  }




  // $('.menu-icon-active').on('click', function () {
  //   $(".wrap_test_unit").css("visibility", "visible");
  // });



  $('.menu-icon-wrapper').on('click', function () {
    // $(".list_docs").css("opacity", "0.5");
    $('.list_docs').toggleClass('list_docs-opacity');

    $('.menu-icon').toggleClass('menu-icon-active');
    $('.wrap_sidebar_menu-hidden').toggleClass('wrap_sidebar_menu-visible');
    $('.index_p').toggleClass('index_p-transparent');
    $('.display_off').toggleClass('.display_on');
    // $(".wrap_test_unit-visible").toggleClass('.wrap_test_unit-hidden');

    // $(".wrap_test_unit").css("visibility", "hidden");
    HideTest();



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








