import AmountWidget from "./AmountWidget.js";
import { select, templates, settings} from '../settings.js'; 
import DatePicker from './DatePicker.js';
import HourPicker from "./HourPicker.js";
import utils from "../utils.js";

class Booking {
    constructor(element) {
        const thisBooking = this;

        thisBooking.element = element;
        thisBooking.render(); 
        thisBooking.initWidgets();
        thisBooking.getData();
    }

    getData() {
        const thisBooking = this;

        const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
        const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

        const params = {
            booking: [
                startDateParam,
                endDateParam,
            ],
            eventsCurrent: [
                settings.db.notRepeatParam,
                startDateParam,
                endDateParam,
            ],
            eventsRepeat: [
                settings.db.repeatParam,
                endDateParam,
           ],
        };

        // console.log('getData params',params);

        const urls = {
            booking:       settings.db.url + '/' + settings.db.bookings + '?' + params.booking.join('&'),
            eventsCurrent: settings.db.url + '/' + settings.db.events   + '?' + params.eventsCurrent.join('&'),
            eventsRepeat:  settings.db.url + '/' + settings.db.events   + '?' + params.eventsRepeat.join('&'),
        };

        // console.log('getData urls', urls);

        Promise.all([
            fetch(urls.booking),
            fetch(urls.eventsCurrent),
            fetch(urls.eventsRepeat),
        ])
            .then(function (allResponses) {
                const bookingResponse = allResponses[0];
                const eventsCurrentResponse = allResponses[1];
                const eventsRepeatResponse = allResponses[2];
                return Promise.all([
                    bookingResponse.json(),
                    eventsCurrentResponse.json(),
                    eventsRepeatResponse.json(),
                ]);
        })
         .then(function ([bookings, eventsCurrent, eventsRepeat]) {
            console.log(bookings); 
            console.log(eventsCurrent);
            console.log(eventsRepeat);
         });
    }

    render() {
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget(); // NIE BYŁO ZAZNACZONE ŻE templates.bookingWidget TO funkcja...
        // console.log('templates.bookingWidget:', templates.bookingWidget());
        // console.log('generatedHTML',generatedHTML);
        thisBooking.dom = {};

        thisBooking.dom.wrapper = thisBooking.element;
        thisBooking.dom.wrapper.innerHTML = generatedHTML;
        thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
        thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
    }

    initWidgets() {
        const thisBooking = this;
        thisBooking.dom.amountWidget0 = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.dom.amountWidget1 = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.dom.amountWidget2 = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.dom.amountWidget3 = new HourPicker(thisBooking.dom.hourPicker);

        thisBooking.datePicker = thisBooking.dom.amountWidget2;
        thisBooking.hourPicker = thisBooking.dom.amountWidget3;

        thisBooking.dom.peopleAmount.addEventListener('updated', function(){
        });
        thisBooking.dom.hoursAmount.addEventListener('updated', function(){
        });
        thisBooking.dom.datePicker.addEventListener('updated', function(){
        });
        thisBooking.dom.hourPicker.addEventListener('updated', function(){
        });
    }
} 

export default Booking