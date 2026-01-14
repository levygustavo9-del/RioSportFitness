/* =======================================================
   PRÉ-MATRÍCULA – FIREBASE + FIRESTORE
   Arquivo ISOLADO (type="module")
   ======================================================= */

/* ================= FIREBASE IMPORTS ================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyAnkcfBz55zVWR6AH2H8vj0LOceNU5uSsQ",
  authDomain: "datahora-29635.firebaseapp.com",
  projectId: "datahora-29635"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= ELEMENTOS ================= */
const form = document.getElementById("matriculaForm");
const horarioSelect = document.getElementById("horario");

/* ================= HORÁRIOS BASE ================= */
function gerarHorarios() {
  const horarios = [];
  for (let h = 7; h < 11; h++) {
    horarios.push(`${String(h).padStart(2, "0")}:00`);
    horarios.push(`${String(h).padStart(2, "0")}:30`);
  }
  return horarios;
}

/* ================= BUSCAR OCUPADOS ================= */
async function buscarHorariosOcupados(dataISO) {
  const ref = collection(db, "agendamentos", dataISO, "horarios");
  const snap = await getDocs(ref);
  return snap.docs.map(d => d.id);
}

/* ================= CARREGAR SELECT ================= */
async function carregarHorarios() {
  if (!horarioSelect) return;

  horarioSelect.innerHTML = "";

  const hoje = new Date();
  const amanha = new Date();
  amanha.setDate(hoje.getDate() + 1);

  const limite = new Date();
  limite.setDate(hoje.getDate() + 30);

  for (let dia = new Date(amanha); dia <= limite; dia.setDate(dia.getDate() + 1)) {
    if (dia.getDay() === 0) continue;

    const dataISO = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, "0")}-${String(dia.getDate()).padStart(2, "0")}`;
    const ocupados = await buscarHorariosOcupados(dataISO);

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

carregarHorarios();

/* ================= SUBMIT ================= */
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.horario.value) {
      alert("⚠️ Escolha um horário disponível.");
      return;
    }

    const [dataISO, hora] = form.horario.value.split("T");
    const ref = doc(db, "agendamentos", dataISO, "horarios", hora);

    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);

        if (snap.exists()) {
          throw "HORARIO_OCUPADO";
        }

        transaction.set(ref, {
          nome: form.nome.value,
          email: form.email.value,
          telefone: form.telefone.value,
          objetivo: form.objetivo.value,
          criadoEm: serverTimestamp()
        });
      });

    } catch {
      alert("❌ Este horário acabou de ser ocupado. Escolha outro.");
      await carregarHorarios();
      return;
    }

    const dadosEmail = {
      nome: form.nome.value,
      email: form.email.value,
      cpf: form.cpf.value,
      nascimento: form.nascimento.value,
      telefone: form.telefone.value,
      objetivo: form.objetivo.value,
      horario: form.horario.options[form.horario.selectedIndex].text,
      termos: form.termos.checked ? "Aceitou" : "Não aceitou"
    };

    if (typeof emailjs !== "undefined") {
      emailjs.send("service_hl3g14c", "template_zegyadw", dadosEmail);
      emailjs.send("service_hl3g14c", "template_itda5kx", dadosEmail)
        .then(async () => {
          alert("✅ Pré-matrícula enviada com sucesso!");
          form.reset();
          await carregarHorarios();
        })
        .catch(() => alert("❌ Erro ao enviar e-mail."));
    }
  });
}
