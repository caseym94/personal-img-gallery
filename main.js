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
      bigImgDisplayState = true,
      selectedYear,
      selectedMonth,
      selectedImg,
      imgRefresher;

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
      for (var i = 0; i < imgContainerRow.length; i++) {
          imgContainerRow[i].innerHTML = '';
      }
  }

  function displayImgs(selectedImgs) {
      //clear
      clearImgs();
      //new
      var rowSwap = 0;
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
  yearSelectionUl.addEventListener('click', (event) => {
      var e = event.target || event;
      if (e.tagName === 'LI') {
          var a = e.parentElement.children;
          for (var i = 0; i < a.length; i++) {
              a[i].classList.add('inactive');
          }
          e.classList.remove('inactive');
          selectedYear = e.innerHTML;
          checkMonthsForContent('_' + e.innerHTML.toLowerCase());
          //clear inactive class when switching year
          for (var i = 0; i < monthSelectionUl.children.length; i++) {
              monthSelectionUl.children[i].classList.remove('inactive')
          }
      }
  });
  //get images for month selected
  monthSelectionUl.addEventListener('click', (event) => {
      var e = event.target || event;
      selectedMonth = e.innerHTML.toLowerCase();
      //check if clicked is an li tag, check if month is available
      if (e.tagName === 'LI' && !e.classList.contains('notAvailable')) {
          var li = e.parentElement.children;
          for (var i = 0; i < li.length; i++) {
              if (!li[i].classList.contains('notAvailable')) {
                  li[i].classList.add('inactive');
              }
          }
          e.classList.remove('inactive');
      }
      //if there's information display images
      if (!e.classList.contains('notAvailable')) {
          //clear previous 
          clearInterval(imgRefresher);
          //use an named function so I don't have to wait for 6 sec on interval to display imgs
          function a() {
              console.log('ayyy');
              if (selectedMonth === 'all') {
                  displayImgs(imgArr['_' + selectedYear]['all']());
              } else {
                  displayImgs(imgArr['_' + selectedYear][selectedMonth]);
              }
          }
          a();
          //constantly loads images because sometimes they bug out/don't load
          imgRefresher = setInterval(a, 6000);
      };
      //store selected images into image tag
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
          setTimeout(() => {
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
          setTimeout(() => {
              bigImgDisplay.children[0].src = '';
              bigImgDisplay.style.display = 'none';
              bigImgDisplayState = true;
              //temp fix
              bigImgDisplay.style.pointerEvents = "auto";
          }, 250)
      }
  }
  main.addEventListener('click', (event) => {
      var e = event.target || event;
      if (event.target.tagName === 'IMG') {
          bigImgDisplayerFunc(bigImgDisplayState, e);
          setTimeout(() => {
              selectededImgFunc();
          }, 250);
      }
  });
  bigImgDisplay.addEventListener('click', () => {
      bigImgDisplayerFunc(false);
      selectedImg = '';
  });
  //keeps track of selected image
  function selectededImgFunc() {
      img.forEach((img) => {
          if (img.src === bigImgDisplay.children[0].src) {
              selectedImg = img;
          }
      });
  }


  //work in progress
  function imgNext() {
      bigImgDisplay.children[0].src = selectedImg.nextElementSibling.src;
      selectededImgFunc();
  }

  function imgPrevious() {
      bigImgDisplay.children[0].src = selectedImg.previousElementSibling.src;
      selectededImgFunc();
  }