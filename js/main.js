/**
 * =========================================================
 * SCRIPT PRINCIPAL DO SITE (MAIN.JS)
 * =========================================================
 * Controla:
 * - Menu hambúrguer (mobile)
 * - AOS (animações)
 * - Swipers
 * - Flatpickr
 * - Modais
 * - Header fixo com scroll
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
    if (menuMobile && window.innerWidth > 1023) {
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
     FLATPICKR (DATA DE NASCIMENTO)
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

});

/* =======================================================
   SWIPERS
   ======================================================= */

if (typeof Swiper !== "undefined") {

  if (document.querySelector(".treinos-deck-slider")) {
    new Swiper(".treinos-deck-slider", {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      grabCursor: true
    });
  }

  if (document.querySelector(".transformacoes-swiper")) {
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
}

/* =======================================================
   MODAIS
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
    if (
      e.target.classList.contains("modal-overlay") ||
      e.target.classList.contains("modal-close")
    ) {
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

/* =======================================================
   MODAL TERMOS E CONDIÇÕES
   ======================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const abrirTermos = document.getElementById("abrir-termos");
  const modalTermos = document.getElementById("modal-termos");
  const fecharTermos = document.getElementById("fechar-termos");

  if (!modalTermos || !abrirTermos) return;

  abrirTermos.addEventListener("click", (e) => {
    e.preventDefault();
    modalTermos.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  fecharTermos.addEventListener("click", () => {
    modalTermos.classList.remove("active");
    document.body.style.overflow = "";
  });

  modalTermos.addEventListener("click", (e) => {
    if (e.target === modalTermos) {
      modalTermos.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modalTermos.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

});



/* =======================================================
   HEADER FIXO COM SCROLL
   ======================================================= */

const header = document.querySelector(".header-container");

let lastScrollY = window.scrollY;
let scrollTimeout;
let isInteracting = false;

window.addEventListener("scroll", () => {
  if (!header) return;

  const currentScroll = window.scrollY;

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

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    if (!isInteracting && window.scrollY > 10) {
      header.classList.remove("is-visible");
      header.classList.add("is-hidden");
    }
  }, 3000);
});

/* INTERAÇÃO COM HEADER */

if (header) {
  header.addEventListener("mouseenter", () => isInteracting = true);
  header.addEventListener("mouseleave", () => isInteracting = false);
  header.addEventListener("touchstart", () => isInteracting = true);
  header.addEventListener("touchend", () => isInteracting = false);
}

window.addEventListener("DOMContentLoaded", () => {
  if (header) {
    header.classList.add("is-fixed", "is-visible");
    header.classList.remove("is-hidden");
  }
});
