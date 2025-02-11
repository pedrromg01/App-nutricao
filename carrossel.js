const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

// Calcula a largura exata para 3 slides sem cortes
const carouselContainer = document.querySelector('.carousel-track-container');
const slideWidth = carouselContainer.offsetWidth / 3; // Divide o contêiner por 3 para largura exata

let currentIndex = 0;
const slidesToShow = 3; // Quantos slides aparecem por vez
const totalSlides = slides.length;

// Define o posicionamento inicial e largura exata de cada slide
slides.forEach((slide) => {
    slide.style.flex = `0 0 ${slideWidth}px`; // Configura flex para exibir exatamente 3 slides
});

// Função para mover o carrossel para um índice específico
const moveToSlide = (index) => {
    track.style.transform = `translateX(-${slideWidth * index}px)`;
    currentIndex = index;
};

// Lógica do botão 'Next'
nextButton.addEventListener('click', () => {
    const maxIndex = totalSlides - slidesToShow; // Índice máximo sem cortar
    if (currentIndex < maxIndex) {
        moveToSlide(currentIndex + 1);
    } else {
        moveToSlide(0); // Retorna ao início quando atinge o final
    }
});

// Lógica do botão 'Prev'
prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        moveToSlide(currentIndex - 1);
    } else {
        moveToSlide(totalSlides - slidesToShow); // Vai para o final quando atinge o início
    }
});
