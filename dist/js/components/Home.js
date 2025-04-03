
class Home {
    constructor() {
        
    }

    render() {
       const thisHome = this;
    }

    initWidget() {
        const thisHome = this;

        document.addEventListener('DOMContentLoaded', () => {
            // Inicjalizacja karuzeli Flickity
            const testimonialCarousel = document.querySelector('.home__testimonial-carousel .carousel-track');
            const flickity = new Flickity(testimonialCarousel, {
                autoPlay: 3000,   // Automatyczne przewijanie co 3 sekundy
                wrapAround: true, // Nieskończone przewijanie
                pageDots: false,  // Ukrywanie kropek nawigacji
                prevNextButtons: false, // Ukrywanie przycisków poprzedni/następny
            });
        })
    }
}

export default Home;