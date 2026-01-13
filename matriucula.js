document.addEventListener("DOMContentLoaded", function () {

  // ==================== MENU HAMBÚRGUER ====================
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

  // ==================== AOS ====================
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true
    });
  }

  // ==================== FUNÇÕES AUXILIARES ====================
  function formatarDataHora(valor) {
    const data = new Date(valor);
    return `${data.toLocaleDateString("pt-BR")} às ${data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
  }

  function formatarData(valor) {
    return new Date(valor).toLocaleDateString("pt-BR");
  }

  // ==================== EMAILJS ====================
  if (typeof emailjs !== "undefined") {
    emailjs.init("P6ayYWMRJy0MVD3v2");
  }

  // ==================== FORMULÁRIO DE PRÉ-MATRÍCULA ====================
  const form = document.getElementById("matriculaForm");
  const horarioSelect = document.getElementById("horario");

  function gerarHorarios() {
    const horarios = [];
    for (let h = 7; h < 11; h++) {
      horarios.push(`${String(h).padStart(2, "0")}:00`);
      horarios.push(`${String(h).padStart(2, "0")}:30`);
    }
    return horarios;
  }

  if (horarioSelect) {
    const horariosOcupados = JSON.parse(localStorage.getItem("horariosOcupados")) || [];

    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    const limite = new Date();
    limite.setDate(hoje.getDate() + 30);

    horarioSelect.innerHTML = "";

    for (let dia = new Date(amanha); dia <= limite; dia.setDate(dia.getDate() + 1)) {
      if (dia.getDay() === 0) continue;

      const dataISO = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, "0")}-${String(dia.getDate()).padStart(2, "0")}`;

      gerarHorarios().forEach(hora => {
        const horarioCompleto = `${dataISO}T${hora}`;

        if (!horariosOcupados.includes(horarioCompleto)) {
          const opt = document.createElement("option");
          opt.value = horarioCompleto;
          opt.textContent = `${dia.toLocaleDateString("pt-BR")} às ${hora}`;
          horarioSelect.appendChild(opt);
        }
      });
    }
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!this.horario.value) {
        alert("⚠️ Escolha um horário para o atendimento.");
        return;
      }

      const dados = {
        tipo: "Pré-matrícula",
        nome: this.nome.value,
        email: this.email.value,
        cpf: this.cpf.value,
        nascimento: formatarData(this.nascimento.value),
        telefone: this.telefone.value,
        objetivo: this.objetivo.value,
        horario: formatarDataHora(this.horario.value),
        assunto: "Pré-Matrícula - Rio Sport Fitness",
        termos: this.termos.checked ? "Aceitou os termos" : "Não aceitou",
        texto: "Recebemos sua pré-matrícula e entraremos em contato em breve!"
      };

      const ocupados = JSON.parse(localStorage.getItem("horariosOcupados")) || [];
      ocupados.push(this.horario.value);
      localStorage.setItem("horariosOcupados", JSON.stringify(ocupados));

      if (typeof emailjs !== "undefined") {
        emailjs.send("service_hl3g14c", "template_zegyadw", dados);
        emailjs.send("service_hl3g14c", "template_itda5kx", dados)
          .then(() => {
            alert(`✅ Pré-matrícula enviada! Confirmação enviada para ${dados.email}`);
            form.reset();
          })
          .catch(() => alert("❌ Erro ao enviar. Tente novamente."));
      }
    });
  }

  // ==================== SLIDER TREINOS ====================
  if (typeof Swiper !== "undefined" && document.querySelector(".treinos-deck-slider")) {
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

  // ==================== FLATPICKR ====================
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

  // ==================== MODAL TERMOS ====================
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

});

// SWIPER DE COMENTÁRIOS


const swiper = new Swiper('.transformacoes-swiper', {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 30,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

//LOGICA DOS MODAIS DE TREINOS

const modalButtons = document.querySelectorAll('[data-modal-target]');
const modals = document.querySelectorAll('.modal-overlay');

modalButtons.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
    const modalId = button.dataset.modalTarget;
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

modals.forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    modals.forEach(modal => modal.classList.remove('active'));
    document.body.style.overflow = '';
  }
});


// =========== MENU FIXO ==========
const header = document.querySelector(".header-container");

let lastScrollY = window.scrollY;
let scrollTimeout;
let isInteracting = false;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  /* Topo da página → fixo e visível */
  if (currentScroll <= 10) {
    header.classList.add("is-fixed", "is-visible");
    header.classList.remove("is-hidden");
    lastScrollY = currentScroll;
    return;
  }

  /* A partir daqui vira fixo */
  header.classList.add("is-fixed");

  /* Rolando para baixo */
  if (currentScroll > lastScrollY && !isInteracting) {
    header.classList.remove("is-visible");
    header.classList.add("is-hidden");
  }

  /* Rolando para cima */
  if (currentScroll < lastScrollY - 10 && !isInteracting) {
    header.classList.add("is-visible");
    header.classList.remove("is-hidden");
  }

  lastScrollY = currentScroll;

  /* Parou de rolar */
  scrollTimeout = setTimeout(() => {
    if (!isInteracting && window.scrollY > 10) {
      header.classList.remove("is-visible");
      header.classList.add("is-hidden");
    }
  }, 3000);

  /* ===== INTERAÇÃO ===== */

  header.addEventListener("mouseenter", () => {
    isInteracting = true;
  });

  header.addEventListener("mouseleave", () => {
    isInteracting = false;
  });

  header.addEventListener("touchstart", () => {
    isInteracting = true;
  });

  header.addEventListener("touchend", () => {
    isInteracting = false;
  });
});

window.addEventListener("DOMContentLoaded", () => {
  header.classList.add("is-fixed", "is-visible");
  header.classList.remove("is-hidden");
});