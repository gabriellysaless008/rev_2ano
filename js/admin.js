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

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


// ======================================================
// FIREBASE
// ======================================================

const db = getFirestore(app);

const storage = getStorage(app);

const auth = getAuth(app);


// ======================================================
// ELEMENTOS
// ======================================================

const telaLogin =
    document.getElementById("telaLogin");

const painelAdmin =
    document.getElementById("painelAdmin");

const formLogin =
    document.getElementById("formLogin");

const erroLogin =
    document.getElementById("erroLogin");

const btnSair =
    document.getElementById("btnSair");

const formTrabalho =
    document.getElementById("formTrabalho");

const listaTrabalhos =
    document.getElementById("listaTrabalhos");

const mensagemCadastro =
    document.getElementById("mensagemCadastro");


// ======================================================
// VERIFICAR LOGIN
// ======================================================

onAuthStateChanged(
    auth,
    (usuario) => {

        if (usuario) {

            telaLogin.style.display =
                "none";

            painelAdmin.style.display =
                "block";

            carregarTrabalhos();

        } else {

            telaLogin.style.display =
                "flex";

            painelAdmin.style.display =
                "none";

        }

    }
);


// ======================================================
// LOGIN
// ======================================================

formLogin?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("emailLogin")
                .value
                .trim();


        const senha =
            document
                .getElementById("senhaLogin")
                .value;


        erroLogin.textContent =
            "Entrando...";


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                senha
            );


            erroLogin.textContent =
                "";


        } catch (erro) {

            console.error(
                "Erro no login:",
                erro
            );


            erroLogin.textContent =
                "Email ou senha incorretos.";

        }

    }
);


// ======================================================
// SAIR
// ======================================================

btnSair?.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

        } catch (erro) {

            console.error(
                "Erro ao sair:",
                erro
            );

        }

    }
);


// ======================================================
// CADASTRAR TRABALHO
// ======================================================

formTrabalho?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const alunos =
            document
                .getElementById("alunos")
                .value
                .trim();


        const titulo =
            document
                .getElementById("tituloTrabalho")
                .value
                .trim();


        const descricao =
            document
                .getElementById("descricaoTrabalho")
                .value
                .trim();


        const imagem =
            document
                .getElementById("imagemTrabalho")
                .files[0];


        if (
            !alunos ||
            !titulo ||
            !descricao ||
            !imagem
        ) {

            mostrarMensagem(
                "Preencha todos os campos.",
                "erro"
            );

            return;

        }


        if (
            !imagem.type.startsWith("image/")
        ) {

            mostrarMensagem(
                "Selecione uma imagem válida.",
                "erro"
            );

            return;

        }


        const botao =
            document.getElementById(
                "btnCadastrar"
            );


        botao.disabled = true;

        botao.textContent =
            "Enviando...";


        try {

            // ==========================================
            // NOME DO ARQUIVO
            // ==========================================

            const nomeArquivo =
                `${Date.now()}_${imagem.name}`;


            // ==========================================
            // CAMINHO NO STORAGE
            // ==========================================

            const caminho =
                `trabalhos/${nomeArquivo}`;


            const imagemRef =
                ref(
                    storage,
                    caminho
                );


            // ==========================================
            // ENVIAR IMAGEM
            // ==========================================

            await uploadBytes(
                imagemRef,
                imagem
            );


            // ==========================================
            // PEGAR URL
            // ==========================================

            const urlImagem =
                await getDownloadURL(
                    imagemRef
                );


            // ==========================================
            // SALVAR NO FIRESTORE
            // ==========================================

            await addDoc(

                collection(
                    db,
                    "trabalhos"
                ),

                {

                    alunos,

                    titulo,

                    descricao,

                    imagem:
                        urlImagem,

                    nomeArquivo:
                        imagem.name,

                    materia:
                        "Literatura",

                    criadoEm:
                        serverTimestamp()

                }

            );


            formTrabalho.reset();


            mostrarMensagem(
                "Trabalho cadastrado com sucesso! ✓",
                "sucesso"
            );


        } catch (erro) {

            console.error(
                "Erro ao cadastrar trabalho:",
                erro
            );


            mostrarMensagem(
                "Não foi possível cadastrar o trabalho.",
                "erro"
            );

        } finally {

            botao.disabled = false;

            botao.textContent =
                "Cadastrar trabalho";

        }

    }
);


// ======================================================
// CARREGAR TRABALHOS
// ======================================================

function carregarTrabalhos() {

    if (!listaTrabalhos) {
        return;
    }


    const consulta = query(

        collection(
            db,
            "trabalhos"
        ),

        where(
            "materia",
            "==",
            "Literatura"
        )

    );


    onSnapshot(

        consulta,

        (snapshot) => {

            listaTrabalhos.innerHTML =
                "";


            if (snapshot.empty) {

                listaTrabalhos.innerHTML = `

                    <div class="lista-vazia">

                        <span>
                            ✦
                        </span>

                        <p>
                            Nenhum trabalho cadastrado ainda.
                        </p>

                    </div>

                `;

                return;

            }


            snapshot.forEach(
                (documento) => {

                    criarCardAdmin(
                        documento.data()
                    );

                }
            );

        },

        (erro) => {

            console.error(
                "Erro ao carregar trabalhos:",
                erro
            );

            listaTrabalhos.innerHTML = `

                <p class="mensagem-erro">
                    Não foi possível carregar os trabalhos.
                </p>

            `;

        }

    );

}


// ======================================================
// CARD DO ADMIN
// ======================================================

function criarCardAdmin(trabalho) {

    const card =
        document.createElement("article");


    card.className =
        "admin-trabalho";


    card.innerHTML = `

        <div class="admin-trabalho-imagem">

            <img
                src="${trabalho.imagem}"
                alt="Imagem do trabalho"
            >

        </div>


        <div class="admin-trabalho-info">

            <span>
                ${escaparHTML(
                    trabalho.alunos ||
                    "Aluno não informado"
                )}
            </span>


            <h3>
                ${escaparHTML(
                    trabalho.titulo ||
                    "Sem título"
                )}
            </h3>


            <p>
                ${escaparHTML(
                    trabalho.descricao ||
                    ""
                )}
            </p>

        </div>

    `;


    listaTrabalhos.appendChild(
        card
    );

}


// ======================================================
// MENSAGENS
// ======================================================

function mostrarMensagem(
    mensagem,
    tipo
) {

    mensagemCadastro.textContent =
        mensagem;


    mensagemCadastro.className =
        `mensagem-cadastro ${tipo}`;


    setTimeout(
        () => {

            mensagemCadastro.textContent =
                "";

        },
        4000
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