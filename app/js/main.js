const D = document;

const FARBA = {
  //lazy load для сторонних либ
  lazyLibraryLoad(scriptSrc, linkHref, callback) {
    let script;
    const domScript = document.querySelector(`script[src="${scriptSrc}"]`);
    const domLink = document.querySelector(`link[href="${linkHref}"]`);

    if (!domScript) {
      script = document.createElement("script");
      script.src = scriptSrc;
      document.querySelector("#wrapper").after(script);
    }

    if (linkHref !== "" && !domLink) {
      let style = document.createElement("link");
      style.href = linkHref;
      style.rel = "stylesheet";
      document.querySelector("link").before(style);
    }

    if (!domScript) {
      script.onload = callback;
    } else {
      // domScript.onload = callback;
      callback()
    }
  },

  scroller(selector) {
    const link = D.querySelectorAll(selector);
    if (!link.length) return

    link.forEach(el => {
      const target = D.querySelector(el.dataset.target)
      if (target) {
        el.addEventListener('click',(e)=> {
          e = e || window.event
          e.preventDefault()
          // target.scrollIntoView({
          //   behavior: "smooth"
          // });
          window.scrollTo({
            top: target.offsetTop,
            behavior: "smooth"
        });
        })
      }
    })
  }
}

$.fn.Tabs = function() {
	var selector = this;

	this.each(function() {
		var obj = $(this);
		$(obj.attr('href')).hide();
		$(obj).click(function() {
			$(selector).removeClass('selected');

			$(selector).each(function(i, element) {
				$($(element).attr('href')).hide();
			});

			$(this).addClass('selected');
			$($(this).attr('href')).fadeIn();
			return false;
		});
	});

	$(this).show();
	$(this).first().click();
	if(location.hash!='' && $('a[href="' + location.hash + '"]').length)
		$('a[href="' + location.hash + '"]').click();
};


//mobile tabs
(function () {
  if (!D.querySelector('.card-tabs-link')) return

  D
    .querySelectorAll('.card-tabs-link')
    .forEach(el => {
      const tab = D.querySelector(el.getAttribute('href'))
      if (tab) {
        const link = D.createElement('a')
        link.href = 'javascript:void(0)'
        link.className = 'card-tabs-link-mobile'
        link.textContent = el.textContent
        link.dataset.href = el.getAttribute('href')
        tab.before(link)
      }
    });

  D
    .querySelectorAll('.card-tabs-link-mobile')
    .forEach(el => el.addEventListener('click', function(e) {
      e = e || window.event;
      e.preventDefault();

      const tab = D.querySelector(this.dataset.href)

      this.classList.toggle('opened')
      tab.classList.toggle('opened')
    }));
})();


//card rebuild
(function() {
  if(matchMedia) {
    const screen = window.matchMedia('(max-width:1024px)');
    screen.addListener(changes);
    changes(screen);
  }
  function changes(screen) {
    if(screen.matches) {
      //экран менее 1024
      $('.card-more-mobile').prepend($('#tabs'))
      $('.card-more-mobile').after($('.card-contacts'))
      $('.col-card-right').append($('.card-services'))
    } else {
      //экран более 1024
      $('.card-more-info').prepend($('#tabs'))
      $('.card-features').after($('.card-contacts'))
      $('.card-txt').append($('.card-services'))
    }
  }
})();


//card carousels
(function() {
  if (!D.querySelector('.swiper-card-imgs')) return

  if (D.querySelectorAll('.card-imgs-link').length <= 1) {
    $('.swiper-card-imgs .card-imgs-arrow').remove()
    return false
  }

  const imgsClone = $('.swiper-card-imgs').clone().addClass('swiper-mobile-imgs').removeClass('swiper-card-imgs');
  imgsClone.find('.card-imgs-prev').addClass('mobile-imgs-prev').removeClass('card-imgs-prev')
  imgsClone.find('.card-imgs-next').addClass('mobile-imgs-next').removeClass('card-imgs-next')
  imgsClone.find('.card-imgs-link').addClass('mobile-imgs-link').removeClass('card-imgs-link mfp-link').removeAttr('data-href')
  imgsClone.find('.mobile-imgs-link').eq(0).addClass('active');

  $('.card-imgs').append(imgsClone)
  $('.swiper-mobile-imgs').wrap('<div class="mobile-imgs"></div>')

  const cardMini = new Swiper('.swiper-mobile-imgs',{
    slidesPerView: 3,
    // shortSwipes: false,
    spaceBetween: 10,
    navigation: {
      nextEl: ".mobile-imgs-next",
      prevEl: ".mobile-imgs-prev",
    },
    breakpoints: {
      841: {
        slidesPerView: 4
      }
    }
  })

  const cardSwiper = new Swiper('.swiper-card-imgs',{
    slidesPerView: 1,
    // shortSwipes: false,
    autoHeight: true,
    navigation: {
      nextEl: ".card-imgs-next",
      prevEl: ".card-imgs-prev",
    },
    pagination: {
      el: '.card-imgs-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      769: {
        pagination: false
      }
    }
  })

  $(document).on('click','.mobile-imgs-link',function(e) {
    e.preventDefault();

    const index = $(this).closest('.swiper-slide').index()
    cardSwiper.slideTo(index)
    $('.mobile-imgs-link').removeClass('active')
    $(this).addClass('active');
  })

  cardSwiper.on('slideChange',function(swiper){
    const index = swiper.realIndex
    cardMini.slideTo(index)
    $('.mobile-imgs-link').removeClass('active');
    $('.swiper-mobile-imgs .swiper-slide').eq(index).find('.mobile-imgs-link').addClass('active');
  })
})();



