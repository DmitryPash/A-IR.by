

catalogLine.onclick = () => {
  catalog.classList.add("catalog-products-line");
  catalog.classList.remove("catalog-products-grid");
  catalogGrid.style.opacity = "0.3";
  catalogLine.style.opacity = "1";
};
catalogGrid.onclick = () => {
  catalog.classList.add("catalog-products-grid");
  catalog.classList.remove("catalog-products-line");
  catalogGrid.style.opacity = "1";
  catalogLine.style.opacity = "0.3";
};


catalogGrid.click();

if (matchMedia) {
  let screen1023 = window.matchMedia("(max-width:1024px)");
  screen1023.addListener(accordionChangesPop);
  accordionChangesPop(screen1023);
}

function accordionChangesPop(screen1023) {
  if (screen1023.matches) {
    $(".catalog-products-filter-popular").appendTo($(".filter-adaptive"));
  } else {
    $(".catalog-products-filter-popular").appendTo($(".filter-adaptive-first"));
  }
}

const productSliderMarkUpcatalog = $(".slider-catalog")
  .clone()
  .removeClass("slider-adaptive-none");
$(".product-swiper-mob-catalog").append(productSliderMarkUpcatalog);

$(".product-swiper-desc-catalog").append(productSliderMarkUpcatalog);

new Swiper(".product-swiper-desc-catalog .product-swiper ", {
  slidesPerView: 4,
  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  spaceBetween: 24,
  breakpoints: {
    1024: {
      slidesPerView: 3,
      spaceBetween: 8,
    },
  },
});



$(document).ready(function(){
  let catalogProductsSearch = $('#catalog_search');
  let catalogProductsReniev = $('.catalog-products-reniev')
  let cardReview = $('#card_review').offset().top;
  let catalogSerachOffset = catalogProductsSearch.offset().top
  let documentHeight = document.documentElement.clientHeight
  
  window.addEventListener('scroll',function() {
    if(window.scrollY + documentHeight > catalogSerachOffset && window.scrollY + documentHeight < cardReview) {
      catalogProductsReniev.addClass('catalog-search-open')
    }else {
      catalogProductsReniev.removeClass('catalog-search-open')
    }
  })
})