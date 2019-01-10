/** This polyfill is required to make forEach work on IEx **/
(function () {
    if ( typeof NodeList.prototype.forEach === "function" ) return false;
    NodeList.prototype.forEach = Array.prototype.forEach;
})();

var map = document.getElementById('map');
var lastPane = map.getElementsByClassName('pane');
var dummyX = null;

var scenes = {};
var layers = [];

var sc = document.querySelectorAll('.scene');
sc.forEach(function(elem) {
    scenes[elem.id] = document.getElementById(elem.id).getBoundingClientRect().left;
});

var i = 0;
var lys = document.querySelectorAll('.layer');
var len = lys.length;

for (i; i < len; i++) {
    var l = lys[i].id;;
    layers.push({
        id: 'l' + (i + 1),
        name: l,
        offset: document.getElementById(l).offsetLeft,
        speed: document.getElementById(l).getAttribute('data-speed')
    });
}

lastPane = lastPane[lastPane.length-1];

function windowOnScroll() {
    var y = document.body.getBoundingClientRect().top;
    map.scrollLeft = -y;

    $('.scene').each(function() {
        var sc = $(this).attr('id');
        var id = '#' + sc;
        var clas = '.' + sc;
        if ($(id).isOnScreen()) {
            $('.map-nav li a').removeClass('active');
            $(clas).addClass('active');
        }
    })
}

function isInView(elem){
    return $(elem).offset().left + $(window).scrollLeft() > $(elem).width() ;
 }

function windowOnResize() {
    var w = map.scrollWidth - window.innerWidth + window.innerHeight;
    document.body.style.height = w + 'px';
    dummyX = lastPane.getBoundingClientRect().left + window.scrollY;
}

function goToScene(sceneName) {
    if (scenes.hasOwnProperty(sceneName)) {
        var pos = scenes[sceneName];
        $('body, html').animate({
            scrollTop: pos
        }, 1000 );
    }
}

function mouseParallax(id, left, mouseX, speed) {
    var obj = document.getElementById(id);
    var parentObj = obj.parentNode,
    containerWidth = parseInt(parentObj.offsetWidth);
    obj.style.left = left - (((mouseX - (parseInt((obj.offsetWidth ) / 2) + left)) / containerWidth) * speed) + 'px';
}

function parallaxOnMouseOver() {
    var parallaxBox = document.getElementById ( 'box' );
    parallaxBox.onmousemove = function(event) {
        event = event || window.event;
        var x = event.clientX - this.offsetLeft;

        var i = 0;
        var lys = layers;
        var len = lys.length;
        for (i; i < len; i++) {
            var l = lys[i];
            mouseParallax(l.name, l.offset, x, l.speed);
        }
    }
}

$.fn.isOnScreen = function() {

    var win = $(window);

    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };

    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
    
    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();
    
    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    
};

window.onload = parallaxOnMouseOver;
windowOnResize();
window.onscroll = windowOnScroll;
window.onresize = windowOnResize;


$(function() {
    $('.lazy').lazy();
});