const changeCatalogStyle = (style) => {
  localStorage.setItem('catalogStyle', style);
  document.querySelector('#catalog').dataset.style = style
  document.querySelectorAll('.catalog-style-toggler').forEach(el => {
    el.classList.remove('active')
    if (el.dataset.style && el.dataset.style === style) {
      el.classList.add('active')
    }
  })
}

(function(){
  if (!document.querySelector('.catalog-style-toggler')) return;

  document.querySelectorAll('.catalog-style-toggler')
    .forEach(el => {
      el.addEventListener('click', function(e) {
        e = e || window.event
        e.preventDefault();

        const style = this.dataset.style || 'grid'
        changeCatalogStyle(style)
      })
    });

  if (localStorage.getItem('catalogStyle')) {
    changeCatalogStyle(localStorage.getItem('catalogStyle'))
  }
})();



(function (){
  if (!$('#catalog_search').length) return;

  let catalogProductsSearch = $('#catalog_search');
  let catalogProductsReniev = $('.catalog-products-reniev')
  let cardReview = $('#card_review').offset().top;
  let catalogSerachOffset = catalogProductsSearch.offset().top

  window.addEventListener('scroll',function() {
    if(window.scrollY > catalogSerachOffset && window.scrollY < cardReview) {
      catalogProductsReniev.addClass('catalog-search-open')
    }else {
      catalogProductsReniev.removeClass('catalog-search-open')
    }
  })
})();


// counter
$(document).on("click", ".btn-plus", function () {
  let input = $(this).prev("input"),
      minus = input.prev('.btn-minus'),
      val = parseInt(input.val(), 10);

  if (isNaN(val)) { return input.val(1); }

  input.val(++val);
  if (val > 1) {
    minus.removeClass('disabled');
  }
});
$(document).on("click", ".btn-minus", function (e) {
  e.preventDefault();
  let thisInput = $(this).next("input"),
    val = parseInt(thisInput.val(), 10);

  if (isNaN(val)) {
    $(this).addClass('disabled');
    return thisInput.val(1);
  }

  if (val <= 2) {
    $(this).addClass('disabled');
    return thisInput.val(1);
  }

  thisInput.val(--val)
});


$(document).on("change", ".card-counter-input", function (e) {
  let val = parseInt($(this).val(), 10),
      minus = $(this).prev('.btn-minus');
  if (val < 0) {
    $(this).val(0);
  }
  if (val !== 1) {
    minus.removeClass('disabled');
  } else {
    minus.addClass('disabled');
  }
});





const productSliderMarkUpdear = $(".slider-dear")
  .clone()
  .removeClass("slider-adaptive-none");
$(".product-swiper-mob-dear").append(productSliderMarkUpdear);

$(".product-swiper-desc-dear").append(productSliderMarkUpdear);

new Swiper(".product-swiper-desc-dear .product-swiper ", {
  slidesPerView: 4,
  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  // spaceBetween: 24,
  breakpoints: {
    1024: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
  },
});




(function(){
  let arrows = document.querySelectorAll(".main-contacts-tel-arrow, .mob-menu-phone");
  let numbers = document.querySelector(".main-contacts-drop");
  if (!arrows.length || !numbers) return

  arrows.forEach(el => {
    el.addEventListener("click", function (e) {
      e = e || window.event
      e.preventDefault()
      this.classList.toggle("opened");
      numbers.classList.toggle("numbers-open");
    })
  });


	document.addEventListener('click', (e) => {
    const withinBoundaries = e.composedPath().includes(numbers);
    const isArrow = e.composedPath().includes(document.querySelector(".main-contacts-tel-arrow"));
    const isMob = e.composedPath().includes(document.querySelector(".mob-menu-phone"));

    if ( !withinBoundaries && !isArrow && !isMob) {
      numbers.classList.remove("numbers-open");
      document.querySelector(".main-contacts-tel-arrow").classList.remove('opened')
      document.querySelector(".mob-menu-phone").classList.remove('opened')
    }
  })
})();



