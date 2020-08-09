import '../css/styles.css';
import '../css/onepage.css';
import '../assets/img/me.jpg';
import '../assets/edlynvillegas_resume.pdf';
import evoJPG from '../assets/img/evo-calendar.png';
import Typed from 'typed.js';
import { onePageScroll } from './onescroll'

var activeProject = 1, activePage = 0, instanceNum = 0;
var loop = 0, looper;
var slider = document.querySelector('.project-slider'),
    navigation = document.querySelector('.project-navigation');
var figure, imageSlider, images, imageCont, stacks, githubURL, demoURL;
var typedTitle, typedDesc;
var isMobile, isTablet, isDesktop;
console.log('Hire me please..')

const opt = {
    sectionContainer: "section",
    easing: "ease",
    animationTime: 1000,
    pagination: true,
    updateURL: true,
    loop: true,
    keyboard: true,
    responsiveFallback: false
}
const ops = new onePageScroll("main", opt);
const projects = [
    {
        title: 'Evo Calendar',
        description: 'Simple modern-looking event calendar &mdash; Jquery plugin',
        imageURL: evoJPG,
        imageAlt: 'Evo Calendar - Royal Navy theme',
        stacks: ['HTML', 'CSS', 'Jquery'],
        githubURL: 'https://github.com/edlynvillegas/evo-calendar',
        demoURL: 'https://edlynvillegas.github.io/evo-calendar/'
    },
    {
        title: 'Flexigram',
        description: 'Instagram clone &amp; redesign',
        imageURL: evoJPG,
        imageAlt: 'Evo Calendar - Royal Navy theme',
        stacks: ['React', 'Hooks', 'Firebase'],
        githubURL: 'https://github.com/edlynvillegas/evo-calendar',
        demoURL: 'https://edlynvillegas.github.io/evo-calendar/'
    },
    {
        title: 'eMailer',
        description: 'Build your email and send it in style',
        imageURL: evoJPG,
        imageAlt: 'Evo Calendar - Royal Navy theme',
        stacks: ['HTML', 'CSS', 'Jquery'],
        githubURL: 'https://github.com/edlynvillegas/evo-calendar',
        demoURL: 'https://edlynvillegas.github.io/evo-calendar/'
    }
]

const renderProject = projects => {
    var markup = `
    <div class="project-content">
        <div class="project-image">
            <div class="project-image-slider">
            ${
                !isTablet && !isMobile ?
                projects.map(project => {
                    return `<figure><img src="${project.imageURL}" alt="${project.imageAlt}"></figure>`;
                }).join('') :
                null
            }
            </div>
        </div>
        <div class="project-details">
            <p class="project-title"></p>
            
            <div class="project-detail">
                <p></p>
                <ul class="project-stack"></ul>
            </div>
            <ul class="project-link">
                <li id="github">
                    <a href target="_black">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z"/><path d="M5.883 18.653c-.3-.2-.558-.455-.86-.816a50.32 50.32 0 0 1-.466-.579c-.463-.575-.755-.84-1.057-.949a1 1 0 0 1 .676-1.883c.752.27 1.261.735 1.947 1.588-.094-.117.34.427.433.539.19.227.33.365.44.438.204.137.587.196 1.15.14.023-.382.094-.753.202-1.095C5.38 15.31 3.7 13.396 3.7 9.64c0-1.24.37-2.356 1.058-3.292-.218-.894-.185-1.975.302-3.192a1 1 0 0 1 .63-.582c.081-.024.127-.035.208-.047.803-.123 1.937.17 3.415 1.096A11.731 11.731 0 0 1 12 3.315c.912 0 1.818.104 2.684.308 1.477-.933 2.613-1.226 3.422-1.096.085.013.157.03.218.05a1 1 0 0 1 .616.58c.487 1.216.52 2.297.302 3.19.691.936 1.058 2.045 1.058 3.293 0 3.757-1.674 5.665-4.642 6.392.125.415.19.879.19 1.38a300.492 300.492 0 0 1-.012 2.716 1 1 0 0 1-.019 1.958c-1.139.228-1.983-.532-1.983-1.525l.002-.446.005-.705c.005-.708.007-1.338.007-1.998 0-.697-.183-1.152-.425-1.36-.661-.57-.326-1.655.54-1.752 2.967-.333 4.337-1.482 4.337-4.66 0-.955-.312-1.744-.913-2.404a1 1 0 0 1-.19-1.045c.166-.414.237-.957.096-1.614l-.01.003c-.491.139-1.11.44-1.858.949a1 1 0 0 1-.833.135A9.626 9.626 0 0 0 12 5.315c-.89 0-1.772.119-2.592.35a1 1 0 0 1-.83-.134c-.752-.507-1.374-.807-1.868-.947-.144.653-.073 1.194.092 1.607a1 1 0 0 1-.189 1.045C6.016 7.89 5.7 8.694 5.7 9.64c0 3.172 1.371 4.328 4.322 4.66.865.097 1.201 1.177.544 1.748-.192.168-.429.732-.429 1.364v3.15c0 .986-.835 1.725-1.96 1.528a1 1 0 0 1-.04-1.962v-.99c-.91.061-1.662-.088-2.254-.485z" fill="#1a1b1b"/></svg>
                        Github
                    </a>
                </li>
                <li id="demo">
                    <a href target="_black">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z"/><path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" fill="rgba(26,27,27,1)"/></svg>
                        Demo
                    </a>
                </li>
            </ul>
        </div>
    </div>
    `
    slider.insertAdjacentHTML('beforeend', markup)
}

const renderStacks = () => {
    var markup = projects[activeProject-1].stacks.map(stack => `<li>${stack}</li>`).join('')
    stacks.innerHTML = markup;
}

