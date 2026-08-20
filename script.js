// ======================================================
// README
// ======================================================

const readme = document.getElementById("readme");

async function loadReadme() {
    try {
        const response = await fetch("./README.md");

        if (!response.ok) {
            throw new Error(
                `Não foi possível carregar README.md (${response.status})`
            );
        }

        const markdown = await response.text();

        readme.innerHTML = marked.parse(markdown);

        // Corrige o alinhamento da seção SIGNAL
        fixSignal();

    } catch (error) {
        console.error("Erro ao carregar README:", error);

        readme.innerHTML = `
            <p>Erro ao carregar o README.</p>
        `;
    }
}

loadReadme();


// ======================================================
// SIGNAL - CENTRALIZA O ASCII
// ======================================================

function fixSignal() {

    const headings = [
        ...document.querySelectorAll(
            "#readme h1, #readme h2, #readme h3"
        )
    ];

    const signalHeading = headings.find(
        heading =>
            heading.textContent
                .toUpperCase()
                .includes("SIGNAL")
    );

    if (!signalHeading) {
        return;
    }

    let element = signalHeading.nextElementSibling;

    while (element) {

        // Para ao encontrar a próxima seção
        if (
            element.tagName === "H1" ||
            element.tagName === "H2" ||
            element.tagName === "H3"
        ) {
            break;
        }

        if (element.tagName === "PRE") {

            const code = element.querySelector("code");

            if (!code) {
                break;
            }

            const lines = code.textContent
                .replace(/\n$/, "")
                .split("\n");

            const validLines = lines.filter(
                line => line.trim().length > 0
            );

            if (validLines.length > 0) {

                const minimumIndent = Math.min(
                    ...validLines.map(line => {

                        const match = line.match(/^\s*/);

                        return match
                            ? match[0].length
                            : 0;
                    })
                );

                code.textContent = lines
                    .map(line =>
                        line.slice(minimumIndent)
                    )
                    .join("\n");
            }

            element.classList.add("signal-code");

            break;
        }

        element = element.nextElementSibling;
    }
}


// ======================================================
// BACKGROUND MUSIC
// ======================================================

const music =
    document.getElementById("backgroundMusic");

const soundButton =
    document.getElementById("soundButton");


// Volume padrão:
//
// 0.05 = 5%
// 0.10 = 10%
// 0.15 = 15%
// 0.20 = 20%
// 0.50 = 50%
// 1.00 = 100%

const DEFAULT_VOLUME = 0.20;


// Configuração inicial
music.volume = DEFAULT_VOLUME;
music.muted = false;


// ======================================================
// ATUALIZA TEXTO DO BOTÃO
// ======================================================

function updateSoundButton() {

    if (!soundButton) {
        return;
    }

    if (music.paused) {
        soundButton.textContent = "SOUND OFF";
    } else {
        soundButton.textContent = "SOUND ON";
    }
}


// ======================================================
// TOCAR MÚSICA
// ======================================================

async function playMusic() {

    try {

        // Garante que nunca comece em 100%
        music.volume = DEFAULT_VOLUME;

        music.muted = false;

        await music.play();

        updateSoundButton();

        return true;

    } catch (error) {

        console.log(
            "Autoplay bloqueado. Aguardando interação do usuário."
        );

        updateSoundButton();

        return false;
    }
}


// ======================================================
// PARAR MÚSICA
// ======================================================

function pauseMusic() {

    music.pause();

    updateSoundButton();
}


// ======================================================
// BOTÃO SOUND ON / OFF
// ======================================================

if (soundButton) {

    soundButton.addEventListener(
        "click",
        async event => {

            // Evita que o clique também seja interpretado
            // pelo listener global da página
            event.stopPropagation();

            if (music.paused) {

                await playMusic();

            } else {

                pauseMusic();
            }
        }
    );
}


// ======================================================
// TENTA AUTOPLAY ASSIM QUE O SITE ABRIR
// ======================================================

window.addEventListener(
    "load",
    async () => {

        music.volume = DEFAULT_VOLUME;

        const started =
            await playMusic();

        // Se autoplay foi bloqueado,
        // deixa o botão mostrando SOUND OFF.
        if (!started) {
            updateSoundButton();
        }
    }
);


// ======================================================
// PRIMEIRO CLIQUE EM QUALQUER LUGAR INICIA A MÚSICA
// ======================================================

async function startMusicOnInteraction(event) {

    // Se clicou no próprio botão de áudio,
    // o botão cuida da música.
    if (
        soundButton &&
        event.target.closest("#soundButton")
    ) {
        return;
    }

    if (music.paused) {

        await playMusic();
    }

    removeInteractionListeners();
}


// Também funciona caso a primeira interação
// seja pelo teclado.

async function startMusicOnKeyboard() {

    if (music.paused) {

        await playMusic();
    }

    removeInteractionListeners();
}


function removeInteractionListeners() {

    document.removeEventListener(
        "pointerdown",
        startMusicOnInteraction
    );

    document.removeEventListener(
        "keydown",
        startMusicOnKeyboard
    );
}


document.addEventListener(
    "pointerdown",
    startMusicOnInteraction
);

document.addEventListener(
    "keydown",
    startMusicOnKeyboard
);


// ======================================================
// MANTÉM BOTÃO SINCRONIZADO
// ======================================================

music.addEventListener(
    "play",
    updateSoundButton
);

music.addEventListener(
    "pause",
    updateSoundButton
);

music.addEventListener(
    "ended",
    updateSoundButton
);


updateSoundButton();