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

const materia = "Sociologia";


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

btnNovoPodcast?.addEventListener(
    "click",
    () => {
        abrirModal(modalPodcast);
    }
);

btnNovaBiografia?.addEventListener(
    "click",
    () => {
        abrirModal(modalBiografia);
    }
);


// ======================================================
// FECHAR MODAIS
// ======================================================

document
    .getElementById("fecharPodcast")
    ?.addEventListener(
        "click",
        () => {
            fecharModal(modalPodcast);
        }
    );

document
    .getElementById("fecharBiografia")
    ?.addEventListener(
        "click",
        () => {
            fecharModal(modalBiografia);
        }
    );

document
    .getElementById("fecharLeitura")
    ?.addEventListener(
        "click",
        () => {
            fecharModal(modalLeitura);
        }
    );

document
    .getElementById("fecharLeituraBiografia")
    ?.addEventListener(
        "click",
        () => {
            fecharModal(modalLeituraBiografia);
        }
    );


// ======================================================
// FECHAR AO CLICAR FORA
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
// PODCASTS
// ======================================================

const formPodcast =
    document.getElementById("formPodcast");


if (formPodcast) {

    formPodcast.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const autor =
                document
                    .getElementById("autorPodcast")
                    ?.value
                    .trim();

            const email =
                document
                    .getElementById("emailPodcast")
                    ?.value
                    .trim();

            const titulo =
                document
                    .getElementById("tituloPodcast")
                    ?.value
                    .trim();

            const descricao =
                document
                    .getElementById("descricaoPodcast")
                    ?.value
                    .trim();

            const arquivo =
                document
                    .getElementById("arquivoPodcast")
                    ?.files[0];


            if (
                !autor ||
                !email ||
                !titulo ||
                !descricao ||
                !arquivo
            ) {

                alert(
                    "Preencha todos os campos."
                );

                return;

            }


            if (
                !arquivo.type.startsWith("audio/")
            ) {

                alert(
                    "Selecione um arquivo de áudio válido."
                );

                return;

            }


            const botao =
                formPodcast.querySelector(
                    "button[type='submit']"
                );


            botao.disabled = true;

            botao.textContent =
                "Enviando podcast...";


            try {

                const nomeArquivo =
                    `${Date.now()}_${arquivo.name}`;


                const caminho =
                    `podcasts/${nomeArquivo}`;


                const arquivoRef =
                    ref(
                        storage,
                        caminho
                    );


                await uploadBytes(
                    arquivoRef,
                    arquivo
                );


                const urlAudio =
                    await getDownloadURL(
                        arquivoRef
                    );


                await addDoc(
                    collection(
                        db,
                        "podcasts"
                    ),
                    {

                        autor,

                        email,

                        titulo,

                        descricao,

                        arquivoAudio:
                            urlAudio,

                        nomeArquivo:
                            arquivo.name,

                        materia,

                        criadoEm:
                            serverTimestamp()

                    }
                );


                formPodcast.reset();


                fecharModal(
                    modalPodcast
                );


                alert(
                    "Podcast adicionado com sucesso!"
                );


            } catch (erro) {

                console.error(
                    "Erro ao enviar podcast:",
                    erro
                );


                alert(
                    "Não foi possível enviar o podcast."
                );


            } finally {

                botao.disabled = false;

                botao.textContent =
                    "Adicionar Podcast";

            }

        }
    );

}


// ======================================================
// CARREGAR PODCASTS
// ======================================================

if (listaPodcasts) {

    const consulta =
        query(
            collection(
                db,
                "podcasts"
            ),

            where(
                "materia",
                "==",
                materia
            )
        );


    onSnapshot(
        consulta,

        (snapshot) => {

            listaPodcasts.innerHTML = "";


            if (snapshot.empty) {

                listaPodcasts.innerHTML = `

                    <div class="empty-state">

                        <p>
                            Ainda não existem podcasts em ${materia}.
                        </p>

                    </div>

                `;

                return;

            }


            snapshot.forEach(
                (documento) => {

                    criarCardPodcast(
                        documento.data()
                    );

                }
            );

        },

        (erro) => {

            console.error(
                "Erro ao carregar podcasts:",
                erro
            );

        }
    );

}


// ======================================================
// CARD PODCAST
// ======================================================

