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

// ==================== ANIMAÇÕES AOS ====================
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
  emailjs.init("P6ayYWMRJy0MVD3v2"); // sua Public Key

  const form = document.getElementById("matriculaForm");
  const horarioSelect = document.getElementById("horario");

  // 🗓️ Função para gerar horários entre 07h e 11h, de 30 em 30 minutos
  function gerarHorariosDisponiveis() {
    const horarios = [];
    for (let hora = 7; hora < 11; hora++) {
      horarios.push(`${hora.toString().padStart(2, '0')}:00`);
      horarios.push(`${hora.toString().padStart(2, '0')}:30`);
    }
    return horarios;
  }

  // 🔒 Horários já ocupados (pode vir do localStorage ou API futuramente)
  const horariosOcupados = JSON.parse(localStorage.getItem("horariosOcupados")) || [
    "2025-11-10T08:00",
    "2025-11-10T09:30",
    "2025-11-11T10:00"
  ];

  // 🕒 Gera automaticamente os horários disponíveis (de amanhã até 30 dias)
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  const limite = new Date(hoje);
  limite.setDate(hoje.getDate() + 30);

  horarioSelect.innerHTML = "";

  for (let dia = new Date(amanha); dia <= limite; dia.setDate(dia.getDate() + 1)) {
    if (dia.getDay() === 0) continue; // pula domingos

    const dataISO = dia.toISOString().split("T")[0];
    const horarios = gerarHorariosDisponiveis();

    horarios.forEach(hora => {
      const [h, m] = hora.split(":");
      const horarioCompleto = `${dataISO}T${h}:${m}`;

      if (!horariosOcupados.includes(horarioCompleto)) {
        const option = document.createElement("option");
        option.value = horarioCompleto;
        option.textContent = `${dia.toLocaleDateString('pt-BR')} às ${hora}`;
        horarioSelect.appendChild(option);
      }
    });
  }

  // ==================== ENVIO DO FORMULÁRIO ====================
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!this.horario.value) {
      alert("⚠️ Escolha um horário disponível para o atendimento.");
      return;
    }

    const formData = {
      nome: this.nome.value,
      email: this.email.value,
      cpf: this.cpf.value,
      nascimento: formatarData(this.nascimento.value),
      telefone: this.telefone.value,
      objetivo: this.objetivo.value,
      horario: formatarDataHora(this.horario.value)
    };

    // ✅ Adiciona o novo horário como ocupado
    horariosOcupados.push(this.horario.value);
    localStorage.setItem("horariosOcupados", JSON.stringify(horariosOcupados));

    // 1️⃣ Envia o e-mail para a academia
    emailjs.send("service_hl3g14c", "template_zegyadw", formData)
      .then(() => {
        // 2️⃣ Envia confirmação para o aluno
        return emailjs.send("service_hl3g14c", "template_s7weu6o", formData);
      })
      .then(() => {
        alert(`✅ Pré-matrícula de ${formData.nome} enviada com sucesso! Um e-mail foi enviado para ${formData.email}.`);
        form.reset();
      })
      .catch((erro) => {
        console.error("❌ Erro ao enviar:", erro);
        alert("❌ Ocorreu um erro ao enviar a pré-matrícula. Verifique sua conexão e tente novamente.");
      });
  });
});
// ==============MELHORIA DO CALENDARIO DE NASCIMENTO====================

flatpickr("#nascimento", {
  // formato interno e visual
  dateFormat: "Y-m-d",        // formato interno correto para o Flatpickr
  altInput: true,             // mostra um campo visual separado
  altFormat: "d/m/Y",         // formato exibido ao usuário
  maxDate: "today",           // bloqueia datas futuras
  minDate: "1930-01-01",      // limite mínimo
  locale: "pt",               // tradução para português
  disableMobile: true,        // força uso no celular
  allowInput: true,           // permite digitar manualmente
  monthSelectorType: "dropdown", // mostra menu de mês/ano
  yearRange: [1930, new Date().getFullYear()], // faixa de anos

  onReady: function(selectedDates, dateStr, instance) {
    // exibe o seletor de mês e ano lado a lado
    const calendarContainer = instance.calendarContainer;
    const monthDropdown = calendarContainer.querySelector(".flatpickr-monthDropdown-months");
    const yearInput = calendarContainer.querySelector(".numInputWrapper");
    if (monthDropdown && yearInput) {
      monthDropdown.style.display = "inline-block";
      yearInput.style.display = "inline-block";
    }
  },

  // converte automaticamente quando o usuário digitar no formato BR
  onValueUpdate: function(selectedDates, dateStr, instance) {
    if (dateStr && dateStr.includes("/")) {
      const [dia, mes, ano] = dateStr.split("/");
      instance.setDate(`${ano}-${mes}-${dia}`, true, "Y-m-d");
    }
  }
});
