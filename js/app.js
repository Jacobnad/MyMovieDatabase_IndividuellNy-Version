'use strict';

// Importera moduler
import apiHandler from "./fetchData.js";
import pagination from "./pagination.js";

// Inställningar för filmer
const movieSettings = {
    currentPage: 1,
    moviesPerPage: 4,
    shuffledMovies: [],
};


// Lyssna på när DOM är laddad
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded');
    try {

        await initiateMovieTrailersFetching();
        await fetchTopMovies();
   
    } catch (error) {
        console.error(error);
    }

    document.querySelector('.navSearch').addEventListener('submit', searchMovies);
    



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


// Hämta toppfilmer och behandla dem
function fetchTopMovies() {
    const handleMoviesAfterFetch = movies => {
        console.log('Movies:', movies);
        movieSettings.shuffledMovies = shuffleArray(movies);
        console.log('Shuffled movies array:', movieSettings.shuffledMovies);
        handleMovies();
    };

    if (!movieSettings.shuffledMovies.length) {
        apiHandler.fetchData('https://santosnr6.github.io/Data/movies.json')
            .then(handleMoviesAfterFetch)
            .catch(error => {
                console.error(error);
                throw error;
            });
    } else {
        handleMovies();
    }
}


// Hantera filmer
function handleMovies() {
    const currentMovies = pagination.paginate(movieSettings.shuffledMovies, movieSettings.currentPage, movieSettings.moviesPerPage);

    const moviesContainer = document.querySelector('.sectionTop20Container');
    if (moviesContainer) {
        renderMovies(currentMovies, moviesContainer);
    }
}



// Rendera filmer
function renderMovies(movies = [], shuffle = false) {
    const moviesContainer = document.querySelector('.sectionTop20Container');

    if (moviesContainer) {
        moviesContainer.innerHTML = '';

        const movieCardsContainer = createMovieCardsContainer(movies, shuffle);
        moviesContainer.appendChild(movieCardsContainer);

        renderPagination(movies);
    }
}


// Skapa behållare för filmkort
function createMovieCardsContainer(movies, shuffle) {
    const movieCardsContainer = document.createElement('section');
    movieCardsContainer.className = 'imageTop20Container';

    const moviesToRender = shuffle ? shuffleArray(movies) : movies;

    moviesToRender.forEach(movie => {
        movieCardsContainer.appendChild(createMovieCard(movie));
    });

    return movieCardsContainer;
}


// Skapa ett filmkort
function createMovieCard(movie) {
    const normalizedMovie = normalizeMovieData(movie);
    const movieCard = document.createElement('section');
    movieCard.className = 'top20Img';

    const posterImage = document.createElement('img');
    posterImage.src = normalizedMovie.poster === 'N/A' ? 'res/logo.png' : normalizedMovie.poster;
    posterImage.alt = `${normalizedMovie.title} movie poster`;
    posterImage.className = 'top20title';

    const movieTitle = document.createElement('h2');
    movieTitle.className = 'movie-title';
    movieTitle.textContent = normalizedMovie.title;

    movieCard.append(posterImage, movieTitle);

    movieCard.addEventListener('click', async () => {
        const imdbIdProperty = movie.hasOwnProperty('imdbID') ? 'imdbID' : 'imdbid';
        const movieDetails = await apiHandler.fetchData(`http://www.omdbapi.com/?apikey=391ecd34&i=${movie[imdbIdProperty]}&plot=full`);
        populateModal(top20InfoContainer, movieDetails);
        top20InfoContainer.style.display = 'block';
    });

    return movieCard;
}


// Skapa top20InfoContainer och stängknapp
const top20InfoContainer = createModal();
const closeButton = top20InfoContainer.querySelector('.style-botton');

closeButton.addEventListener('click', () => top20InfoContainer.style.display = 'none');


