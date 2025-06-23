document.addEventListener('DOMContentLoaded', () => {
    const defaultSettings = {
        images: [
            'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjHPUMwhvqqNjvIXF_SnPhUD65H6hoG0__rOoO7Qnv6AQQXA9VcKQoyinTgLu6vcnNW3CXCHv0NTf41qSmqAHB2PPy69bOHogSBqZvOaarOaL1KBPwY9RIqPML8mh-ACgnZVM1cByNc73o/s1600/4_fraktal3608ab310dc594c738706a02f4962899f.jpg',
            'https://media.istockphoto.com/id/1057506940/ru/%D1%84%D0%BE%D1%82%D0%BE/%D1%86%D0%B2%D0%B5%D1%82%D0%BD%D0%BE%D0%B9-%D0%B2%D0%B7%D1%80%D1%8B%D0%B2-%D0%BF%D0%BE%D1%80%D0%BE%D1%88%D0%BA%D0%B0-%D0%BD%D0%B0-%D1%87%D0%B5%D1%80%D0%BD%D0%BE%D0%BC-%D1%84%D0%BE%D0%BD%D0%B5.jpg?s=612x612&w=0&k=20&c=26Ox6E4zWU3pJPGhRPW-4tiU-Wg2D2Px-iR4Yl42iMs=',
            'https://media.istockphoto.com/id/1140180560/uk/%D1%84%D0%BE%D1%82%D0%BE/%D0%BA%D0%BE%D0%BB%D1%8C%D0%BE%D1%80%D0%BE%D0%B2%D0%B8%D0%B9-%D0%B2%D0%B8%D0%B1%D1%83%D1%85-%D0%BF%D0%BE%D1%80%D0%BE%D1%88%D0%BA%D1%83-%D0%BD%D0%B0-%D1%87%D0%BE%D1%80%D0%BD%D0%BE%D0%BC%D1%83-%D1%82%D0%BB%D1%96.jpg?s=612x612&w=0&k=20&c=lsc0fphPy7bANhHywC7mpeeo0RtLa8qh96D2exL0K6Q=',
            'https://webmaestro.com.ua/img/blog/20181208171932_.jpg',
            'https://static6.depositphotos.com/1003369/659/i/450/depositphotos_6591667-stock-photo-close-up-of-beautiful-womanish.jpg'
        ],
        animationSpeed: 500, 
        autoplay: true, 
        autoplayInterval: 3000, 
        showArrows: true, 
        showDots: true 
    };

    function createSlider(selector, options = {}) {
        const settings = { ...defaultSettings, ...options }; 

        const sliderContainer = document.querySelector(selector);
        if (!sliderContainer) {
            console.error(`Slider container with selector "${selector}" not found.`);
            return;
        }

        const sliderWrapper = sliderContainer.querySelector('.slider-wrapper');
        const prevArrow = sliderContainer.querySelector('.slider-arrow.prev');
        const nextArrow = sliderContainer.querySelector('.slider-arrow.next');
        const dotsContainer = sliderContainer.querySelector('.slider-dots');

        let currentIndex = 0;
        let slideInterval;
        let isTransitioning = false; 

        function renderSlides() {
            sliderWrapper.innerHTML = ''; 
            settings.images.forEach((content, index) => {
                const slide = document.createElement('div');
                slide.classList.add('slider-slide');

                if (typeof content === 'string' && (content.startsWith('http') || content.startsWith('/') || content.startsWith('./'))) {
                    const img = document.createElement('img');
                    img.src = content;
                    img.alt = `Slide ${index + 1}`;
                    slide.appendChild(img);
                } else {
                    slide.innerText = content; 
                }
                sliderWrapper.appendChild(slide);
            });
            sliderWrapper.style.transition = `transform ${settings.animationSpeed / 1000}s ease-in-out`;
        }

        function renderDots() {
            dotsContainer.innerHTML = '';
            if (!settings.showDots) {
                dotsContainer.style.display = 'none';
                return;
            } else {
                dotsContainer.style.display = 'flex';
            }

            settings.images.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === currentIndex) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    if (isTransitioning) return;
                    goToSlide(index);
                });
                dotsContainer.appendChild(dot);
            });
        }

        function goToSlide(index) {
            if (isTransitioning) return; 

            const numSlides = settings.images.length;

            if (index < 0) {
                currentIndex = numSlides - 1;
            } else if (index >= numSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            isTransitioning = true;
            sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

            setTimeout(() => {
                isTransitioning = false;
                updateDots();
            }, settings.animationSpeed);
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function updateDots() {
            if (!settings.showDots) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function toggleArrows() {
            if (settings.showArrows) {
                prevArrow.style.display = 'flex';
                nextArrow.style.display = 'flex';
            } else {
                prevArrow.style.display = 'none';
                nextArrow.style.display = 'none';
            }
        }

        function startAutoplay() {
            if (settings.autoplay) {
                clearInterval(slideInterval); 
                slideInterval = setInterval(nextSlide, settings.autoplayInterval);
            }
        }

        function stopAutoplay() {
            clearInterval(slideInterval);
        }

        sliderContainer.addEventListener('mouseover', stopAutoplay);
        sliderContainer.addEventListener('mouseout', startAutoplay);

        document.addEventListener('keydown', (event) => {
            if (isTransitioning) return;
            if (event.key === 'ArrowLeft') {
                prevSlide();
            } else if (event.key === 'ArrowRight') {
                nextSlide();
            }
        });

        function init() {
            renderSlides();
            renderDots();
            toggleArrows();
            startAutoplay();
            updateDots(); 
        }

        init(); 

        prevArrow.addEventListener('click', () => {
            if (isTransitioning) return;
            prevSlide();
        });
        nextArrow.addEventListener('click', () => {
            if (isTransitioning) return;
            nextSlide();
        });
    }

    createSlider('#mySlider');

});