// alert('WAIT! This page is still under development so..')
window.onhashchange = getActive;
window.onscroll = function() {getSection()};
var hash, navs = document.querySelectorAll('nav > a');

if (window.location.hash) getActive();
function getActive() {
    hash = window.location.hash.split('#')[1];
    for (var i=0; i < navs.length; i++) {
        if (hash === navs[i].dataset.link) {
            setActive(navs[i].dataset.link)
        }
    }
}
function setActive(val) {
    for (var i=0; i < navs.length; i++) {
        navs[i].classList.remove('active')
        if (val === navs[i].dataset.link) {
            navs[i].classList.add('active')
        }
    }
}
function getSection(e) {
    var scr = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var sections = document.querySelectorAll('section')
    for (var i=0; i < sections.length; i++) {
        if (scr >= sections[i].offsetTop - (sections[i].offsetHeight/2) && scr <= sections[i].offsetTop + sections[i].offsetHeight) {
            console.log('active section ->', sections[i].dataset.section)
            setActive(sections[i].dataset.section)
            // window.location.hash = '#'+sections[i].dataset.section;
        }
    }
}