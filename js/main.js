<<<<<<< HEAD
/* main function */
import initUtils from "./utils.js";
import initTyped from "./plugins/typed.js";
import initModeToggle from "./tools/lightDarkSwitch.js";
import initLazyLoad from "./layouts/lazyload.js";
import initScrollTopBottom from "./tools/scrollTopBottom.js";
import initLocalSearch from "./tools/localSearch.js";
import initCopyCode from "./tools/codeBlock.js";

export const main = {
  themeInfo: {
    theme: `Redefine v${theme.version}`,
    author: "EvanNotFound",
    repository: "https://github.com/EvanNotFound/hexo-theme-redefine",
  },
  localStorageKey: "REDEFINE-THEME-STATUS",
  styleStatus: {
    isExpandPageWidth: false,
    isDark: false,
    fontSizeLevel: 0,
    isOpenPageAside: true,
  },
  printThemeInfo: () => {
    console.log(
      `      ______ __  __  ______  __    __  ______                       \r\n     \/\\__  _\/\\ \\_\\ \\\/\\  ___\\\/\\ \"-.\/  \\\/\\  ___\\                      \r\n     \\\/_\/\\ \\\\ \\  __ \\ \\  __\\\\ \\ \\-.\/\\ \\ \\  __\\                      \r\n        \\ \\_\\\\ \\_\\ \\_\\ \\_____\\ \\_\\ \\ \\_\\ \\_____\\                    \r\n         \\\/_\/ \\\/_\/\\\/_\/\\\/_____\/\\\/_\/  \\\/_\/\\\/_____\/                    \r\n                                                               \r\n ______  ______  _____   ______  ______ __  __   __  ______    \r\n\/\\  == \\\/\\  ___\\\/\\  __-.\/\\  ___\\\/\\  ___\/\\ \\\/\\ \"-.\\ \\\/\\  ___\\   \r\n\\ \\  __<\\ \\  __\\\\ \\ \\\/\\ \\ \\  __\\\\ \\  __\\ \\ \\ \\ \\-.  \\ \\  __\\   \r\n \\ \\_\\ \\_\\ \\_____\\ \\____-\\ \\_____\\ \\_\\  \\ \\_\\ \\_\\\\\"\\_\\ \\_____\\ \r\n  \\\/_\/ \/_\/\\\/_____\/\\\/____\/ \\\/_____\/\\\/_\/   \\\/_\/\\\/_\/ \\\/_\/\\\/_____\/\r\n                                                               \r\n  Github: https:\/\/github.com\/EvanNotFound\/hexo-theme-redefine`,
    ); // console log message
  },
  setStyleStatus: () => {
    localStorage.setItem(
      main.localStorageKey,
      JSON.stringify(main.styleStatus),
    );
  },
  getStyleStatus: () => {
    let temp = localStorage.getItem(main.localStorageKey);
    if (temp) {
      temp = JSON.parse(temp);
      for (let key in main.styleStatus) {
        main.styleStatus[key] = temp[key];
      }
      return temp;
    } else {
      return null;
    }
  },
  refresh: () => {
    initUtils();
    initModeToggle();
    initScrollTopBottom();
    if (
      theme.home_banner.subtitle.text.length !== 0 &&
      location.pathname === config.root
    ) {
      initTyped("subtitle");
    }

    if (theme.navbar.search.enable === true) {
      initLocalSearch();
    }

    if (theme.articles.code_block.copy === true) {
      initCopyCode();
    }

    if (theme.articles.lazyload === true) {
      initLazyLoad();
    }
  },
};

export function initMain() {
  main.printThemeInfo();
  main.refresh();
}

document.addEventListener("DOMContentLoaded", initMain);

try {
  swup.hooks.on("page:view", () => {
    main.refresh();
  });
} catch (e) {}
=======
import initUtils from"./utils.js";import initTyped from"./plugins/typed.js";import initModeToggle from"./tools/lightDarkSwitch.js";import initLazyLoad from"./layouts/lazyload.js";import initScrollTopBottom from"./tools/scrollTopBottom.js";import initLocalSearch from"./tools/localSearch.js";import initCopyCode from"./tools/codeBlock.js";let main={themeInfo:{theme:"Redefine v"+theme.version,author:"EvanNotFound",repository:"https://github.com/EvanNotFound/hexo-theme-redefine"},localStorageKey:"REDEFINE-THEME-STATUS",styleStatus:{isExpandPageWidth:!1,isDark:theme.colors.default_mode&&"dark"===theme.colors.default_mode,fontSizeLevel:0,isOpenPageAside:!0},printThemeInfo:()=>{console.log(`      ______ __  __  ______  __    __  ______                       \r
     /\\__  _/\\ \\_\\ \\/\\  ___\\/\\ "-./  \\/\\  ___\\                      \r
     \\/_/\\ \\\\ \\  __ \\ \\  __\\\\ \\ \\-./\\ \\ \\  __\\                      \r
        \\ \\_\\\\ \\_\\ \\_\\ \\_____\\ \\_\\ \\ \\_\\ \\_____\\                    \r
         \\/_/ \\/_/\\/_/\\/_____/\\/_/  \\/_/\\/_____/                    \r
                                                               \r
 ______  ______  _____   ______  ______ __  __   __  ______    \r
/\\  == \\/\\  ___\\/\\  __-./\\  ___\\/\\  ___/\\ \\/\\ "-.\\ \\/\\  ___\\   \r
\\ \\  __<\\ \\  __\\\\ \\ \\/\\ \\ \\  __\\\\ \\  __\\ \\ \\ \\ \\-.  \\ \\  __\\   \r
 \\ \\_\\ \\_\\ \\_____\\ \\____-\\ \\_____\\ \\_\\  \\ \\_\\ \\_\\\\"\\_\\ \\_____\\ \r
  \\/_/ /_/\\/_____/\\/____/ \\/_____/\\/_/   \\/_/\\/_/ \\/_/\\/_____/\r
                                                               \r
  Github: https://github.com/EvanNotFound/hexo-theme-redefine`)},setStyleStatus:()=>{localStorage.setItem(main.localStorageKey,JSON.stringify(main.styleStatus))},getStyleStatus:()=>{var _=localStorage.getItem(main.localStorageKey);if(_){for(var t in _=JSON.parse(_),main.styleStatus)main.styleStatus[t]=_[t];return _}return null},refresh:()=>{initUtils(),initModeToggle(),initScrollTopBottom(),0!==theme.home_banner.subtitle.text.length&&location.pathname===config.root&&initTyped("subtitle"),!0===theme.navbar.search.enable&&initLocalSearch(),!0===theme.articles.code_block.copy&&initCopyCode(),!0===theme.articles.lazyload&&initLazyLoad()}};function initMain(){main.printThemeInfo(),main.refresh()}document.addEventListener("DOMContentLoaded",initMain);try{swup.hooks.on("page:view",()=>{main.refresh()})}catch(_){}export{main,initMain};
>>>>>>> main1
