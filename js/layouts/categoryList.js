<<<<<<< HEAD
const toggleStyle = (element, style, firstValue, secondValue) => {
  element.style[style] =
    element.style[style] === firstValue ? secondValue : firstValue;
};

const setupCategoryList = () => {
  const parentElements = Array.from(
    document.querySelectorAll(".all-category-list-item"),
  ).filter((item) =>
    item.parentElement.classList.contains("all-category-list"),
  );

  parentElements.forEach((parentElement) => {
    const childElements = parentElement.querySelectorAll(
      ".all-category-list-child",
    );
    childElements.forEach((childElement) => {
      childElement.style.maxHeight = "0px";
      childElement.style.marginTop = "0px";
    });

    parentElement.addEventListener("click", () => {
      const clickedElementTopOffset = parentElement.offsetTop;
      childElements.forEach((childElement) => {
        toggleStyle(childElement, "maxHeight", "0px", "1000px");
        toggleStyle(childElement, "marginTop", "0px", "15px");
      });

      parentElements.forEach((siblingElement) => {
        if (
          siblingElement.offsetTop === clickedElementTopOffset &&
          siblingElement !== parentElement
        ) {
          const siblingChildElements = siblingElement.querySelectorAll(
            ".all-category-list-child",
          );
          siblingChildElements.forEach((siblingChildElement) => {
            toggleStyle(siblingChildElement, "maxHeight", "0px", "1000px");
            toggleStyle(siblingChildElement, "marginTop", "0px", "15px");
          });
        }
      });
    });
  });
};

try {
  swup.hooks.on("page:view", setupCategoryList);
} catch (e) {
  console.error(e);
}

document.addEventListener("DOMContentLoaded", setupCategoryList);
=======
let toggleStyle=(e,t,l,o)=>{e.style[t]=e.style[t]===l?o:l},setupCategoryList=()=>{let o=Array.from(document.querySelectorAll(".all-category-list-item")).filter(e=>e.parentElement.classList.contains("all-category-list"));o.forEach(l=>{let e=l.querySelectorAll(".all-category-list-child");e.forEach(e=>{e.style.maxHeight="0px",e.style.marginTop="0px"}),l.addEventListener("click",()=>{let t=l.offsetTop;e.forEach(e=>{toggleStyle(e,"maxHeight","0px","1000px"),toggleStyle(e,"marginTop","0px","15px")}),o.forEach(e=>{e.offsetTop===t&&e!==l&&e.querySelectorAll(".all-category-list-child").forEach(e=>{toggleStyle(e,"maxHeight","0px","1000px"),toggleStyle(e,"marginTop","0px","15px")})})})})};try{swup.hooks.on("page:view",setupCategoryList)}catch(e){console.error(e)}document.addEventListener("DOMContentLoaded",setupCategoryList);
>>>>>>> main1
