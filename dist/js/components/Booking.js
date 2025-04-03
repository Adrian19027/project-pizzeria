import AmountWidget from "./AmountWidget.js";
import { select, templates, settings, classNames} from '../settings.js'; 
import DatePicker from './DatePicker.js';
import HourPicker from "./HourPicker.js";
import utils from "../utils.js";

class Booking {
    constructor(wrapper) {
        const thisBooking = this;

        thisBooking.render(wrapper); 
        thisBooking.initWidgets();
        thisBooking.getData();
        thisBooking.selectedTable = null;
        thisBooking.sendBooking();
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
            // console.log(bookings);
            // console.log(eventsCurrent);
             // console.log(eventsRepeat);
             thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
         });
    }

    parseData(bookings, eventsCurrent, eventsRepeat) {
        const thisBooking = this;

        thisBooking.booked = {};

        for (let item of bookings){
            thisBooking.makeBooked(item.date,item.hour,item.duration,item.table);
        }

        for (let item of eventsCurrent){
            thisBooking.makeBooked(item.date,item.hour,item.duration,item.table);
        }

        const minDate = thisBooking.datePicker.minDate;
        const maxDate = thisBooking.datePicker.maxDate;


        for (let item of eventsRepeat) {
            if (item.repeat == 'daily') {
                for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
                    thisBooking.makeBooked(utils.dateToStr(loopDate),item.hour,item.duration,item.table);    
                } 
            }
        }
        // console.log('thisBooking.booked', thisBooking.booked);
        
        thisBooking.updateDOM();
    }

    makeBooked(date, hour, duration, table) {
        const thisBooking = this;

        if (typeof thisBooking.booked[date] == 'undefined') {
            thisBooking.booked[date] = {};
        }

        const startHour = utils.hourToNumber(hour);

        for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
            // console.log('loop', hourBlock);
            
            if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
            thisBooking.booked[date][hourBlock] = [];
        }

            thisBooking.booked[date][hourBlock].push(table);
        }
    }

    updateDOM() {
        const thisBooking = this;

        thisBooking.date = thisBooking.datePicker.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

        let allAvailable = false;

        if (
            typeof thisBooking.booked[thisBooking.date] == 'undefined'
            ||
            typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
        ) {
            allAvailable = true;
        }

        for (let table of thisBooking.dom.tables) {
            let tableId = table.getAttribute(settings.booking.tableIdAttribute);
            if (!isNaN(tableId)) {
                tableId = parseInt(tableId);
            }

            if (
                !allAvailable
                &&
                thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) > -1
            ) {
                table.classList.add(classNames.booking.tableBooked);
            } else {
                table.classList.remove(classNames.booking.tableBooked);
            }
        }
    }

    render(wrapper) {
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget(); // NIE BYŁO ZAZNACZONE ŻE templates.bookingWidget TO funkcja...
        // console.log('templates.bookingWidget:', templates.bookingWidget());
        // console.log('generatedHTML',generatedHTML);
        thisBooking.dom = {};

        thisBooking.dom.wrapper = wrapper;

        thisBooking.dom.wrapper.innerHTML = generatedHTML;

        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

        thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
        thisBooking.dom.tablesContainer = thisBooking.dom.wrapper.querySelector('.floor-plan');
        thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
        thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
        thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    }

    initWidgets() {
        const thisBooking = this;
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

        thisBooking.dom.peopleAmount.addEventListener('updated', function(){
        });
        thisBooking.dom.hoursAmount.addEventListener('updated', function(){
        });
        thisBooking.dom.datePicker.addEventListener('updated', function(){
        });
        thisBooking.dom.hourPicker.addEventListener('updated', function(){
        });

        thisBooking.dom.wrapper.addEventListener('updated', function () {
            thisBooking.updateDOM();
            // "zerowanie" wyboru stolika przy zmianie godziny czy daty:
            const selectedTable = thisBooking.dom.tablesContainer.querySelector('.table.selected');
            if (selectedTable) {
                selectedTable.classList.remove('selected');
            }
        });

        thisBooking.dom.tablesContainer.addEventListener('click', function (event) {
            console.log('cliknieto stolik');
            thisBooking.initTables(event);
        })


    }

    initTables(event) {
        const thisBooking = this;

        const clickedTable = event.target.closest('.table');
        const tableId = clickedTable.getAttribute(settings.booking.tableIdAttribute);

        if (clickedTable && clickedTable.classList.contains('table')) {
            

            if (clickedTable.classList.contains(classNames.booking.tableBooked)) {
                alert('Ten stolik jest już zajęty');
            } else {
                if (thisBooking.selectedTable && thisBooking.selectedTable !== tableId) {
                    const previousSelectedTable = thisBooking.dom.wrapper.querySelector('.table.selected');
                    if (previousSelectedTable) {
                        previousSelectedTable.classList.remove('selected');
                    }
                }
            
                if (!clickedTable.classList.contains('selected')) {
                    thisBooking.selectedTable = tableId;
                    clickedTable.classList.add('selected');
                } else {
                    clickedTable.classList.remove('selected');
                }
            }
        }
    }

    sendBooking() {
      const thisBooking = this;
      const url = settings.db.url + '/' + settings.db.bookings;

        thisBooking.payload = {};
        thisBooking.payload.date = thisBooking.dom.datePicker.value;
        thisBooking.payload.hour = thisBooking.dom.hourPicker.value;
        thisBooking.payload.table = thisBooking.selectedTable;
        thisBooking.payload.duration = thisBooking.dom.hoursAmount;
        thisBooking.payload.ppl = thisBooking.dom.peopleAmount;
        thisBooking.payload.phone = thisBooking.dom.phone.value;
        thisBooking.payload.address = thisBooking.dom.address.value;    
        thisBooking.payload.starters = [];

      for (let prod of thisBooking.products) {
        thisBooking.payload.products.push(prod.getData());
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thisBooking.payload),
      };

      fetch(url, options);
      
      console.log('thisBooking.payload:',thisBooking.payload);
    }
    
}

export default Booking;