// Footer change media
if (matchMedia) {
  var screen1170 = window.matchMedia("(max-width:1170px)");
  screen1170.addListener(changes);
  changes(screen1170);

  var screen768 = window.matchMedia("(max-width:768px)");
  screen768.addListener(changes768);
  changes768(screen768);

  var screen450 = window.matchMedia("(max-width:450px)");
  screen450.addListener(changes450);
  changes450(screen450);
}

function changes(screen1170) {
  if (screen1170.matches) {
    $(".footer-bottom-links").appendTo($(".footer-top-contact"));
    $(".footer-top-wrapper").appendTo($(".footer-top-info"));
    $(".footer-top-services").appendTo($(".footer-top-about"));
    $(".footer-top-resource").appendTo($(".footer-bootom-media-links"));
    $(".footer-bottom-info").appendTo($(".footer-bootom-media-links"));
    $(".footer-bottom-reit").appendTo($(".footer-bottom-socials-wrapper"));
  } else {
    $(".footer-bottom-links").appendTo($(".footer-bootom-media-links"));
    $(".footer-top-services").appendTo($(".footer-top-services-wrapper"));
    $(".footer-top-wrapper").appendTo($(".footer-top-about"));
    $(".footer-top-resource").appendTo($(".footer-top-resource-container"));
    $(".footer-bottom-info").appendTo($(".footer-bottom-info-wrapper"));
    $(".footer-bottom-reit").appendTo($(".footer-bottom-reit-wrapper"));
  }
}
function changes450(screen450) {
  if (screen450.matches) {
    $(".catalog_link").appendTo($(".catalog-articles"));
    $(".video_link").appendTo($(".catalog-video"));
    $(".feedback_link").appendTo($(".catalog-brands"));
  } else {
    $(".catalog_link").appendTo($(".catalog-articles-title"));
    $(".video_link").appendTo($(".video_wrap"));
    $(".feedback_link").appendTo($(".feedback-brands-header"));
  }
}
function changes768(screen768) {
  if (screen768.matches) {
    $(".footer-bottom-socials-wrapper").appendTo($(".footer-top-about"));
    $(".footer-bottom-info").appendTo($(".footer-top-media-wrapper"));
  } else {
    $(".footer-bottom-socials-wrapper").appendTo($(".footer-bottom-socials"));
  }
}

// Footer toggler
let menu = document.querySelectorAll(".footer-top-title");
menu.forEach((element) => {
  element.addEventListener("click", () => {
    element.classList.toggle("footer-open");
  });
});

// Imask for calculator-input
let calculatorMask = document.querySelectorAll(".calculator-mask");
calculatorMask.forEach((element) => {
  IMask(element, {
    mask: /^[1-9]\d{0,9}$/,
  });
});
// for input catalog-products
let inputMask = document.querySelectorAll(".input-mask");
inputMask.forEach((element) => {
  IMask(element, {
    mask: /^[0-9]\d{0,6}$/,
  });
});
//  for catalog telephone
var catalogPhone = document.getElementById("catalog_phone");
var maskOptions = {
  placeholder: "+{000}(00)000-00-00",
  mask: "+{000}(00)000-00-00",
};
if (catalogPhone) {
  var mask = IMask(catalogPhone, maskOptions);
}



// Input range

// checkbox hide on click

if (document.querySelector(".catalog-products-field-btn")) {
  let checkboxBtn = document.querySelectorAll(".catalog-products-field-btn"),
    catalogbtnText = document.querySelectorAll(".catalog-products-field-text"),
    catalogbtnImg = document.querySelector(".catalog-products-field-img img"),
    checkboxHiden = document.querySelectorAll(".checkbox-hide");

  checkboxBtn.forEach((element) => {
    element.addEventListener("click", openFunc);
    function openFunc() {
      let classListAdd = element.classList;
      element.classList.toggle("checkboxBtn_active");
      if (classListAdd.value.split(" ").indexOf("checkboxBtn_active") < 0) {
        element.children[1].innerHTML = "Показать ещё";
        element.children[0].style.backgroundImage =
          "url(././images/icons/green-cross.svg)";
      } else {
        element.children[1].innerHTML = "Скрыть";
        element.children[0].style.backgroundImage =
          "url(././images/icons/red-cross.svg)";
      }
      const parent = element.closest(".catalog-products-field-container");
      let checkboxes = parent.querySelectorAll(".checkbox-hide");
      checkboxes.forEach((el) => {
        el.classList.toggle("checkbox-on");
      });
    }
  });
}



