import { select, templates } from '../settings.js';
import utils from '../utils.js';
class Home {
    constructor() {
        const thisHome = this;
        
        thisHome.render();
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
        
    }
}

export default Home;