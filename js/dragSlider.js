/* 
    .drag-slider > .drag-slider-container > .drag-slider__slide
*/

class DragSlider {
    constructor(dragSliderElement, active){
        this.dragSliderElement = dragSliderElement;
        this.active = active;
        this.isDown = false;
        this.startX;
        this.scrollLeft;
        this.currentSlide;
        this.children = this.dragSliderElement.getElementsByClassName("drag-slider__slide");

        let container = this.dragSliderElement.getElementsByClassName("drag-slider-container")[0];
        container.style.width = (this.children[0].offsetWidth * this.children.length + 100) + "px";

        this.initializeEventListeners();
        this.initializeSelectors();
        window.addEventListener("DOMContentLoaded", () => {this.centerSlider(0)}, false);
        window.addEventListener("resize", () => {this.rezise();}, false);
    }

    enable(){this.active = true;}
    disable(){this.active = false;}

    rezise(){
        setTimeout(function(){
            let container = this.dragSliderElement.getElementsByClassName("drag-slider-container")[0];
            container.style.width = (this.children[0].offsetWidth * this.children.length + 100) + "px";
            this.centerSlider(0);
        }.bind(this), 20);
    }

    initializeEventListeners(){
        this.dragSliderElement.addEventListener('mousedown', (e) => {
            if (e.button == 0 && this.active){
                e.preventDefault();
                this.isDown = true;
                this.startX = e.clientX;
                this.scrollLeft = this.dragSliderElement.scrollLeft;
                this.dragSliderElement.classList.add("on-sliding");
            }
        });
        
        this.dragSliderElement.addEventListener('mouseleave', (e) => {
            if (e.button == 0 && this.active){
                e.preventDefault();
                if (this.isDown){
                    let diference = e.clientX - this.startX;
                    this.centerSlider(diference);
                }
                this.isDown = false;
                this.dragSliderElement.classList.remove("on-sliding");
            }
        });
        
        this.dragSliderElement.addEventListener('mouseup', (e) => {
            if (e.button == 0 && this.active){
                e.preventDefault();
                if (this.isDown){
                    let diference = e.clientX - this.startX;
                    this.centerSlider(diference);
                }
                this.isDown = false;
                this.dragSliderElement.classList.remove("on-sliding");
            }
        });
        
        this.dragSliderElement.addEventListener('mousemove', (e) => {
            if (e.button == 0 && this.active){
                e.preventDefault();
                if (!this.isDown) return;
                let diference = e.clientX - this.startX;
                this.dragSliderElement.scrollLeft = this.scrollLeft - diference;
            }
        });
    }

    centerSlider(direction) {
        for (let index = 0; index < this.children.length; index++) {
            const element = this.children[index];
            if (direction == 0){ /* Refres slides position (window rezise) */                
                let mark = this.dragSliderElement.scrollLeft + (.5*this.dragSliderElement.offsetWidth);
                if (mark > element.offsetLeft && mark < element.offsetLeft + element.offsetWidth){
                    this.changeSlide(index, 0, true);
                    return;
                }
            } else if(direction < 0){ /* Slide left */
                let mark = this.dragSliderElement.scrollLeft + (.8*this.dragSliderElement.offsetWidth);
                if (mark > element.offsetLeft && mark < element.offsetLeft + element.offsetWidth){
                    this.changeSlide(index, -1);
                    return;
                }
            } else{ /* Slide right */
                let mark = this.dragSliderElement.scrollLeft + (.2*this.dragSliderElement.offsetWidth);
                if (mark > element.offsetLeft && mark < element.offsetLeft + element.offsetWidth){
                    this.changeSlide(index, 1);
                    return;
                }
            }
        }
    }

    changeSlide(slideIndex, dir, sudden) {
        scrollTo(this.dragSliderElement, this.children[slideIndex].offsetLeft, 400, 0);
        /* this.dragSliderElement.scroll({ top: 0, left: this.children[slideIndex].offsetLeft, behavior: (sudden == undefined ? 'smooth' : 'auto') }); */
        this.currentSlide = slideIndex;

        let selectors = this.dragSliderElement.getElementsByClassName("slider__selector");
        for (let index = 0; index < selectors.length; index++) {
            const element = selectors[index];
            if (index == slideIndex){
                element.classList.add("slider__selector--active");
            } else{
                element.classList.remove("slider__selector--active");
            }
        }
    }

    initializeSelectors() {
        var slideSelectorContainer = document.createElement("DIV");
        slideSelectorContainer.className = "slider-selector-container";
        var slideSelector = document.createElement("DIV");
        slideSelector.className = "slider__slide-selector";
    
        for (let index = 0; index < this.children.length; index++) {
            var newSelector = document.createElement("DIV");
            newSelector.className = "slider__selector";
            newSelector.setAttribute("data-slideindex", index);
            slideSelector.appendChild(newSelector);
        }
        slideSelectorContainer.appendChild(slideSelector);
        this.dragSliderElement.appendChild(slideSelectorContainer);
    
        var slideSelectors = this.dragSliderElement.getElementsByClassName("slider__selector");
    
        for (let index = 0; index < slideSelectors.length; index++) {
            slideSelectors[index].addEventListener("click", (function(){ /* Click en selectores de sliders */
                if (this.currentSlide != slideSelectors[index].getAttribute("data-slideindex")) {
                    this.changeSlide(index);
                }
            }).bind(this), false);
        }
    }
}