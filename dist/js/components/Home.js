import { select, templates } from '../settings.js';
import utils from '../utils.js';
class Home {
    constructor() {
        const thisHome = this;
        
        thisHome.render();
        thisHome.initActions();
    }

    render() {
        const thisHome = this;

        const generatedHTML = templates.homePage();

        thisHome.element = utils.createDOMFromHTML(generatedHTML);
              
              const homeContainer = document.querySelector(select.containerOf.homePage);
              
              homeContainer.appendChild(thisHome.element);
    }

    initWidget() {
        
    }

    initActions() {
        const thisHome = this;

        const orderLink = document.querySelector('a[href="#order"]');

        orderLink.addEventListener('click', function (event) {
            event.preventDefault();

            const orderNavLink = document.querySelector('.main-nav a[href="#order"]');

            const navLinks = document.querySelectorAll('.main-nav a');

            for (let link of navLinks) {
                if(link.classList.contains('active')) {
                    link.classList.remove('active');
                }
            }

            orderNavLink.classList.add('active');
        })
    }
}

export default Home;