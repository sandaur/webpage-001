/*
    .slider > .slider__slide
*/

class Slider {
    constructor(sliderElement, slider_tt, slider_st, autoTransition) {
        this.sliderElement = sliderElement
        this.slides = sliderElement.getElementsByClassName("slider__slide");
        this.progressbar;
        this.currentSlide = 0;
        this.sliderEnable = true;
        this.autoTransition = autoTransition || 'running';

        this.SLIDER_TRANSITION_TIME = slider_tt;
        this.SLIDER_SLEEP_TIME = slider_st;

        this.initializeSelectors();
        this.initializeProgressbar();

        document.addEventListener("DOMContentLoaded", (function() {
            this.changeSlide();
        }).bind(this), false);
    }

    changeSlide(slideIndex) {
        if (this.sliderEnable){
            this.currentSlide = slideIndex || this.currentSlide;
            this.currentSlide = this.currentSlide%this.slides.length;

            var slideSelectors = this.sliderElement.getElementsByClassName("slider__selector");
            
            this.sliderEnable = false;
            for (let index = 0; index < this.slides.length; index++) {
                if (index != this.currentSlide) {
                    this.slides[index].classList.remove("slider__slide--active");
                    slideSelectors[index].classList.remove("slider__selector--active");
                    if (this.slides[index].style.left == "0%"){
                        this.slides[index].classList.add("slider_slide--transition-out");
                        this.slides[index].style.left = "20%";
                    }
                    setTimeout((function() {
                        if (index != this.currentSlide) {
                            if (this.slides[index].classList.contains("slider_slide--transition-out")){
                                this.slides[index].classList.remove("slider_slide--transition-out");
                            }
                            this.slides[index].style.left = "-100%";
                        }
                    }).bind(this), this.SLIDER_TRANSITION_TIME); /* Delay desaparicion de imag anterior */
                    
                } else if (index > this.currentSlide) { /* Vestigio */
                    this.slides[index].style.left = "100%";
    
                } else if (index == this.currentSlide) { /* Cambio de slide */
                    this.slides[index].style.left = "0%";
                    this.slides[index].classList.add("slider__slide--active");
                    slideSelectors[index].classList.add("slider__selector--active");
                    setTimeout((function() { /* Evita cambio de slide durante animacion */
                        this.sliderEnable = true;
                    }).bind(this), this.SLIDER_TRANSITION_TIME);
                }
            }    
        }
    }

    initializeProgressbar(reset) {
        if (reset !== undefined){
            this.sliderElement.removeChild(this.progressbar);
        }
        
        if (this.sliderElement.getElementsByClassName("slider__progressbar").length == 0){
            this.progressbar = this.sliderElement.appendChild(document.createElement("DIV"));
            
            this.progressbar.className = "slider__progressbar";
            this.progressbar.style.animationDuration = (this.SLIDER_SLEEP_TIME/1000) + "s";
            this.progressbar.addEventListener("animationiteration", (function(){
                this.changeSlide(this.currentSlide + 1);
            }).bind(this));
            this.progressbar.style.animationPlayState = this.autoTransition;
        }
    }

    initializeSelectors() {
        var slideSelectorContainer = document.createElement("DIV");
        slideSelectorContainer.className = "slider-selector-container";
        var slideSelector = document.createElement("DIV");
        slideSelector.className = "slider__slide-selector";

        for (let index = 0; index < this.slides.length; index++) {
            var newSelector = document.createElement("DIV");
            newSelector.className = "slider__selector";
            newSelector.setAttribute("data-slideindex", index);
            slideSelector.appendChild(newSelector);
        }
        slideSelectorContainer.appendChild(slideSelector); /** */
        this.sliderElement.appendChild(slideSelectorContainer);

        var slideSelectors = this.sliderElement.getElementsByClassName("slider__selector");

        for (let index = 0; index < slideSelectors.length; index++) {
            slideSelectors[index].addEventListener("click", (function(){ /* Click en selectores de sliders */
                if (this.currentSlide != slideSelectors[index].getAttribute("data-slideindex")) {
                    this.changeSlide(slideSelectors[index].getAttribute("data-slideindex"));
                }
                this.initializeProgressbar(true);
            }).bind(this), false);
        }
    }
}