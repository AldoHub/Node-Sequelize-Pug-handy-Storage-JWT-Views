document.addEventListener("DOMContentLoaded", () => {
    let showMenu = document.querySelector("#showMenu");
    let closeMenu = document.querySelector("#closeMenu");    
    let nav = document.querySelector("nav");

    showMenu.addEventListener("click", () => {
        nav.style.width = "300px";
    });
    
    closeMenu.addEventListener("click", () => {
        nav.style.width = "";
    })

})