// Rendera paginering
function renderPagination() {
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'top20pagiation';

    const prevArrow = createArrow('fa-chevron-left');
    const nextArrow = createArrow('fa-chevron-right');
    const nextPageText = document.createElement('span');
    nextPageText.id = 'page-text';

    [prevArrow, nextArrow].forEach(arrow => {
        arrow.classList.add('arrow-hover');
        arrow.addEventListener('click', arrow === prevArrow ? handlePrevArrowClick : handleNextArrowClick);
    });

    const totalPages = Math.ceil(movieSettings.shuffledMovies.length / movieSettings.moviesPerPage);
    nextPageText.textContent = `Page ${movieSettings.currentPage} of ${totalPages}`;

    paginationContainer.append(prevArrow, nextPageText, nextArrow);

    const moviesContainer = document.querySelector('.sectionTop20Container');
    if (!moviesContainer) {
        console.error('Movies container not found');
        return;
    }

    const movieCardsContainer = document.querySelector('.found-movie-cards-container');
    if (movieCardsContainer) {
        moviesContainer.appendChild(movieCardsContainer);
    }

    moviesContainer.appendChild(paginationContainer);
}



// Skapa en pil
function createArrow(iconClass,) {
    const arrow = document.createElement('i');
    arrow.className = `fas ${iconClass} top20Arrow`;
    arrow.setAttribute('aria-hidden', 'true');
    arrow.style.cursor = 'pointer';
    return arrow;
}


// Hantera klick på pil till vänster
function handlePrevArrowClick() {
    movieSettings.currentPage = Math.max(1, movieSettings.currentPage - 1);
    fetchTopMovies();
}


// Hantera klick på pil till höger
function handleNextArrowClick() {
    const totalPages = Math.ceil(movieSettings.shuffledMovies.length / movieSettings.moviesPerPage);
    
    if (movieSettings.currentPage < totalPages) {
        movieSettings.currentPage += 1;
    } else {
        movieSettings.currentPage = totalPages;
    }

    fetchTopMovies();
}


// Blanda en array
function shuffleArray(array) {
    const shuffledIndices = Array.from({ length: array.length }, (_, index) => index);
    
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }

    return shuffledIndices.map(index => array[index]);
}


function createModal() {
    const top20InfoContainer = document.createElement('div');
    top20InfoContainer.classList.add('top20InfoContainer');
    top20InfoContainer.style.display = 'none';

    const modalContent = document.createElement('div');
    modalContent.classList.add('top20InfoContainer-content');

    const closeButton = createCloseButton();

    const movieDetails = document.createElement('div');
    movieDetails.classList.add('movie-details');

    modalContent.append(closeButton, movieDetails);

    top20InfoContainer.appendChild(modalContent);
    document.body.appendChild(top20InfoContainer);

    return top20InfoContainer;
}

function createCloseButton() {
    return createElement('span', 'style-botton', '&times;');
}

function createElement(tag, className, innerHTML) {
    const element = document.createElement(tag);
    element.classList.add(className);
    element.innerHTML = innerHTML;
    return element;
}


// Fyll top20InfoContainer med filminformation
function populateModal(top20InfoContainer, movie) {
    const movieDetails = top20InfoContainer.querySelector('.movie-details');
    const modalContent = top20InfoContainer.querySelector('.top20InfoContainer-content');

    movieDetails.style.display = 'flex';
    movieDetails.style.flexDirection = 'column';
    movieDetails.style.alignItems = 'center';

    const posterContainer = document.createElement('div');
    posterContainer.classList.add('top20title');
    const posterImage = document.createElement('img');
    posterImage.src = movie.Poster === 'N/A' ? 'res/logo.png' : movie.Poster;
    posterImage.alt = `${movie.Title} movie poster`;
    posterContainer.appendChild(posterImage);

    const movieInfo = document.createElement('section');
    movieInfo.classList.add('rop20Information');
    const titleElement = document.createElement('h2');
    titleElement.textContent = movie.Title;

    const details = ['Year', 'Runtime', 'Genre', 'Director', 'Actors', 'Country', 'Awards', 'imdbRating', 'BoxOffice'];

    details.forEach(detail => {
        const detailElement = document.createElement('p');
        detailElement.textContent = `${detail}: ${movie[detail] || 'N/A'}`;
        movieInfo.appendChild(detailElement);
    });

    const plotElement = document.createElement('p');
    plotElement.textContent = movie.Plot;

    movieDetails.innerHTML = '';
    movieDetails.appendChild(posterContainer);
    movieDetails.appendChild(movieInfo);
    movieDetails.appendChild(plotElement);

    modalContent.style.background = '#000000';
}



