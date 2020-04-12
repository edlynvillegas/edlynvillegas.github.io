/*

+------------------------+
+ Author: Edlyn Villegas +
+------------------------+

+--- SETTINGS ---+
(/) theme

+--- METHODS ----+

(/) addCalendarEvent -> array -> Add Calendar event(s)
(/) removeCalendarEvent -> array/id -> Remove event(s) by their id
** new **
(/) toggleSidebar -> arg: bool (optional) -> Toggle sidebar display
(/) toggleEventList -> arg: bool (optional) -> Toggle event list display
(/) getActiveDate -> none -> Get the selected date
(/) getActiveEvents  -> none -> Get the event(s) of selected date
(/) selectDate -> date -> Select date programmatically **(formatted date)
(/) selectMonth -> date -> Select month programmatically
(/) selectYear -> date -> Select year programmatically

+---- EVENTS ----+
(/) selectDate -> arg: newDate, oldDate -> Fires after selecting date
(/) selectEvent -> arg: index, activeEvent -> Fires after selecting event

+---- TO DO -----+
- EvoCalendar demo page (edlynvillegas.github.io/evo-calendar)
- format settings for getActiveDate()
- Fix iOS compatibility 
(/) organize global variables
- add function to check if date is valid


use formatDate():
 - getActiveDate()
 - getActiveEvents()
 - on: selectDate
 - on: selectEvent
 - event-header (eventTitleFormat)
 - <th> (titleFormat)

+-- VERSION 1.2.0 --+
- able to add event type (name, color)
- calendarEvents:
    + everyWeek (boolean)

+-- VERSION 1.3.0 --+
- multi-day event
- Select date range

+-- VERSION 1.4.0 --+
- time functionality
  - start & end time
  - arrange event by their time (start time)
  - see event time
  - time filter
  

*/

