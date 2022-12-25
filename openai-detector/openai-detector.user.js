// ==UserScript==
// @name        Stack Exchange, OpenAI detector
// @namespace   https://github.com/Glorfindel83/
// @description Adds a button to check the probability that a post was written by a bot
// @author      Glorfindel
// @updateURL   https://raw.githubusercontent.com/Glorfindel83/SE-Userscripts/master/openai-detector/openai-detector.user.js
// @downloadURL https://raw.githubusercontent.com/Glorfindel83/SE-Userscripts/master/openai-detector/openai-detector.user.js
// @supportURL  https://stackapps.com/questions/9611/openai-detector
// @version     0.2.1
// @match       *://*.stackexchange.com/questions/*
// @match       *://*.stackoverflow.com/questions/*
// @match       *://*.superuser.com/questions/*
// @match       *://*.serverfault.com/questions/*
// @match       *://*.askubuntu.com/questions/*
// @match       *://*.stackapps.com/questions/*
// @match       *://*.mathoverflow.net/questions/*
// @exclude     *://*.stackexchange.com/questions/ask
// @exclude     *://*.stackoverflow.com/questions/ask
// @exclude     *://*.superuser.com/questions/ask
// @exclude     *://*.serverfault.com/questions/ask
// @exclude     *://*.askubuntu.com/questions/ask
// @exclude     *://*.stackapps.com/questions/ask
// @exclude     *://*.mathoverflow.net/questions/ask
// @connect     huggingface.co
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// ==/UserScript==

(function () {
  "use strict";

  $("a.js-share-link").each(function() {
    let shareButton = $(this);

    // Add button
    let button = $('<button class="s-btn s-btn__link" type="button" href="#">Detect OpenAI</button>');
    let cell = $('<div class="flex--item"></div>');
    cell.append(button);
    let menu = shareButton.parent().parent();
    menu.append(cell);

    function detectAI(event) {
      let post = shareButton.parents(".answercell");
      if (post.length == 0) {
        post = shareButton.parents(".postcell");
      }
      let text = post.find(".js-post-body").text().trim();
      $.ajaxSetup({ cache: true });
      $.get("https://huggingface.co/openai-detector?" + encodeURIComponent(text), function (data) {
        let message = "According to Hugging Face, the chance that this post was generated by OpenAI is "
          + Math.round(data.fake_probability * 100, 2) + "%.";
        StackExchange.helpers.showToast(message);
      });
    }
    button.on('click', detectAI);
  });
})();

