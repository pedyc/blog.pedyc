<<<<<<< HEAD
export default function initLazyLoad() {
  const imgs = document.querySelectorAll("img");
  const options = {
    rootMargin: "0px",
    threshold: 0.1,
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute("data-src");
        img.removeAttribute("lazyload");
        observer.unobserve(img);
      }
    });
  }, options);
  imgs.forEach((img) => {
    if (img.hasAttribute("lazyload")) {
      observer.observe(img);
    }
  });
}
=======
export default function initLazyLoad(){var e=document.querySelectorAll("img");let t=new IntersectionObserver((e,t)=>{e.forEach(e=>{e.isIntersecting&&((e=e.target).src=e.getAttribute("data-src"),e.removeAttribute("lazyload"),t.unobserve(e))})},{rootMargin:"0px",threshold:.1});e.forEach(e=>{e.hasAttribute("lazyload")&&t.observe(e)})}
>>>>>>> main1
