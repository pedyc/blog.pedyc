<<<<<<< HEAD
const initCopyCode = () => {
  HTMLElement.prototype.wrap = function (wrapper) {
    this.parentNode.insertBefore(wrapper, this);
    this.parentNode.removeChild(this);
    wrapper.appendChild(this);
  };

  document.querySelectorAll("figure.highlight").forEach((element) => {
    const container = document.createElement("div");
    element.wrap(container);
    container.classList.add("highlight-container");
    container.insertAdjacentHTML(
      "beforeend",
      '<div class="copy-button"><i class="fa-regular fa-copy"></i></div>',
    );
    container.insertAdjacentHTML(
      "beforeend",
      '<div class="fold-button"><i class="fa-solid fa-chevron-down"></i></div>',
    );
    const copyButton = container.querySelector(".copy-button");
    const foldButton = container.querySelector(".fold-button");
    copyButton.addEventListener("click", () => {
      const codeLines = [...container.querySelectorAll(".code .line")];
      const code = codeLines.map((line) => line.innerText).join("\n");

      // Copy code to clipboard
      navigator.clipboard.writeText(code);

      // Display 'copied' icon
      copyButton.querySelector("i").className = "fa-regular fa-check";

      // Reset icon after a while
      setTimeout(() => {
        copyButton.querySelector("i").className = "fa-regular fa-copy";
      }, 1000);
    });
    foldButton.addEventListener("click", () => {
      container.classList.toggle("folded");
      foldButton.querySelector("i").className = container.classList.contains(
        "folded",
      )
        ? "fa-solid fa-chevron-up"
        : "fa-solid fa-chevron-down";
    });
  });
};

export default initCopyCode;
=======
let initCopyCode=()=>{HTMLElement.prototype.wrap=function(e){this.parentNode.insertBefore(e,this),this.parentNode.removeChild(this),e.appendChild(this)},document.querySelectorAll("figure.highlight").forEach(e=>{let t=document.createElement("div"),o=(e.wrap(t),t.classList.add("highlight-container"),t.insertAdjacentHTML("beforeend",'<div class="copy-button"><i class="fa-regular fa-copy"></i></div>'),t.insertAdjacentHTML("beforeend",'<div class="fold-button"><i class="fa-solid fa-chevron-down"></i></div>'),t.querySelector(".copy-button")),i=t.querySelector(".fold-button");o.addEventListener("click",()=>{var e=[...t.querySelectorAll(".code .line")].map(e=>e.innerText).join("\n");navigator.clipboard.writeText(e),o.querySelector("i").className="fa-regular fa-check",setTimeout(()=>{o.querySelector("i").className="fa-regular fa-copy"},1e3)}),i.addEventListener("click",()=>{t.classList.toggle("folded"),i.querySelector("i").className=t.classList.contains("folded")?"fa-solid fa-chevron-up":"fa-solid fa-chevron-down"})})};export default initCopyCode;
>>>>>>> main1