renderProject(projects)
const initListener = () => {
    document.querySelectorAll('[data-project]').forEach(el => el.addEventListener('click', e => {
        instanceNum++;
        var num = parseInt(e.target.dataset.project);
        if (instanceNum > 1 && num === activeProject) return;
        loop = num-1;
        projectLoop();
    }))
}

const renderNavs = () => {
    var links = document.querySelectorAll('.project-navigation > button');
    if (links) {
        for (var i=0; i < links.length; i++) {
            links[i].remove();
        }
    }
    for (var i=0; i < projects.length; i++) {
        if (isDesktop) {
            navigation.insertAdjacentHTML('beforeend', `<button data-project="${i+1}">${ projects[i].title }</button>`)
        } else {
            navigation.insertAdjacentHTML('beforeend', `<button data-project="${i+1}">${ i+1 }</button>`)
        }
    }
    initListener();
    setNavActive();
}
const setNavActive = () => {
    var links = document.querySelectorAll('.project-navigation > button');
    for (var i=0; i < links.length; i++) {
        links[i].classList.remove('active')
        if (i === activeProject-1) links[i].classList.add('active')
    }
}

const init = () => {
    imageCont = document.querySelectorAll('.project-content');
    figure = document.querySelector('.project-image');
    imageSlider = document.querySelector('.project-image-slider');
    images = document.querySelectorAll('.project-image figure');
    stacks = document.querySelector('.project-stack');
    githubURL = document.querySelector('ul.project-link > li#github > a');
    demoURL = document.querySelector('ul.project-link > li#demo > a');
    renderNavs();
    projectLoop();
}
const projectLoop = () => {
    loopEnd();
    const loopFunc = () => {
        selectProject(loop+1);
        looper = setTimeout(projectLoop, 6000);
        loop++;
    }
    if (loop < projects.length) {
        loopFunc();
    } else {
        loop = 0;
        loopFunc();
    }
}
const loopEnd = () => {
    if (looper) clearTimeout(looper);
}
const reinit = () => {
    imageSlider = document.querySelector('.project-image-slider');
    images = document.querySelectorAll('.project-image figure');
    projectLoop();
    renderNavs();
}
const renderImage = () => {
    var imageEl = document.querySelector('.project-content');
    figure = document.querySelector('.project-image');
    var details = document.querySelector('.project-content > .project-details');
    var detail = document.querySelector('.project-detail');
    if (figure) figure.remove();
    
    if (isDesktop) {
        var markup =`<div class="project-image">
                        <div class="project-image-slider">
                        ${
                            projects.map(project => {
                                return `<figure><img src="${project.imageURL}" alt="${project.imageAlt}"></figure>`;
                            }).join('')
                        }
                        </div>
                    </div>`
        details.insertAdjacentHTML('beforebegin', markup)
    } else {
        var markup =`<div class="project-image">
                        <div class="project-image-content">
                            <div class="project-image-slider">
                            ${
                                projects.map(project => {
                                    return `<figure><img src="${project.imageURL}" alt="${project.imageAlt}"></figure>`;
                                }).join('')
                            }
                            </div>
                        </div>
                    </div>`
        detail.insertAdjacentHTML('beforebegin', markup)
    }
    figure = document.querySelector('.project-image');
    images = document.querySelectorAll('.project-image figure');
    setImagePos();
}
const setImagePos = () => {
    setTimeout(() => {
        var h, hY;
        h =  images[activeProject-1].offsetHeight;
        hY = h * (activeProject - 1);
        figure.style.height = h + 'px';
        imageSlider.style.transform = `translateY(-${hY}px)`;
    }, 0);
}
const renderLinks =() => {
    githubURL.setAttribute('href', projects[activeProject-1].githubURL)
    demoURL.setAttribute('href', projects[activeProject-1].demoURL)
}
// var i = 0, y = 0;
const renderTitle = () => {
    var title = projects[activeProject-1].title;
    
    var options = {
        strings: [title],
        showCursor: false,
        fadeOut: true,
        typeSpeed: 30
    };
    if (typedTitle) {
        typedTitle.destroy();
    }
    typedTitle = new Typed('p.project-title', options);
}
const renderDescription = () => {
    var title = projects[activeProject-1].description;
    
    var options = {
        strings: [title],
        showCursor: false,
        fadeOut: true,
        typeSpeed: 10
    };
    if (typedDesc) {
        typedDesc.destroy();
    }
    typedDesc = new Typed('.project-detail > p', options);
}
const selectProject = (num) => {
    activeProject = num;
    setNavActive();
    setImagePos();
    renderDescription();
    renderStacks()
    renderTitle();
    renderLinks();
}
const deviceResized = () => {
    var w = window.innerWidth;
    if (w > 768) {
        isDesktop = true;
        isTablet = false;
        isMobile = false;
    } else if (w <= 768 && w > 576) {
        isDesktop = false;
        isTablet = true;
        isMobile = false;
    } else if (w <= 576) {
        isDesktop = false;
        isTablet = false;
        isMobile = true;
    }
    renderImage();
}
deviceResized();

window.addEventListener('resize', () => {
    deviceResized();
    reinit();
})
document.addEventListener('DOMContentLoaded', () => {
    ops.init()
    init()
    var loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.remove();
    }, 1500);
})

// document.onload = () => {
//     ops.init()
//     init()
//     var loader = document.querySelector('.loader');
//     setTimeout(() => {
//         loader.remove();
//     }, 500);
// }

// if (document.readyState === 'loading') {
// } else {
//     init();
// }
// setTimeout(() => init(), 0);