/* ================= FIREBASE (Configuração Correta para HTML) ================= */
const firebaseConfig = {
  apiKey: "AIzaSyARYVgimtj7_-AGclaV1qvaQRXJecyNgdM",
  authDomain: "datahora-73183.firebaseapp.com",
  projectId: "datahora-73183",
  storageBucket: "datahora-73183.firebasestorage.app",
  messagingSenderId: "70731944657",
  appId: "1:70731944657:web:fb79aff377b126f0ed3470",
  measurementId: "G-DVH152XWK3"
};

// Inicializa o Firebase (Padrão Compat/CDN)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

/* ================= EMAILJS ================= */

emailjs.init("P6ayYWMRJy0MVD3v2");

/* ================= UTIL ================= */

function gerarHorarios() {
  const h = [];
  for (let i = 7; i < 11; i++) {
    h.push(`${String(i).padStart(2, "0")}:00`);
    h.push(`${String(i).padStart(2, "0")}:30`);
  }
  h.push("11:00"); // garante que não exista 11:30
  return h;
}


function formatarDataHora(valor) {
  const d = new Date(valor);
  return `${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  })}`;
}

/* ================= FIRESTORE ================= */

async function buscarOcupados(dataISO) {
  const snap = await db
    .collection("agendamentos")
    .doc(dataISO)
    .collection("horarios")
    .get();

  return snap.docs.map(doc => doc.id);
}

async function salvarHorario(dataISO, hora) {
  const ref = db
    .collection("agendamentos")
    .doc(dataISO)
    .collection("horarios")
    .doc(hora);

  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);

    if (doc.exists) {
      throw new Error("Horário ocupado");
    }

    transaction.set(ref, {
      criadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });
  });
}


// Formata data ISO (YYYY-MM-DD) para formato BR (DD/MM/YYYY)
function formatarDataBR(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

/* ================= DOM ================= */

document.addEventListener("DOMContentLoaded", async () => {

  const form = document.getElementById("matriculaForm");
  const horarioSelect = document.getElementById("horario");

  async function carregarHorarios() {
    horarioSelect.innerHTML = "";

    const hoje = new Date();

    for (let d = 1; d <= 30; d++) {
      const dia = new Date();
      dia.setDate(hoje.getDate() + d);
      if (dia.getDay() === 0) continue;

      const dataISO = dia.toISOString().split("T")[0];
      const ocupados = await buscarOcupados(dataISO);

      gerarHorarios().forEach(hora => {
        if (!ocupados.includes(hora)) {
          const opt = document.createElement("option");
          opt.value = `${dataISO}T${hora}`;
          opt.textContent = `${dia.toLocaleDateString("pt-BR")} às ${hora}`;
          horarioSelect.appendChild(opt);
        }
      });
    }
  }

  if (horarioSelect) await carregarHorarios();

  if (form) {
    form.addEventListener("submit", async e => {
      e.preventDefault();

      if (!horarioSelect.value) {
        alert("⚠️ Escolha um horário.");
        return;
      }

      const [dataISO, hora] = horarioSelect.value.split("T");

      try {
        await salvarHorario(dataISO, hora);
      } catch {
        alert("❌ Horário já ocupado.");
        carregarHorarios();
        return;
      }

      const dados = {
        tipo: "Aula Experimental",
        nome: form.nome.value,
        cpf: form.cpf.value,
        nascimento: formatarDataBR(form.nascimento.value),
        telefone: form.telefone.value,
        email: form.email.value,
        objetivo: form.objetivo.value,
        horario: formatarDataHora(horarioSelect.value),
        termos: "Aceitou os termos"
      };

      await emailjs.send("service_hl3g14c", "template_zegyadw", dados);
      await emailjs.send("service_hl3g14c", "template_itda5kx", dados);

      alert("✅ Pré-matrícula enviada!");
      form.reset();
      carregarHorarios();
    });
  }
});

