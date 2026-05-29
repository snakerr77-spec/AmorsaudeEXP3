import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const usersGrid = document.getElementById("usersGrid");
const template = document.getElementById("userCardTemplate");
const adminMessage = document.getElementById("adminMessage");
const searchInput = document.getElementById("userSearch");
const refreshUsers = document.getElementById("refreshUsers");
const statTotal = document.getElementById("statTotal");
const statAtivos = document.getElementById("statAtivos");
const statBloqueados = document.getElementById("statBloqueados");

let usuarios = [];
const CIDADES_AMOR_SAUDE = ["Embu das Artes", "Itapeva", "Tatui", "Cerquilho"];

function normalizarCidadeAdmin(cidade) {
  const valor = String(cidade || "").trim();
  return CIDADES_AMOR_SAUDE.includes(valor) ? valor : "Cerquilho";
}

function setMessage(texto, tipo = "") {
  adminMessage.textContent = texto;
  adminMessage.className = "admin-message" + (tipo ? ` ${tipo}` : "");
}

function formatDate(value) {
  if (!value) return "--";
  try {
    const date = value.toDate ? value.toDate() : new Date(value);
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date);
  } catch {
    return "--";
  }
}

function atualizarStats(lista) {
  const total = lista.length;
  const ativos = lista.filter((u) => u.ativo === true).length;
  statTotal.textContent = total;
  statAtivos.textContent = ativos;
  statBloqueados.textContent = total - ativos;
}

function renderUsuarios() {
  const termo = (searchInput.value || "").toLowerCase().trim();
  const filtrados = usuarios.filter((usuario) => {
    const texto = `${usuario.nomeCompleto || ""} ${usuario.email || ""} ${usuario.cidade || ""}`.toLowerCase();
    return texto.includes(termo);
  });

  usersGrid.innerHTML = "";
  atualizarStats(filtrados);

  if (!filtrados.length) {
    setMessage("Nenhum usuário encontrado.");
    return;
  }

  setMessage(`${filtrados.length} usuário(s) na lista.`, "sucesso");

  filtrados.forEach((usuario) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".user-card");
    const avatar = node.querySelector(".avatar");
    const name = node.querySelector("[data-name]");
    const email = node.querySelector("[data-email]");
    const active = node.querySelector("[data-active]");
    const role = node.querySelector("[data-role]");
    const city = node.querySelector("[data-city]");
    const created = node.querySelector("[data-created]");
    const lastLogin = node.querySelector("[data-last-login]");
    const saveButton = node.querySelector(".save-user");

    avatar.src = usuario.foto || "../assets/images/mascote_hero.png";
    name.textContent = usuario.nomeCompleto || "Sem nome";
    email.textContent = usuario.email || "Sem e-mail";
    active.value = usuario.ativo === true ? "true" : "false";
    role.value = usuario.nivelAcesso || "colaborador";
    city.value = normalizarCidadeAdmin(usuario.cidade);
    created.textContent = "Cadastro: " + formatDate(usuario.createdAt);
    lastLogin.textContent = "Último login: " + formatDate(usuario.ultimoLogin);

    saveButton.addEventListener("click", async () => {
      saveButton.disabled = true;
      saveButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

      try {
        await updateDoc(doc(db, "usuarios", usuario.id), {
          ativo: active.value === "true",
          nivelAcesso: role.value,
          cidade: normalizarCidadeAdmin(city.value),
          updatedAt: serverTimestamp()
        });

        usuario.ativo = active.value === "true";
        usuario.nivelAcesso = role.value;
        usuario.cidade = normalizarCidadeAdmin(city.value);
        setMessage(`Usuário ${usuario.email || usuario.id} atualizado.`, "sucesso");
      } catch (erro) {
        console.error("Erro ao salvar usuário:", erro);
        setMessage("Erro ao salvar. Verifique se sua conta é admin e se as regras foram publicadas.", "erro");
      } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salvar alterações';
      }
    });

    usersGrid.appendChild(node);
  });
}

async function carregarUsuarios() {
  setMessage("Carregando usuários...");
  usersGrid.innerHTML = "";

  try {
    const snap = await getDocs(collection(db, "usuarios"));
    usuarios = snap.docs.map((documento) => ({
      id: documento.id,
      ...documento.data()
    })).sort((a, b) => String(a.email || "").localeCompare(String(b.email || "")));

    renderUsuarios();
  } catch (erro) {
    console.error("Erro ao carregar usuários:", erro);
    setMessage("Não consegui carregar usuários. Confira as regras do Firestore e se você é admin.", "erro");
  }
}

window.addEventListener("usuario-carregado", (event) => {
  if (event.detail?.nivelAcesso === "admin") carregarUsuarios();
});

if (window.usuarioLogado?.nivelAcesso === "admin") {
  carregarUsuarios();
}

searchInput.addEventListener("input", renderUsuarios);
refreshUsers.addEventListener("click", carregarUsuarios);