// ion range input
$(".slider-wrapper").each(function () {
  var $range = $(".js-range-slider", this),
    $inputFrom = $(".js-input-from", this),
    $inputTo = $(".js-input-to", this),
    instance,
    min_1 = $inputFrom[0].dataset.min,
    max_1 = $inputTo[0].dataset.max,
    from_1 = $inputFrom[0].dataset.min,
    to_1 = $inputTo[0].dataset.max,
    steps = $range[0].dataset.steps;

  $range.ionRangeSlider({
    skin: "round",
    type: "double",
    min: min_1,
    max: max_1,
    from: from_1,
    to: to_1,
    step: steps,
    onStart: updateInputs,
    onChange: updateInputs,
  });

  instance = $range.data("ionRangeSlider");

  function updateInputs(data) {
    from = data.from;
    to = data.to;

    $inputFrom.prop("value", from);
    $inputTo.prop("value", to);
  }

  $inputFrom.on("input", function () {
    var val = $(this).prop("value");

    // validate
    if (val < min) {
      val = min;
    } else if (val > to) {
      val = to;
    }

    instance.update({
      from: val,
    });
  });

  $inputTo.on("input", function () {
    var val = $(this).prop("value");

    // validate
    if (val < from) {
      val = from;
    } else if (val > max) {
      val = max;
    }

    instance.update({
      to: val,
    });
  });
});

$(document).on("click", ".catalog-question-item-title", function (e) {

  $(this)
    .closest(".catalog-question-item")
    .toggleClass("catalog-question-toggle");
});


if (document.getElementById("card-breackpoint")) {
  // $(document).ready(function () {
    let cardBreackpoint = $("#card-breackpoint").offset().top;
    // let footerBreackpoint = $("#footer").offset().top;
    let cardSticky = $(".card-sticky");
    let headerCard = $(".header");
    // let footerHeight = $('#footer').innerHeight();

    window.addEventListener("resize", function () {
      cardBreackpoint = $("#card-breackpoint").offset().top;
    });
    window.addEventListener("scroll", function () {
      // console.log(footerBreackpoint)
      // console.log(window.scrollY)
      if (window.scrollY < cardBreackpoint) {
        headerCard.removeClass("headerCard_fixed");
        cardSticky.removeClass("card-breackpoint-open");
      } else {
        headerCard.addClass("headerCard_fixed");
        cardSticky.addClass("card-breackpoint-open");
      }
    });
  // });
}


(function (){
  if (!D.querySelector('.catalog-marks')) return;

  const wrapBtn =D.querySelector('.catalog-marks-toggler');
  const wrapSettings = D.querySelector('.catalog-marks-list')

  function resSetting() {
    const wrapSettingContainer = document.querySelector('.catalog-marks-height').clientHeight;

    if (wrapSettingContainer <= 80){
      wrapSettings.classList.add("opened");
      wrapBtn.classList.add('ui-hidden');
    }
    else {
      wrapSettings.classList.remove("opened");
      wrapBtn.classList.remove('ui-hidden');
    }
  }
  resSetting();
  window.addEventListener('resize', resSetting)
})();


(function (){
  if (!D.querySelector('.ux-collapsible-toggler')) return;

  D
    .querySelectorAll('.ux-collapsible-toggler')
    .forEach(el => {
      el.addEventListener('click',function(e) {
        e = e || window.event
        e.preventDefault()
        e.stopPropagation()

        const openTxt = this.dataset.open || 'Показать все'
        const closeTxt = this.dataset.close || 'Скрыть'
        const icon = this.querySelector('.ui-btn-icon')
        const txt = this.querySelector('.ui-btn-txt')
        const content = this.closest('.ux-collapsible').querySelector('.ux-collapsible-content')

        if (this.classList.contains('opened')) {
          txt.textContent = openTxt
          icon.classList.remove('ui-btn-icon-cancel')
          icon.classList.add('ui-btn-icon-plus')
          content.classList.remove('opened')
        } else {
          txt.textContent = closeTxt
          icon.classList.add('ui-btn-icon-cancel')
          icon.classList.remove('ui-btn-icon-plus')
          content.classList.add('opened')
        }

        this.classList.toggle('opened')
      })
    })
})();


