
window.addEventListener("DOMContentLoaded", parallaxLoop, false);
window.addEventListener("DOMContentLoaded", horizontalParallax, false);
window.addEventListener("DOMContentLoaded", navBarControll, false);
window.addEventListener("scroll", displayOnScroll, false);
window.addEventListener("DOMContentLoaded", displayOnScroll, false);


/*
    TODO:
    - (displayOnScroll) elementos con padres con position: relative, la distancia
        hasta el inicio del documento se calcula usando una iteracion WHILE.
    - problema con el ancho del elemento diptych al achicar la ventana
    - arreglar compativilidad de funcion scroll con microsoft Edgy
    - ! arreglar el tamaño de las slides dentro de la seccion de habitaciones

    - *FIXED* arreglar sliding hacia la derecha en ultima slide (seccion habitaciones)
        -> no record
    - *FIXED* problema con sliders al modificar el tamaño de la ventana
        -> transision timing en propiedad width causaba mal calculo del width de contenedor
*/

var yScrollPosition;

function parallaxLoop(){
    yScrollPosition = window.scrollY;

    parallaxItems = document.getElementsByClassName("parallax-frame-container");

    for (index = 0; index < parallaxItems.length; index++) {
        parallaxOffSet = yScrollPosition*0.3 - parallaxItems[index].parentElement.offsetTop*0.3;
        parallaxItems[index].style.top = parallaxOffSet+"px";
    }
                
    window.requestAnimationFrame(parallaxLoop);
}

function horizontalParallax(){
    yScrollPosition = window.scrollY;

    parallaxItems = document.getElementsByClassName("horizontal-parallax");

    for (index = 0; index < parallaxItems.length; index++) {
        parallaxRate = parallaxItems[index].getAttribute("data-parallax-rate");
        parallaxOffSet = yScrollPosition*parallaxRate - parallaxItems[index].parentElement.offsetTop*parallaxRate;

        parallaxItems[index].style.left = parallaxOffSet+"px";
        
    }
                
    window.requestAnimationFrame(horizontalParallax);
}

function navBarControll(){
    yScrollPosition = window.scrollY;

    if (yScrollPosition > 200){
        document.getElementById("main-navbar").classList.add("nav-ontop");
    }else{
        document.getElementById("main-navbar").classList.remove("nav-ontop");
    }

    window.requestAnimationFrame(navBarControll);
}

/* Display elements with class <scroll-hide> on-scroll */
var elementsDisplayOnScroll = [];
elementsDisplayOnScroll = elementsDisplayOnScroll.concat(document.getElementsByClassName("scroll-hide"));
var onScrollDisplayEnable = true;
function displayOnScroll(){
    for (let index = 0; index < elementsDisplayOnScroll[0].length; index++) {
        let element = elementsDisplayOnScroll[0][index];
        let topElemPos = getDistToTop(element) + element.parentElement.offsetHeight/3; /* element.parentElement.offsetTop */
        let botElemPos = getDistToTop(element) + element.parentElement.offsetHeight;
        let botMarginDisplay = window.scrollY + window.innerHeight;
        let topMarginDisplay = window.scrollY;
        if (onScrollDisplayEnable){
            if (topElemPos < botMarginDisplay && botElemPos > topMarginDisplay && !element.classList.contains("scroll-display")){
                element.classList.add("scroll-display");
                onScrollDisplayEnable = false;
                setTimeout((function(){
                    onScrollDisplayEnable = true;
                    displayOnScroll();
                }).bind(onScrollDisplayEnable), 200);
            } else if (!(topElemPos < botMarginDisplay && botElemPos > topMarginDisplay) && element.classList.contains("scroll-display")){
                element.classList.remove("scroll-display");
            }
        }
    }
}

function getDistToTop(element){
    let elem = element;
    let distance = 0;

    // Loop up the dom
    do {
        // Increase our distance counter
        distance += elem.offsetTop;

        // Set the element to it's parent
        elem = elem.offsetParent;

    } while (elem);
    
    return distance;
}

var navShortcuts = document.getElementsByClassName("btn-shortcut");
for (let index = 0; index < navShortcuts.length; index++) {
    const element = navShortcuts[index];
    let target = document.getElementById(element.getAttribute("data-scrolltarget"));
    element.addEventListener("click", (event) => {
        event.preventDefault();
        let bodyScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (target !== null) scrollTo(document.documentElement, target.offsetTop, 600, 1);
        /* if (target !== null) target.scrollIntoView({behavior: 'smooth'}); */
    }, false);
}

var contactBtn = document.getElementById("go-footer");
contactBtn.addEventListener("click", (event) => {
    event.preventDefault();
    scrollTo(document.documentElement, document.body.scrollHeight, 600, 1);
    /* window.scrollTo({left: 0, top: document.body.scrollHeight, behavior: 'smooth'}); */
}, false);

var myDragSlider = new DragSlider(document.getElementById("drag-slider-1"), true);
var sliderCL = new DragSlider(document.getElementById("drag-slider-2"), false);
var sliderCR = new DragSlider(document.getElementById("drag-slider-3"), false);
var mySlider = new Slider(document.getElementById("main-slider"), 1200, 8000);

var cardLeft = document.getElementById("diptych-card1");
var cardRight = document.getElementById("diptych-card2");

var btnCL = cardLeft.getElementsByClassName("diptych__sign")[0];
var btnCR = cardRight.getElementsByClassName("diptych__sign")[0];

btnCL.addEventListener("click", (event) => {
    cardRight.classList.add("card-displace");
    cardLeft.classList.add("card-active");
    sliderCL.enable();
}, false);
cardLeft.addEventListener("mouseleave", (event) => {
    cardLeft.classList.remove("card-active");
    cardRight.classList.remove("card-displace");
    sliderCL.disable();
}, false);

btnCR.addEventListener("click", (event) => {
    cardLeft.classList.add("card-displace");
    cardRight.classList.add("card-active");
    sliderCR.enable();
}, false);
cardRight.addEventListener("mouseleave", (event) => {
    cardRight.classList.remove("card-active");
    cardLeft.classList.remove("card-displace");
    sliderCR.disable();
}, false);