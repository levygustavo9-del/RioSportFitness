// MENU HAMBÚRGUER
const hamburger = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');
const menuMobile = document.getElementById('menu-mobile-panel');
const menuItems = document.querySelectorAll('#menu-mobile-panel a');

function openMenu() {
  menuMobile.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menuMobile.classList.remove('is-open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMenu);
closeIcon.addEventListener('click', closeMenu);
menuItems.forEach(item => item.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 1023 && menuMobile.classList.contains('is-open')) {
    closeMenu();
  }
});

AOS.init({
  duration: 1000,
  once: true
});

// FORMULÁRIO DE PRÉ-MATRÍCULA
(function() {
  emailjs.init("P6ayYWMRJy0MVD3v2"); // sua Public Key
})();

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("matriculaForm");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = {
      nome: this.nome.value,
      cpf: this.cpf.value,
      nascimento: this.nascimento.value,
      telefone: this.telefone.value,
      objetivo: this.objetivo.value,
      horario: this.horario.value
    };

    emailjs.send("service_hl3g14c", "template_zegyadw", formData)
      .then(() => {
        alert("✅ Pré-matrícula enviada com sucesso! Em breve entraremos em contato.");
        form.reset();
      })
      .catch((erro) => {
        console.error("❌ Erro ao enviar:", erro);
        alert("❌ Ocorreu um erro ao enviar a pré-matrícula. Verifique sua conexão e tente novamente.");
      });
  });
});