// Normalisera filminformation
function normalizeMovieData(movie) {
    return Object.fromEntries(
        Object.entries(movie)
            .map(([key, value]) => [key.toLowerCase(), value])
    );
}

 
// Funktion för att söka filmer
async function searchMovies(event) {
    // Förhindra standardbeteendet för formulär
    event.preventDefault();

    // Hämta referens till felmeddelandekontainer
    const errorRef = document.querySelector('.errorMsg');
    errorRef.style.display = 'none'; // Dölj felmeddelandet från tidigare sökning
    errorRef.innerHTML = ''; // Rensa tidigare felmeddelanden

    // Hämta sökterm från inputfältet
    const query = document.querySelector('.searchInput').value;
    console.log(`Searching for: ${query}`);

    try {
        // Hämta data från API 
        const response = await apiHandler.fetchData(`http://www.omdbapi.com/?apikey=db27598d&s=${query}`);
        console.log("API Response:", response);

        // Hämta sidans namn från URL:en
        const page = window.location.pathname.split('/').pop();

        // Kontrollera om API-anropet var framgångsrikt
        if (response.Response === "True") {
            // Om sidan är index.html, rensa innehåll och visa sökresultat
            if (page === 'index.html') {
                clearMainContent();
                displaySearchResults(response.Search);
                foundMovies = response.Search; // Spara sökresultaten för framtida användning
                renderMovies(foundMovies); // Rendera sökresultaten i gränssnittet
                currentPage = 1;
            } else {
                // Visa felmeddelande om sidan inte är index.html
                displayErrorMessage(response.Error);
            }
        } else {
            // Visa felmeddelande om API-svarar med fel
            displayErrorMessage(response.Error);
        }
    } catch (error) {
       
    }
}

// Funktion för att visa sökresultat
function displaySearchResults(movies) {
    const parentContainer = document.getElementById('SerchMovieContainer');
    parentContainer.innerHTML = ''; // Rensa tidigare sökresultat från containern

    // Loopa genom varje film i sökresultaten och skapa ett kort för varje film
    movies.forEach((movie) => {
        const movieCard = createMovieCards(movie);
        parentContainer.appendChild(movieCard); // Lägg till filmkortet i föräldercontainern
    });
}

// Funktion för att skapa ett filmkort
function createMovieCards(movie) {
    const normalizedMovie = normalizeMovieData(movie);
    const movieCard = document.createElement('section');
    movieCard.className = 'searchImg';

    // Skapa en bild för filmens poster
    const posterImage = document.createElement('img');
    posterImage.src = normalizedMovie.poster === 'N/A' ? 'res/logo.png' : normalizedMovie.poster;
    posterImage.alt = `${normalizedMovie.title} movie poster`;
    posterImage.className = 'top20title';

    // Skapa en rubrik för filmens titel
    const movieTitle = document.createElement('h2');
    movieTitle.className = 'movie-title';
    movieTitle.textContent = normalizedMovie.title;

    // Lägg till bild och rubrik till filmkortet
    movieCard.append(posterImage, movieTitle);

    // Lägg till en klickhändelse för att visa detaljer när användaren klickar på filmkortet
    movieCard.addEventListener('click', async () => {
        const imdbIdProperty = movie.hasOwnProperty('imdbID') ? 'imdbID' : 'imdbid';
        const movieDetails = await apiHandler.fetchData(`http://www.omdbapi.com/?apikey=391ecd34&i=${movie[imdbIdProperty]}&plot=full`);
        populateModal(top20InfoContainer, movieDetails);
        top20InfoContainer.style.display = 'block';
    });

    return movieCard;
}

// Funktion för att rensa huvudinnehållet
function clearMainContent() {
    const mainRef = document.querySelector('.mainContaier');
    mainRef.innerHTML = '';

    const paginationContainer = document.querySelector('.top20Container');
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
    }

    const topHeaderContainer = document.querySelector('.top-header');
    if (topHeaderContainer) {
        topHeaderContainer.innerHTML = '';
    }
}

// Funktion för att visa felmeddelanden
function displayErrorMessage(errorMessage) {
    console.error(`Error from API: ${errorMessage}`);
    const errorMessageSpan = document.createElement('span');
    errorMessageSpan.className = 'error-message';
    errorMessageSpan.textContent = errorMessage;
    const errorRef = document.querySelector('.errorMsg');
    errorRef.style.display = 'block';
    errorRef.appendChild(errorMessageSpan);
}
