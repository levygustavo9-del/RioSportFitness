/**
 * =========================================================
 * SCRIPT PRINCIPAL DO SITE
 * =========================================================
 * Responsável apenas por:
 * - Menu hambúrguer (mobile)
 * - AOS (animações)
 * - Swiper (sliders)
 * - Flatpickr
 * - Modais
 * - Header fixo com efeito no scroll
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", function () {

  /* =======================================================
     MENU HAMBÚRGUER (MOBILE)
     ======================================================= */

  const hamburger = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");
  const menuMobile = document.getElementById("menu-mobile-panel");
  const menuItems = document.querySelectorAll("#menu-mobile-panel a");

  function openMenu() {
    if (!menuMobile) return;
    menuMobile.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    if (!menuMobile) return;
    menuMobile.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (hamburger) hamburger.addEventListener("click", openMenu);
  if (closeIcon) closeIcon.addEventListener("click", closeMenu);
  menuItems.forEach(item => item.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (menuMobile && window.innerWidth > 1023 && menuMobile.classList.contains("is-open")) {
      closeMenu();
    }
  });

  /* =======================================================
     AOS – ANIMAÇÕES
     ======================================================= */

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true
    });
  }

  /* =======================================================
     SLIDER TREINOS
     ======================================================= */

  if (typeof Swiper !== "undefined" && document.querySelector(".treinos-deck-slider")) {
    new Swiper(".treinos-deck-slider", {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      }
    });
  }

  /* =======================================================
     SLIDER TRANSFORMAÇÕES
     ======================================================= */

  if (typeof Swiper !== "undefined" && document.querySelector(".transformacoes-swiper")) {
    new Swiper(".transformacoes-swiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    });
  }

  /* =======================================================
     FLATPICKR – DATA DE NASCIMENTO
     ======================================================= */

  if (typeof flatpickr !== "undefined" && document.querySelector("#nascimento")) {
    flatpickr("#nascimento", {
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d/m/Y",
      maxDate: "today",
      minDate: "1930-01-01",
      locale: "pt",
      disableMobile: true,
      allowInput: true,
      monthSelectorType: "dropdown",
      yearRange: [1930, new Date().getFullYear()]
    });
  }

  /* =======================================================
     MODAL TERMOS
     ======================================================= */

  const modal = document.getElementById("modal-termos");
  const abrir = document.getElementById("abrir-termos");
  const fechar = document.getElementById("fechar-termos");

  if (abrir && modal) {
    abrir.addEventListener("click", e => {
      e.preventDefault();
      modal.style.display = "flex";
    });
  }

  if (fechar && modal) {
    fechar.addEventListener("click", () => modal.style.display = "none");
  }

  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  /* =======================================================
     MODAIS DE TREINOS
     ======================================================= */

  const modalButtons = document.querySelectorAll("[data-modal-target]");
  const modals = document.querySelectorAll(".modal-overlay");

  modalButtons.forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();
      const modalId = button.dataset.modalTarget;
      document.getElementById(modalId).classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  modals.forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target.classList.contains("modal-overlay") || e.target.classList.contains("modal-close")) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      modals.forEach(modal => modal.classList.remove("active"));
      document.body.style.overflow = "";
    }
  });

});

/* =======================================================
   HEADER FIXO COM SCROLL
   ======================================================= */

const header = document.querySelector(".header-container");
let lastScrollY = window.scrollY;
let scrollTimeout = null;
let isInteracting = false;

if (header) {

  header.addEventListener("mouseenter", () => isInteracting = true);
  header.addEventListener("mouseleave", () => isInteracting = false);
  header.addEventListener("touchstart", () => isInteracting = true);
  header.addEventListener("touchend", () => isInteracting = false);

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (scrollTimeout) clearTimeout(scrollTimeout);

    if (currentScroll <= 10) {
      header.classList.add("is-fixed", "is-visible");
      header.classList.remove("is-hidden");
      lastScrollY = currentScroll;
      return;
    }

    header.classList.add("is-fixed");

    if (currentScroll > lastScrollY && !isInteracting) {
      header.classList.remove("is-visible");
      header.classList.add("is-hidden");
    }

    if (currentScroll < lastScrollY - 10 && !isInteracting) {
      header.classList.add("is-visible");
      header.classList.remove("is-hidden");
    }

    lastScrollY = currentScroll;

    scrollTimeout = setTimeout(() => {
      if (!isInteracting && window.scrollY > 10) {
        header.classList.remove("is-visible");
        header.classList.add("is-hidden");
      }
    }, 3000);
  });

  header.classList.add("is-fixed", "is-visible");
  header.classList.remove("is-hidden");
}
