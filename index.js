// // alert('WAIT! This page is still under development so..')
// window.onhashchange = getActive;
// window.onscroll = function() {getSection()};
// var hash, navs = document.querySelectorAll('nav > a');

// if (window.location.hash) getActive();
// function getActive() {
//     hash = window.location.hash.split('#')[1];
//     for (var i=0; i < navs.length; i++) {
//         if (hash === navs[i].dataset.link) {
//             setActive(navs[i].dataset.link)
//         }
//     }
// }
// function setActive(val) {
//     for (var i=0; i < navs.length; i++) {
//         navs[i].classList.remove('active')
//         if (val === navs[i].dataset.link) {
//             navs[i].classList.add('active')
//         }
//     }
// }
// function getSection(e) {
//     var scr = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
//     var sections = document.querySelectorAll('section')
//     for (var i=0; i < sections.length; i++) {
//         if (scr >= sections[i].offsetTop - (sections[i].offsetHeight/2) && scr <= sections[i].offsetTop + sections[i].offsetHeight) {
//             setActive(sections[i].dataset.section)
//             // window.location.hash = '#'+sections[i].dataset.section;
//         }
//     }
// }

(function() {
    onePageScroll("main", {
        sectionContainer: "section",     // sectionContainer accepts any kind of selector in case you don't want to use section
        easing: "ease",                  // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in", 
                                         // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
        animationTime: 400,             // AnimationTime let you define how long each section takes to animate
        pagination: false,                // You can either show or hide the pagination. Toggle true for show, false for hide.
        updateURL: true,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
        loop: true,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
        keyboard: true,                  // You can activate the keyboard controls
        responsiveFallback: false        // You can fallback to normal page scroll by defining the width of the browser in which
                                         // you want the responsive fallback to be triggered. For example, set this to 600 and whenever 
                                         // the browser's width is less than 600, the fallback will kick in.
    });
 })();