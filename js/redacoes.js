import { app } from "./firebase.js";

import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// ======================================================
// FIREBASE
// ======================================================

const db = getFirestore(app);


// ======================================================
// IDENTIFICAR A MATÉRIA PELA PÁGINA
// ======================================================

const paginas = {
    "tema1.html": "Filosofia",
    "tema2.html": "Sociologia",
    "tema3.html": "Literatura"
};

const paginaAtual = window.location.pathname.split("/").pop();

const materia = paginas[paginaAtual];


// Se estiver no index.html, não faz nada
if (!materia) {
    console.log("Página inicial. Nenhuma matéria selecionada.");
} else {

    console.log("Matéria atual:", materia);


    // ==================================================
    // ELEMENTOS DO HTML
    // ==================================================

    const btnNovaRedacao = document.getElementById("btnNovaRedacao");
    const modalRedacao = document.getElementById("modalRedacao");
    const fecharModal = document.getElementById("fecharModal");
    const formRedacao = document.getElementById("formRedacao");

    const modalLeitura = document.getElementById("modalLeitura");
    const fecharLeitura = document.getElementById("fecharLeitura");

    const tituloRedacao = document.getElementById("tituloRedacao");
    const textoRedacao = document.getElementById("textoRedacao");
    const autorRedacao = document.getElementById("autorRedacao");

    const listaRedacoes = document.getElementById("listaRedacoes");


    // ==================================================
    // VERIFICAR SE OS ELEMENTOS EXISTEM
    // ==================================================

    if (!listaRedacoes) {
        console.error(
            "Não foi encontrado o elemento #listaRedacoes nesta página."
        );
    }


    // ==================================================
    // ABRIR MODAL DE NOVA REDAÇÃO
    // ==================================================

    if (btnNovaRedacao) {

        btnNovaRedacao.addEventListener("click", () => {

            modalRedacao.style.display = "flex";

        });

    }


    // ==================================================
    // FECHAR MODAL DE NOVA REDAÇÃO
    // ==================================================

    if (fecharModal) {

        fecharModal.addEventListener("click", () => {

            modalRedacao.style.display = "none";

        });

    }


    // ==================================================
    // FECHAR MODAL DE LEITURA
    // ==================================================

    if (fecharLeitura) {

        fecharLeitura.addEventListener("click", () => {

            modalLeitura.style.display = "none";

        });

    }


    // ==================================================
    // FECHAR MODAIS CLICANDO FORA
    // ==================================================

    window.addEventListener("click", (event) => {

        if (event.target === modalRedacao) {

            modalRedacao.style.display = "none";

        }

        if (event.target === modalLeitura) {

            modalLeitura.style.display = "none";

        }

    });


    // ==================================================
    // ENVIAR REDAÇÃO
    // ==================================================

    if (formRedacao) {

        formRedacao.addEventListener("submit", async (event) => {

            event.preventDefault();


            // ----------------------------------------------
            // PEGAR VALORES
            // ----------------------------------------------

            const autor = document
                .getElementById("autor")
                .value
                .trim();

            const email = document
                .getElementById("email")
                .value
                .trim();

            const titulo = document
                .getElementById("titulo")
                .value
                .trim();

            const texto = document
                .getElementById("texto")
                .value
                .trim();


            // ----------------------------------------------
            // VALIDAÇÃO
            // ----------------------------------------------

            if (!autor || !email || !titulo || !texto) {

                alert("Preencha todos os campos.");

                return;

            }


            // ----------------------------------------------
            // DESABILITAR BOTÃO
            // ----------------------------------------------

            const botaoEnviar = formRedacao.querySelector(
                "button[type='submit']"
            );

            const textoOriginal = botaoEnviar.textContent;

            botaoEnviar.disabled = true;

            botaoEnviar.textContent = "Enviando...";


            try {

                // ------------------------------------------
                // SALVAR NO FIRESTORE
                // ------------------------------------------

                await addDoc(collection(db, "Sociologia"), {

                    autor: autor,

                    email: email,

                    titulo: titulo,

                    texto: texto,

                    materia: materia,

                    criadoEm: serverTimestamp()

                });


                // ------------------------------------------
                // LIMPAR FORMULÁRIO
                // ------------------------------------------

                formRedacao.reset();


                // ------------------------------------------
                // FECHAR MODAL
                // ------------------------------------------

                modalRedacao.style.display = "none";


                alert("Redação enviada com sucesso!");


            } catch (erro) {

                console.error(
                    "Erro ao salvar redação:",
                    erro
                );

                alert(
                    "Não foi possível enviar a redação. " +
                    "Verifique a conexão com o Firebase."
                );

            } finally {

                botaoEnviar.disabled = false;

                botaoEnviar.textContent = textoOriginal;

            }

        });

    }


    // ==================================================
    // CARREGAR REDAÇÕES DA MATÉRIA
    // ==================================================

    if (listaRedacoes) {

        listaRedacoes.innerHTML = `
            <div class="loading">
                Carregando redações...
            </div>
        `;


        // ----------------------------------------------
        // CONSULTA
        // ----------------------------------------------

        const consulta = query(
        collection(db, "redacoes"),
        where("materia", "==", materia)
);


        // ----------------------------------------------
        // ESCUTAR ALTERAÇÕES EM TEMPO REAL
        // ----------------------------------------------

        onSnapshot(

            consulta,

            (snapshot) => {

                listaRedacoes.innerHTML = "";


                // ------------------------------------------
                // NENHUMA REDAÇÃO
                // ------------------------------------------

                if (snapshot.empty) {

                    listaRedacoes.innerHTML = `
                        <div class="empty-state">

                            <span class="empty-icon">
                                📝
                            </span>

                            <p>
                                Ainda não existem redações em ${materia}.
                            </p>

                        </div>
                    `;

                    return;

                }


                // ------------------------------------------
                // CRIAR CARDS
                // ------------------------------------------

                snapshot.forEach((documento) => {

                    const redacao = documento.data();

                    criarCardRedacao(
                        documento.id,
                        redacao
                    );

                });

            },

            (erro) => {

                console.error(
                    "Erro ao carregar redações:",
                    erro
                );

                listaRedacoes.innerHTML = `
                    <div class="empty-state">

                        <span class="empty-icon">
                            ⚠️
                        </span>

                        <p>
                            Não foi possível carregar as redações.
                        </p>

                    </div>
                `;

            }

        );

    }


    // ==================================================
    // CRIAR CARD
    // ==================================================

    function criarCardRedacao(id, redacao) {

        const card = document.createElement("article");

        card.className = "card-redacao";


        // ----------------------------------------------
        // DATA
        // ----------------------------------------------

        let dataFormatada = "Data não disponível";


        if (redacao.criadoEm) {

            const data = redacao.criadoEm.toDate();

            dataFormatada = data.toLocaleDateString(
                "pt-BR",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );

        }


        // ----------------------------------------------
        // PRÉVIA
        // ----------------------------------------------

        let previa = redacao.texto || "";

        if (previa.length > 180) {

            previa = previa.substring(0, 180) + "...";

        }


        // ----------------------------------------------
        // CONTEÚDO
        // ----------------------------------------------

        card.innerHTML = `

            <h3>
                ${escaparHTML(redacao.titulo || "Sem título")}
            </h3>

            <p class="card-autor">
                ${escaparHTML(redacao.autor || "Autor desconhecido")}
            </p>

            <p class="card-preview">
                ${escaparHTML(previa)}
            </p>

            <p class="card-data">
                ${dataFormatada}
            </p>

            <button class="btn-ler" type="button">
                Ler redação →
            </button>

        `;


        // ----------------------------------------------
        // ABRIR REDAÇÃO
        // ----------------------------------------------

        card.addEventListener("click", () => {

            abrirRedacao(redacao);

        });


        listaRedacoes.appendChild(card);

    }


    // ==================================================
    // ABRIR REDAÇÃO COMPLETA
    // ==================================================

    function abrirRedacao(redacao) {

        tituloRedacao.textContent =
            redacao.titulo || "Sem título";


        textoRedacao.textContent =
            redacao.texto || "";


        autorRedacao.innerHTML = `
            <strong>Autor:</strong>
            ${escaparHTML(redacao.autor || "Desconhecido")}
        `;


        modalLeitura.style.display = "flex";

    }


    // ==================================================
    // PROTEGER TEXTO CONTRA HTML
    // ==================================================

    function escaparHTML(texto) {

        const div = document.createElement("div");

        div.textContent = texto;

        return div.innerHTML;

    }

}