function criarCardPodcast(podcast) {

    const card =
        document.createElement("article");


    card.className =
        "card-podcast";


    card.innerHTML = `

        <div class="icone-podcast">
            🎙
        </div>


        <div class="podcast-info">

            <h3>
                ${escaparHTML(
                    podcast.titulo ||
                    "Sem título"
                )}
            </h3>


            <p class="card-autor">
                ${escaparHTML(
                    podcast.autor ||
                    "Autor desconhecido"
                )}
            </p>


            <p class="podcast-descricao">
                ${escaparHTML(
                    podcast.descricao ||
                    ""
                )}
            </p>


            <audio
                class="player-podcast"
                controls
                preload="metadata"
            >

                <source
                    src="${podcast.arquivoAudio}"
                >

                Seu navegador não suporta áudio.

            </audio>

        </div>

    `;


    listaPodcasts.appendChild(card);

}


// ======================================================
// BIOGRAFIAS
// ======================================================

const formBiografia =
    document.getElementById("formBiografia");


if (formBiografia) {

    formBiografia.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const nome =
                document
                    .getElementById("nomeBiografado")
                    ?.value
                    .trim();

            const autor =
                document
                    .getElementById("autorBiografia")
                    ?.value
                    .trim();

            const email =
                document
                    .getElementById("emailBiografia")
                    ?.value
                    .trim();

            const titulo =
                document
                    .getElementById("tituloBiografia")
                    ?.value
                    .trim();

            const texto =
                document
                    .getElementById("textoBiografia")
                    ?.value
                    .trim();

            const imagem =
                document
                    .getElementById("imagemBiografia")
                    ?.files[0];


            if (
                !nome ||
                !autor ||
                !email ||
                !titulo ||
                !texto ||
                !imagem
            ) {

                alert(
                    "Preencha todos os campos."
                );

                return;

            }


            if (
                !imagem.type.startsWith("image/")
            ) {

                alert(
                    "Selecione uma imagem válida."
                );

                return;

            }


            const botao =
                formBiografia.querySelector(
                    "button[type='submit']"
                );


            botao.disabled = true;

            botao.textContent =
                "Enviando biografia...";


            try {

                const nomeArquivo =
                    `${Date.now()}_${imagem.name}`;


                const caminho =
                    `biografias/${nomeArquivo}`;


                const imagemRef =
                    ref(
                        storage,
                        caminho
                    );


                await uploadBytes(
                    imagemRef,
                    imagem
                );


                const urlImagem =
                    await getDownloadURL(
                        imagemRef
                    );


                await addDoc(
                    collection(
                        db,
                        "biografias"
                    ),
                    {

                        nome,

                        autor,

                        email,

                        titulo,

                        texto,

                        imagem:
                            urlImagem,

                        nomeArquivo:
                            imagem.name,

                        materia,

                        criadoEm:
                            serverTimestamp()

                    }
                );


                formBiografia.reset();


                fecharModal(
                    modalBiografia
                );


                alert(
                    "Biografia adicionada com sucesso!"
                );


            } catch (erro) {

                console.error(
                    "Erro ao enviar biografia:",
                    erro
                );


                alert(
                    "Não foi possível enviar a biografia."
                );


            } finally {

                botao.disabled = false;

                botao.textContent =
                    "Adicionar Biografia";

            }

        }
    );

}


// ======================================================
// CARREGAR BIOGRAFIAS
// ======================================================

if (listaBiografias) {

    const consulta =
        query(
            collection(
                db,
                "biografias"
            ),

            where(
                "materia",
                "==",
                materia
            )
        );


    onSnapshot(
        consulta,

        (snapshot) => {

            listaBiografias.innerHTML = "";


            if (snapshot.empty) {

                listaBiografias.innerHTML = `

                    <div class="empty-state">

                        <p>
                            Ainda não existem biografias em ${materia}.
                        </p>

                    </div>

                `;

                return;

            }


            snapshot.forEach(
                (documento) => {

                    criarCardBiografia(
                        documento.data()
                    );

                }
            );

        },

        (erro) => {

            console.error(
                "Erro ao carregar biografias:",
                erro
            );

        }
    );

}


// ======================================================
// CARD BIOGRAFIA
// ======================================================

