import AmountWidget from "./AmountWidget.js";
import { select, templates } from '../settings.js'; 
import DatePicker from './DatePicker.js';
import HourPicker from "./HourPicker.js";

class Booking {
    constructor(element) {
        const thisBooking = this;

        thisBooking.element = element;
        thisBooking.render(); 
        thisBooking.initWidgets();
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