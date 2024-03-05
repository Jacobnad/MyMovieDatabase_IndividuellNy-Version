'use strict';

// Importera moduler
import apiHandler from "./fetchData.js";

// Lyssna på när DOM är laddad
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded');
    await initiateMovieTrailersFetching();
   
   
});

// Hämta filmtrailers när sidan laddas
async function initiateMovieTrailersFetching() {
    try {
        const data = await fetchDataFromAPI('https://santosnr6.github.io/Data/movies.json');
        const selectedTrailers = getRandomTrailers(data, 5);
        displayCarousel(selectedTrailers);
    } catch (error) {
        handleFetchError(error);
    }
}

// Hämta data från API
async function fetchDataFromAPI(url) {
    try {
        const data = await apiHandler.fetchData(url);
        return data;
    } catch (error) {
        throw error;
    }
}

// Hantera fel vid hämtning av data
function handleFetchError(error) {
    console.error(error);
    throw error;
} 

// Hämta slumpmässiga trailers från en array
function getRandomTrailers(array, count) {
    const shuffledArray = array.slice().sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, count);
}

// Visa en bildkarusell med trailers
function displayCarousel(trailers) {
    const carousel = createCarousel(trailers);
    const carouselContainer = createCarouselContainer(carousel);

    const trailerContainer = document.querySelector('.mainContaierChild.mainContainerAndraChild');
    trailerContainer.appendChild(carouselContainer);

    appendArrowsToCarousel(carouselContainer, carousel, trailers);
}

// Skapa en bildkarusell
function createCarousel(trailers) {
    const carousel = document.createElement('div');
    carousel.className = 'Youtubearousel';

    trailers.forEach((trailer, index) => {
        const trailerElement = createTrailerElement(trailer, index === 0);
        carousel.appendChild(trailerElement);
    });

    return carousel;
}

// Skapa en behållare för bildkarusellen
function createCarouselContainer(carousel) {
    const carouselContainer = document.createElement('section');
    carouselContainer.className = 'youtubeTrailerCarousel';
    carouselContainer.appendChild(carousel);
    return carouselContainer;
}

// Skapa ett ifram-element för en trailer
function createTrailerElement(trailer, isVisible) {
    const trailerElement = document.createElement('iframe');
    setTrailerAttributes(trailerElement, trailer, isVisible);
    return trailerElement;
}

// Sätt attribut för ett trailer-element
function setTrailerAttributes(element, trailer, isVisible) {
    element.src = trailer.trailer_link;
    element.className = 'mainYoutubeCarouselContainer';
    element.style.display = isVisible ? 'block' : 'none';
    element.width = "650";
    element.height = "400";
    element.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    element.allowFullscreen = true;
}

// Lägg till pilknappar till bildkarusellen
function appendArrowsToCarousel(container, carousel, trailers) {
    const arrowsContainer = document.createElement('div');
    arrowsContainer.className = 'YoutubeFlexContainer';

    const leftArrow =  createTrailerPagiation('fa-chevron-left', 'Left Arrow', true);
    const rightArrow =  createTrailerPagiation('fa-chevron-right', 'Right Arrow', true);

    let currentIndex = 0;

    leftArrow.addEventListener('click', () => {
        toggleCarouselDisplay(currentIndex, carousel);
        currentIndex = (currentIndex - 1 + trailers.length) % trailers.length;
        toggleCarouselDisplay(currentIndex, carousel);
    });

    rightArrow.addEventListener('click', () => {
        toggleCarouselDisplay(currentIndex, carousel);
        currentIndex = (currentIndex + 1) % trailers.length;
        toggleCarouselDisplay(currentIndex, carousel);
    });

    arrowsContainer.appendChild(leftArrow);
    arrowsContainer.appendChild(rightArrow);

    container.appendChild(arrowsContainer);
}


// Skapa en pagineringspil
function createTrailerPagiation(iconClass, altText, isCarouselArrow) {
    const arrow = document.createElement('i');
    
    if (isCarouselArrow) {
        arrow.classList.add('youtubeCarouselPilar', `youtubeCarouselPilar--${iconClass}`);
    }
    
    arrow.classList.add('fa', iconClass);
    arrow.setAttribute('aria-label', altText);
    
    return arrow;
}


// Växla display för bildkarusellen
const toggleCarouselDisplay = function(currentIndex, carousel) {
    if (carousel !== null) {
        Array.from(carousel.children).forEach(child => {
            child.style.display = 'none';
        });
        carousel.children[currentIndex].style.display = 'block';
    } else {
        console.error('Carousel is null');
    }
};