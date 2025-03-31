import AmountWidget from "./AmountWidget.js";
import { select, templates } from '../settings.js'; 

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
        console.log('templates.bookingWidget:', templates.bookingWidget);
        console.log('generatedHTML',generatedHTML);
        thisBooking.dom = {};

        thisBooking.dom.wrapper = thisBooking.element;
        thisBooking.dom.wrapper.innerHTML = generatedHTML;
        thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    }

    initWidgets() {
        const thisBooking = this;
        thisBooking.dom.amountWidget0 = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.dom.amountWidget1 = new AmountWidget(thisBooking.dom.hoursAmount);

        thisBooking.dom.peopleAmount.addEventListener('updated', function(){
        });
        thisBooking.dom.hoursAmount.addEventListener('updated', function(){
        });
    }
} 

export default Booking