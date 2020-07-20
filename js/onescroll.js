/* ===========================================================
 * onepagescroll.js v1.2.2
 * ===========================================================
 * Copyright 2014 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Create an Apple-like website that let user scroll
 * one page at a time
 *
 * Credit: Eike Send for the awesome swipe event
 * https://github.com/peachananr/purejs-onepage-scroll
 * 
 * License: GPL v3
 *
 * ========================================================== */
	
function onePageScroll(element, options) {
  
    var defaults = {
              sectionContainer: "section",
              easing: "ease",
              animationTime: 1000,
              pagination: true,
              updateURL: false,
              keyboard: true,
              beforeMove: null,
              afterMove: null,
              loop: false,
              responsiveFallback: false
          },
          _root = this,
          settings = Object.extend({}, defaults, options),
          el = document.querySelector(element),
          sections = document.querySelectorAll(settings.sectionContainer),
          sectionIndex = [],
          total = sections.length,
          activeIndex = 0;
          status = "off",
          topPos = 0,
          lastAnimation = 0,
          quietPeriod = 500,
          paginationList = "",
          body = document.querySelector("body");
    
    this.init = function() { 
        /*-------------------------------------------*/
        /*  Prepare Everything                       */
        /*-------------------------------------------*/
        var hash = location.hash;
        _addClass(el, "onepage-wrapper")

        for( var i = 0; i < sections.length; i++){
            sectionIndex.push(sections[i].dataset.section)
        }
      
        _swipeEvents(el);
        document.addEventListener("swipeDown",  function(event){
          if (!_hasClass(body, "disabled-onepage-scroll")) event.preventDefault();
            moveUp(el);
        }, { passive: false });
        document.addEventListener("swipeUp", function(event){
            if (!_hasClass(body, "disabled-onepage-scroll")) event.preventDefault();
            moveDown(el);
        }, { passive: false });
        
        if (hash && _getSectionIndex(hash.replace("#", "")) >= 0) {
            console.log('hereee', hash)
            activeIndex = sectionIndex.map(function (obj) { return obj }).indexOf(hash.replace("#", ""))
            var pos, current = _getSectionEl(sectionIndex[activeIndex])
            console.log(current)
                
            _addClass(current, "active")
            _addClass(_getPaginationEl(activeIndex), "active");

            _setURLHash(sectionIndex[activeIndex])

            pos = (activeIndex * 100) * -1;
            _transformPage(el, settings, pos, activeIndex);
        } else {
            console.log('thereee', hash)
            _setURLHash('intro');
            _addClass(_getSectionEl('intro'), "active");
            _addClass(_getPaginationEl(0), "active");
        }
      
        _paginationHandler = function() {
            var page_index = this.dataset.link;
            moveTo(el, page_index);
        }
        
        var pagination_links = document.querySelectorAll("[data-link]");
          for( var i = 0; i < pagination_links.length; i++){
            pagination_links[i].addEventListener('click', _paginationHandler, { passive: false });
        }
      
        _mouseWheelHandler = function(event) {
            event.preventDefault();
            var delta = event.wheelDelta || -event.detail;
            if (!_hasClass(body, "disabled-onepage-scroll")) _init_scroll(event, delta);
        }
      
        document.addEventListener('mousewheel', _mouseWheelHandler, { passive: false });
        document.addEventListener('DOMMouseScroll', _mouseWheelHandler, { passive: false });
      
      
        if(settings.responsiveFallback != false) {
          window.onresize = function(){
                _responsive();
            }
      
            _responsive();
        }
      
      _keydownHandler = function(e) {
            var tag = e.target.tagName.toLowerCase();
      
            if (!_hasClass(body, "disabled-onepage-scroll")) {
                switch(e.which) {
                    case 38:
                        if (tag != 'input' && tag != 'textarea') moveUp(el)
                        break;
                    case 40:
                        if (tag != 'input' && tag != 'textarea') moveDown(el)
                        break;
                    default: return;
                }
            }
            return false;
        }
      
        if(settings.keyboard == true) {
            document.onkeydown = _keydownHandler;
        }
        return false;
    }
    
    /*-------------------------------------------------------*/
    /*  Private Functions                                    */
    /*-------------------------------------------------------*/
    /*------------------------------------------------*/
    /*  Credit: Eike Send for the awesome swipe event */
    /*------------------------------------------------*/
    _swipeEvents = function(el){
        var startX,
            startY;
    
      document.addEventListener("touchstart", touchstart, { passive: false });  
    
        function touchstart(event) {
            var touches = event.touches;
            if (touches && touches.length) {
                startX = touches[0].pageX;
                startY = touches[0].pageY;
                document.addEventListener("touchmove", touchmove, { passive: false });
            }
        }
    
        function touchmove(event) {
            var touches = event.touches;
            if (touches && touches.length) {
              event.preventDefault();
                var deltaX = startX - touches[0].pageX;
                var deltaY = startY - touches[0].pageY;
    
                if (deltaX >= 50) {
                  var event = new Event('swipeLeft');
                  document.dispatchEvent(event);
                }
                if (deltaX <= -50) {
                  var event = new Event('swipeRight');
                  document.dispatchEvent(event);
                }
                if (deltaY >= 50) {
                  var event = new Event('swipeUp');
                  document.dispatchEvent(event);
                }
                if (deltaY <= -50) {
                  var event = new Event('swipeDown');
                  document.dispatchEvent(event);
                }
    
                if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
                    document.removeEventListener('touchmove', touchmove);
                }
            }
        }
    
    };
    /*-----------------------------------------------------------*/
      /*  Utility to add/remove class easily with javascript       */
      /*-----------------------------------------------------------*/
  
    _trim = function(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    _getSectionEl = function(sec) {
        if (typeof sec === 'number') {
            sec = sectionIndex[sec]
        }
        return document.querySelector(settings.sectionContainer + "[data-section='" + sec + "']")
    }

    _getPaginationEl = function(index) {
        return document.querySelector("[data-link='" + index + "']")
    }

    _getSectionIndex = function(hash) {
        return sectionIndex.map(function (obj) { return obj }).indexOf(hash)
    }

    _setURLHash = function(hash) {
        if (history.replaceState && settings.updateURL == true) {
            var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + hash;
            history.pushState( {}, document.title, href );
        }
    }
  
    _hasClass = function(ele,cls) {
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    }
  
    _addClass = function(ele,cls) {
      if (!_hasClass(ele,cls)) ele.className += " "+cls;
      ele.className = _trim(ele.className)
    }
  
    _removeClass = function(ele,cls) {
      if (_hasClass(ele,cls)) {
          var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
          ele.className=ele.className.replace(reg,' ');
      }
      ele.className = _trim(ele.className)
    }
  
    /*-----------------------------------------------------------*/
      /*  Transtionend Normalizer by Modernizr                     */
      /*-----------------------------------------------------------*/
  
    _whichTransitionEvent = function(){
      var t;
      var el = document.createElement('fakeelement');
      var transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      }
  
      for(t in transitions){
          if( el.style[t] !== undefined ){
              return transitions[t];
          }
      }
    }
  
    /*-----------------------------------------------------------*/
      /*  Function to perform scroll to top animation              */
      /*-----------------------------------------------------------*/
  
    _scrollTo = function(element, to, duration) {
        console.log('scroll to')
      if (duration < 0) return;
      var difference = to - element.scrollTop;
      var perTick = difference / duration * 10;
  
      setTimeout(function() {
          element.scrollTop = element.scrollTop + perTick;
          if (element.scrollTop == to) return;
          _scrollTo(element, to, duration - 10);
      }, 10);
    }
    
    
       
    /*---------------------------------*/
    /*  Function to transform the page */
    /*---------------------------------*/
    
    _transformPage = function(el2, settings, pos, index, next_el) {
      if (typeof settings.beforeMove == 'function') settings.beforeMove(index, next_el);
      
      var transformCSS = "-webkit-transform: translate3d(0, " + pos + "%, 0); -webkit-transition: -webkit-transform " + settings.animationTime + "ms " + settings.easing + "; -moz-transform: translate3d(0, " + pos + "%, 0); -moz-transition: -moz-transform " + settings.animationTime + "ms " + settings.easing + "; -ms-transform: translate3d(0, " + pos + "%, 0); -ms-transition: -ms-transform " + settings.animationTime + "ms " + settings.easing + "; transform: translate3d(0, " + pos + "%, 0); transition: transform " + settings.animationTime + "ms " + settings.easing + ";";
      
      el2.style.cssText = transformCSS;
      
      var transitionEnd = _whichTransitionEvent();
       el2.addEventListener(transitionEnd, endAnimation, false);
      
      function endAnimation() {
        if (typeof settings.afterMove == 'function') settings.afterMove(index, next_el);
        el2.removeEventListener(transitionEnd, endAnimation)
      }
    }
    
    /*-------------------------------------------*/
    /*  Responsive Fallback trigger              */
    /*-------------------------------------------*/
    
    _responsive = function() {
  
          if (document.body.clientWidth < settings.responsiveFallback) {
              _addClass(body, "disabled-onepage-scroll");
              document.removeEventListener('mousewheel', _mouseWheelHandler);
              document.removeEventListener('DOMMouseScroll', _mouseWheelHandler);
              _swipeEvents(el);
              document.removeEventListener("swipeDown");
              document.removeEventListener("swipeUp");
              
          } else {
            
            if (_hasClass(body, "disabled-onepage-scroll")) {
              _removeClass(body, "disabled-onepage-scroll");
              _scrollTo(document.documentElement, 0, 2000);
          }
        
        
  
              _swipeEvents(el);
              document.addEventListener("swipeDown",  function(event){
                if (!_hasClass(body, "disabled-onepage-scroll")) event.preventDefault();
                  moveUp(el);
              }, { passive: false });
              document.addEventListener("swipeUp", function(event){
                  if (!_hasClass(body, "disabled-onepage-scroll")) event.preventDefault();
                  moveDown(el);
              }, { passive: false });
        
            document.addEventListener('mousewheel', _mouseWheelHandler, { passive: false });
            document.addEventListener('DOMMouseScroll', _mouseWheelHandler, { passive: false });
              
          }
      }
      
      /*-------------------------------------------*/
    /*  Initialize scroll detection              */
    /*-------------------------------------------*/
    
    _init_scroll = function(event, delta) {
          var deltaOfInterest = delta,
              timeNow = new Date().getTime();
              
          // Cancel scroll if currently animating or within quiet period
          if(timeNow - lastAnimation < quietPeriod + settings.animationTime) {
              event.preventDefault();
              return;
          }
  
          if (deltaOfInterest < 0) {
              moveDown(el)
          } else {
              moveUp(el)
          }
          
          lastAnimation = timeNow;
      }
     
    
    /*-------------------------------------------------------*/
    /*  Public Functions                                     */
    /*-------------------------------------------------------*/
    
    /*---------------------------------*/
    /*  Function to move down section  */
    /*---------------------------------*/
    
    this.moveDown = function(el3) {
        if (typeof el3 == "string") el3 = document.querySelector(el3);
        var curr = document.querySelector(settings.sectionContainer +".active").dataset.section;
        activeIndex = _getSectionIndex(curr)
      
        var current = _getSectionEl(activeIndex),
            next_index = activeIndex + 1,
            next = _getSectionEl(next_index);
              
        if(!next) {
            if (settings.loop == true) {
                pos = 0;
                next_index = 0;
                next = _getSectionEl(next_index);
            } else { return }
        } else {
            pos = ((activeIndex+1) * 100) * -1;
            console.log('pos', pos, activeIndex)
        }

        _removeClass(current, "active");
        _addClass(next, "active");
        
        _removeClass(_getPaginationEl(activeIndex), "active");
        _addClass(_getPaginationEl(next_index), "active");
        
        _setURLHash(sectionIndex[next_index]);
        _transformPage(el3, settings, pos, next_index, next);
    }
      
      /*---------------------------------*/
    /*  Function to move up section    */
    /*---------------------------------*/
      
      this.moveUp = function(el4) {
        if (typeof el4 == "string") el4 = document.querySelector(el4);
        var curr = document.querySelector(settings.sectionContainer +".active").dataset.section;
        activeIndex = _getSectionIndex(curr)
      
        var current = _getSectionEl(activeIndex),
            next_index = activeIndex - 1,
            next = _getSectionEl(next_index);
              
        if(!next) {
            if (settings.loop == true) {
                pos = ((sections.length - 1) * 100) * -1;
                next_index = 2;
                next = _getSectionEl(next_index);
            } else { return }
        } else {
            pos = ((activeIndex-1) * 100) * -1;
            console.log('pos', pos, activeIndex)
        }

        _removeClass(current, "active");
        _addClass(next, "active");
        
        _removeClass(_getPaginationEl(activeIndex), "active");
        _addClass(_getPaginationEl(next_index), "active");
        
        _setURLHash(sectionIndex[next_index]);
        _transformPage(el4, settings, pos, next_index, next);
      }
    
    /*-------------------------------------------*/
    /*  Function to move to specified section    */
    /*-------------------------------------------*/
    
    this.moveTo = function(el5, page_index) {
        console.log('move to')
        
        if (typeof el5 == "string") el5 = document.querySelector(el5);
        var curr = document.querySelector(settings.sectionContainer +".active").dataset.section;
        activeIndex = _getSectionIndex(curr)
      
        var current = _getSectionEl(activeIndex),
            next_index = parseInt(page_index),
            next = _getSectionEl(next_index);
              
        if(next) {
            _removeClass(current, "active");
            _addClass(next, "active");
            
            _removeClass(_getPaginationEl(activeIndex), "active");
            _addClass(_getPaginationEl(next_index), "active");

            pos = ((next_index) * 100) * -1;
            console.log(next_index, pos)
            
            _setURLHash(sectionIndex[next_index]);
            _transformPage(el5, settings, pos, next_index, next);
        }
    }
      
    this.init();
  }
  
  /*------------------------------------------------*/
   /*  Ulitilities Method                            */
   /*------------------------------------------------*/
   
   /*-----------------------------------------------------------*/
   /*  Function by John Resig to replicate extend functionality */
   /*-----------------------------------------------------------*/
   
   Object.extend = function(orig){
     if ( orig == null )
       return orig;
   
     for ( var i = 1; i < arguments.length; i++ ) {
       var obj = arguments[i];
       if ( obj != null ) {
         for ( var prop in obj ) {
           var getter = obj.__lookupGetter__( prop ),
               setter = obj.__lookupSetter__( prop );
   
           if ( getter || setter ) {
             if ( getter )
               orig.__defineGetter__( prop, getter );
             if ( setter )
               orig.__defineSetter__( prop, setter );
           } else {
             orig[ prop ] = obj[ prop ];
           }
         }
       }
     }
   
     return orig;
   };
      
  