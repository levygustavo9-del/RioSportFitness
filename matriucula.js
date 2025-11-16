// ==================== MENU HAMBÚRGUER ====================
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

// ==================== AOS ====================
AOS.init({
  duration: 1000,
  once: true
});

// ==================== FUNÇÕES AUXILIARES ====================
function formatarDataHora(valor) {
  const data = new Date(valor);
  const dataFormatada = data.toLocaleDateString('pt-BR');
  const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dataFormatada} às ${horaFormatada}`;
}

function formatarData(valor) {
  const data = new Date(valor);
  return data.toLocaleDateString('pt-BR');
}

// ==================== FORMULÁRIO DE PRÉ-MATRÍCULA ====================
document.addEventListener("DOMContentLoaded", function() {
  emailjs.init("P6ayYWMRJy0MVD3v2"); // SUA PUBLIC KEY

  const form = document.getElementById("matriculaForm");
  const horarioSelect = document.getElementById("horario");

  // 🗓️ Gera horários disponíveis de 30 em 30 minutos
  function gerarHorarios() {
    const horarios = [];
    for (let h = 7; h < 11; h++) {
      horarios.push(`${h.toString().padStart(2,'0')}:00`);
      horarios.push(`${h.toString().padStart(2,'0')}:30`);
    }
    return horarios;
  }

  const horariosOcupados = JSON.parse(localStorage.getItem("horariosOcupados")) || [];

  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  const limite = new Date(hoje);
  limite.setDate(hoje.getDate() + 30);

  horarioSelect.innerHTML = "";

  for (let dia = new Date(amanha); dia <= limite; dia.setDate(dia.getDate() + 1)) {
    if (dia.getDay() === 0) continue;

    const dataISO = 
      dia.getFullYear() + "-" +
      String(dia.getMonth() + 1).padStart(2, "0") + "-" +
      String(dia.getDate()).padStart(2, "0");

    const horarios = gerarHorarios();

    horarios.forEach(hora => {
      const horarioCompleto = `${dataISO}T${hora}`;

      if (!horariosOcupados.includes(horarioCompleto)) {
        const opt = document.createElement("option");
        opt.value = horarioCompleto;
        opt.textContent = `${dia.toLocaleDateString('pt-BR')} às ${hora}`;
        horarioSelect.appendChild(opt);
      }
    });
  }

  // ==================== ENVIO DO FORMULÁRIO ====================
  form.addEventListener("submit", function(event) {
    event.preventDefault();

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

    // marca horário ocupado
    horariosOcupados.push(this.horario.value);
    localStorage.setItem("horariosOcupados", JSON.stringify(horariosOcupados));

    // 1) email para academia
    emailjs.send("service_hl3g14c", "template_zegyadw", dados);

    // 2) email para aluno
    emailjs.send("service_hl3g14c", "template_itda5kx", dados)
      .then(() => {
        alert(`✅ Pré-matrícula enviada! Confirmação enviada para ${dados.email}`);
        form.reset();
      })
      .catch(() => {
        alert("❌ Erro ao enviar. Tente novamente.");
      });
  });
});

// ==================== CALENDÁRIO DE NASCIMENTO ====================
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
  yearRange: [1930, new Date().getFullYear()],
  onValueUpdate: function(_, dateStr, instance) {
    if (dateStr.includes("/")) {
      const [d,m,a] = dateStr.split("/");
      instance.setDate(`${a}-${m}-${d}`, true);
    }
  }
});

// ==================== CALENDÁRIO DE NASCIMENTO ====================
flatpickr("#nascimento", {
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "d/m/Y",
  maxDate: "today",
  minDate: "1930-01-01",
  locale: "pt",
  disableMobile: true
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

