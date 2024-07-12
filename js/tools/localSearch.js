<<<<<<< HEAD
export default function initLocalSearch() {
  // Search DB path
  let searchPath = config.path;
  if (!searchPath) {
    // Search DB path
    console.warn("`hexo-generator-searchdb` plugin is not installed!");
    return;
  }

  // Popup Window
  let isfetched = false;
  let datas;
  let isXml = true;
  if (searchPath.length === 0) {
    searchPath = "search.xml";
  } else if (searchPath.endsWith("json")) {
    isXml = false;
  }
  const searchInputDom = document.querySelector(".search-input");
  const resultContent = document.getElementById("search-result");

  const getIndexByWord = (word, text, caseSensitive) => {
    let wordLen = word.length;
    if (wordLen === 0) return [];
    let startPosition = 0;
    let position = [];
    let index = [];
    if (!caseSensitive) {
      text = text.toLowerCase();
      word = word.toLowerCase();
    }
    while ((position = text.indexOf(word, startPosition)) > -1) {
      index.push({ position, word });
      startPosition = position + wordLen;
    }
    return index;
  };

  // Merge hits into slices
  const mergeIntoSlice = (start, end, index, searchText) => {
    let currentItem = index[index.length - 1];
    let { position, word } = currentItem;
    let hits = [];
    let searchTextCountInSlice = 0;

    // Merge hits into the slice
    while (position + word.length <= end && index.length !== 0) {
      if (word === searchText) {
        searchTextCountInSlice++;
      }
      hits.push({
        position,
        length: word.length,
      });

      const wordEnd = position + word.length;

      // Move to the next position of the hit
      index.pop();
      for (let i = index.length - 1; i >= 0; i--) {
        currentItem = index[i];
        position = currentItem.position;
        word = currentItem.word;
        if (wordEnd <= position) {
          break;
        } else {
          index.pop();
        }
      }
    }

    return {
      hits,
      start,
      end,
      searchTextCount: searchTextCountInSlice,
    };
  };

  // Highlight title and content
  const highlightKeyword = (text, slice) => {
    let result = "";
    let prevEnd = slice.start;
    slice.hits.forEach((hit) => {
      result += text.substring(prevEnd, hit.position);
      let end = hit.position + hit.length;
      result += `<b class="search-keyword">${text.substring(
        hit.position,
        end,
      )}</b>`;
      prevEnd = end;
    });
    result += text.substring(prevEnd, slice.end);
    return result;
  };

  const inputEventFunction = () => {
    if (!isfetched) return;
    let searchText = searchInputDom.value.trim().toLowerCase();
    let keywords = searchText.split(/[-\s]+/);
    if (keywords.length > 1) {
      keywords.push(searchText);
    }
    let resultItems = [];
    if (searchText.length > 0) {
      // Perform local searching
      datas.forEach(({ title, content, url }) => {
        let titleInLowerCase = title.toLowerCase();
        let contentInLowerCase = content.toLowerCase();
        let indexOfTitle = [];
        let indexOfContent = [];
        let searchTextCount = 0;
        keywords.forEach((keyword) => {
          indexOfTitle = indexOfTitle.concat(
            getIndexByWord(keyword, titleInLowerCase, false),
          );
          indexOfContent = indexOfContent.concat(
            getIndexByWord(keyword, contentInLowerCase, false),
          );
        });

        // Show search results
        if (indexOfTitle.length > 0 || indexOfContent.length > 0) {
          let hitCount = indexOfTitle.length + indexOfContent.length;
          // Sort index by position of keyword
          [indexOfTitle, indexOfContent].forEach((index) => {
            index.sort((itemLeft, itemRight) => {
              if (itemRight.position !== itemLeft.position) {
                return itemRight.position - itemLeft.position;
              }
              return itemLeft.word.length - itemRight.word.length;
            });
          });

          let slicesOfTitle = [];
          if (indexOfTitle.length !== 0) {
            let tmp = mergeIntoSlice(0, title.length, indexOfTitle, searchText);
            searchTextCount += tmp.searchTextCountInSlice;
            slicesOfTitle.push(tmp);
          }

          let slicesOfContent = [];
          while (indexOfContent.length !== 0) {
            let item = indexOfContent[indexOfContent.length - 1];
            let { position, word } = item;
            // Cut out 100 characters
            let start = position - 20;
            let end = position + 80;
            if (start < 0) {
              start = 0;
            }
            if (end < position + word.length) {
              end = position + word.length;
            }
            if (end > content.length) {
              end = content.length;
            }
            let tmp = mergeIntoSlice(start, end, indexOfContent, searchText);
            searchTextCount += tmp.searchTextCountInSlice;
            slicesOfContent.push(tmp);
          }

          // Sort slices in content by search text's count and hits' count
          slicesOfContent.sort((sliceLeft, sliceRight) => {
            if (sliceLeft.searchTextCount !== sliceRight.searchTextCount) {
              return sliceRight.searchTextCount - sliceLeft.searchTextCount;
            } else if (sliceLeft.hits.length !== sliceRight.hits.length) {
              return sliceRight.hits.length - sliceLeft.hits.length;
            }
            return sliceLeft.start - sliceRight.start;
          });

          // Select top N slices in content
          let upperBound = parseInt(
            theme.navbar.search.top_n_per_article
              ? theme.navbar.search.top_n_per_article
              : 1,
            10,
          );
          if (upperBound >= 0) {
            slicesOfContent = slicesOfContent.slice(0, upperBound);
          }

          let resultItem = "";

          if (slicesOfTitle.length !== 0) {
            resultItem += `<li><a href="${url}" class="search-result-title">${highlightKeyword(
              title,
              slicesOfTitle[0],
            )}</a>`;
          } else {
            resultItem += `<li><a href="${url}" class="search-result-title">${title}</a>`;
          }

          slicesOfContent.forEach((slice) => {
            resultItem += `<a href="${url}"><p class="search-result">${highlightKeyword(
              content,
              slice,
            )}...</p></a>`;
          });

          resultItem += "</li>";
          resultItems.push({
            item: resultItem,
            id: resultItems.length,
            hitCount,
            searchTextCount,
          });
        }
      });
    }
    if (keywords.length === 1 && keywords[0] === "") {
      resultContent.innerHTML =
        '<div id="no-result"><i class="fa-solid fa-magnifying-glass fa-5x"></i></div>';
    } else if (resultItems.length === 0) {
      resultContent.innerHTML =
        '<div id="no-result"><i class="fa-solid fa-box-open fa-5x"></i></div>';
    } else {
      resultItems.sort((resultLeft, resultRight) => {
        if (resultLeft.searchTextCount !== resultRight.searchTextCount) {
          return resultRight.searchTextCount - resultLeft.searchTextCount;
        } else if (resultLeft.hitCount !== resultRight.hitCount) {
          return resultRight.hitCount - resultLeft.hitCount;
        }
        return resultRight.id - resultLeft.id;
      });
      let searchResultList = '<ul class="search-result-list">';
      resultItems.forEach((result) => {
        searchResultList += result.item;
      });
      searchResultList += "</ul>";
      resultContent.innerHTML = searchResultList;
      window.pjax && window.pjax.refresh(resultContent);
    }
  };

  const fetchData = () => {
    fetch(config.root + searchPath)
      .then((response) => response.text())
      .then((res) => {
        // Get the contents from search data
        isfetched = true;
        datas = isXml
          ? [
              ...new DOMParser()
                .parseFromString(res, "text/xml")
                .querySelectorAll("entry"),
            ].map((element) => {
              return {
                title: element.querySelector("title").textContent,
                content: element.querySelector("content").textContent,
                url: element.querySelector("url").textContent,
              };
            })
          : JSON.parse(res);
        // Only match articles with not empty titles
        datas = datas
          .filter((data) => data.title)
          .map((data) => {
            data.title = data.title.trim();
            data.content = data.content
              ? data.content.trim().replace(/<[^>]+>/g, "")
              : "";
            data.url = decodeURIComponent(data.url).replace(/\/{2,}/g, "/");
            return data;
          });
        // Remove loading animation
        const noResultDom = document.querySelector("#no-result");
        noResultDom &&
          (noResultDom.innerHTML =
            '<i class="fa-solid fa-magnifying-glass fa-5x"></i>');
      });
  };

  if (theme.navbar.search.preload) {
    fetchData();
  }

  if (searchInputDom) {
    searchInputDom.addEventListener("input", inputEventFunction);
  }

  // Handle and trigger popup window
  document.querySelectorAll(".search-popup-trigger").forEach((element) => {
    element.addEventListener("click", () => {
      document.body.style.overflow = "hidden";
      document.querySelector(".search-pop-overlay").classList.add("active");
      setTimeout(() => searchInputDom.focus(), 500);
      if (!isfetched) fetchData();
    });
  });

  // Monitor main search box
  const onPopupClose = () => {
    document.body.style.overflow = "";
    document.querySelector(".search-pop-overlay").classList.remove("active");
  };

  document
    .querySelector(".search-pop-overlay")
    .addEventListener("click", (event) => {
      if (event.target === document.querySelector(".search-pop-overlay")) {
        onPopupClose();
      }
    });
  document
    .querySelector(".search-input-field-pre")
    .addEventListener("click", () => {
      searchInputDom.value = "";
      searchInputDom.focus();
      inputEventFunction();
    });
  document
    .querySelector(".popup-btn-close")
    .addEventListener("click", onPopupClose);
  try {
    swup.hooks.on("page:view", (visit) => {
      onPopupClose();
    });
  } catch (e) {}

  window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      onPopupClose();
    }
  });
}
=======
export default function initLocalSearch(){let a=config.path;if(a){let t=!1,r,n=!0,o=(0===a.length?a="search.xml":a.endsWith("json")&&(n=!1),document.querySelector(".search-input")),e=document.getElementById("search-result"),v=(e,t,r)=>{var n=e.length;if(0===n)return[];let o=0;var l,s=[];for(r||(t=t.toLowerCase(),e=e.toLowerCase());-1<(l=t.indexOf(e,o));)s.push({position:l,word:e}),o=l+n;return s},m=(e,t,r,n)=>{var o;let{position:l,word:s}=r[r.length-1];var i=[];let a=0;for(;l+s.length<=t&&0!==r.length;){s===n&&a++,i.push({position:l,length:s.length});var c=l+s.length;r.pop();for(let e=r.length-1;0<=e&&(o=r[e],l=o.position,s=o.word,!(c<=l));e--)r.pop()}return{hits:i,start:e,end:t,searchTextCount:a}},y=(r,e)=>{let n="",o=e.start;return e.hits.forEach(e=>{n+=r.substring(o,e.position);var t=e.position+e.length;n+=`<b class="search-keyword">${r.substring(e.position,t)}</b>`,o=t}),n+=r.substring(o,e.end)},l=()=>{if(t){let p=o.value.trim().toLowerCase(),g=p.split(/[-\s]+/),f=(1<g.length&&g.push(p),[]);if(0<p.length&&r.forEach(({title:e,content:n,url:o})=>{let t=e.toLowerCase(),r=n.toLowerCase(),l=[],s=[],i=0;if(g.forEach(e=>{l=l.concat(v(e,t,!1)),s=s.concat(v(e,r,!1))}),0<l.length||0<s.length){var a=l.length+s.length,c=([l,s].forEach(e=>{e.sort((e,t)=>t.position!==e.position?t.position-e.position:e.word.length-t.word.length)}),[]);0!==l.length&&(d=m(0,e.length,l,p),i+=d.searchTextCountInSlice,c.push(d));let r=[];for(;0!==s.length;){var{position:h,word:u}=s[s.length-1];let e=h-20,t=h+80;e<0&&(e=0),(t=t<h+u.length?h+u.length:t)>n.length&&(t=n.length);h=m(e,t,s,p);i+=h.searchTextCountInSlice,r.push(h)}r.sort((e,t)=>e.searchTextCount!==t.searchTextCount?t.searchTextCount-e.searchTextCount:e.hits.length!==t.hits.length?t.hits.length-e.hits.length:e.start-t.start);var d=parseInt(theme.navbar.search.top_n_per_article||1,10);0<=d&&(r=r.slice(0,d));let t="";t+=0!==c.length?`<li><a href="${o}" class="search-result-title">${y(e,c[0])}</a>`:`<li><a href="${o}" class="search-result-title">${e}</a>`,r.forEach(e=>{t+=`<a href="${o}"><p class="search-result">${y(n,e)}...</p></a>`}),t+="</li>",f.push({item:t,id:f.length,hitCount:a,searchTextCount:i})}}),1===g.length&&""===g[0])e.innerHTML='<div id="no-result"><i class="fa-solid fa-magnifying-glass fa-5x"></i></div>';else if(0===f.length)e.innerHTML='<div id="no-result"><i class="fa-solid fa-box-open fa-5x"></i></div>';else{f.sort((e,t)=>e.searchTextCount!==t.searchTextCount?t.searchTextCount-e.searchTextCount:e.hitCount!==t.hitCount?t.hitCount-e.hitCount:t.id-e.id);let t='<ul class="search-result-list">';f.forEach(e=>{t+=e.item}),t+="</ul>",e.innerHTML=t,window.pjax&&window.pjax.refresh(e)}}},s=()=>{fetch(config.root+a).then(e=>e.text()).then(e=>{t=!0,r=(r=n?[...(new DOMParser).parseFromString(e,"text/xml").querySelectorAll("entry")].map(e=>({title:e.querySelector("title").textContent,content:e.querySelector("content").textContent,url:e.querySelector("url").textContent})):JSON.parse(e)).filter(e=>e.title).map(e=>(e.title=e.title.trim(),e.content=e.content?e.content.trim().replace(/<[^>]+>/g,""):"",e.url=decodeURIComponent(e.url).replace(/\/{2,}/g,"/"),e));e=document.querySelector("#no-result");e&&(e.innerHTML='<i class="fa-solid fa-magnifying-glass fa-5x"></i>')})},i=(theme.navbar.search.preload&&s(),o&&o.addEventListener("input",l),document.querySelectorAll(".search-popup-trigger").forEach(e=>{e.addEventListener("click",()=>{document.body.style.overflow="hidden",document.querySelector(".search-pop-overlay").classList.add("active"),setTimeout(()=>o.focus(),500),t||s()})}),()=>{document.body.style.overflow="",document.querySelector(".search-pop-overlay").classList.remove("active")});document.querySelector(".search-pop-overlay").addEventListener("click",e=>{e.target===document.querySelector(".search-pop-overlay")&&i()}),document.querySelector(".search-input-field-pre").addEventListener("click",()=>{o.value="",o.focus(),l()}),document.querySelector(".popup-btn-close").addEventListener("click",i);try{swup.hooks.on("page:view",e=>{i()})}catch(e){}window.addEventListener("keyup",e=>{"Escape"===e.key&&i()})}else console.warn("`hexo-generator-searchdb` plugin is not installed!")}
>>>>>>> main1