function criarCardBiografia(biografia) {

    const card =
        document.createElement("article");


    card.className =
        "card-biografia";


    let previa =
        biografia.texto || "";


    if (previa.length > 180) {

        previa =
            previa.substring(0, 180) +
            "...";

    }


    card.innerHTML = `

        <div class="biografia-imagem">

            <img
                src="${biografia.imagem}"
                alt="${escaparHTML(
                    biografia.nome ||
                    "Pessoa"
                )}"
            >

        </div>


        <div class="biografia-info">

            <h3>
                ${escaparHTML(
                    biografia.nome ||
                    "Nome não informado"
                )}
            </h3>


            <h4>
                ${escaparHTML(
                    biografia.titulo ||
                    ""
                )}
            </h4>


            <p>
                ${escaparHTML(previa)}
            </p>


            <button
                class="btn-ler-biografia"
                type="button"
            >
                Ler biografia →
            </button>

        </div>

    `;


    card
        .querySelector(
            ".btn-ler-biografia"
        )
        .addEventListener(
            "click",
            () => {
                abrirBiografia(biografia);
            }
        );


    listaBiografias.appendChild(card);

}


// ======================================================
// ABRIR BIOGRAFIA
// ======================================================

function abrirBiografia(biografia) {

    const conteudo =
        document.getElementById(
            "conteudoBiografia"
        );


    if (!conteudo) {
        return;
    }


    conteudo.innerHTML = `

        <img
            class="imagem-biografia-leitura"
            src="${biografia.imagem}"
            alt="${escaparHTML(
                biografia.nome ||
                "Pessoa"
            )}"
        >


        <h2 class="titulo-biografia">
            ${escaparHTML(
                biografia.nome ||
                "Sem nome"
            )}
        </h2>


        <h3 class="subtitulo-biografia">
            ${escaparHTML(
                biografia.titulo ||
                ""
            )}
        </h3>


        <div class="texto-biografia">
            ${escaparHTML(
                biografia.texto ||
                ""
            )}
        </div>


        <p class="autor-redacao">

            <strong>
                Autor:
            </strong>

            ${escaparHTML(
                biografia.autor ||
                "Desconhecido"
            )}

        </p>

    `;


    abrirModal(
        modalLeituraBiografia
    );

}


// ======================================================
// PROTEGER HTML
// ======================================================

function escaparHTML(texto) {

    const div =
        document.createElement("div");


    div.textContent =
        texto;


    return div.innerHTML;

}


// ======================================================
// CARROSSEL DE VÍDEOS
// ======================================================

const videosSociologia = [

    {
        titulo: "Juliane Furno",
        alunos: "Ketelyn, Gabrielly e Sebastian",
        descricao:
            "Trabalho produzido pelos alunos sobre Juliane Furno.",
        url:
            "https://youtu.be/GoNvmioRuOs?si=aPJPedRUYcT9juIk"
    },

    {
        titulo: "Eliane Potiguara",
        alunos:
            "Samuel, Rafael, Isabela Guth e Lucas",
        descricao:
            "Trabalho produzido pelos alunos sobre Eliane Potiguara.",
        url:
            "https://youtu.be/skVPiTBKRW0?si=OXmm8FUkepHFFdN3"
    },

    {
        titulo: "Natalia Pasternak",
        alunos:
            "Vitor Pasternakk, David e Caio",
        descricao:
            "Trabalho produzido pelos alunos sobre Natalia Pasternak.",
        url:
            "https://youtu.be/nDhLE-SJPZY?si=zAr1rCiylk5O2OSZ"
    },

    {
        titulo: "Leandro Karnal",
        alunos:
            "Brendha, Julia Balan e Luiz Eduardo",
        descricao:
            "Trabalho produzido pelos alunos sobre Leandro Karnal.",
        url:
            "https://youtu.be/0X72ycTla_8?si=nH5S2qVUG-nZbqyN"
    },

    {
        titulo: "Marielle Franco",
        alunos:
            "Alicia, Guilherme Bueno e Vitor Livina",
        descricao:
            "Trabalho produzido pelos alunos sobre Marielle Franco.",
        url:
            "https://youtu.be/N3mLERzPAlM?si=ULsBpA4I8SH2RHvA"
    }

];


