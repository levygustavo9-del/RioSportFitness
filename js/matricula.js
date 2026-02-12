/* ================= FIREBASE ================= */

const firebaseConfig = {
  apiKey: "AIzaSyARYVgimtj7_-AGclaV1qvaQRXJecyNgdM",
  authDomain: "datahora-73183.firebaseapp.com",
  projectId: "datahora-73183",
  storageBucket: "datahora-73183.firebasestorage.app",
  messagingSenderId: "70731944657",
  appId: "1:70731944657:web:fb79aff377b126f0ed3470"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

/* ================= EMAILJS ================= */

emailjs.init("P6ayYWMRJy0MVD3v2");

/* ================= UTIL ================= */

// Horários de 1h (07h às 20h)
function gerarHorarios() {
  const horarios = [];
  for (let i = 7; i <= 20; i++) {
    horarios.push(`${String(i).padStart(2, "0")}:00`);
  }
  return horarios;
}

// Formata data e hora para exibição
function formatarDataHora(valor) {
  const d = new Date(valor);
  return `${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  })}`;
}

// Data ISO → BR
function formatarDataBR(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

/* ================= FIRESTORE ================= */

// Salva apenas como LEAD (pré-matrícula)
async function salvarPreMatricula(dados) {
  return db.collection("pre_matriculas").add({
    ...dados,
    criadoEm: firebase.firestore.FieldValue.serverTimestamp()
  });
}

/* ================= DOM ================= */

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("matriculaForm");
  const horarioSelect = document.getElementById("horario");

  function carregarHorarios() {
    horarioSelect.innerHTML = "";

    const hoje = new Date();

    for (let d = 1; d <= 30; d++) {
      const dia = new Date();
      dia.setDate(hoje.getDate() + d);

      // Bloqueia domingo
      if (dia.getDay() === 0) continue;

      const dataISO = dia.toISOString().split("T")[0];

      gerarHorarios().forEach(hora => {
        const opt = document.createElement("option");
        opt.value = `${dataISO}T${hora}`;
        opt.textContent = `${dia.toLocaleDateString("pt-BR")} às ${hora}`;
        horarioSelect.appendChild(opt);
      });
    }
  }

  if (horarioSelect) carregarHorarios();

  if (form) {
    form.addEventListener("submit", async e => {
      e.preventDefault();

      if (!horarioSelect.value) {
        alert("⚠️ Escolha um horário preferido.");
        return;
      }

      const dados = {
        tipo: "Pré-matrícula",
        nome: form.nome.value,
        cpf: form.cpf.value,
        nascimento: formatarDataBR(form.nascimento.value),
        telefone: form.telefone.value,
        email: form.email.value,
        objetivo: form.objetivo.value,
        horarioPreferido: formatarDataHora(horarioSelect.value),
        termos: "Aceitou os termos"
      };

      try {
        await salvarPreMatricula(dados);

        await emailjs.send("service_hl3g14c", "template_zegyadw", dados);
        await emailjs.send("service_hl3g14c", "template_itda5kx", dados);

        alert("✅ Pré-matrícula enviada! Nossa equipe entrará em contato.");

        form.reset();
        carregarHorarios();

      } catch (error) {
        console.error(error);
        alert("❌ Erro ao enviar pré-matrícula. Tente novamente.");
      }
    });
  }
});
