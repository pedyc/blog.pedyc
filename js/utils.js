<<<<<<< HEAD
/* utils function */
import { navbarShrink } from "./layouts/navbarShrink.js";
import { initTOC } from "./layouts/toc.js";
import { main } from "./main.js";
import imageViewer from "./tools/imageViewer.js";

export const navigationState = {
  isNavigating: false,
};

export default function initUtils() {
  const utils = {
    html_root_dom: document.querySelector("html"),
    pageContainer_dom: document.querySelector(".page-container"),
    pageTop_dom: document.querySelector(".main-content-header"),
    homeBanner_dom: document.querySelector(".home-banner-container"),
    homeBannerBackground_dom: document.querySelector(".home-banner-background"),
    scrollProgressBar_dom: document.querySelector(".scroll-progress-bar"),
    pjaxProgressBar_dom: document.querySelector(".pjax-progress-bar"),
    pjaxProgressIcon_dom: document.querySelector(".swup-progress-icon"),
    backToTopButton_dom: document.querySelector(".tool-scroll-to-top"),
    toolsList: document.querySelector(".hidden-tools-list"),
    toggleButton: document.querySelector(".toggle-tools-list"),

    innerHeight: window.innerHeight,
    pjaxProgressBarTimer: null,
    prevScrollValue: 0,
    fontSizeLevel: 0,
    triggerViewHeight: 0.5 * window.innerHeight,

    isHasScrollProgressBar: theme.global.scroll_progress.bar === true,
    isHasScrollPercent: theme.global.scroll_progress.percentage === true,

    // Scroll Style
    updateScrollStyle() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const percent = this.calculatePercentage(
        scrollTop,
        scrollHeight,
        clientHeight,
      );

      this.updateScrollProgressBar(percent);
      this.updateScrollPercent(percent);
      this.updatePageTopVisibility(scrollTop, clientHeight);

      this.prevScrollValue = scrollTop;
    },

    updateScrollProgressBar(percent) {
      if (this.isHasScrollProgressBar) {
        const progressPercent = percent.toFixed(3);
        const visibility = percent === 0 ? "hidden" : "visible";

        this.scrollProgressBar_dom.style.visibility = visibility;
        this.scrollProgressBar_dom.style.width = `${progressPercent}%`;
      }
    },

    updateScrollPercent(percent) {
      if (this.isHasScrollPercent) {
        const percentDom = this.backToTopButton_dom.querySelector(".percent");
        const showButton = percent !== 0 && percent !== undefined;

        this.backToTopButton_dom.classList.toggle("show", showButton);
        percentDom.innerHTML = percent.toFixed(0);
      }
    },

    updatePageTopVisibility(scrollTop, clientHeight) {
      if (theme.navbar.auto_hide) {
        const prevScrollValue = this.prevScrollValue;
        const hidePageTop =
          prevScrollValue > clientHeight && scrollTop > prevScrollValue;

        this.pageTop_dom.classList.toggle("hide", hidePageTop);
      } else {
        this.pageTop_dom.classList.remove("hide");
      }
    },

    calculatePercentage(scrollTop, scrollHeight, clientHeight) {
      return Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    },

    // register window scroll event
    registerWindowScroll() {
      window.addEventListener("scroll", () => {
        this.updateScrollStyle();
        this.updateTOCScroll();
        this.updateNavbarShrink();
        // this.updateHomeBannerBlur();
        this.updateAutoHideTools();
        this.updateAPlayerAutoHide();
      });
      window.addEventListener(
        "scroll",
        this.debounce(() => this.updateHomeBannerBlur(), 80),
      );
    },

    updateTOCScroll() {
      if (
        theme.articles.toc.enable &&
        initTOC().hasOwnProperty("updateActiveTOCLink")
      ) {
        initTOC().updateActiveTOCLink();
      }
    },

    updateNavbarShrink() {
      if (!navigationState.isNavigating) {
        navbarShrink.init();
      }
    },

    debounce(func, delay) {
      let timer;
      return function () {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
      };
    },

    updateHomeBannerBlur() {
      if (!this.homeBannerBackground_dom) return;

      if (
        theme.home_banner.style === "fixed" &&
        location.pathname === config.root
      ) {
        const scrollY = window.scrollY || window.pageYOffset;
        const blurValue = scrollY >= this.triggerViewHeight ? 15 : 0;

        try {
          requestAnimationFrame(() => {
            this.homeBannerBackground_dom.style.transition = "0.3s";
            this.homeBannerBackground_dom.style.webkitFilter = `blur(${blurValue}px)`;
          });
        } catch (e) {
          // Handle or log the error properly
          console.error("Error updating banner blur:", e);
        }
      }
    },

    updateAutoHideTools() {
      const y = window.pageYOffset;
      const height = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      const toolList = document.getElementsByClassName(
        "right-side-tools-container",
      );

      for (let i = 0; i < toolList.length; i++) {
        const tools = toolList[i];
        if (y <= 0) {
          if (location.pathname !== "/") {
            //console.log(location.pathname)
          } else {
            tools.classList.add("hide");
          }
        } else if (y + windowHeight >= height - 20) {
          tools.classList.add("hide");
        } else {
          tools.classList.remove("hide");
        }
      }
    },

    updateAPlayerAutoHide() {
      const aplayer = document.getElementById("aplayer");
      if (aplayer == null) {
      } else {
        const y = window.pageYOffset;
        const height = document.body.scrollHeight;
        const windowHeight = window.innerHeight;
        if (y <= 0) {
          if (location.pathname !== "/") {
            //console.log(location.pathname)
          } else {
            aplayer.classList.add("hide");
          }
        } else if (y + windowHeight >= height - 20) {
          aplayer.classList.add("hide");
        } else {
          aplayer.classList.remove("hide");
        }
      }
    },

    toggleToolsList() {
      this.toggleButton.addEventListener("click", () => {
        this.toolsList.classList.toggle("show");
      });
    },

    fontAdjPlus_dom: document.querySelector(".tool-font-adjust-plus"),
    fontAdMinus_dom: document.querySelector(".tool-font-adjust-minus"),
    globalFontSizeAdjust() {
      const htmlRoot = this.html_root_dom;
      const fontAdjustPlus = this.fontAdjPlus_dom;
      const fontAdjustMinus = this.fontAdMinus_dom;

      const fontSize = document.defaultView.getComputedStyle(
        document.body,
      ).fontSize;
      const baseFontSize = parseFloat(fontSize);

      let fontSizeLevel = 0;
      const styleStatus = main.getStyleStatus();
      if (styleStatus) {
        fontSizeLevel = styleStatus.fontSizeLevel;
        setFontSize(fontSizeLevel);
      }

      function setFontSize(level) {
        const fontSize = baseFontSize * (1 + level * 0.05);
        htmlRoot.style.fontSize = `${fontSize}px`;
        main.styleStatus.fontSizeLevel = level;
        main.setStyleStatus();
      }

      function increaseFontSize() {
        fontSizeLevel = Math.min(fontSizeLevel + 1, 5);
        setFontSize(fontSizeLevel);
      }

      function decreaseFontSize() {
        fontSizeLevel = Math.max(fontSizeLevel - 1, 0);
        setFontSize(fontSizeLevel);
      }

      fontAdjustPlus.addEventListener("click", increaseFontSize);
      fontAdjustMinus.addEventListener("click", decreaseFontSize);
    },
    // go comment anchor
    goComment() {
      this.goComment_dom = document.querySelector(".go-comment");
      if (this.goComment_dom) {
        this.goComment_dom.addEventListener("click", () => {
          const target = document.querySelector("#comment-anchor");
          if (target) {
            const offset = target.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: offset,
              behavior: "smooth",
            });
          }
        });
      }
    },

    // get dom element height
    getElementHeight(selectors) {
      const dom = document.querySelector(selectors);
      return dom ? dom.getBoundingClientRect().height : 0;
    },

    // init first screen height
    inithomeBannerHeight() {
      this.homeBanner_dom &&
        (this.homeBanner_dom.style.height = this.innerHeight + "px");
    },

    // init page height handle
    initPageHeightHandle() {
      if (this.homeBanner_dom) return;
      const temp_h1 = this.getElementHeight(".main-content-header");
      const temp_h2 = this.getElementHeight(".main-content-body");
      const temp_h3 = this.getElementHeight(".main-content-footer");
      const allDomHeight = temp_h1 + temp_h2 + temp_h3;
      const innerHeight = window.innerHeight;
      const pb_dom = document.querySelector(".main-content-footer");
      if (allDomHeight < innerHeight) {
        const marginTopValue = Math.floor(innerHeight - allDomHeight);
        if (marginTopValue > 0) {
          pb_dom.style.marginTop = `${marginTopValue - 2}px`;
        }
      }
    },

    // big image viewer

    // set how long ago language
    setHowLongAgoLanguage(p1, p2) {
      return p2.replace(/%s/g, p1);
    },

    getHowLongAgo(timestamp) {
      const l = lang_ago;

      const __Y = Math.floor(timestamp / (60 * 60 * 24 * 30) / 12);
      const __M = Math.floor(timestamp / (60 * 60 * 24 * 30));
      const __W = Math.floor(timestamp / (60 * 60 * 24) / 7);
      const __d = Math.floor(timestamp / (60 * 60 * 24));
      const __h = Math.floor((timestamp / (60 * 60)) % 24);
      const __m = Math.floor((timestamp / 60) % 60);
      const __s = Math.floor(timestamp % 60);

      if (__Y > 0) {
        return this.setHowLongAgoLanguage(__Y, l.year);
      } else if (__M > 0) {
        return this.setHowLongAgoLanguage(__M, l.month);
      } else if (__W > 0) {
        return this.setHowLongAgoLanguage(__W, l.week);
      } else if (__d > 0) {
        return this.setHowLongAgoLanguage(__d, l.day);
      } else if (__h > 0) {
        return this.setHowLongAgoLanguage(__h, l.hour);
      } else if (__m > 0) {
        return this.setHowLongAgoLanguage(__m, l.minute);
      } else if (__s > 0) {
        return this.setHowLongAgoLanguage(__s, l.second);
      }
    },

    relativeTimeInHome() {
      const post = document.querySelectorAll(
        ".home-article-meta-info .home-article-date",
      );
      const df = theme.home.article_date_format;
      if (df === "relative") {
        post &&
          post.forEach((v) => {
            const nowDate = Date.now();
            const postDate = new Date(
              v.dataset.date.split(" GMT")[0],
            ).getTime();
            v.innerHTML = this.getHowLongAgo(
              Math.floor((nowDate - postDate) / 1000),
            );
          });
      } else if (df === "auto") {
        post &&
          post.forEach((v) => {
            const nowDate = Date.now();
            const postDate = new Date(
              v.dataset.date.split(" GMT")[0],
            ).getTime();
            const finalDays = Math.floor(
              (nowDate - postDate) / (60 * 60 * 24 * 1000),
            );
            if (finalDays < 7) {
              v.innerHTML = this.getHowLongAgo(
                Math.floor((nowDate - postDate) / 1000),
              );
            }
          });
      }
    },
  };

  // init scroll
  utils.registerWindowScroll();

  // toggle show tools list
  utils.toggleToolsList();

  // main font adjust
  utils.globalFontSizeAdjust();

  // go comment
  utils.goComment();

  // init page height handle
  utils.initPageHeightHandle();

  // init first screen height
  utils.inithomeBannerHeight();

  // set how long ago in home article block
  utils.relativeTimeInHome();

  // image viewer handle
  imageViewer();
}
=======
import{navbarShrink}from"./layouts/navbarShrink.js";import{initTOC}from"./layouts/toc.js";import{main}from"./main.js";import imageViewer from"./tools/imageViewer.js";let navigationState={isNavigating:!1};export default function initUtils(){var e={html_root_dom:document.querySelector("html"),pageContainer_dom:document.querySelector(".page-container"),pageTop_dom:document.querySelector(".main-content-header"),homeBanner_dom:document.querySelector(".home-banner-container"),homeBannerBackground_dom:document.querySelector(".home-banner-background"),scrollProgressBar_dom:document.querySelector(".scroll-progress-bar"),pjaxProgressBar_dom:document.querySelector(".pjax-progress-bar"),backToTopButton_dom:document.querySelector(".tool-scroll-to-top"),toolsList:document.querySelector(".hidden-tools-list"),toggleButton:document.querySelector(".toggle-tools-list"),innerHeight:window.innerHeight,pjaxProgressBarTimer:null,prevScrollValue:0,fontSizeLevel:0,triggerViewHeight:.5*window.innerHeight,isHasScrollProgressBar:!0===theme.global.scroll_progress.bar,isHasScrollPercent:!0===theme.global.scroll_progress.percentage,updateScrollStyle(){var e=window.pageYOffset||document.documentElement.scrollTop,t=document.documentElement.scrollHeight,o=window.innerHeight||document.documentElement.clientHeight,t=this.calculatePercentage(e,t,o);this.updateScrollProgressBar(t),this.updateScrollPercent(t),this.updatePageTopVisibility(e,o),this.prevScrollValue=e},updateScrollProgressBar(e){var t;this.isHasScrollProgressBar&&(t=e.toFixed(3),this.scrollProgressBar_dom.style.visibility=0===e?"hidden":"visible",this.scrollProgressBar_dom.style.width=t+"%")},updateScrollPercent(e){var t;this.isHasScrollPercent&&(t=this.backToTopButton_dom.querySelector(".percent"),this.backToTopButton_dom.classList.toggle("show",0!==e&&void 0!==e),t.innerHTML=e.toFixed(0))},updatePageTopVisibility(e,t){var o;theme.navbar.auto_hide?(o=this.prevScrollValue,this.pageTop_dom.classList.toggle("hide",t<o&&o<e)):this.pageTop_dom.classList.remove("hide")},calculatePercentage(e,t,o){return Math.round(e/(t-o)*100)},registerWindowScroll(){window.addEventListener("scroll",()=>{this.updateScrollStyle(),this.updateTOCScroll(),this.updateNavbarShrink(),this.updateAutoHideTools()}),window.addEventListener("scroll",this.debounce(()=>this.updateHomeBannerBlur(),20))},updateTOCScroll(){theme.articles.toc.enable&&initTOC().hasOwnProperty("updateActiveTOCLink")&&initTOC().updateActiveTOCLink()},updateNavbarShrink(){navigationState.isNavigating||navbarShrink.init()},debounce(e,t){let o;return function(){clearTimeout(o),o=setTimeout(()=>e.apply(this,arguments),t)}},updateHomeBannerBlur(){if(this.homeBannerBackground_dom&&"fixed"===theme.home_banner.style&&location.pathname===config.root){let e=(window.scrollY||window.pageYOffset)>=this.triggerViewHeight?15:0;try{requestAnimationFrame(()=>{this.homeBannerBackground_dom.style.filter=`blur(${e}px)`,this.homeBannerBackground_dom.style.webkitFilter=`blur(${e}px)`})}catch(e){console.error("Error updating banner blur:",e)}}},updateAutoHideTools(){var t=window.scrollY,o=document.body.scrollHeight,n=window.innerHeight,i=document.getElementsByClassName("right-side-tools-container"),r=document.getElementById("aplayer");for(let e=0;e<i.length;e++){var a=i[e];t<=100?location.pathname===config.root&&(a.classList.add("hide"),null!==r)&&r.classList.add("hide"):o-20<=t+n?(a.classList.add("hide"),null!==r&&r.classList.add("hide")):(a.classList.remove("hide"),null!==r&&r.classList.remove("hide"))}},toggleToolsList(){this.toggleButton.addEventListener("click",()=>{this.toolsList.classList.toggle("show")})},fontAdjPlus_dom:document.querySelector(".tool-font-adjust-plus"),fontAdMinus_dom:document.querySelector(".tool-font-adjust-minus"),globalFontSizeAdjust(){let o=this.html_root_dom;var e=this.fontAdjPlus_dom,t=this.fontAdMinus_dom,n=document.defaultView.getComputedStyle(document.body).fontSize;let i=parseFloat(n),r=0;n=main.getStyleStatus();function a(e){var t=i*(1+.05*e);o.style.fontSize=t+"px",main.styleStatus.fontSizeLevel=e,main.setStyleStatus()}n&&a(r=n.fontSizeLevel),e.addEventListener("click",function(){a(r=Math.min(r+1,5))}),t.addEventListener("click",function(){a(r=Math.max(r-1,0))})},goComment(){this.goComment_dom=document.querySelector(".go-comment"),this.goComment_dom&&this.goComment_dom.addEventListener("click",()=>{var e=document.querySelector("#comment-anchor");e&&(e=e.getBoundingClientRect().top+window.scrollY,window.scrollTo({top:e,behavior:"smooth"}))})},getElementHeight(e){e=document.querySelector(e);return e?e.getBoundingClientRect().height:0},inithomeBannerHeight(){this.homeBanner_dom&&(this.homeBanner_dom.style.height=this.innerHeight+"px")},initPageHeightHandle(){var e,t,o;this.homeBanner_dom||(e=this.getElementHeight(".main-content-header")+this.getElementHeight(".main-content-body")+this.getElementHeight(".main-content-footer"),o=window.innerHeight,t=document.querySelector(".main-content-footer"),e<o&&0<(o=Math.floor(o-e))&&(t.style.marginTop=o-2+"px"))},setHowLongAgoLanguage(e,t){return t.replace(/%s/g,e)},getHowLongAgo(e){var t=lang_ago,o=Math.floor(e/2592e3/12),n=Math.floor(e/2592e3),i=Math.floor(e/86400/7),r=Math.floor(e/86400),a=Math.floor(e/3600%24),l=Math.floor(e/60%60),e=Math.floor(e%60);return 0<o?this.setHowLongAgoLanguage(o,t.year):0<n?this.setHowLongAgoLanguage(n,t.month):0<i?this.setHowLongAgoLanguage(i,t.week):0<r?this.setHowLongAgoLanguage(r,t.day):0<a?this.setHowLongAgoLanguage(a,t.hour):0<l?this.setHowLongAgoLanguage(l,t.minute):0<e?this.setHowLongAgoLanguage(e,t.second):void 0},relativeTimeInHome(){var e=document.querySelectorAll(".home-article-meta-info .home-article-date"),t=theme.home.article_date_format;"relative"===t?e&&e.forEach(e=>{var t=Date.now(),o=new Date(e.dataset.date.split(" GMT")[0]).getTime();e.innerHTML=this.getHowLongAgo(Math.floor((t-o)/1e3))}):"auto"===t&&e&&e.forEach(e=>{var t=Date.now(),o=new Date(e.dataset.date.split(" GMT")[0]).getTime();Math.floor((t-o)/864e5)<7&&(e.innerHTML=this.getHowLongAgo(Math.floor((t-o)/1e3)))})}};e.updateAutoHideTools(),e.registerWindowScroll(),e.toggleToolsList(),e.globalFontSizeAdjust(),e.goComment(),e.initPageHeightHandle(),e.inithomeBannerHeight(),e.relativeTimeInHome(),imageViewer()}export{navigationState};
>>>>>>> main1