// ======================================================
// ELEMENTOS DO CARROSSEL DE VÍDEOS
// ======================================================

const carrosselVideosTrack =
    document.getElementById(
        "carrosselVideosTrack"
    );

const carrosselVideosIndicadores =
    document.getElementById(
        "carrosselVideosIndicadores"
    );

const btnVideoAnterior =
    document.getElementById(
        "btnVideoAnterior"
    );

const btnVideoProximo =
    document.getElementById(
        "btnVideoProximo"
    );


let indiceVideoAtual = 0;


// ======================================================
// CRIAR CARROSSEL DE VÍDEOS
// ======================================================

function criarCarrosselVideos() {

    if (
        !carrosselVideosTrack ||
        !carrosselVideosIndicadores ||
        !btnVideoAnterior ||
        !btnVideoProximo
    ) {

        return;

    }


    carrosselVideosTrack.innerHTML = "";

    carrosselVideosIndicadores.innerHTML = "";


    videosSociologia.forEach(
        (video, indice) => {

            const slide =
                document.createElement("article");


            slide.className =
                "carrossel-slide";


            slide.innerHTML = `

                <div class="card-video">

                    <div class="card-video-topo">

                        <span class="card-video-numero">
                            VÍDEO ${String(
                                indice + 1
                            ).padStart(2, "0")}
                        </span>

                    </div>


                    <div class="card-video-conteudo">

                        <span class="card-video-label">
                            TRABALHO DA TURMA
                        </span>


                        <h3>
                            ${escaparHTML(
                                video.titulo
                            )}
                        </h3>


                        <p class="card-video-alunos">
                            ${escaparHTML(
                                video.alunos
                            )}
                        </p>


                        <div class="card-video-linha">
                        </div>


                        <p class="card-video-descricao">
                            ${escaparHTML(
                                video.descricao
                            )}
                        </p>


                        <a
                            href="${video.url}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="video-youtube"
                        >

                            <span>▶</span>

                            Assistir no YouTube

                            <span>↗</span>

                        </a>

                    </div>

                </div>

            `;


            carrosselVideosTrack.appendChild(
                slide
            );


            // Indicador

            const indicador =
                document.createElement("button");


            indicador.type =
                "button";


            indicador.className =
                "carrossel-indicador";


            indicador.setAttribute(
                "aria-label",
                `Ir para o vídeo ${indice + 1}`
            );


            indicador.addEventListener(
                "click",
                () => {

                    indiceVideoAtual =
                        indice;

                    atualizarCarrosselVideos();

                }
            );


            carrosselVideosIndicadores.appendChild(
                indicador
            );

        }
    );


    atualizarCarrosselVideos();

}


// ======================================================
// ATUALIZAR CARROSSEL DE VÍDEOS
// ======================================================

function atualizarCarrosselVideos() {

    if (!carrosselVideosTrack) {
        return;
    }


    carrosselVideosTrack.style.transform =
        `translateX(-${indiceVideoAtual * 100}%)`;


    const indicadores =
        carrosselVideosIndicadores?.querySelectorAll(
            ".carrossel-indicador"
        );


    indicadores?.forEach(
        (indicador, indice) => {

            indicador.classList.toggle(
                "ativo",
                indice === indiceVideoAtual
            );

        }
    );


    if (btnVideoAnterior) {

        btnVideoAnterior.disabled =
            indiceVideoAtual === 0;

    }


    if (btnVideoProximo) {

        btnVideoProximo.disabled =
            indiceVideoAtual ===
            videosSociologia.length - 1;

    }

}


// ======================================================
// VÍDEO ANTERIOR
// ======================================================

btnVideoAnterior?.addEventListener(
    "click",
    () => {

        if (indiceVideoAtual > 0) {

            indiceVideoAtual--;

            atualizarCarrosselVideos();

        }

    }
);


// ======================================================
// PRÓXIMO VÍDEO
// ======================================================

btnVideoProximo?.addEventListener(
    "click",
    () => {

        if (
            indiceVideoAtual <
            videosSociologia.length - 1
        ) {

            indiceVideoAtual++;

            atualizarCarrosselVideos();

        }

    }
);


// ======================================================
// INICIAR CARROSSEL DE VÍDEOS
// ======================================================

criarCarrosselVideos();