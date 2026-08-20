// ======================================================
// ELEMENTOS
// ======================================================

const readme = document.getElementById("readme");
const music = document.getElementById("backgroundMusic");
const soundButton = document.getElementById("soundButton");

const DEFAULT_VOLUME = 0.05; // 12%

// ======================================================
// CARREGAR README
// ======================================================

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

        prepareSpecialBlocks();

    } catch (error) {
        console.error("Erro ao carregar README:", error);

        readme.innerHTML = `
            <p>Erro ao carregar o README.</p>
        `;
    }
}

loadReadme();


// ======================================================
// REMOVER ESPAÇOS EXTRAS NO INÍCIO DOS BLOCOS ASCII
// ======================================================

function trimSharedIndent(text) {
    let lines = text.replace(/\t/g, "    ").split("\n");

    while (lines.length && !lines[0].trim()) {
        lines.shift();
    }

    while (lines.length && !lines[lines.length - 1].trim()) {
        lines.pop();
    }

    const nonEmptyLines = lines.filter(line => line.trim().length > 0);

    if (!nonEmptyLines.length) {
        return lines.join("\n");
    }

    const minimumIndent = Math.min(
        ...nonEmptyLines.map(line => {
            const match = line.match(/^ */);
            return match ? match[0].length : 0;
        })
    );

    return lines
        .map(line => line.slice(Math.min(minimumIndent, line.length)))
        .join("\n");
}


// ======================================================
// DETECTAR E CENTRALIZAR BLOCOS ESPECIAIS
// ======================================================

function prepareSpecialBlocks() {
    const preBlocks = document.querySelectorAll("#readme pre");

    preBlocks.forEach(pre => {
        const code = pre.querySelector("code");
        if (!code) return;

        const cleaned = trimSharedIndent(code.textContent);
        code.textContent = cleaned;

        const text = cleaned.toUpperCase();

        // SIGNAL
        if (text.includes("MIDNIGHT CHANNEL")) {
            pre.classList.add("signal-code");
        }

        // BLOCO DO CÉU / ESTRELAS / LUA / LOST
        if (
            text.includes("LOST //") ||
            text.includes("BUT MOVING") ||
            text.includes("XM4TH3US")
        ) {
            pre.classList.add("sky-code");
        }
    });
}


// ======================================================
// BOTÃO DE SOM
// ======================================================

function updateSoundButton() {
    if (!soundButton || !music) return;

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
    if (!music) return false;

    try {
        music.volume = DEFAULT_VOLUME;
        music.muted = false;

        await music.play();

        updateSoundButton();
        return true;

    } catch (error) {
        console.log("Autoplay bloqueado pelo navegador.");
        updateSoundButton();
        return false;
    }
}


// ======================================================
// PAUSAR MÚSICA
// ======================================================

function pauseMusic() {
    if (!music) return;

    music.pause();
    updateSoundButton();
}


// ======================================================
// TENTAR AUTOPLAY AO ENTRAR
// ======================================================

window.addEventListener("load", async () => {
    if (!music) return;

    music.volume = DEFAULT_VOLUME;
    await playMusic();
});


// ======================================================
// SE AUTOPLAY FALHAR, PRIMEIRA INTERAÇÃO INICIA
// ======================================================

async function startMusicOnFirstInteraction(event) {
    if (
        soundButton &&
        event.target.closest("#soundButton")
    ) {
        return;
    }

    if (music && music.paused) {
        await playMusic();
    }

    removeFirstInteractionListeners();
}

async function startMusicOnFirstKey() {
    if (music && music.paused) {
        await playMusic();
    }

    removeFirstInteractionListeners();
}

function removeFirstInteractionListeners() {
    document.removeEventListener("pointerdown", startMusicOnFirstInteraction);
    document.removeEventListener("keydown", startMusicOnFirstKey);
}

document.addEventListener("pointerdown", startMusicOnFirstInteraction);
document.addEventListener("keydown", startMusicOnFirstKey);


// ======================================================
// CLIQUE NO BOTÃO SOUND
// ======================================================

if (soundButton) {
    soundButton.addEventListener("click", async (event) => {
        event.stopPropagation();

        if (!music) return;

        if (music.paused) {
            await playMusic();
        } else {
            pauseMusic();
        }
    });
}


// ======================================================
// MANTER BOTÃO SINCRONIZADO
// ======================================================

if (music) {
    music.addEventListener("play", updateSoundButton);
    music.addEventListener("pause", updateSoundButton);
    music.addEventListener("ended", updateSoundButton);
}

updateSoundButton();