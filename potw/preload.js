document.querySelector('main').style.display = "none"
document.querySelector('footer').style.display = "none";

var loader = document.getElementById("preload")
window.addEventListener("load", function(){
    loader.style.display = "none";
    document.querySelector('main').style.display = "block";
    document.querySelector('footer').style.display = "block";
})