(function (){
  if (!D.querySelector('.ui-spoiler')) return;

  D
    .querySelectorAll('.ui-spoiler-toggler')
    .forEach(el => {
      el.addEventListener('click',function(e) {
        e = e || window.event
        e.preventDefault()
        e.stopPropagation()

        const openTxt = this.dataset.open || 'Показать все'
        const closeTxt = this.dataset.close || 'Скрыть'
        const icon = this.querySelector('.ui-btn-icon')
        const txt = this.querySelector('.ui-btn-txt')
        const content = this.closest('.ui-spoiler').querySelector('.ui-spoiler-body')

        if (this.classList.contains('opened')) {
          txt.textContent = openTxt
          icon.classList.remove('ui-btn-icon-cancel')
          icon.classList.add('ui-btn-icon-plus')
          content.classList.remove('opened')
        } else {
          txt.textContent = closeTxt
          icon.classList.add('ui-btn-icon-cancel')
          icon.classList.remove('ui-btn-icon-plus')
          content.classList.add('opened')
        }

        this.classList.toggle('opened')
      })
    })
})();




(function () {
  if (!document.querySelector('.catalog-reviews-desktop')) return
  let slider = null, native = null;

  //desktop
  if(matchMedia) {
    var bp = window.matchMedia('(min-width:1024.02px)');
    bp.addListener(changes);
    changes(bp);
  }
  function changes(bp) {
    if(bp.matches && !slider) {
      slider = new Swiper(".catalog-reviews", {
        slidesPerView: 2,
        spaceBetween: 24,
        // shortSwipes: false,
        navigation: {
          nextEl: ".catalog-reviews-next",
          prevEl: ".catalog-reviews-prev",
        }
      });
    }
    if (!bp.matches && !native) {
      //mobile
      const clone = $('.catalog-reviews-desktop .review-card').clone();
      $('.catalog-reviews-mobile .ui-scroller').prepend(clone)
      native = true
    }
  }
})();

(function () {
  if (!document.querySelector('.catalog-articles-desktop')) return;
  let sliderArticle = 'no';

  //mobile
  const clone = $('.catalog-articles-desktop .catalog-articles-item').clone();
  $('.catalog-articles-mobile .ui-scroller').prepend(clone)

  //desktop
  if(matchMedia) {
    var bp = window.matchMedia('(min-width:1024.02px)');
    bp.addListener(changes);
    changes(bp);
  }
  function changes(bp) {
    if(bp.matches && sliderArticle === 'no') {
      sliderArticle = new Swiper(".slider_article", {
        slidesPerView: 1,
        spaceBetween: 24,
        autoHeight: true,
        // shortSwipes: false,
        navigation: {
          nextEl: ".article-button-next",
          prevEl: ".article-button-prev",
        }
      });
    }
  }
})();




(function(){
  if (!document.querySelector('.catalog-related-desktop')) return
  let slider = null, native = null;

  //desktop
  if(matchMedia) {
    var bp = window.matchMedia('(min-width:1024.02px)');
    bp.addListener(changes);
    changes(bp);
  }
  function changes(bp) {
    if(bp.matches && !slider) {
      slider = new Swiper(".catalog-related-swiper", {
        slidesPerView: 2,
        spaceBetween: 24,
        // shortSwipes: false,
        navigation: {
          nextEl: ".catalog-related-next",
          prevEl: ".catalog-related-prev",
        },
        breakpoints: {
          1140: {
            slidesPerView: 3,
          },
        }
      });
    }
    if (!bp.matches && !native) {
      //mobile
      const clone = $('.catalog-related-desktop .slider-product').clone();
      $('.catalog-related-mobile .ui-scroller').prepend(clone)
      native = true
    }
  }
})();


(function(){
  if (!document.querySelector('.card-related-desktop')) return
  let slider = null, native = null;

  //desktop
  if(matchMedia) {
    var bp = window.matchMedia('(min-width:1024.02px)');
    bp.addListener(changes);
    changes(bp);
  }
  function changes(bp) {
    if(bp.matches && !slider) {
      slider = new Swiper(".swiper-card-related", {
        slidesPerView: 3,
        spaceBetween: 24,
        // shortSwipes: false,
        navigation: {
          nextEl: ".card-related-next",
          prevEl: ".card-related-prev",
        },
        breakpoints: {
          1140: {
            slidesPerView: 4,
          },
        }
      });
    }

    if (!bp.matches && !native) {
      const clone = $('.card-related-desktop .slider-product').clone();
      $('.card-related-mobile .ui-scroller').prepend(clone)
      native = true
    }
  }
})();


