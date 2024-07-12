<<<<<<< HEAD
/* main function */

import { initTocToggle } from "../tools/tocToggle.js";
import { main } from "../main.js";
export function initTOC() {
  const utils = {
    navItems: document.querySelectorAll(".post-toc-wrap .post-toc li"),

    updateActiveTOCLink() {
      if (!Array.isArray(utils.sections)) return;
      let index = utils.sections.findIndex((element) => {
        return element && element.getBoundingClientRect().top - 100 > 0;
      });
      if (index === -1) {
        index = utils.sections.length - 1;
      } else if (index > 0) {
        index--;
      }
      this.activateTOCLink(index);
    },

    registerTOCScroll() {
      utils.sections = [
        ...document.querySelectorAll(".post-toc li a.nav-link"),
      ].map((element) => {
        const target = document.getElementById(
          decodeURI(element.getAttribute("href")).replace("#", ""),
        );
        return target;
      });
    },

    activateTOCLink(index) {
      const target = document.querySelectorAll(".post-toc li a.nav-link")[
        index
      ];

      if (!target || target.classList.contains("active-current")) {
        return;
      }

      document.querySelectorAll(".post-toc .active").forEach((element) => {
        element.classList.remove("active", "active-current");
      });
      target.classList.add("active", "active-current");
      // Scroll to the active TOC item
      const tocElement = document.querySelector(".toc-content-container");
      const tocTop = tocElement.getBoundingClientRect().top;
      const scrollTopOffset =
        tocElement.offsetHeight > window.innerHeight
          ? (tocElement.offsetHeight - window.innerHeight) / 2
          : 0;
      const targetTop = target.getBoundingClientRect().top - tocTop;
      const viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0,
      );
      const distanceToCenter =
        targetTop -
        viewportHeight / 2 +
        target.offsetHeight / 2 -
        scrollTopOffset;
      const scrollTop = tocElement.scrollTop + distanceToCenter;

      tocElement.scrollTo({
        top: scrollTop,
        behavior: "smooth", // Smooth scroll
      });
    },

    showTOCAside() {
      const openHandle = () => {
        const styleStatus = main.getStyleStatus();
        const key = "isOpenPageAside";
        if (styleStatus && styleStatus.hasOwnProperty(key)) {
          initTocToggle().pageAsideHandleOfTOC(styleStatus[key]);
        } else {
          initTocToggle().pageAsideHandleOfTOC(true);
        }
      };

      const initOpenKey = "init_open";

      if (theme.articles.toc.hasOwnProperty(initOpenKey)) {
        theme.articles.toc[initOpenKey]
          ? openHandle()
          : initTocToggle().pageAsideHandleOfTOC(false);
      } else {
        openHandle();
      }
    },
  };

  if (utils.navItems.length > 0) {
    utils.showTOCAside();
    utils.registerTOCScroll();
  } else {
    document
      .querySelectorAll(".toc-content-container, .toc-marker")
      .forEach((elem) => {
        elem.remove();
      });
  }

  return utils;
}

// Event listeners
try {
  swup.hooks.on("page:view", () => {
    initTOC();
  });
} catch (e) {}

document.addEventListener("DOMContentLoaded", initTOC);
=======
import{initTocToggle}from"../tools/tocToggle.js";import{main}from"../main.js";function initTOC(){let t={navItems:document.querySelectorAll(".post-toc-wrap .post-toc li"),updateActiveTOCLink(){if(Array.isArray(t.sections)){let e=t.sections.findIndex(e=>e&&0<e.getBoundingClientRect().top-100);-1===e?e=t.sections.length-1:0<e&&e--,this.activateTOCLink(e)}},registerTOCScroll(){t.sections=[...document.querySelectorAll(".post-toc li a.nav-link")].map(e=>{return document.getElementById(decodeURI(e.getAttribute("href")).replace("#",""))})},activateTOCLink(e){var t,o,i,e=document.querySelectorAll(".post-toc li a.nav-link")[e];e&&!e.classList.contains("active-current")&&(document.querySelectorAll(".post-toc .active").forEach(e=>{e.classList.remove("active","active-current")}),e.classList.add("active","active-current"),i=(t=document.querySelector(".toc-content-container")).getBoundingClientRect().top,o=t.offsetHeight>window.innerHeight?(t.offsetHeight-window.innerHeight)/2:0,i=e.getBoundingClientRect().top-i-Math.max(document.documentElement.clientHeight,window.innerHeight||0)/2+e.offsetHeight/2-o,e=t.scrollTop+i,t.scrollTo({top:e,behavior:"smooth"}))},showTOCAside(){var e=()=>{var e=main.getStyleStatus(),t="isOpenPageAside";e&&e.hasOwnProperty(t)?initTocToggle().pageAsideHandleOfTOC(e[t]):initTocToggle().pageAsideHandleOfTOC(!0)},t="init_open";!theme.articles.toc.hasOwnProperty(t)||theme.articles.toc[t]?e():initTocToggle().pageAsideHandleOfTOC(!1)}};return 0<t.navItems.length?(t.showTOCAside(),t.registerTOCScroll()):document.querySelectorAll(".toc-content-container, .toc-marker").forEach(e=>{e.remove()}),t}try{swup.hooks.on("page:view",()=>{initTOC()})}catch(e){}document.addEventListener("DOMContentLoaded",initTOC);export{initTOC};
>>>>>>> main1
