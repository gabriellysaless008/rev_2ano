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

const db =
    getFirestore(app);


const storage =
    getStorage(app);



// ======================================================
// IDENTIFICAR MATÉRIA
// ======================================================

const paginas = {

    "tema2.html": "Sociologia",

    "tema3.html": "Literatura"

};


const paginaAtual =
    window.location.pathname
        .split("/")
        .pop();


const materia =
    paginas[paginaAtual];



if (!materia) {

    console.log(
        "Página inicial. Nenhuma matéria selecionada."
    );


} else {

    console.log(
        "Matéria atual:",
        materia
    );



    // ======================================================
    // ELEMENTOS
    // ======================================================

    const btnNovaRedacao =
        document.getElementById(
            "btnNovaRedacao"
        );


    const btnNovoPodcast =
        document.getElementById(
            "btnNovoPodcast"
        );


    const btnNovaBiografia =
        document.getElementById(
            "btnNovaBiografia"
        );



    const modalRedacao =
        document.getElementById(
            "modalRedacao"
        );


    const modalPodcast =
        document.getElementById(
            "modalPodcast"
        );


    const modalBiografia =
        document.getElementById(
            "modalBiografia"
        );


    const modalLeitura =
        document.getElementById(
            "modalLeitura"
        );


    const modalLeituraBiografia =
        document.getElementById(
            "modalLeituraBiografia"
        );



    const listaRedacoes =
        document.getElementById(
            "listaRedacoes"
        );


    const listaPodcasts =
        document.getElementById(
            "listaPodcasts"
        );


    const listaBiografias =
        document.getElementById(
            "listaBiografias"
        );



    // ======================================================
    // ELEMENTOS DO CARROSSEL DE REDAÇÕES
    // ======================================================

    const carrosselTrack =
        document.getElementById(
            "carrosselTrack"
        );


    const carrosselIndicadores =
        document.getElementById(
            "carrosselIndicadores"
        );


    const btnAnterior =
        document.getElementById(
            "btnAnterior"
        );


    const btnProximo =
        document.getElementById(
            "btnProximo"
        );


    let redacoesCarrossel = [];


    let indiceAtual = 0;



    // ======================================================
    // MODAIS
    // ======================================================

    function abrirModal(modal) {

        if (modal) {

            modal.style.display =
                "flex";

        }

    }



    function fecharModal(modal) {

        if (modal) {

            modal.style.display =
                "none";

        }

    }



    // ======================================================
    // BOTÕES
    // ======================================================

    if (btnNovaRedacao) {

        btnNovaRedacao.addEventListener(

            "click",

            () =>
                abrirModal(
                    modalRedacao
                )

        );

    }



    if (btnNovoPodcast) {

        btnNovoPodcast.addEventListener(

            "click",

            () =>
                abrirModal(
                    modalPodcast
                )

        );

    }



    if (btnNovaBiografia) {

        btnNovaBiografia.addEventListener(

            "click",

            () =>
                abrirModal(
                    modalBiografia
                )

        );

    }



    // ======================================================
    // FECHAR MODAIS
    // ======================================================

    document
        .getElementById("fecharModal")
        ?.addEventListener(

            "click",

            () =>
                fecharModal(
                    modalRedacao
                )

        );



    document
        .getElementById("fecharPodcast")
        ?.addEventListener(

            "click",

            () =>
                fecharModal(
                    modalPodcast
                )

        );



    document
        .getElementById("fecharBiografia")
        ?.addEventListener(

            "click",

            () =>
                fecharModal(
                    modalBiografia
                )

        );



    document
        .getElementById("fecharLeitura")
        ?.addEventListener(

            "click",

            () =>
                fecharModal(
                    modalLeitura
                )

        );



    document
        .getElementById("fecharLeituraBiografia")
        ?.addEventListener(

            "click",

            () =>
                fecharModal(
                    modalLeituraBiografia
                )

        );



    // ======================================================
    // FECHAR AO CLICAR FORA
    // ======================================================

    window.addEventListener(

        "click",

        (event) => {

            if (
                event.target.classList.contains(
                    "literatura-modal"
                )
            ) {

                fecharModal(
                    event.target
                );

            }

        }

    );



    // ======================================================
    // REDAÇÕES
    // ======================================================

    const formRedacao =
        document.getElementById(
            "formRedacao"
        );



    if (formRedacao) {

        formRedacao.addEventListener(

            "submit",

            async (event) => {

                event.preventDefault();


                const autor =
                    document
                        .getElementById("autor")
                        .value
                        .trim();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const titulo =
                    document
                        .getElementById("titulo")
                        .value
                        .trim();


                const texto =
                    document
                        .getElementById("texto")
                        .value
                        .trim();



                if (

                    !autor ||
                    !email ||
                    !titulo ||
                    !texto

                ) {

                    alert(
                        "Preencha todos os campos."
                    );

                    return;

                }



                const botao =
                    formRedacao.querySelector(
                        "button[type='submit']"
                    );


                botao.disabled =
                    true;


                botao.textContent =
                    "Enviando...";



                try {

                    await addDoc(

                        collection(
                            db,
                            "redacoes"
                        ),

                        {

                            autor,

                            email,

                            titulo,

                            texto,

                            materia,

                            criadoEm:
                                serverTimestamp()

                        }

                    );


                    formRedacao.reset();


                    fecharModal(
                        modalRedacao
                    );


                    alert(
                        "Redação enviada com sucesso!"
                    );


                } catch (erro) {

                    console.error(

                        "Erro ao salvar redação:",

                        erro

                    );


                    alert(
                        "Não foi possível enviar a redação."
                    );


                } finally {

                    botao.disabled =
                        false;


                    botao.textContent =
                        "Enviar Redação";

                }

            }

        );

    }



    // ======================================================
    // CARREGAR REDAÇÕES
    // ======================================================

    if (listaRedacoes) {

        const consulta =

            query(

                collection(
                    db,
                    "redacoes"
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


                redacoesCarrossel = [];


                snapshot.forEach(

                    (documento) => {

                        redacoesCarrossel.push(

                            documento.data()

                        );

                    }

                );



                if (

                    redacoesCarrossel.length === 0

                ) {

                    if (carrosselTrack) {

                        carrosselTrack.innerHTML = `

                            <div class="empty-state">

                                <span class="empty-icon">
                                    ✦
                                </span>

                                <p>
                                    Ainda não existem redações em ${materia}.
                                </p>

                            </div>

                        `;

                    }


                    if (carrosselIndicadores) {

                        carrosselIndicadores.innerHTML =
                            "";

                    }


                    if (btnAnterior) {

                        btnAnterior.disabled =
                            true;

                    }


                    if (btnProximo) {

                        btnProximo.disabled =
                            true;

                    }


                    return;

                }


                indiceAtual = 0;


                criarCarrosselRedacoes();

            },


            (erro) => {

                console.error(

                    "Erro ao carregar redações:",

                    erro

                );

            }

        );

    }



    // ======================================================
    // CRIAR CARROSSEL DE REDAÇÕES
    // ======================================================

    function criarCarrosselRedacoes() {

        if (

            !carrosselTrack ||
            !carrosselIndicadores

        ) {

            return;

        }


        carrosselTrack.innerHTML =
            "";


        carrosselIndicadores.innerHTML =
            "";



        redacoesCarrossel.forEach(

            (redacao, indice) => {


                const slide =
                    document.createElement(
                        "article"
                    );


                slide.className =
                    "card-redacao carrossel-slide";



                let previa =
                    redacao.texto || "";



                if (

                    previa.length > 280

                ) {

                    previa =

                        previa.substring(
                            0,
                            280
                        )

                        + "...";

                }



                let dataFormatada =
                    "Data não disponível";



                if (redacao.criadoEm) {

                    dataFormatada =

                        redacao.criadoEm
                            .toDate()
                            .toLocaleDateString(
                                "pt-BR"
                            );

                }



                slide.innerHTML = `

                    <div class="redacao-numero">

                        ${String(
                            indice + 1
                        ).padStart(2, "0")}

                    </div>


                    <div class="redacao-conteudo">


                        <span class="redacao-label">

                            REDAÇÃO DA TURMA

                        </span>


                        <h3>

                            ${escaparHTML(

                                redacao.titulo ||

                                "Sem título"

                            )}

                        </h3>


                        <p class="card-autor">

                            Por

                            <strong>

                                ${escaparHTML(

                                    redacao.autor ||

                                    "Autor desconhecido"

                                )}

                            </strong>

                        </p>


                        <div class="linha-redacao"></div>


                        <p class="card-preview">

                            ${escaparHTML(
                                previa
                            )}

                        </p>


                        <div class="redacao-rodape">


                            <span class="card-data">

                                ${dataFormatada}

                            </span>


                            <button

                                class="btn-ler"

                                type="button"

                            >

                                Ler redação →

                            </button>


                        </div>


                    </div>

                `;



                slide
                    .querySelector(".btn-ler")
                    .addEventListener(

                        "click",

                        () =>
                            abrirRedacao(
                                redacao
                            )

                    );



                carrosselTrack.appendChild(
                    slide
                );



                const indicador =
                    document.createElement(
                        "button"
                    );


                indicador.className =
                    "carrossel-indicador";


                indicador.type =
                    "button";


                indicador.setAttribute(

                    "aria-label",

                    `Ir para redação ${indice + 1}`

                );



                indicador.addEventListener(

                    "click",

                    () => {

                        indiceAtual =
                            indice;


                        atualizarCarrossel();

                    }

                );



                carrosselIndicadores.appendChild(
                    indicador
                );

            }

        );



        if (btnAnterior) {

            btnAnterior.disabled =

                redacoesCarrossel.length <= 1;

        }



        if (btnProximo) {

            btnProximo.disabled =

                redacoesCarrossel.length <= 1;

        }



        atualizarCarrossel();

    }



    // ======================================================
    // ATUALIZAR CARROSSEL DE REDAÇÕES
    // ======================================================

    function atualizarCarrossel() {

        if (

            !redacoesCarrossel.length ||
            !carrosselTrack

        ) {

            return;

        }



        carrosselTrack.style.transform =

            `translateX(
                -${indiceAtual * 100}%
            )`;



        const indicadores =

            document.querySelectorAll(
                ".carrossel-indicador"
            );



        indicadores.forEach(

            (indicador, indice) => {

                indicador.classList.toggle(

                    "ativo",

                    indice === indiceAtual

                );

            }

        );



        if (btnAnterior) {

            btnAnterior.disabled =

                indiceAtual === 0;

        }



        if (btnProximo) {

            btnProximo.disabled =

                indiceAtual ===
                redacoesCarrossel.length - 1;

        }

    }



    // ======================================================
    // BOTÃO ANTERIOR
    // ======================================================

    btnAnterior?.addEventListener(

        "click",

        () => {

            if (indiceAtual > 0) {

                indiceAtual--;


                atualizarCarrossel();

            }

        }

    );



    // ======================================================
    // BOTÃO PRÓXIMO
    // ======================================================

    btnProximo?.addEventListener(

        "click",

        () => {

            if (

                indiceAtual <
                redacoesCarrossel.length - 1

            ) {

                indiceAtual++;


                atualizarCarrossel();

            }

        }

    );



    // ======================================================
    // ABRIR REDAÇÃO
    // ======================================================

    function abrirRedacao(redacao) {

        document
            .getElementById(
                "tituloRedacao"
            )
            .textContent =

                redacao.titulo ||

                "Sem título";



        document
            .getElementById(
                "textoRedacao"
            )
            .textContent =

                redacao.texto ||

                "";



        document
            .getElementById(
                "autorRedacao"
            )
            .textContent =

                `Autor: ${

                    redacao.autor ||

                    "Desconhecido"

                }`;



        abrirModal(
            modalLeitura
        );

    }



    // ======================================================
    // ======================================================
    // TRABALHOS DA TURMA
    // ======================================================
    // ======================================================

    const trabalhosTrack =
        document.getElementById(
            "trabalhosTrack"
        );


    const trabalhosIndicadores =
        document.getElementById(
            "trabalhosIndicadores"
        );


    const btnTrabalhoAnterior =
        document.getElementById(
            "btnTrabalhoAnterior"
        );


    const btnTrabalhoProximo =
        document.getElementById(
            "btnTrabalhoProximo"
        );



    let trabalhos = [

        {
            titulo:
                "Análise de uma obra literária",

            alunos: [
                "nome1",
                "nome2",
                "nome3"
            ],

            imagem: null
        },


        {
            titulo:
                "Atividade de Literatura",

            alunos: [
                "Aluno 1",
                "Aluno 2"
            ],

            imagem: null
        },


        {
            titulo:
                "Projeto Literário",

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

        if (

            !trabalhosTrack ||
            !trabalhosIndicadores

        ) {

            return;

        }



        trabalhosTrack.innerHTML =
            "";


        trabalhosIndicadores.innerHTML =
            "";



        trabalhos.forEach(

            (trabalho, indice) => {


                const slide =
                    document.createElement(
                        "article"
                    );


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

                            alt="${escaparHTML(
                                trabalho.titulo
                            )}"

                        >

                    `;

                } else {

                    areaImagem = `

                        <div class="trabalho-placeholder">

                            <span>
                                ✦
                            </span>

                            <p>
                                Imagem do trabalho
                            </p>

                        </div>

                    `;

                }



                // ==================================================
                // ALUNOS
                // ==================================================

                const nomesAlunos =

                    trabalho.alunos

                        .map(

                            aluno =>
                                escaparHTML(
                                    aluno
                                )

                        )

                        .join(" • ");



                // ==================================================
                // SLIDE
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

                            ${escaparHTML(

                                trabalho.titulo

                            )}

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



                trabalhosTrack.appendChild(
                    slide
                );



                // ==================================================
                // INDICADOR
                // ==================================================

                const indicador =
                    document.createElement(
                        "button"
                    );


                indicador.type =
                    "button";


                indicador.className =
                    "trabalho-indicador";


                indicador.setAttribute(

                    "aria-label",

                    `Ir para o trabalho ${indice + 1}`

                );



                indicador.addEventListener(

                    "click",

                    () => {

                        trabalhoAtual =
                            indice;


                        atualizarCarrosselTrabalhos();

                    }

                );



                trabalhosIndicadores.appendChild(
                    indicador
                );

            }

        );



        atualizarCarrosselTrabalhos();

    }



    // ======================================================
    // ATUALIZAR CARROSSEL DE TRABALHOS
    // ======================================================

    function atualizarCarrosselTrabalhos() {

        if (

            !trabalhos.length ||
            !trabalhosTrack

        ) {

            return;

        }



        trabalhosTrack.style.transform =

            `translateX(
                -${trabalhoAtual * 100}%
            )`;



        const indicadores =

            document.querySelectorAll(
                ".trabalho-indicador"
            );



        indicadores.forEach(

            (indicador, indice) => {

                indicador.classList.toggle(

                    "ativo",

                    indice === trabalhoAtual

                );

            }

        );



        if (btnTrabalhoAnterior) {

            btnTrabalhoAnterior.disabled =

                trabalhoAtual === 0;

        }



        if (btnTrabalhoProximo) {

            btnTrabalhoProximo.disabled =

                trabalhoAtual ===
                trabalhos.length - 1;

        }

    }



    // ======================================================
    // TRABALHO ANTERIOR
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
    // PRÓXIMO TRABALHO
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
    // INICIAR CARROSSEL DE TRABALHOS
    // ======================================================

    criarCarrosselTrabalhos();



    // ======================================================
    // PODCASTS
    // ======================================================

    const formPodcast =
        document.getElementById(
            "formPodcast"
        );



    if (formPodcast) {

        formPodcast.addEventListener(

            "submit",

            async (event) => {

                event.preventDefault();


                const autor =
                    document
                        .getElementById(
                            "autorPodcast"
                        )
                        .value
                        .trim();


                const email =
                    document
                        .getElementById(
                            "emailPodcast"
                        )
                        .value
                        .trim();


                const titulo =
                    document
                        .getElementById(
                            "tituloPodcast"
                        )
                        .value
                        .trim();


                const descricao =
                    document
                        .getElementById(
                            "descricaoPodcast"
                        )
                        .value
                        .trim();


                const arquivo =
                    document
                        .getElementById(
                            "arquivoPodcast"
                        )
                        .files[0];



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

                    !arquivo.type.startsWith(
                        "audio/"
                    )

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


                botao.disabled =
                    true;


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

                    botao.disabled =
                        false;


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

                listaPodcasts.innerHTML =
                    "";


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
            document.createElement(
                "article"
            );


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


        listaPodcasts.appendChild(
            card
        );

    }



    // ======================================================
    // BIOGRAFIAS
    // ======================================================

    const formBiografia =
        document.getElementById(
            "formBiografia"
        );



    if (formBiografia) {

        formBiografia.addEventListener(

            "submit",

            async (event) => {

                event.preventDefault();


                const nome =
                    document
                        .getElementById(
                            "nomeBiografado"
                        )
                        .value
                        .trim();


                const autor =
                    document
                        .getElementById(
                            "autorBiografia"
                        )
                        .value
                        .trim();


                const email =
                    document
                        .getElementById(
                            "emailBiografia"
                        )
                        .value
                        .trim();


                const titulo =
                    document
                        .getElementById(
                            "tituloBiografia"
                        )
                        .value
                        .trim();


                const texto =
                    document
                        .getElementById(
                            "textoBiografia"
                        )
                        .value
                        .trim();


                const imagem =
                    document
                        .getElementById(
                            "imagemBiografia"
                        )
                        .files[0];



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

                    !imagem.type.startsWith(
                        "image/"
                    )

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


                botao.disabled =
                    true;


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

                    botao.disabled =
                        false;


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

                listaBiografias.innerHTML =
                    "";


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
            document.createElement(
                "article"
            );


        card.className =
            "card-biografia";


        let previa =
            biografia.texto || "";


        if (previa.length > 180) {

            previa =

                previa.substring(
                    0,
                    180
                )

                + "...";

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

                    ${escaparHTML(
                        previa
                    )}

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

                () =>
                    abrirBiografia(
                        biografia
                    )

            );



        listaBiografias.appendChild(
            card
        );

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
            document.createElement(
                "div"
            );


        div.textContent =
            texto;


        return div.innerHTML;

    }

}