(function(){
  if (!document.querySelector('.card-reviews-desktop')) return
  let slider = null, native = null;

  //desktop
  if(matchMedia) {
    var bp = window.matchMedia('(min-width:1024.02px)');
    bp.addListener(changes);
    changes(bp);
  }
  function changes(bp) {
    if(bp.matches && !slider) {
      slider = new Swiper(".swiper-card-reviews", {
        slidesPerView: 2,
        spaceBetween: 24,
        // shortSwipes: false,
        navigation: {
          nextEl: ".card-reviews-next",
          prevEl: ".card-reviews-prev",
        },
        breakpoints: {
          1140: {
            slidesPerView: 3,
          },
        }
      });
    }

    if (!bp.matches && !native) {
      const clone = $('.card-reviews-desktop .review-card').clone();
      $('.card-reviews-mobile .ui-scroller').prepend(clone)
      native = true
    }
  }
})();


(function(){
  if (!document.querySelector('.card-interest-desktop')) return
  let slider = null, native = null;

  //desktop
  if(matchMedia) {
    var bp = window.matchMedia('(min-width:1024.02px)');
    bp.addListener(changes);
    changes(bp);
  }
  function changes(bp) {
    if(bp.matches && !slider) {
      slider = new Swiper(".swiper-card-interest", {
        slidesPerView: 3,
        spaceBetween: 24,
        // shortSwipes: false,
        navigation: {
          nextEl: ".card-interest-next",
          prevEl: ".card-interest-prev",
        },
        breakpoints: {
          1140: {
            slidesPerView: 4,
          },
        }
      });
    }
    if (!bp.matches && !native) {
      //mobile
      const clone = $('.card-interest-desktop .slider-product').clone();
      $('.card-interest-mobile .ui-scroller').prepend(clone)
      native = true
    }
  }
})();


(function(){
  if (!document.querySelector('.slider-product-topline')) return

  document.querySelectorAll('.slider-product-topline')
    .forEach(el => {
      el.addEventListener('click', function (event) {
        event = event || window.event
        event.preventDefault()
        event.stopPropagation()

        const url = this.dataset.href || null

        if (document.documentElement.clientWidth > 1024) {
          return event.target.closest('.slider-product').classList.toggle('opened');
        }

        if (!url) return
        $.magnificPopup.open({
          items: { src: url },
          type: "ajax",
          overflowY: "scroll",
          removalDelay: 610,
          mainClass: "my-mfp-zoom-in",
          ajax: {
            tError: "Error. Not valid url",
          }
        });
      })
    })
})();

(function(){
  if (!document.querySelector('.product-card-topline')) return

  document.querySelectorAll('.product-card-topline')
    .forEach(el => {
      el.addEventListener('click', function (event) {
        event = event || window.event
        event.preventDefault()
        event.stopPropagation()

        const url = this.dataset.href || null

        if (document.documentElement.clientWidth > 1024) {
          return event.target.closest('.product-card').classList.toggle('opened');
        }

        if (!url) return
        $.magnificPopup.open({
          items: { src: url },
          type: "ajax",
          overflowY: "scroll",
          removalDelay: 610,
          mainClass: "my-mfp-zoom-in",
          ajax: {
            tError: "Error. Not valid url",
          }
        });
      })
    })
})();


(function(){
  if (!document.querySelector('.catalog-filters-toggler')) return

  document
    .querySelectorAll('.catalog-filters-toggler')
    .forEach(el => el.addEventListener('click', function (e) {
      e = e || window.event
      e.preventDefault()

      const txt = this.querySelector('.catalog-filters-toggler-txt')
      const icon = this.querySelector('.ui-btn-icon')

      if (this.classList.contains('opened')) {
        txt.textContent = 'Показать все'
        icon.classList.add('ui-btn-icon-plus')
        icon.classList.remove('ui-btn-icon-cancel')
      } else {
        txt.textContent = 'Скрыть'
        icon.classList.remove('ui-btn-icon-plus')
        icon.classList.add('ui-btn-icon-cancel')
      }

      this.classList.toggle('opened')

      const group = this.closest('.catalog-filters-group')
      if (!group) return

      group
        .querySelectorAll('.catalog-filters-hidden')
        .forEach(item => item.classList.toggle('opened'))
    }))
})();



//fixing submit btn in filters
(function(){
  if (!document.querySelector('.catalog-filters-submit')) return

  const filters = document.querySelector('.catalog-filters')
  const submit = filters.querySelector('.catalog-filters-submit')

  document.addEventListener('scroll',() => {
    if (document.documentElement.clientWidth < 1024) return;

    const sc = window.pageYOffset;
    const offset = filters.offsetTop
    const rect = filters.getBoundingClientRect()
    const vh = document.documentElement.clientHeight

    //81 = btn height + position offset from bottom
    if (sc + vh - 81 > offset && sc + vh < offset + rect.height) {
      submit.classList.add('fixed')
      submit.classList.remove('fixed-bottom')
      submit.style.width = rect.width + 'px'
    } else if (sc + vh > offset + rect.height) {
      submit.classList.add('fixed-bottom')
      submit.classList.remove('fixed')
      submit.style.width = rect.width + 'px'
    } else {
      submit.classList.remove('fixed')
      submit.classList.remove('fixed-bottom')
      submit.style.width = ''
    }
  })
})();


