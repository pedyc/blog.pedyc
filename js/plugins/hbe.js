<<<<<<< HEAD
(() => {
  "use strict";

  const cryptoObj = window.crypto || window.msCrypto;
  const storage = window.localStorage;

  const storageName = "hexo-blog-encrypt:#" + window.location.pathname;
  const keySalt = textToArray("hexo-blog-encrypt的作者们都是大帅比!");
  const ivSalt = textToArray("hexo-blog-encrypt是地表最强Hexo加密插件!");

  // As we can't detect the wrong password with AES-CBC,
  // so adding an empty div and check it when decrption.
  const knownPrefix = "<hbe-prefix></hbe-prefix>";

  const mainElement = document.getElementById("hexo-blog-encrypt");
  const wrongPassMessage = mainElement.dataset["wpm"];
  const wrongHashMessage = mainElement.dataset["whm"];
  const dataElement = mainElement.getElementsByTagName("script")["hbeData"];
  const encryptedData = dataElement.innerText;
  const HmacDigist = dataElement.dataset["hmacdigest"];

  function hexToArray(s) {
    return new Uint8Array(
      s.match(/[\da-f]{2}/gi).map((h) => {
        return parseInt(h, 16);
      }),
    );
  }

  function textToArray(s) {
    var i = s.length;
    var n = 0;
    var ba = new Array();

    for (var j = 0; j < i; ) {
      var c = s.codePointAt(j);
      if (c < 128) {
        ba[n++] = c;
        j++;
      } else if (c > 127 && c < 2048) {
        ba[n++] = (c >> 6) | 192;
        ba[n++] = (c & 63) | 128;
        j++;
      } else if (c > 2047 && c < 65536) {
        ba[n++] = (c >> 12) | 224;
        ba[n++] = ((c >> 6) & 63) | 128;
        ba[n++] = (c & 63) | 128;
        j++;
      } else {
        ba[n++] = (c >> 18) | 240;
        ba[n++] = ((c >> 12) & 63) | 128;
        ba[n++] = ((c >> 6) & 63) | 128;
        ba[n++] = (c & 63) | 128;
        j += 2;
      }
    }
    return new Uint8Array(ba);
  }

  function arrayBufferToHex(arrayBuffer) {
    if (
      typeof arrayBuffer !== "object" ||
      arrayBuffer === null ||
      typeof arrayBuffer.byteLength !== "number"
    ) {
      throw new TypeError("Expected input to be an ArrayBuffer");
    }

    var view = new Uint8Array(arrayBuffer);
    var result = "";
    var value;

    for (var i = 0; i < view.length; i++) {
      value = view[i].toString(16);
      result += value.length === 1 ? "0" + value : value;
    }

    return result;
  }

  async function getExecutableScript(oldElem) {
    let out = document.createElement("script");
    const attList = [
      "type",
      "text",
      "src",
      "crossorigin",
      "defer",
      "referrerpolicy",
    ];
    attList.forEach((att) => {
      if (oldElem[att]) out[att] = oldElem[att];
    });

    return out;
  }

  async function convertHTMLToElement(content) {
    let out = document.createElement("div");
    out.innerHTML = content;
    out.querySelectorAll("script").forEach(async (elem) => {
      elem.replaceWith(await getExecutableScript(elem));
    });

    return out;
  }

  function getKeyMaterial(password) {
    let encoder = new TextEncoder();
    return cryptoObj.subtle.importKey(
      "raw",
      encoder.encode(password),
      {
        name: "PBKDF2",
      },
      false,
      ["deriveKey", "deriveBits"],
    );
  }

  function getHmacKey(keyMaterial) {
    return cryptoObj.subtle.deriveKey(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: keySalt.buffer,
        iterations: 1024,
      },
      keyMaterial,
      {
        name: "HMAC",
        hash: "SHA-256",
        length: 256,
      },
      true,
      ["verify"],
    );
  }

  function getDecryptKey(keyMaterial) {
    return cryptoObj.subtle.deriveKey(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: keySalt.buffer,
        iterations: 1024,
      },
      keyMaterial,
      {
        name: "AES-CBC",
        length: 256,
      },
      true,
      ["decrypt"],
    );
  }

  function getIv(keyMaterial) {
    return cryptoObj.subtle.deriveBits(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: ivSalt.buffer,
        iterations: 512,
      },
      keyMaterial,
      16 * 8,
    );
  }

  async function verifyContent(key, content) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(content);

    let signature = hexToArray(HmacDigist);

    const result = await cryptoObj.subtle.verify(
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      key,
      signature,
      encoded,
    );
    console.log(`Verification result: ${result}`);
    if (!result) {
      alert(wrongHashMessage);
      console.log(`${wrongHashMessage}, got `, signature, ` but proved wrong.`);
    }
    return result;
  }

  async function decrypt(decryptKey, iv, hmacKey) {
    let typedArray = hexToArray(encryptedData);

    const result = await cryptoObj.subtle
      .decrypt(
        {
          name: "AES-CBC",
          iv: iv,
        },
        decryptKey,
        typedArray.buffer,
      )
      .then(async (result) => {
        const decoder = new TextDecoder();
        const decoded = decoder.decode(result);

        // check the prefix, if not then we can sure here is wrong password.
        if (!decoded.startsWith(knownPrefix)) {
          throw "Decode successfully but not start with KnownPrefix.";
        }

        const hideButton = document.createElement("button");
        hideButton.textContent = "Encrypt again";
        hideButton.type = "button";
        hideButton.classList.add("hbe-button");
        hideButton.addEventListener("click", () => {
          window.localStorage.removeItem(storageName);
          window.location.reload();
        });

        document.getElementById("hexo-blog-encrypt").style.display = "inline";
        document.getElementById("hexo-blog-encrypt").innerHTML = "";
        document
          .getElementById("hexo-blog-encrypt")
          .appendChild(await convertHTMLToElement(decoded));
        document.getElementById("hexo-blog-encrypt").appendChild(hideButton);

        // support html5 lazyload functionality.
        document.querySelectorAll("img").forEach((elem) => {
          if (elem.getAttribute("data-src") && !elem.src) {
            elem.src = elem.getAttribute("data-src");
          }
        });

        // support theme-next refresh
        window.NexT &&
          NexT.boot &&
          typeof NexT.boot.refresh === "function" &&
          NexT.boot.refresh();

        // TOC part
        var tocDiv = document.getElementById("toc-div");
        if (tocDiv) {
          tocDiv.style.display = "inline";
        }

        var tocDivs = document.getElementsByClassName("toc-div-class");
        if (tocDivs && tocDivs.length > 0) {
          for (var idx = 0; idx < tocDivs.length; idx++) {
            tocDivs[idx].style.display = "inline";
          }
        }

        // trigger event
        var event = new Event("hexo-blog-decrypt");
        window.dispatchEvent(event);

        return await verifyContent(hmacKey, decoded);
      })
      .catch((e) => {
        alert(wrongPassMessage);
        console.log(e);
        return false;
      });

    return result;
  }

  function hbeLoader() {
    const oldStorageData = JSON.parse(storage.getItem(storageName));

    if (oldStorageData) {
      console.log(
        `Password got from localStorage(${storageName}): `,
        oldStorageData,
      );

      const sIv = hexToArray(oldStorageData.iv).buffer;
      const sDk = oldStorageData.dk;
      const sHmk = oldStorageData.hmk;

      cryptoObj.subtle
        .importKey(
          "jwk",
          sDk,
          {
            name: "AES-CBC",
            length: 256,
          },
          true,
          ["decrypt"],
        )
        .then((dkCK) => {
          cryptoObj.subtle
            .importKey(
              "jwk",
              sHmk,
              {
                name: "HMAC",
                hash: "SHA-256",
                length: 256,
              },
              true,
              ["verify"],
            )
            .then((hmkCK) => {
              decrypt(dkCK, sIv, hmkCK).then((result) => {
                if (!result) {
                  storage.removeItem(storageName);
                }
              });
            });
        });
    }

    mainElement.addEventListener("keydown", async (event) => {
      if (event.isComposing || event.key === "Enter") {
        const password = document.getElementById("hbePass").value;
        const keyMaterial = await getKeyMaterial(password);
        const hmacKey = await getHmacKey(keyMaterial);
        const decryptKey = await getDecryptKey(keyMaterial);
        const iv = await getIv(keyMaterial);

        decrypt(decryptKey, iv, hmacKey).then((result) => {
          console.log(`Decrypt result: ${result}`);
          if (result) {
            cryptoObj.subtle.exportKey("jwk", decryptKey).then((dk) => {
              cryptoObj.subtle.exportKey("jwk", hmacKey).then((hmk) => {
                const newStorageData = {
                  dk: dk,
                  iv: arrayBufferToHex(iv),
                  hmk: hmk,
                };
                storage.setItem(storageName, JSON.stringify(newStorageData));
              });
            });
          }
        });
      }
    });
  }

  hbeLoader();
})();
=======
(()=>{let i=window.crypto||window.msCrypto,a=window.localStorage,l="hexo-blog-encrypt:#"+window.location.pathname,c=n("hexo-blog-encrypt的作者们都是大帅比!"),s=n("hexo-blog-encrypt是地表最强Hexo加密插件!"),d="<hbe-prefix></hbe-prefix>",e=document.getElementById("hexo-blog-encrypt"),r=e.dataset.wpm,y=e.dataset.whm;var t=e.getElementsByTagName("script").hbeData;let o=t.innerText,h=t.dataset.hmacdigest;function u(e){return new Uint8Array(e.match(/[\da-f]{2}/gi).map(e=>parseInt(e,16)))}function n(e){for(var t=e.length,n=0,r=new Array,o=0;o<t;){var a=e.codePointAt(o);a<128?(r[n++]=a,o++):127<a&&a<2048?(r[n++]=a>>6|192,r[n++]=63&a|128,o++):2047<a&&a<65536?(r[n++]=a>>12|224,r[n++]=a>>6&63|128,r[n++]=63&a|128,o++):(r[n++]=a>>18|240,r[n++]=a>>12&63|128,r[n++]=a>>6&63|128,r[n++]=63&a|128,o+=2)}return new Uint8Array(r)}async function m(e){var t=document.createElement("div");return t.innerHTML=e,t.querySelectorAll("script").forEach(async e=>{e.replaceWith(await async function(t){let n=document.createElement("script");return["type","text","src","crossorigin","defer","referrerpolicy"].forEach(e=>{t[e]&&(n[e]=t[e])}),n}(e))}),t}async function g(e,t,a){var n=u(o);return await i.subtle.decrypt({name:"AES-CBC",iv:t},e,n.buffer).then(async e=>{e=(new TextDecoder).decode(e);if(!e.startsWith(d))throw"Decode successfully but not start with KnownPrefix.";var t=document.createElement("button"),t=(t.textContent="Encrypt again",t.type="button",t.classList.add("hbe-button"),t.addEventListener("click",()=>{window.localStorage.removeItem(l),window.location.reload()}),document.getElementById("hexo-blog-encrypt").style.display="inline",document.getElementById("hexo-blog-encrypt").innerHTML="",document.getElementById("hexo-blog-encrypt").appendChild(await m(e)),document.getElementById("hexo-blog-encrypt").appendChild(t),document.querySelectorAll("img").forEach(e=>{e.getAttribute("data-src")&&!e.src&&(e.src=e.getAttribute("data-src"))}),window.NexT&&NexT.boot&&"function"==typeof NexT.boot.refresh&&NexT.boot.refresh(),document.getElementById("toc-div")),n=(t&&(t.style.display="inline"),document.getElementsByClassName("toc-div-class"));if(n&&0<n.length)for(var r=0;r<n.length;r++)n[r].style.display="inline";var o,t=new Event("hexo-blog-decrypt");return window.dispatchEvent(t),t=a,e=e,e=(new TextEncoder).encode(e),o=u(h),t=await i.subtle.verify({name:"HMAC",hash:"SHA-256"},t,o,e),console.log("Verification result: "+t),t||(alert(y),console.log(y+", got ",o," but proved wrong.")),t}).catch(e=>(alert(r),console.log(e),!1))}t=JSON.parse(a.getItem(l));if(t){console.log(`Password got from localStorage(${l}): `,t);let n=u(t.iv).buffer;var p=t.dk;let e=t.hmk;i.subtle.importKey("jwk",p,{name:"AES-CBC",length:256},!0,["decrypt"]).then(t=>{i.subtle.importKey("jwk",e,{name:"HMAC",hash:"SHA-256",length:256},!0,["verify"]).then(e=>{g(t,n,e).then(e=>{e||a.removeItem(l)})})})}e.addEventListener("keydown",async e=>{if(e.isComposing||"Enter"===e.key){e=document.getElementById("hbePass").value,o=(e=e,o=new TextEncoder,await i.subtle.importKey("raw",o.encode(e),{name:"PBKDF2"},!1,["deriveKey","deriveBits"]));e=o;let n=await i.subtle.deriveKey({name:"PBKDF2",hash:"SHA-256",salt:c.buffer,iterations:1024},e,{name:"HMAC",hash:"SHA-256",length:256},!0,["verify"]),t=(e=o,await i.subtle.deriveKey({name:"PBKDF2",hash:"SHA-256",salt:c.buffer,iterations:1024},e,{name:"AES-CBC",length:256},!0,["decrypt"])),r=(e=o,await i.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:s.buffer,iterations:512},e,128));g(t,r,n).then(e=>{console.log("Decrypt result: "+e),e&&i.subtle.exportKey("jwk",t).then(t=>{i.subtle.exportKey("jwk",n).then(e=>{e={dk:t,iv:function(e){if("object"!=typeof e||null===e||"number"!=typeof e.byteLength)throw new TypeError("Expected input to be an ArrayBuffer");for(var t,n=new Uint8Array(e),r="",o=0;o<n.length;o++)r+=1===(t=n[o].toString(16)).length?"0"+t:t;return r}(r),hmk:e};a.setItem(l,JSON.stringify(e))})})})}var o})})();
>>>>>>> main1
