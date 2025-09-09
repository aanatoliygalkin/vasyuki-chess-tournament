    function initSlider(sliderElement) {
            const wrapperClass = ['.slider1-wrapper', '.slider2-wrapper', '.slider-wrapper'];
            let slides = null;

            for (const cls of wrapperClass) {
                slides = sliderElement.querySelector(cls);
                if (slides) break;
            }

            if (!slides) {
                console.warn('Не найден .slider-wrapper в слайдере', sliderElement);
                return;
            }

            const slideElements = sliderElement.querySelectorAll('.slider-slide');
            const prevBtn = sliderElement.querySelector('.prevBtn');
            const nextBtn = sliderElement.querySelector('.nextBtn');
            const paginationContainer = sliderElement.querySelector('.pagination');

            if (!slideElements.length || !prevBtn || !nextBtn || !paginationContainer) {
                console.warn('Не все элементы найдены в слайдере', sliderElement);
                return;
            }

            let currentIndex = 0;
            const totalSlides = slideElements.length;

            const isLoop = sliderElement.classList.contains('slider2');
            const autoPlayInterval = isLoop ? 4000 : null;

            const slideWidth = slideElements[0].offsetWidth || 335;
            const gap = parseInt(getComputedStyle(slides).gap) || 20;

            let autoPlayTimer = null;

            function updateButtonState() {
                if (isLoop) {
                    prevBtn.disabled = false;
                    nextBtn.disabled = false;
                    prevBtn.style.opacity = '1';
                    nextBtn.style.opacity = '1';
                    prevBtn.style.cursor = 'pointer';
                    nextBtn.style.cursor = 'pointer';
                } else {
                    prevBtn.disabled = currentIndex === 0;
                    nextBtn.disabled = currentIndex === totalSlides - 1;

                    prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
                    nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
                    prevBtn.style.cursor = prevBtn.disabled ? 'not-allowed' : 'pointer';
                    nextBtn.style.cursor = nextBtn.disabled ? 'not-allowed' : 'pointer';
                }
            }
            function createPagination() {
                paginationContainer.innerHTML = '';

                if (sliderElement.classList.contains('slider2')) {
                    const textNode = document.createElement('span');
                    textNode.classList.add('slider-numbers');
                    textNode.textContent = `${currentIndex + 1}/${totalSlides}`;
                    paginationContainer.appendChild(textNode);
                } else {
                    slideElements.forEach((_, index) => {
                        const dot = document.createElement('div');
                        dot.classList.add('pagination-dot');
                        if (index === currentIndex) dot.classList.add('active');
                        dot.addEventListener('click', () => goToSlide(index));
                        paginationContainer.appendChild(dot);
                    });
                }
            }

            function updateSliderPosition() {
                const offset = currentIndex * (slideWidth + gap);
                slides.style.transform = `translateX(-${offset}px)`;

                if (sliderElement.classList.contains('slider2')) {
                    const textNode = paginationContainer.querySelector('span');
                    if (textNode) {
                        textNode.textContent = `${currentIndex + 1}/${totalSlides}`;
                    }
                } else {
                    const dots = paginationContainer.querySelectorAll('.pagination-dot');
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentIndex);
                    });
                }

                updateButtonState();
            }

            function goToSlide(index) {
                if (index < 0) {
                    currentIndex = totalSlides - 1;
                } else if (index >= totalSlides) {
                    currentIndex = 0;
                } else {
                    currentIndex = index;
                }
                updateSliderPosition();
                resetAutoPlay();
            }

            nextBtn.addEventListener('click', () => {
                if (isLoop || currentIndex < totalSlides - 1) {
                    goToSlide(currentIndex + 1);
                }
            });

            prevBtn.addEventListener('click', () => {
                if (isLoop || currentIndex > 0) {
                    goToSlide(currentIndex - 1);
                }
            });

            function startAutoPlay() {
                if (!isLoop || !autoPlayInterval) return;

                if (autoPlayTimer !== null) return;

                function play() {
                    goToSlide(currentIndex + 1);
                    autoPlayTimer = setTimeout(play, autoPlayInterval);
                }

                autoPlayTimer = setTimeout(play, autoPlayInterval);
            }

            function stopAutoPlay() {
                if (autoPlayTimer !== null) {
                    clearTimeout(autoPlayTimer);
                    autoPlayTimer = null;
                }
            }

            function resetAutoPlay() {
                if (isLoop) {
                    stopAutoPlay();
                    startAutoPlay();
                }
            }

            sliderElement.addEventListener('mouseenter', () => {
                if (isLoop) stopAutoPlay();
            });

            sliderElement.addEventListener('mouseleave', () => {
                if (isLoop) startAutoPlay();
            });

            createPagination();
            updateSliderPosition();

            if (isLoop) {
                startAutoPlay();
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.slider').forEach(initSlider);
        });