(function() {
  if (!document.querySelector('.catalog-filters-close')) return

  document
    .querySelector('.catalog-filters-close')
    .addEventListener('click',() => {
      document.documentElement.classList.remove('no-overflow');
      document.querySelector('.catalog-filters').classList.remove('opened');
    })
})();


(function() {
  if (!document.querySelector('.catalog-filters-bg')) return

  document
    .querySelector('.catalog-filters-bg')
    .addEventListener('click',() => {
      document.documentElement.classList.remove('no-overflow');
      document.querySelector('.catalog-filters').classList.remove('opened');
    })
})();


(function() {
  if (!document.querySelector('.catalog-settings-filters')) return

  document
    .querySelector('.catalog-settings-filters')
    .addEventListener('click',() => {
      document.documentElement.classList.add('no-overflow');
      document.querySelector('.catalog-filters').classList.add('opened');
    })
})();



const ratings = document.querySelectorAll(".card-rating");
const acc = document.getElementsByClassName("accordion-items-title");

let ratingActive;
let ratingValue;


// rating stars
if (ratings.length > 0) {
  initRatings();
}

function initRatings() {
  for (let i = 0; i < ratings.length; i++) {
    const rating = ratings[i];

    if (rating.classList.contains("rating-set")) {
      setRating(rating);
    }

    initRatingVars(rating);
    setRatingActiveWidth();
  }
}

function initRatingVars(rating) {
  ratingActive = rating.querySelector(".card-rating-active");
  ratingValue = rating.querySelector(".card-rating-value");
}

function setRatingActiveWidth(index = ratingValue.innerHTML) {
  const ratingActiveWidth = index / 0.05;

  if (index === "Нет оценки") {
    ratingActive.style.width = "0%";
  } else {
    ratingActive.style.width = `${ratingActiveWidth}%`;
  }
}

function setRating(rating) {
  const ratingItems = rating.querySelectorAll(".card-rating-item");

  for (let i = 0; i < ratingItems.length; i++) {
    const ratingItem = ratingItems[i];

    ratingItem.addEventListener("mouseenter", function (e) {
      initRatingVars(rating);
      setRatingActiveWidth(ratingItem.value);
    });

    ratingItem.addEventListener("mouseleave", function (e) {
      setRatingActiveWidth();
    });

    ratingItem.addEventListener("click", function (e) {
      initRatingVars(rating);

      ratingValue.innerHTML = ratingItem.value;
      setRatingActiveWidth();
    });
  }
}




$(function () {
  let header = $(".header"),
    headerMenu = $(".header .menu"),
    headerNav = $(".header .nav-wrapper"),
    wrapperFixed = $(".wrapper"),
    footerBreackpoint = $("#footer"),
    footerHeight = $('#footer').innerHeight();
  const headerOffset = $('header .main').offset().top


  $(window).scroll(function () {
    let cardBreackpointOpen = $('.card-breackpoint-open');
    let headerCardFixedHeight = $('.header_fixed .main').innerHeight();
    const headerHeight = $('header .main').outerHeight(true);

    let offsetFooter = footerBreackpoint.offset().top


    if (matchMedia) {
      var screen678 = window.matchMedia("(max-width:678px)");
      screen678.addListener(changes);
      changes(screen678);
    }
    function changes(screen678) {
      if (screen678.matches) {
        // cardBreackpointOpen.css({
        //   'top': 'initial',
        //   'bottom': 0
        // })

        if (offsetFooter < document.documentElement.clientHeight + window.scrollY) {
          D.querySelector('#middle').classList.remove("panel-is-float")
          cardBreackpointOpen.css({
            'position': 'relative',
          })
        } else {
          D.querySelector('#middle').classList.add("panel-is-float")
          cardBreackpointOpen.css({
            'top': 'initial',
            'position': 'fixed',
            'bottom': 0,
          })
        }
      } else {
        cardBreackpointOpen.css('top', headerCardFixedHeight + 'px')
        cardBreackpointOpen.css('bottom', 'initial')
      }
    }

    if ($(this).scrollTop() > headerOffset) {
      wrapperFixed.css('paddingTop', headerHeight + 'px')
      header.addClass("header_fixed");
      wrapperFixed.addClass("wrapper_fixed");
    } else {
      wrapperFixed.css('paddingTop', 0)
      header.removeClass("header_fixed");
      wrapperFixed.removeClass("wrapper_fixed");
    }
  });
});


