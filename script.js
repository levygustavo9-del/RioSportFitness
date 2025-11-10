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

// ANIMAÇÕES AOS
AOS.init({
  duration: 1000,
  once: true
});

// FORMULÁRIO DE PRÉ-MATRÍCULA
function formatarDataHora(valor) {
  const data = new Date(valor);
  const dataFormatada = data.toLocaleDateString('pt-BR');
  const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dataFormatada} às ${horaFormatada}`;
}

document.addEventListener("DOMContentLoaded", function() {
  emailjs.init("P6ayYWMRJy0MVD3v2"); // sua Public Key

  const form = document.getElementById("matriculaForm");
  const horarioInput = document.getElementById("horario");

  // ⛔️ Bloqueia domingos e horários inválidos
  horarioInput.addEventListener("change", function() {
    const dataSelecionada = new Date(this.value);
    const diaSemana = dataSelecionada.getUTCDay(); // 0 = domingo
    const hora = dataSelecionada.getHours();

    if (diaSemana === 0) {
      alert("⚠️ A academia não realiza avaliações aos domingos. Escolha outro dia.");
      this.value = "";
      return;
    }

    // Limite de horários — apenas entre 7h e 20h
    if (hora < 7 || hora >  11 ) {
      alert("⚠️ Os horários disponíveis são das 07:00 às 11:00.");
      this.value = "";
    }
  });

  // Envio do formulário
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = {
      nome: this.nome.value,
      email: this.email.value,
      cpf: this.cpf.value,
      nascimento: this.nascimento.value,
      telefone: this.telefone.value,
      objetivo: this.objetivo.value,
      horario: formatarDataHora(this.horario.value)
    };

    // 1️⃣ Envia para a academia
    emailjs.send("service_hl3g14c", "template_zegyadw", formData)
      .then(() => {
        // 2️⃣ Envia confirmação para o aluno
        return emailjs.send("service_hl3g14c", "template_s7weu6o", formData);
      })
      .then(() => {
        alert(`✅ Pré-matrícula de ${formData.nome} enviada com sucesso! Um e-mail de confirmação foi enviado para ${formData.email}.`);
        form.reset();
      })
      .catch((erro) => {
        console.error("❌ Erro ao enviar:", erro);
        alert("❌ Ocorreu um erro ao enviar a pré-matrícula. Verifique sua conexão e tente novamente.");
      });
  });
});
