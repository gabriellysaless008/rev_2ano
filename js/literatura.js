import { app } from "./firebase.js";

import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";


// ======================================================
// FIREBASE
// ======================================================

const db = getFirestore(app);
const storage = getStorage(app);

const materia = "Literatura";


// ======================================================
// ELEMENTOS
// ======================================================

const btnNovoPodcast =
    document.getElementById("btnNovoPodcast");

const btnNovaBiografia =
    document.getElementById("btnNovaBiografia");

const modalPodcast =
    document.getElementById("modalPodcast");

const modalBiografia =
    document.getElementById("modalBiografia");

const modalLeitura =
    document.getElementById("modalLeitura");

const modalLeituraBiografia =
    document.getElementById("modalLeituraBiografia");

const listaPodcasts =
    document.getElementById("listaPodcasts");

const listaBiografias =
    document.getElementById("listaBiografias");


// ======================================================
// MODAIS
// ======================================================

function abrirModal(modal) {
    if (modal) {
        modal.style.display = "flex";
    }
}


function fecharModal(modal) {
    if (modal) {
        modal.style.display = "none";
    }
}


// ======================================================
// ABRIR MODAIS
// ======================================================

btnNovoPodcast?.addEventListener("click", () => {
    abrirModal(modalPodcast);
});

btnNovaBiografia?.addEventListener("click", () => {
    abrirModal(modalBiografia);
});


// ======================================================
// FECHAR MODAIS
// ======================================================

document
    .getElementById("fecharPodcast")
    ?.addEventListener("click", () => {
        fecharModal(modalPodcast);
    });

document
    .getElementById("fecharBiografia")
    ?.addEventListener("click", () => {
        fecharModal(modalBiografia);
    });

document
    .getElementById("fecharLeitura")
    ?.addEventListener("click", () => {
        fecharModal(modalLeitura);
    });

document
    .getElementById("fecharLeituraBiografia")
    ?.addEventListener("click", () => {
        fecharModal(modalLeituraBiografia);
    });


// ======================================================
// FECHAR MODAL CLICANDO FORA
// ======================================================

window.addEventListener("click", (event) => {

    if (
        event.target.classList.contains(
            "literatura-modal"
        )
    ) {
        fecharModal(event.target);
    }

});


// ======================================================
// CARROSSEL DE TRABALHOS
// ======================================================

const trabalhosTrack =
    document.getElementById("trabalhosTrack");

const trabalhosIndicadores =
    document.getElementById("trabalhosIndicadores");

const btnTrabalhoAnterior =
    document.getElementById("btnTrabalhoAnterior");

const btnTrabalhoProximo =
    document.getElementById("btnTrabalhoProximo");


// ======================================================
// TRABALHOS
// ======================================================

const trabalhos = [

    {
        titulo: "Análise de uma obra literária",

        alunos: [
            "nome1",
            "nome2",
            "nome3"
        ],

        imagem: null
    },

    {
        titulo: "Atividade de Literatura",

        alunos: [
            "Aluno 1",
            "Aluno 2"
        ],

        imagem: null
    },

    {
        titulo: "Projeto Literário",

        alunos: [
            "Aluno 3"
        ],

        imagem: null
    }

];


let trabalhoAtual = 0;


// ======================================================
// CRIAR CARROSSEL DE TRABALHOS
// ======================================================

