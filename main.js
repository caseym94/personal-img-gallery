  'use strict';
  //       window.addEventListener('load',function(){ console.log('yo')})
  var imgContainer = document.querySelector('#img-container'),
      nav = document.querySelector('nav'),
      yearSelectionUl = document.querySelector('#year-selection'),
      monthSelectionUl = document.querySelector('#month-selection'),
      monthLi = document.querySelectorAll('#month-selection li'),
      main = document.querySelector('main'),
      imgContainerRow = document.querySelectorAll(
          '.img-container-row'),
      bigImgDisplay = document.querySelector('#bigImgDisplay'),
      img,
      rowSwap = 0,
      bigImgDisplayState = true,
      selectedYear,
      selectedImg;

  //resizes main section and the big img displayer
  var resizeDisplay = () => {
      main.style.height = window.innerHeight - nav.offsetHeight + 'px';
      bigImgDisplay.style.height = window.innerHeight - nav.offsetHeight + 'px';
  }
  resizeDisplay();
  window.addEventListener('resize', () => {
      resizeDisplay();
  });

  function clearImgs() {
      imgContainerRow.forEach(function (row) {
          row.innerHTML = '';
      });
  }

  function displayImgs(selectedImgs) {
      clearImgs();
      for (var i = 0; i < selectedImgs.length; i++) {
          if (rowSwap === 0) {
              var img = imgContainerRow[rowSwap].appendChild(
                  document.createElement(
                      'img'));
              img.src = selectedImgs[i];
              rowSwap = 1;
          } else if (rowSwap === 1) {
              var img = imgContainerRow[rowSwap].appendChild(
                  document.createElement(
                      'img'));
              img.src = selectedImgs[i];
              rowSwap = 2;
          } else if (rowSwap === 2) {
              var img = imgContainerRow[rowSwap].appendChild(
                  document.createElement(
                      'img'));
              img.src = selectedImgs[i];
              rowSwap = 3;
          } else if (rowSwap === 3) {
              var img = imgContainerRow[rowSwap].appendChild(
                  document.createElement(
                      'img'));
              img.src = selectedImgs[i];
              rowSwap = 0;
          }
      }
      rowSwap = 0;
  }
  yearSelectionUl.addEventListener('click', function () {
      if (event.target.tagName === 'LI') {
          var a = event.target.parentElement.children;
          for (var i = 0; i < a.length; i++) {
              a[i].classList.add('inactive');
          }
          event.target.classList.remove('inactive');
          selectedYear = event.target.innerHTML;
          checkMonthsForContent('_' + event.target.innerHTML.toLowerCase());
          //clear inactive class when switching year
          for (var i = 0; i < monthSelectionUl.children.length; i++) {
              monthSelectionUl.children[i].classList.remove('inactive')
          }
      }
  });
  //get images for month selected
  monthSelectionUl.addEventListener('click', function () {

      //check if clicked is an li tag, check if month is available
      if (event.target.tagName === 'LI' && !event.target.classList.contains('notAvailable')) {
          var li = event.target.parentElement.children;
          for (var i = 0; i < li.length; i++) {
              if (!li[i].classList.contains('notAvailable')) {
                  li[i].classList.add('inactive');
              }
          }
          event.target.classList.remove('inactive');
      }
      if (!event.target.classList.contains('notAvailable')) {
          if (event.target.innerHTML.toLowerCase() === 'all') {
              displayImgs(imgArr['_' + selectedYear]['all']());
          } else {
              displayImgs(imgArr['_' + selectedYear][event.target.innerHTML.toLowerCase()]);
          }
      };
      img = document.querySelectorAll('main img');
  });

  //based on the selected year, highlight months that have available images or information
  function checkMonthsForContent(year) {
      //first reset all months to default by removing inactive class and adding notAvailable class 
      for (var i = 0; i < monthSelectionUl.children.length; i++) {
          //monthSelectionUl.children[i].classList.remove('inactive');
          monthSelectionUl.children[i].classList.add('notAvailable');
      }
      //check if there is information for each month
      //if there is information on a month find the matching li and remove the notAvailable class for it
      for (var key in imgArr[year]) {
          if (imgArr[year][key] !== undefined) {
              monthLi.forEach((li) => {
                  if (key === li.innerHTML.toLowerCase()) {
                      li.classList.remove('notAvailable');
                  }
              });
          }
      }
  }

  //big img displayer
  function bigImgDisplayerFunc(state, imgSelected) {
      //temp fix to prevent issue when clicking too fast
      bigImgDisplay.style.pointerEvents = "none";
      if (state === true) {
          bigImgDisplay.style.display = 'initial';
          setTimeout(function () {
              bigImgDisplay.style.opacity = '1'
              main.style.filter = 'blur(2px)';
              bigImgDisplay.children[0].src = imgSelected.src;
              var a = bigImgDisplay.offsetHeight - bigImgDisplay.children[0].offsetHeight;
              bigImgDisplay.children[0].style.marginTop = a / 2 + 'px';
              bigImgDisplayState = false;
              //temp fix
              bigImgDisplay.style.pointerEvents = "auto";
          }, 250);
      } else if (state === false) {
          bigImgDisplay.style.opacity = '0'
          main.style.filter = 'blur(0)';
          setTimeout(function () {
              bigImgDisplay.children[0].src = '';
              bigImgDisplay.style.display = 'none';
              bigImgDisplayState = true;
              //temp fix
              bigImgDisplay.style.pointerEvents = "auto";
          }, 250)
      }
  }
  main.addEventListener('click', function () {
      if (event.target.tagName === 'IMG') {
          bigImgDisplayerFunc(bigImgDisplayState, event.target);
          setTimeout(function () {
              selectededImgFunc();
          }, 250);
      }
  });
  bigImgDisplay.addEventListener('click', function () {
      bigImgDisplayerFunc(false);
      selectedImg = '';
  });

  function selectededImgFunc() {
      img.forEach(function (img) {
          if (img.src === bigImgDisplay.children[0].src) {
              selectedImg = img;
          }
      });
  }

  function imgNext() {
      bigImgDisplay.children[0].src = selectedImg.nextElementSibling.src;
      selectededImgFunc();
  }

  function imgPrevious() {
      bigImgDisplay.children[0].src = selectedImg.previousElementSibling.src;
      selectededImgFunc();
  }