(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var EvoCalendar = window.EvoCalendar || {};
    function UTCDate() {
		return new Date(Date.UTC.apply(Date, arguments));
	}
    function UTCToday() {
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
    }
    EvoCalendar = (function() {
        function EvoCalendar(element, settings) {
            var _ = this, dataSettings;
            _.defaults = {
                theme: null,
                format: 'mm/dd/yyyy',
                titleFormat: 'MM yyyy',
                eventHeaderFormat: 'MM d, yyyy',
                firstDayOfWeek: 'Sun',
                language: 'en',
                todayHighlight: false,
                sidebarDisplayDefault: true,
                sidebarToggler: true,
                eventListToggler: true,
                eventDisplayDefault: true,
                calendarEvents: null,
                disabledDate: null
            };

            _.initials = {
                validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
                dates: {
                    en: {
                        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    },
                    es: {
                        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
                        daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
                    },
                    de: {
                        days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
                        daysShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                        daysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                        months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                        monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
                    }
                }
            }

            _.options = $.extend({}, _.defaults, settings);

            // Format Calendar Events into selected format
            if(_.options.calendarEvents != null) {
                for(var i=0; i < _.options.calendarEvents.length; i++) {
                    // If event doesn't have an id, throw an error
                    if(!_.options.calendarEvents[i].id) {
                        console.log("%c Event named: \""+_.options.calendarEvents[i].name+"\" doesn't have a unique ID ", "color:white;font-weight:bold;background-color:#e21d1d;");
                    }
                    if(_.isValidDate(_.options.calendarEvents[i].date)) {
                        _.options.calendarEvents[i].date = _.formatDate(_.options.calendarEvents[i].date, _.options.format)
                    }
                }
                console.log('CALENDAR EVENTS: ', _.options.calendarEvents)
            }

            // if(_.options.disabledDate != null) {
            //     for(var i=0; i < _.options.disabledDate.length; i++) {
            //         if(_.isValidDate(_.options.disabledDate[i])) {
            //             _.options.disabledDate[i] = _.formatDate(new Date(_.options.disabledDate[i]), _.options.format, 'en')
            //         }
            //     }
            // }

            
            // Global variables
            
            // CURRENT
            _.$current = {
                month: (isNaN(this.month) || this.month == null) ? new Date().getMonth() : this.month,
                year: (isNaN(this.year) || this.year == null) ? new Date().getFullYear() : this.year,
                date: _.formatDate(_.initials.dates[_.defaults.language].months[new Date().getMonth()]+'/'+new Date().getDate()+'/'+ new Date().getFullYear(), _.options.format)
            }

            // ACTIVE
            _.$active = {
                month: _.$current.month,
                year: _.$current.year,
                date: _.$current.date,
                events: []
            }

            // LABELS
            _.$label = {
                days: [],
                months: _.initials.dates[_.defaults.language].months,
                days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            }

            // HTML Markups (template)
            _.$markups = {
                calendarHTML: '',
                mainHTML: '',
                sidebarHTML: '',
                eventHTML: ''
            }
            // HTML DOM elements
            _.$elements = {
                calendarEl: $(element),
                innerEl: '',
                sidebarEl: '',
                eventEl: '',
                activeDayEl: '',
                activeMonthEl: '',
                activeYearEl: ''
            }

            _.selectDate = $.proxy(_.selectDate, _);
            _.selectMonth = $.proxy(_.selectMonth, _);
            _.selectYear = $.proxy(_.selectYear, _);
            _.selectEvent = $.proxy(_.selectEvent, _);
            _.toggleSidebar = $.proxy(_.toggleSidebar, _);
            _.toggleEventList = $.proxy(_.toggleEventList, _);
            

            // _.$helloworld = function() {
                // console.log(UTCToday())
            // }
            

            _.init(true);
        }

        return EvoCalendar;

    }());

    EvoCalendar.prototype.limitTitle = function(title, limit) {
        var newTitle = [];
        limit = limit === undefined ? 18 : limit;
        if ((title).split(' ').join('').length > limit) {
            var t = title.split(' ');
            for (var i=0; i<t.length; i++) {
                if (t[i].length + newTitle.join('').length <= limit) {
                    newTitle.push(t[i])
                }
            }
            return newTitle.join(' ') + '...'
        }
        return title;
    }
            
    EvoCalendar.prototype.parseFormat = function(format) {
        var _ = this;
        if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function')
            return format;
        // IE treats \0 as a string end in inputs (truncating the value),
        // so it's a bad format delimiter, anyway
        var separators = format.replace(_.initials.validParts, '\0').split('\0'),
            parts = format.match(_.initials.validParts);
        if (!separators || !separators.length || !parts || parts.length === 0){
            console.log("%c Invalid date format ", "color:white;font-weight:bold;background-color:#e21d1d;");
        }
        return {separators: separators, parts: parts};
    };
    
    EvoCalendar.prototype.formatDate = function(date, format, language) {
        var _ = this;
        if (!date)
            return '';
        language = language ? language : _.defaults.language
        if (typeof format === 'string')
            format = _.parseFormat(format);
        if (format.toDisplay)
            return format.toDisplay(date, format, language);
            
        // date = new Date(date).toISOString();
        date = new Date(date).getTime();
        
        var val = {
            d: new Date(date).getDate(),
            D: _.initials.dates[language].daysShort[new Date(date).getDay()],
            DD: _.initials.dates[language].days[new Date(date).getDay()],
            m: new Date(date).getMonth() + 1,
            M: _.initials.dates[language].monthsShort[new Date(date).getMonth()],
            MM: _.initials.dates[language].months[new Date(date).getMonth()],
            yy: new Date(date).getFullYear().toString().substring(2),
            yyyy: new Date(date).getFullYear()
        };
        // console.log(date)
        // var val = {
        //     d: new Date(date).getUTCDate(),
        //     D: _.initials.dates[language].daysShort[new Date(date).getUTCDay()],
        //     DD: _.initials.dates[language].days[new Date(date).getUTCDay()],
        //     m: new Date(date).getUTCMonth() + 1,
        //     M: _.initials.dates[language].monthsShort[new Date(date).getUTCMonth()],
        //     MM: _.initials.dates[language].months[new Date(date).getUTCMonth()],
        //     yy: new Date(date).getFullYear().toString().substring(2),
        //     yyyy: new Date(date).getFullYear()
        // };
        val.dd = (val.d < 10 ? '0' : '') + val.d;
        val.mm = (val.m < 10 ? '0' : '') + val.m;
        date = [];
        var seps = $.extend([], format.separators);
        for (var i=0, cnt = format.parts.length; i <= cnt; i++){
            if (seps.length)
                date.push(seps.shift());
            date.push(val[format.parts[i]]);
        }
        // console.log(date.join(''))
        return date.join('');
    };

    EvoCalendar.prototype.init = function(creation) {

        var _ = this;

        if (!$(_.$elements.calendarEl).hasClass('calendar-initialized')) {

            $(_.$elements.calendarEl).addClass('evo-calendar calendar-initialized');

            if (!_.options.sidebarDisplayDefault) $(_.$elements.calendarEl).addClass('sidebar-hide');

            if (!_.options.eventDisplayDefault) $(_.$elements.calendarEl).addClass('event-hide');

            if (_.options.theme) _.setTheme()

            _.buildCalendar('all');
        }
    };
    
    EvoCalendar.prototype.setTheme = function() {
        var _ = this;
        var themeName = _.options.theme.toLowerCase().split(' ').join('-');
        $(_.$elements.calendarEl).addClass(themeName);
    }

    // Add listeners
    EvoCalendar.prototype.initEventListener = function() {
        var _ = this;

        // IF sidebarToggler: set event listener: toggleSidebar
        if(_.options.sidebarToggler) {
            $('#sidebarToggler')
            .off('click.evocalendar')
            .on('click.evocalendar', _.toggleSidebar);
        }
        
        // IF eventListToggler: set event listener: toggleEventList
        if(_.options.eventListToggler) {
            $('#eventListToggler')
            .off('click.evocalendar')
            .on('click.evocalendar', _.toggleEventList);
        }

        // set event listener for each day
        $('[data-date-val]')
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectDate)
        // .on('click.evocalendar', _.options.onSelectDate);

        // set event listener for each month
        $('[data-month-val]')
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectMonth);

        // set event listener for year
        $('[data-year-val]')
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectYear);

        $('[data-event-index]')
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectEvent);
    };

    EvoCalendar.prototype.buildCalendar = function(val, new_month, new_year) {
        var _ = this;

        // get first day of month
        new_month = (isNaN(new_month) || new_month == null) ? _.$active.month : new_month;
        new_year = (isNaN(new_year) || new_year == null) ? _.$active.year : new_year;

        // find number of days in month
        var monthLength = _.$label.days_in_month[new_month];

        // compensate for leap year
        if (new_month == 1) { // February only!
            if((new_year % 4 == 0 && new_year % 100 != 0) || new_year % 400 == 0){
                monthLength = 29;
            }
        }
        
        var nameDays = _.initials.dates[_.options.language].daysShort;
        var firstDayOfWeekName = _.initials.dates[_.options.language].daysShort.map(function(obj) {return obj}).indexOf(_.options.firstDayOfWeek);

        if (firstDayOfWeekName < 0) {
            // If firstDayOfWeek and language aren't the same, find in default language
            firstDayOfWeekName = _.initials.dates[_.defaults.language].daysShort.map(function(obj) {return obj}).indexOf(_.defaults.firstDayOfWeek)
        }

        while (_.$label.days.length < nameDays.length) {
            if (firstDayOfWeekName == nameDays.length) {
                firstDayOfWeekName=0;
            }
            _.$label.days.push(nameDays[firstDayOfWeekName]);
            firstDayOfWeekName++;
        }
        
        var firstDay = new Date(new_year, new_month).getDay() - firstDayOfWeekName;
        var startingDay = firstDay < 0 ? (_.$label.days.length + firstDay) : firstDay;

        // do the header
        
        var monthName =  _.$label.months[new_month];
        var mainHTML = '';
        var sidebarHTML = '';
        var calendarHTML = '';
        
        function buildMainHTML() {
            var mainHTML = '<div class="calendar-sidebar"></div><div class="calendar-inner"></div><div class="calendar-events"></div>';
            
            if(_.options.eventListToggler) {
                mainHTML += '<span id="eventListToggler" title="Close event list"><button class="icon-button"><span class="chevron-arrow-right"></span></button></span>';
            }
            _.$markups.mainHTML = mainHTML;
        }

        function buildSidebarHTML() {
            sidebarHTML = '<div class="calendar-year"><button class="icon-button" data-year-val="prev" title="Previous year"><span class="chevron-arrow-left"></span></button>&nbsp;<p>'+new_year+'&nbsp;</p><button class="icon-button" data-year-val="next" title="Next year"><span class="chevron-arrow-right"></span></button></div>';
            sidebarHTML += '<ul class="calendar-months">';
            for(var i = 0; i < _.$label.months.length; i++) {
                sidebarHTML += '<li class="month';
                sidebarHTML += (parseInt(_.$active.month) === i) ? ' active-month' : ''
                sidebarHTML += '" data-month-val="'+i+'">'+_.initials.dates[_.options.language].months[i]+'</li>';
            }
            sidebarHTML += '</ul>';
            if(_.options.sidebarToggler) {
                sidebarHTML += '<span id="sidebarToggler" title="Close sidebar"><button class="icon-button"><span class="bars"></span></button></span>';
            }
            _.$markups.sidebarHTML = sidebarHTML;
        }

        function buildCalendarHTML() {
            calendarHTML = '<table class="calendar-table">';
            calendarHTML += '<tr><th colspan="7">';
            calendarHTML +=  _.formatDate(new Date(monthName +' 1 '+ new_year), _.options.titleFormat, _.options.language);
            calendarHTML += '</th></tr>';
            calendarHTML += '<tr class="calendar-header">';
            for(var i = 0; i <= 6; i++ ){
                calendarHTML += '<td class="calendar-header-day">';
                calendarHTML += _.$label.days[i];
                calendarHTML += '</td>';
            }
            calendarHTML += '</tr><tr class="calendar-body">';
            // fill in the days
            var day = 1;
            // this loop is for is weeks (rows)
            for (var i = 0; i < 9; i++) {
                // this loop is for weekdays (cells)
                for (var j = 0; j <= 6; j++) { 
                    calendarHTML += '<td class="calendar-day">';
                    if (day <= monthLength && (i > 0 || j >= startingDay)) {
                        var thisDay = _.formatDate(monthName +'/'+ day +'/'+ new_year, _.options.format);
                        calendarHTML += '<div class="day'
                        calendarHTML += ((_.$active.date === thisDay) ? ' calendar-active' : '') + '" data-date-val="'+thisDay+'">'+day+'</div>';
                        day++;
                    }
                    calendarHTML += '</td>';
                }
                // stop making rows if we've run out of days
                if (day > monthLength) {
                  break;
                } else {
                  calendarHTML += '</tr><tr class="calendar-body">';
                }
            }
            calendarHTML += '</tr></table>';
            _.$markups.calendarHTML = calendarHTML;
        }
        
        function buildEventListHTML() {
            if(_.options.calendarEvents != null) {
                _.$active.events = [];
                var eventHTML = '<div class="event-header"><p>'+_.formatDate(_.$active.date, _.options.eventHeaderFormat, _.options.language)+'</p></div>';
                var hasEventToday = false;
                eventHTML += '<div>';
                for (var i = 0; i < _.options.calendarEvents.length; i++) {
                    if(_.$active.date === _.options.calendarEvents[i].date) {
                        // console.log(_.$active.date, new Date(_.options.calendarEvents[i].date).getTime())
                        hasEventToday = true;
                        _.$active.events.push(_.options.calendarEvents[i])
                        eventHTML += '<div class="event-container" data-event-index="'+(_.options.calendarEvents[i].id ? _.options.calendarEvents[i].id : i)+'">';
                        eventHTML += '<div class="event-icon"><div class="event-bullet-'+_.options.calendarEvents[i].type+'"></div></div>';
                        eventHTML += '<div class="event-info"><p>'+_.limitTitle(_.options.calendarEvents[i].name)+'</p></div>';
                        eventHTML += '</div>';
                    }
                    // else if (_.options.calendarEvents[i].everyYear) {
                    //     var d = _.formatDate(new Date(_.$active.date), 'mm/dd');
                    //     var dd = _.formatDate(new Date(_.options.calendarEvents[i].date), 'mm/dd');
                    //     if(d==dd) {
                    //         hasEventToday = true;
                    //         _.$active.events.push(_.options.calendarEvents[i])
                    //         eventHTML += '<div class="event-container" data-event-index="'+_.options.calendarEvents[i].id+'">';
                    //         eventHTML += '<div class="event-icon"><div class="event-bullet-'+_.options.calendarEvents[i].type+'"></div></div>';
                    //         eventHTML += '<div class="event-info"><p>'+_.limitTitle(_.options.calendarEvents[i].name)+'</p></div>';
                    //         eventHTML += '</div>';
                    //     }
                    // }
                };
                if(!hasEventToday) {
                    eventHTML += '<p>No event for this day.. so take a rest! :)</p>';
                }
                eventHTML += '</div>';
                _.$markups.eventHTML = eventHTML;
            }
        }

        if(val == 'all') {
            buildMainHTML();
            buildSidebarHTML();
            buildCalendarHTML();
            buildEventListHTML();
        } else if (val == 'sidebar') {
            buildSidebarHTML();
        } else if (val == 'inner') {
            buildCalendarHTML();
        } else if (val == 'events') {
            buildEventListHTML();
        }

        _.setHTML(val);
    };

    // Set the HTML to element
    EvoCalendar.prototype.setHTML = function(val) {
        var _ = this;

        if (!_.$elements.calendarEl.html()) _.$elements.calendarEl.html(_.$markups.mainHTML);
        if (!_.$elements.sidebarEl) _.$elements.sidebarEl = $('.calendar-sidebar');
        if (!_.$elements.innerEl) _.$elements.innerEl = $('.calendar-inner');
        if (!_.$elements.eventEl) _.$elements.eventEl = $('.calendar-events');

        if(val == 'all') {
            _.$elements.sidebarEl.html(_.$markups.sidebarHTML);
            _.$elements.innerEl.html(_.$markups.calendarHTML);
            _.$elements.eventEl.html(_.$markups.eventHTML);
        } else if (val == 'sidebar') {
            _.$elements.sidebarEl.html(_.$markups.sidebarHTML);
        } else if (val == 'inner') {
            _.$elements.innerEl.html(_.$markups.calendarHTML);
        } else if (val == 'events') {
            _.$elements.eventEl.html(_.$markups.eventHTML);
        }

        if(_.options.calendarEvents != null) {
            _.initCalendarEvents();
        }

        if(_.options.todayHighlight) {
            $('.day[data-date-val="'+_.$current.date+'"]').addClass('calendar-today');
        }

        _.initEventListener();
    };


    EvoCalendar.prototype.buildEventIndicator = function(active_date, type) {
        var _ = this;
        var thisDate = $('[data-date-val="'+active_date+'"]');

        if($('[data-date-val="'+active_date+'"] span.event-indicator').length == 0) {
            thisDate.append('<span class="event-indicator"></span>');
        }

        if($('[data-date-val="'+active_date+'"] span.event-indicator > .type-bullet > .type-'+type).length == 0) {
            var htmlToAppend = '<div class="type-bullet"><div class="type-'+type+'"></div></div>';
            thisDate.find('.event-indicator').append(htmlToAppend);
        }
    }

    EvoCalendar.prototype.removeEventIndicator = function(active_date, type) {
        var _ = this;
        var eventLength = 0;

        // Check if has '.event-indicator' already
        if ($('[data-date-val="'+active_date+'"] span.event-indicator').length == 0) {
            return;
        }

        // Check how many events that has the same type
        for (var i = 0; i < _.options.calendarEvents.length; i++) {
            if(active_date === _.options.calendarEvents[i].date && type === _.options.calendarEvents[i].type) {
                eventLength++;
            }
        }

        // If has no type of event, then delete 
        if (eventLength === 0) {
            $('[data-date-val="'+active_date+'"] span.event-indicator > .type-bullet > .type-'+type).parent().remove();
        }
    }

    // Add calendar events
    EvoCalendar.prototype.initCalendarEvents = function() {
        var _ = this;
        // prevent duplication
        $('.event-indicator').empty();
        // find number of days in month
        var monthLength = _.$label.days_in_month[_.$active.month];

        // compensate for leap year
        if (_.$active.month == 1) { // February only!
            if((_.$active.year % 4 == 0 && _.$active.year % 100 != 0) || _.$active.year % 400 == 0){
                monthLength = 29;
            }
        }
        
        for (var i = 0; i < _.options.calendarEvents.length; i++) {
            for (var x = 0; x < monthLength; x++) {
                var active_date = _.formatDate(_.$label.months[_.$active.month] +'/'+ (x + 1) +'/'+ _.$active.year, _.options.format);
                
                if(active_date==_.options.calendarEvents[i].date) {
                    _.buildEventIndicator(active_date, _.options.calendarEvents[i].type);
                }
                // else if (_.options.calendarEvents[i].everyYear) {
                //     var d = _.formatDate(new Date(active_date), 'mm/dd');
                //     var dd = _.formatDate(new Date(_.options.calendarEvents[i].date), 'mm/dd');
                //     if(d==dd) {
                //         _.buildEventIndicator(active_date, _.options.calendarEvents[i].type);
                //     }
                // }
            }
        };
    };

    
    // Select event
    EvoCalendar.prototype.selectEvent = function(event) {
        var _ = this;
        var el = $(event.target).closest('.event-container');
        var id = $(el).data('eventIndex');
        var index = _.options.calendarEvents.map(function (event) { return event.id }).indexOf(id);
        $(_.$elements.calendarEl).trigger("selectEvent", [id, _.options.calendarEvents[index]])
    }

    // select year
    EvoCalendar.prototype.selectYear = function(event) {
        var _ = this;
        var el, yearVal;

        if (typeof event === 'string' || typeof event === 'number') {
            if ((parseInt(event)).toString().length === 4) {
                _.$elements.activeYearEl = '';
                yearVal = parseInt(event);
            }
        } else {
            _.$elements.activeYearEl = $(event.currentTarget);
            el = $(event.target).closest('[data-year-val]');
            yearVal = $(el).data('yearVal');
        }

        if(yearVal == "prev") {
            --_.$active.year;
        } else if (yearVal == "next") {
            ++_.$active.year;
        } else if (typeof yearVal === 'number') {
            _.$active.year = yearVal;
        }

        $('.calendar-year p').text(_.$active.year);
         _.buildCalendar('inner', null, _.$active.year);
    };

    // select month
    EvoCalendar.prototype.selectMonth = function(event) {
        var _ = this;
        
        if (typeof event === 'string' || typeof event === 'number') {
            if (event >= 0 && event <=_.$label.months.length) {
                // if: 0-11
                _.$elements.activeMonthEl = $('[data-month-val="'+event+'"]');
                _.$active.month = (event).toString();
            } else {
                // else: active month
                _.$elements.activeMonthEl = $('[data-month-val="'+_.$active.month+'"]');
            }
        } else {
            // if month is manually selected
            _.$elements.activeMonthEl = $(event.currentTarget);
            _.$active.month = _.$elements.activeMonthEl.data('monthVal');
        }
        
        $('[data-month-val]').removeClass('active-month');
        _.$elements.activeMonthEl.addClass('active-month');
         _.buildCalendar('inner', _.$active.month);
    };

    
    // select specific date
    EvoCalendar.prototype.selectDate = function(event) {
        var _ = this;
        var oldDate = _.$active.date;
        var date, year, month, day;

        if (typeof event === 'string' || typeof event === 'number' || event instanceof Date) {
            date = new Date(event).getTime();
            year = new Date(date).getFullYear();
            month = new Date(date).getMonth();
            day = new Date(date).getDate();
            
            _.selectYear(year);
            _.selectMonth(month);
            _.$elements.activeDayEl = $('[data-date-val="'+date+'"]');
        } else {
            _.$elements.activeDayEl = $(event.currentTarget);
            date = _.$elements.activeDayEl.data('dateVal')
        }

        // Set new active date
        _.$active.date = date;
        // Remove active class to all
        $('.day').removeClass('calendar-active');
        // Add active class to selected date
        _.$elements.activeDayEl.addClass('calendar-active');
        // Buil event lists
         _.buildCalendar('events');
        $(_.$elements.calendarEl).trigger("selectDate", [_.$active.date, oldDate])
    };
    
    

    /*  
        METHODS
    */
    
    // GET ACTIVE DATE
    EvoCalendar.prototype.getActiveDate = function() {
        var _ = this;
        var active_date = _.formatDate(new Date(_.$active.date), _.options.format, _.options.language);
        return active_date;
    }
    EvoCalendar.prototype.getCurrentDate = function() {
        var _ = this;
        var current_date = _.formatDate(new Date(_.$current.date), _.options.format, _.options.language);
        return current_date;
    }
    
    // GET ACTIVE EVENTS
    EvoCalendar.prototype.getActiveEvents = function() {
        var _ = this;
        for (var i=0; i<_.$active.events.length; i++) {
            _.$active.events[i].date = _.formatDate(new Date(_.$active.events[i].date), _.options.format, _.options.language);
        }
        return _.$active.events;
    }

    // TOGGLE SIDEBAR
    EvoCalendar.prototype.toggleSidebar = function(event) {
        var _ = this;

        if (event === undefined || event.originalEvent) {
            $(_.$elements.calendarEl).toggleClass('sidebar-hide');
        } else {
            if(event) {
                $(_.$elements.calendarEl).removeClass('sidebar-hide');
            } else {
                $(_.$elements.calendarEl).addClass('sidebar-hide');
            }
        }

        // if($(_.$elements.calendarEl).hasClass('sidebar-hide')) {
        //     $(_.$elements.calendarEl).removeClass('sidebar-hide');
        // } else {
        //     $(_.$elements.calendarEl).addClass('sidebar-hide');
        // }
    };

    // TOGGLE EVENT LIST
    EvoCalendar.prototype.toggleEventList = function(event) {
        var _ = this;

        if (event === undefined || event.originalEvent) {
            $(_.$elements.calendarEl).toggleClass('event-hide');
        } else {
            if(event) {
                $(_.$elements.calendarEl).removeClass('event-hide');
            } else {
                $(_.$elements.calendarEl).addClass('event-hide');
            }
        }
        
        // if($(_.$elements.calendarEl).hasClass('event-hide')) {
        //     $(_.$elements.calendarEl).removeClass('event-hide');
        // } else {
        //     $(_.$elements.calendarEl).addClass('event-hide');
        // }
    };

    // ADD CALENDAR EVENT(S)
    EvoCalendar.prototype.addCalendarEvent = function(arr) {
        var _ = this;

        function addEvent(data) {
            if(!data.id) {
                console.log("%c Event named: \""+data.name+"\" doesn't have a unique ID ", "color:white;font-weight:bold;background-color:#e21d1d;");
            }
            if(_.isValidDate(data.date)) {
                data.date = _.formatDate(new Date(data.date), _.options.format);
                // data.date = new Date(data.date).getTime();
                _.options.calendarEvents.push(data);
                _.buildCalendar('inner');
                _.buildCalendar('events');
            }
        }
        if (arr instanceof Array) { // Arrays of events
            for(var i=0; i < arr.length; i++) {
                addEvent(arr[i])
            }
        } else if (typeof arr === 'object') { // Single event
            addEvent(arr)
        }
    };

    // REMOVE CALENDAR EVENT(S)
    EvoCalendar.prototype.removeCalendarEvent = function(arr) {
        var _ = this;

        function deleteEvent(data) {
            // Array index
            var index = _.options.calendarEvents.map(function (event) { return event.id }).indexOf(data);
            
            if (index > 0) {
                var active_date = new Date(_.options.calendarEvents[index].date).getTime();
                var type = _.options.calendarEvents[index].type;
                // Remove event from calendar events
                _.options.calendarEvents.splice(index, 1);
                // Remove event from DOM
                $('[data-event-index="'+data+'"]').remove();
                _.removeEventIndicator(active_date, type);
            } else {
                console.log("%c "+data+": ID not found ", "color:white;font-weight:bold;background-color:#e21d1d;");
            }
        }
        if (arr instanceof Array) { // Arrays of index
            for(var i=0; i < arr.length; i++) {
                deleteEvent(arr[i])
            }
        } else { // Single index
            deleteEvent(arr)
        }
    };

    
	EvoCalendar.prototype.isUTCEquals = function(date1, date2) {
		return (
			date1.getUTCFullYear() === date2.getUTCFullYear() &&
			date1.getUTCMonth() === date2.getUTCMonth() &&
			date1.getUTCDate() === date2.getUTCDate()
		);
	}

    EvoCalendar.prototype.isValidDate = function(d){
        return new Date(d) && !isNaN(new Date(d).getTime());
    }

    $.fn.evoCalendar = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].evoCalendar = new EvoCalendar(_[i], opt);
            else
                ret = _[i].evoCalendar[opt].apply(_[i].evoCalendar, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));