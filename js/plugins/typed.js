<<<<<<< HEAD
/*
author: @jiangwen5945 & EvanNotFound
*/
export const config = {
  usrTypeSpeed: theme.home_banner.subtitle.typing_speed,
  usrBackSpeed: theme.home_banner.subtitle.backing_speed,
  usrBackDelay: theme.home_banner.subtitle.backing_delay,
  usrStartDelay: theme.home_banner.subtitle.starting_delay,
  usrLoop: theme.home_banner.subtitle.loop,
  usrSmartBackspace: theme.home_banner.subtitle.smart_backspace,
  usrHitokotoAPI: theme.home_banner.subtitle.hitokoto.api,
};

export default function initTyped(id) {
  const {
    usrTypeSpeed,
    usrBackSpeed,
    usrBackDelay,
    usrStartDelay,
    usrLoop,
    usrSmartBackspace,
    usrHitokotoAPI,
  } = config;

  function typing(dataList) {
    const st = new Typed("#" + id, {
      strings: [dataList],
      typeSpeed: usrTypeSpeed || 100,
      smartBackspace: usrSmartBackspace || false,
      backSpeed: usrBackSpeed || 80,
      backDelay: usrBackDelay || 1500,
      loop: usrLoop || false,
      startDelay: usrStartDelay || 500,
    });
  }

  if (theme.home_banner.subtitle.hitokoto.enable) {
    fetch(usrHitokotoAPI)
      .then((response) => response.json())
      .then((data) => {
        typing(data.hitokoto);
      })
      .catch(console.error);
  } else {
    const sentenceList = [...theme.home_banner.subtitle.text];
    if (document.getElementById(id)) {
      const st = new Typed("#" + id, {
        strings: sentenceList,
        typeSpeed: usrTypeSpeed || 100,
        smartBackspace: usrSmartBackspace || false,
        backSpeed: usrBackSpeed || 80,
        backDelay: usrBackDelay || 1500,
        loop: usrLoop || false,
        startDelay: usrStartDelay || 500,
      });
    }
  }
}
=======
let config={usrTypeSpeed:theme.home_banner.subtitle.typing_speed,usrBackSpeed:theme.home_banner.subtitle.backing_speed,usrBackDelay:theme.home_banner.subtitle.backing_delay,usrStartDelay:theme.home_banner.subtitle.starting_delay,usrLoop:theme.home_banner.subtitle.loop,usrSmartBackspace:theme.home_banner.subtitle.smart_backspace,usrHitokotoAPI:theme.home_banner.subtitle.hitokoto.api};export default function initTyped(t){let{usrTypeSpeed:a,usrBackSpeed:o,usrBackDelay:s,usrStartDelay:r,usrLoop:n,usrSmartBackspace:p,usrHitokotoAPI:e}=config;var c;theme.home_banner.subtitle.hitokoto.enable?fetch(e).then(e=>e.json()).then(e=>{e=e.hitokoto,new Typed("#"+t,{strings:[e],typeSpeed:a||100,smartBackspace:p||!1,backSpeed:o||80,backDelay:s||1500,loop:n||!1,startDelay:r||500})}).catch(console.error):(c=[...theme.home_banner.subtitle.text],document.getElementById(t)&&new Typed("#"+t,{strings:c,typeSpeed:a||100,smartBackspace:p||!1,backSpeed:o||80,backDelay:s||1500,loop:n||!1,startDelay:r||500}))}export{config};
>>>>>>> main1
