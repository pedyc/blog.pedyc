<<<<<<< HEAD
export default function imageViewer() {
  let isBigImage = false;
  let scale = 1;
  let isMouseDown = false;
  let dragged = false;
  let currentImgIndex = 0;  
  let lastMouseX = 0;
  let lastMouseY = 0;
  let translateX = 0;
  let translateY = 0;

  const maskDom = document.querySelector(".image-viewer-container");
  const targetImg = maskDom.querySelector("img");

  const showHandle = (isShow) => {
    document.body.style.overflow = isShow ? "hidden" : "auto";
    isShow
      ? maskDom.classList.add("active")
      : maskDom.classList.remove("active");
  };

  const zoomHandle = (event) => {
    event.preventDefault();
    const rect = targetImg.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const dx = offsetX - rect.width / 2;
    const dy = offsetY - rect.height / 2;
    const oldScale = scale;
    scale += event.deltaY * -0.001;
    scale = Math.min(Math.max(0.8, scale), 4);

    if (oldScale < scale) {
      // Zooming in
      translateX -= dx * (scale - oldScale);
      translateY -= dy * (scale - oldScale);
    } else {
      // Zooming out
      translateX = 0;
      translateY = 0;
    }

    targetImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  };

  const dragStartHandle = (event) => {
    event.preventDefault();
    isMouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    targetImg.style.cursor = 'grabbing'; 
  };

  let lastTime = 0;
  const throttle = 100;

  const dragHandle = (event) => {
    if (isMouseDown) {
      const currentTime = new Date().getTime();
      if (currentTime - lastTime < throttle) {
        return;
      }
      lastTime = currentTime;
      const deltaX = event.clientX - lastMouseX;
      const deltaY = event.clientY - lastMouseY;
      translateX += deltaX;
      translateY += deltaY;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      targetImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      dragged = true; 
    }
  };

  const dragEndHandle = (event) => {
    if (isMouseDown) {
      event.stopPropagation();
    }
    isMouseDown = false;
    targetImg.style.cursor = 'grab'; 
  };

  targetImg.addEventListener("wheel", zoomHandle, { passive: false });
  targetImg.addEventListener("mousedown", dragStartHandle, { passive: false });
  targetImg.addEventListener("mousemove", dragHandle, { passive: false });
  targetImg.addEventListener("mouseup", dragEndHandle, { passive: false });
  targetImg.addEventListener("mouseleave", dragEndHandle, { passive: false });

  maskDom.addEventListener("click", (event) => {
    if (!dragged) { 
      isBigImage = false;
      showHandle(isBigImage);
      scale = 1;
      translateX = 0;
      translateY = 0;
      targetImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
    dragged = false;  
  });
  
  const imgDoms = document.querySelectorAll(
    ".markdown-body img, .masonry-item img, #shuoshuo-content img",
  );

  const escapeKeyListener = (event) => {
    if (event.key === "Escape" && isBigImage) {
      isBigImage = false;
      showHandle(isBigImage);
      scale = 1;
      translateX = 0;
      translateY = 0;
      targetImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      // Remove the event listener when the image viewer is closed
      document.removeEventListener("keydown", escapeKeyListener);
    }
  };

  imgDoms.forEach((img, index) => { 
    img.addEventListener("click", () => {
      currentImgIndex = index;  
      isBigImage = true;
      showHandle(isBigImage);
      targetImg.src = img.src;
      document.addEventListener("keydown", escapeKeyListener);
    });
  });

  const handleArrowKeys = (event) => {
    if (!isBigImage) return;  
  
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      currentImgIndex = (currentImgIndex - 1 + imgDoms.length) % imgDoms.length;
    } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      currentImgIndex = (currentImgIndex + 1) % imgDoms.length;
    } else {
      return;
    }
  
    const currentImg = imgDoms[currentImgIndex];
    let newSrc = currentImg.src;

    if (currentImg.hasAttribute("lazyload")) {
    newSrc = currentImg.getAttribute("data-src");
    currentImg.src = newSrc;  
    currentImg.removeAttribute("lazyload");  
  }

  targetImg.src = newSrc;
};

  document.addEventListener("keydown", handleArrowKeys); 

  if (!imgDoms.length && maskDom) {
    maskDom.parentNode.removeChild(maskDom);
  }
}
=======
export default function imageViewer(){let r=!1,a=1,n=!1,s=!1,i=0,l=0,o=0,d=0,c=0,t=document.querySelector(".image-viewer-container"),m=t.querySelector("img"),v=e=>{document.body.style.overflow=e?"hidden":"auto",e?t.classList.add("active"):t.classList.remove("active")};let u=0;var e=e=>{n&&e.stopPropagation(),n=!1,m.style.cursor="grab"};m.addEventListener("wheel",e=>{e.preventDefault();var t=m.getBoundingClientRect(),r=e.clientX-t.left,n=e.clientY-t.top,r=r-t.width/2,n=n-t.height/2,t=a;a+=-.001*e.deltaY,t<(a=Math.min(Math.max(.8,a),4))?(d-=r*(a-t),c-=n*(a-t)):(d=0,c=0),m.style.transform=`translate(${d}px, ${c}px) scale(${a})`},{passive:!1}),m.addEventListener("mousedown",e=>{e.preventDefault(),n=!0,l=e.clientX,o=e.clientY,m.style.cursor="grabbing"},{passive:!1}),m.addEventListener("mousemove",e=>{var t,r;!n||(t=(new Date).getTime())-u<100||(u=t,t=e.clientX-l,r=e.clientY-o,d+=t,c+=r,l=e.clientX,o=e.clientY,m.style.transform=`translate(${d}px, ${c}px) scale(${a})`,s=!0)},{passive:!1}),m.addEventListener("mouseup",e,{passive:!1}),m.addEventListener("mouseleave",e,{passive:!1}),t.addEventListener("click",e=>{s||(r=!1,v(r),a=1,d=0,c=0,m.style.transform=`translate(${d}px, ${c}px) scale(${a})`),s=!1});let p=document.querySelectorAll(".markdown-body img, .masonry-item img, #shuoshuo-content img"),y=e=>{"Escape"===e.key&&r&&(r=!1,v(r),a=1,d=0,c=0,m.style.transform=`translate(${d}px, ${c}px) scale(${a})`,document.removeEventListener("keydown",y))};p.forEach((e,t)=>{e.addEventListener("click",()=>{i=t,r=!0,v(r),m.src=e.src,document.addEventListener("keydown",y)})});document.addEventListener("keydown",t=>{if(r){if("ArrowUp"===t.key||"ArrowLeft"===t.key)i=(i-1+p.length)%p.length;else{if("ArrowDown"!==t.key&&"ArrowRight"!==t.key)return;i=(i+1)%p.length}t=p[i];let e=t.src;t.hasAttribute("lazyload")&&(e=t.getAttribute("data-src"),t.src=e,t.removeAttribute("lazyload")),m.src=e}}),!p.length&&t&&t.parentNode.removeChild(t)}
>>>>>>> main1