function criarCarrosselTrabalhos() {

    if (!trabalhosTrack) {

        console.warn(
            "ERRO: #trabalhosTrack não foi encontrado no HTML."
        );

        return;
    }


    // Limpa o conteúdo anterior

    trabalhosTrack.innerHTML = "";

    if (trabalhosIndicadores) {
        trabalhosIndicadores.innerHTML = "";
    }


    // Cria cada trabalho

    trabalhos.forEach((trabalho, indice) => {

        const slide =
            document.createElement("article");

        slide.className =
            "trabalho-slide";


        // ==================================================
        // IMAGEM
        // ==================================================

        let areaImagem = "";

        if (trabalho.imagem) {

            areaImagem = `
                <img
                    src="${trabalho.imagem}"
                    alt="${escaparHTML(trabalho.titulo)}"
                >
            `;

        } else {

            areaImagem = `
                <div class="trabalho-placeholder">
                    <span>✦</span>

                    <p>
                        Imagem do trabalho
                    </p>
                </div>
            `;

        }


        // ==================================================
        // NOMES
        // ==================================================

        const nomesAlunos =
            trabalho.alunos
                .map(aluno => escaparHTML(aluno))
                .join(" • ");


        // ==================================================
        // CONTEÚDO DO SLIDE
        // ==================================================

        slide.innerHTML = `

            <div class="trabalho-imagem">

                ${areaImagem}

            </div>


            <div class="trabalho-info">

                <span class="trabalho-label">
                    TRABALHO DA TURMA
                </span>


                <h3>
                    ${escaparHTML(trabalho.titulo)}
                </h3>


                <div class="trabalho-alunos">

                    <span class="alunos-icone">
                        👥
                    </span>


                    <div>

                        <small>
                            ALUNOS
                        </small>

                        <p>
                            ${nomesAlunos}
                        </p>

                    </div>

                </div>

            </div>

        `;


        trabalhosTrack.appendChild(slide);


        // ==================================================
        // INDICADOR
        // ==================================================

        if (trabalhosIndicadores) {

            const indicador =
                document.createElement("button");

            indicador.type = "button";

            indicador.className =
                "trabalho-indicador";

            indicador.setAttribute(
                "aria-label",
                `Ir para o trabalho ${indice + 1}`
            );


            indicador.addEventListener("click", () => {

                trabalhoAtual = indice;

                atualizarCarrosselTrabalhos();

            });


            trabalhosIndicadores.appendChild(
                indicador
            );

        }

    });


    // Atualiza posição inicial

    atualizarCarrosselTrabalhos();

}


// ======================================================
// ATUALIZAR CARROSSEL DE TRABALHOS
// ======================================================

function atualizarCarrosselTrabalhos() {

    if (
        !trabalhosTrack ||
        !trabalhos.length
    ) {
        return;
    }


    // Garante que o índice nunca fique inválido

    if (trabalhoAtual < 0) {
        trabalhoAtual = 0;
    }

    if (
        trabalhoAtual >
        trabalhos.length - 1
    ) {
        trabalhoAtual =
            trabalhos.length - 1;
    }


    // Move o carrossel

    trabalhosTrack.style.transform =
        `translateX(-${trabalhoAtual * 100}%)`;


    // ==================================================
    // INDICADORES
    // ==================================================

    const indicadores =
        trabalhosIndicadores?.querySelectorAll(
            ".trabalho-indicador"
        );


    indicadores?.forEach(
        (indicador, indice) => {

            indicador.classList.toggle(
                "ativo",
                indice === trabalhoAtual
            );

        }
    );


    // ==================================================
    // BOTÃO ANTERIOR
    // ==================================================

    if (btnTrabalhoAnterior) {

        btnTrabalhoAnterior.disabled =
            trabalhoAtual === 0;

    }


    // ==================================================
    // BOTÃO PRÓXIMO
    // ==================================================

    if (btnTrabalhoProximo) {

        btnTrabalhoProximo.disabled =
            trabalhoAtual ===
            trabalhos.length - 1;

    }

}


// ======================================================
// BOTÃO ANTERIOR
// ======================================================

btnTrabalhoAnterior?.addEventListener(
    "click",
    () => {

        if (trabalhoAtual > 0) {

            trabalhoAtual--;

            atualizarCarrosselTrabalhos();

        }

    }
);


// ======================================================
// BOTÃO PRÓXIMO
// ======================================================

btnTrabalhoProximo?.addEventListener(
    "click",
    () => {

        if (
            trabalhoAtual <
            trabalhos.length - 1
        ) {

            trabalhoAtual++;

            atualizarCarrosselTrabalhos();

        }

    }
);


// ======================================================
// INICIAR CARROSSEL
// ======================================================

function iniciarCarrosselLiteratura() {

    criarCarrosselTrabalhos();

}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarCarrosselLiteratura
    );

} else {

    iniciarCarrosselLiteratura();

}