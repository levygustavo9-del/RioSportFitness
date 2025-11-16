// ==================== MENU HAMBÚRGUER ====================
const hamburger = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');
const menuMobile = document.getElementById('menu-mobile-panel');

hamburger.addEventListener('click', () => {
  menuMobile.classList.add('is-open');
  document.body.style.overflow = 'hidden';
});

closeIcon.addEventListener('click', () => {
  menuMobile.classList.remove('is-open');
  document.body.style.overflow = '';
});

// ==================== AOS ====================
AOS.init({
  duration: 1000,
  once: true
});

// ==================== FORMULÁRIO DE AULA EXPERIMENTAL ====================
document.addEventListener("DOMContentLoaded", function() {
  emailjs.init("P6ayYWMRJy0MVD3v2"); // sua public key

  const form = document.getElementById("matriculaForm");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const dados = {
      tipo: "Aula Experimental",
      nome: this.nome.value,
      email: this.email.value,
      cpf: this.cpf.value,
      nascimento: this.nascimento.value,
      telefone: this.telefone.value,
      objetivo: this.objetivo.value,
      termos: this.termos.checked ? "Aceitou os termos" : "Não aceitou",
      assunto: "Aula Experimental - Rio Sport Fitness",
      texto: "Recebemos sua solicitação de aula experimental! Entraremos em contato!"
    };

    // 1) email para academia
    emailjs.send("service_hl3g14c", "template_zegyadw", dados);

    // 2) email para aluno
    emailjs.send("service_hl3g14c", "template_itda5kx", dados)
      .then(() => {
        alert(`✅ Solicitação enviada! Enviamos confirmação para ${dados.email}.`);
        form.reset();
      })
      .catch(() => {
        alert("❌ Ocorreu um erro ao enviar. Tente novamente.");
      });
  });
});


//==================== Termos e condições =====================
const modal = document.getElementById("modal-termos");
const abrir = document.getElementById("abrir-termos");
const fechar = document.getElementById("fechar-termos");

abrir.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
});

fechar.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


