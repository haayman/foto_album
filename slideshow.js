var makeBSS = function (el, options) {
  var $slideshows = document.querySelectorAll(el), // a collection of all of the slideshow
    $slideshow = {},
    Slideshow = {
      init: function (el, options) {
        options = options || {}; // if options object not passed in, then set to empty object
        options.auto = options.auto || false; // if options.auto object not passed in, then set to false
        this.opts = {
          selector:
            typeof options.selector === "undefined"
              ? "figure"
              : options.selector,
          auto: typeof options.auto === "undefined" ? false : options.auto,
          speed:
            typeof options.auto.speed === "undefined"
              ? 1500
              : options.auto.speed,
          pauseOnHover:
            typeof options.auto.pauseOnHover === "undefined"
              ? false
              : options.auto.pauseOnHover,
          fullScreen:
            typeof options.fullScreen === "undefined"
              ? false
              : options.fullScreen,
          swipe: typeof options.swipe === "undefined" ? false : options.swipe,
        };

        this.counter = 0; // to keep track of current slide
        this.el = el; // current slideshow container
        this.$items = el.querySelectorAll(this.opts.selector); // a collection of all of the slides, caching for performance
        this.numItems = this.$items.length; // total number of slides
        this.$items[0].classList.add("bss-show"); // add show class to first figure
        this.injectControls(el);
        this.addEventListeners(el);
        if (this.opts.auto) {
          this.autoCycle(this.el, this.opts.speed, this.opts.pauseOnHover);
        }
        if (this.opts.fullScreen) {
          this.addFullScreen(this.el);
        }
        if (this.opts.swipe) {
          this.addSwipe(this.el);
        }
      },
      showCurrent: function (i) {
        // increment or decrement this.counter depending on whether i === 1 or i === -1
        if (i > 0) {
          this.counter =
            this.counter + 1 === this.numItems ? 0 : this.counter + 1;
        } else {
          this.counter =
            this.counter - 1 < 0 ? this.numItems - 1 : this.counter - 1;
        }

        const item = this.$items[this.counter];
        const setActive = () => {
          [].forEach.call(this.$items, function (el) {
            el.classList.remove("bss-show");
          });
          item.classList.add("bss-show");
        };

        const img = item.querySelector("img");
        // lazy load img
        if (!img.src) {
          img.addEventListener("load", () => {
            setActive();
          });
          img.src = img.getAttribute("data-src");
          img.removeAttribute("data-src");
        } else {
          setActive();
        }
      },
      injectControls: function (el) {
        // build and inject prev/next controls
        // first create all the new elements
        var spanPrev = document.createElement("span"),
          spanNext = document.createElement("span"),
          docFrag = document.createDocumentFragment();

        // add classes
        spanPrev.classList.add("bss-prev");
        spanNext.classList.add("bss-next");

        // add contents
        spanPrev.innerHTML = "&laquo;";
        spanNext.innerHTML = "&raquo;";

        // append elements to fragment, then append fragment to DOM
        docFrag.appendChild(spanPrev);
        docFrag.appendChild(spanNext);
        el.appendChild(docFrag);
      },
      addEventListeners: function (el) {
        var that = this;
        el.querySelector(".bss-next").addEventListener(
          "click",
          function () {
            that.showCurrent(1); // increment & show
          },
          false
        );

        el.querySelector(".bss-prev").addEventListener(
          "click",
          function () {
            that.showCurrent(-1); // decrement & show
          },
          false
        );

        el.onkeydown = function (e) {
          e = e || window.event;
          if (e.keyCode === 37) {
            that.showCurrent(-1); // decrement & show
          } else if (e.keyCode === 39) {
            that.showCurrent(1); // increment & show
          }
        };
      },
      autoCycle: function (el, speed, pauseOnHover) {
        var that = this,
          interval = window.setInterval(function () {
            that.showCurrent(1); // increment & show
          }, speed);

        if (pauseOnHover) {
          el.addEventListener(
            "mouseover",
            function () {
              clearInterval(interval);
              interval = null;
            },
            false
          );
          el.addEventListener(
            "mouseout",
            function () {
              if (!interval) {
                interval = window.setInterval(function () {
                  that.showCurrent(1); // increment & show
                }, speed);
              }
            },
            false
          );
        } // end pauseonhover
      },
      addFullScreen: function (el) {
        var that = this,
          fsControl = document.createElement("span");

        fsControl.classList.add("bss-fullscreen");
        el.appendChild(fsControl);
        el.querySelector(".bss-fullscreen").addEventListener(
          "click",
          function () {
            that.toggleFullScreen(el);
          },
          false
        );
      },
      addSwipe: function (el) {
        var that = this,
          ht = new Hammer(el);
        ht.on("swiperight", function (e) {
          that.showCurrent(-1); // decrement & show
        });
        ht.on("swipeleft", function (e) {
          that.showCurrent(1); // increment & show
        });
      },
      toggleFullScreen: function (el) {
        // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
        if (
          !document.fullscreenElement && // alternative standard method
          !document.mozFullScreenElement &&
          !document.webkitFullscreenElement &&
          !document.msFullscreenElement
        ) {
          // current working methods
          if (document.documentElement.requestFullscreen) {
            el.requestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            el.msRequestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            el.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            el.webkitRequestFullscreen(el.ALLOW_KEYBOARD_INPUT);
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      }, // end toggleFullScreen
    }; // end Slideshow object .....

  // make instances of Slideshow as needed
  [].forEach.call($slideshows, function (el) {
    $slideshow = Object.create(Slideshow);
    $slideshow.init(el, options);
  });
};

function loadAlbum($, link, elemId) {
  console.log(link, elemId);
  const elem = jQuery(`#${elemId}`);
  const width = Math.floor(Math.min(800, jQuery(elem).width()));
  const height = (width * 2) / 3;

  elem.css({ maxWidth: width, height });
  // TODO: bepaal manier om relatief pad te kunnen gebruiken
  const albumWorker = new Worker("/wp-content/plugins/foto_album//parseAlbum.js");
  albumWorker.postMessage(link);
  albumWorker.onmessage = (e) => {
    const fotos = e.data;
    elem.html(""); // remove spinner
    fotos.forEach(function (foto, index) {
      const figure = $("<figure />");
      const url = `${foto}=w${width}`;
      const attributes = index
        ? {
            "data-src": url,
            // loading: 'lazy'
          }
        : { src: url };
      const img = $("<img />", attributes);
      figure.append(img);
      elem.append(figure);
    });
    elem.append($('<span class="bss-prev>«</span'));
    elem.append($('<span class="bss-next>»</span'));

    makeBSS("#" + elemId, {
      auto: {
        speed: 2500,
        pauseOnHover: true,
      },
    });
    albumWorker.terminate();
  };

  albumWorker.onerror = (e) => {
    elem.html("Er is een fout opgetreden bij het laden van de foto's");
    albumWorker.terminate();
  }
}