//фиксируем блок с картинками при скроле на планшетах
function fixCardImgsTablet(card,imgs,section) {
  let dw = document.documentElement.clientWidth
  if (dw > 1024 || dw < 768) return;

  const sc = window.pageYOffset;
  const offset = card.offsetTop
  const rect = card.getBoundingClientRect()
  const vh = document.documentElement.clientHeight
  const to = 165 //offset from top of screen
  const ih = imgs.clientHeight
  const w = section.clientWidth


  if (sc > offset - to && sc + vh - (vh - ih - to) < offset + rect.height) {
    imgs.classList.add('fixed')
    imgs.classList.remove('fixed-bottom')
    imgs.style.width = w + 'px'
  } else if (sc + vh -  (vh - ih - to) > offset + rect.height) {
    imgs.classList.add('fixed-bottom')
    imgs.classList.remove('fixed')
    imgs.style.width = w + 'px'
  } else {
    imgs.classList.remove('fixed')
    imgs.classList.remove('fixed-bottom')
    imgs.style.width = ''
  }
}

(function() {
  const card = document.querySelector('.card')
  const imgs = document.querySelector('.card-imgs')
  const section = document.querySelector('.card-section')

  document.addEventListener('scroll',fixCardImgsTablet.bind(null,card,imgs,section))
  window.addEventListener('resize',fixCardImgsTablet.bind(null,card,imgs,section))
})();


jQuery(document).ready(function($){
  $('.card-tabs-link').Tabs();

  $(document).on('click','.tabs-target',function(e){
    e.preventDefault();
    const id = $(this).attr('href');

    if ($(id).length) {
      $('.card-tabs-link[href="'+id+'"]').click();
      const offset = $('.card-tabs-body').offset().top
      $('html,body').animate({scrollTop: offset-160},300)
    }
  })

  $("select").styler();

  $(document).on("click", ".mfp-link", function () {
    var a = $(this);
    $.magnificPopup.open({
      items: { src: a.attr("data-href") },
      type: "ajax",
      overflowY: "scroll",
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in',
      ajax: {
        tError: "Error. Not valid url",
      },
      callbacks: {
        open: function () {
          setTimeout(function(){
            $('.mfp-wrap').addClass('not_delay');
            $('.mfp-popup').addClass('not_delay');
          },700);
        }
      },
    });
    return false;
  });

  $('.video-card-link, .mfp-frame').on('click',function(e){
    e.preventDefault();

    const url = $(this).attr('data-href') || null
    if (!url) return

    $.magnificPopup.open({
      items: { src: url },
      type: 'iframe',
      disableOn: 700,
      mainClass: 'mfp-fade',
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false
    });
  })


  // Validation for catalog email input
  $(".catalog-search-form").validate({
    errorElement: "span",
    rules: {
      email: {
        email: true,
      },
    },
    messages: {
      email: {
        email: "Пожалуйста, введите корректный Email",
      },
    },
  });


  $('.card-tabs-link').Tabs();

  $(document).on('click','.mfp-custom-close',function(e){
    e.preventDefault()
    $.magnificPopup.close()
  })

  // $(function() {
  //   let tabOrder = $('#making-order-pickup .making-order-content > div');
  //   let tabPayment = $('#making-order-payment .making-order-content > div');

  //   tabOrder.hide().filter(':first').show();

  //   // Клики по вкладкам.
  //   $('#making-order-pickup .making-order-tabs a').click(function(){
  //     tabOrder.hide();
  //     tabOrder.filter(this.hash).show();
  //     $('#making-order-pickup .making-order-tabs a').removeClass('active');
  //     $(this).addClass('active');
  //     return false;
  //   }).filter(':first').click();

  //   // Клики по вкладкам.
  //   $('#making-order-payment .making-order-tabs a').click(function(){
  //     tabPayment.hide();
  //     tabPayment.filter(this.hash).show();
  //     $('#making-order-payment .making-order-tabs a').removeClass('active');
  //     $(this).addClass('active');
  //     return false;
  //   }).filter(':first').click();
  // });

  // function myMap() {
  // var mapProp= {
  //     center:new google.maps.LatLng(51.508742,-0.120850),
  //     zoom:5,
  // };
  // var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
  // }

  // let test = document.querySelector('.making-order-header');
  // let list = document.querySelector('.making-order-list');

  // test.addEventListener('click', () => {
  //   list.classList.toggle('active')
  // })
});//ready