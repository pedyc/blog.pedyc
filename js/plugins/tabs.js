<<<<<<< HEAD
function setTabs() {
  let tabs = document.querySelectorAll(".tabs .nav-tabs");
  if (!tabs) return;

  tabs.forEach((tab) => {
    tab.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const parentTab = e.target.parentElement.parentElement.parentElement;
        parentTab.querySelector(".nav-tabs .active").classList.remove("active");
        e.target.parentElement.classList.add("active");
        parentTab
          .querySelector(".tab-content .active")
          .classList.remove("active");
        parentTab.querySelector(e.target.className).classList.add("active");

        return false;
      });
    });
  });
}

try {
  swup.hooks.on("page:view", setTabs);
} catch (e) {}

document.addEventListener("DOMContentLoaded", setTabs);
=======
function setTabs(){var e=document.querySelectorAll(".tabs .nav-tabs");e&&e.forEach(e=>{e.querySelectorAll("a").forEach(e=>{e.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation();var t=e.target.parentElement.parentElement.parentElement;return t.querySelector(".nav-tabs .active").classList.remove("active"),e.target.parentElement.classList.add("active"),t.querySelector(".tab-content .active").classList.remove("active"),t.querySelector(e.target.className).classList.add("active"),!1})})})}try{swup.hooks.on("page:view",setTabs)}catch(e){}document.addEventListener("DOMContentLoaded",setTabs);
>>>>>>> main1
