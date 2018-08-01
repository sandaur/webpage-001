var scrollingElements = []; /* {element: '', interval: ''} */

function scrollTo(element, to, duration, dir) {
    var start = (dir) ? element.scrollTop : element.scrollLeft,
        change = to - start,
        currentTime = 0,
        increment = 16,
        axis = dir;

    for (let index = 0; index < scrollingElements.length; index++) {
        const arrayElement = scrollingElements[index];
        if (arrayElement.element == element){
            clearInterval(arrayElement.interval);
            scrollingElements.splice(index,1);
            break;
        }
    }
    
    var newScrollingElem = {};
    var animateScroll = setInterval(function(){
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);

        window.requestAnimationFrame(() => {
            if (axis){element.scrollTop = val;}
            else {element.scrollLeft = val;}
        });

        if(currentTime > duration) {
            /* if (axis){element.scrollTop = to;}
            else {element.scrollLeft = to;} */
            clearInterval(animateScroll);
            scrollingElements.splice(scrollingElements.indexOf(newScrollingElem),1);
        }
        
    }, increment);

    newScrollingElem.element = element;
    newScrollingElem.interval = animateScroll;
    scrollingElements.push(newScrollingElem);
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};