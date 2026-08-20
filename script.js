const readme = document.getElementById("readme");

async function loadReadme() {

    try {

        const response = await fetch("./README.md");

        if (!response.ok) {
            throw new Error("Não foi possível carregar README.md");
        }

        const markdown = await response.text();

        readme.innerHTML = marked.parse(markdown);

    } catch (error) {

        readme.innerHTML = `
            <p>Erro ao carregar o README.</p>
        `;

        console.error(error);
    }

}

loadReadme();



const music = document.getElementById("backgroundMusic");
const soundButton = document.getElementById("soundButton");

music.volume = 0.20;

soundButton.addEventListener("click", async () => {

    try {

        if (music.paused) {

            await music.play();

            soundButton.textContent = "SOUND ON";

        } else {

            music.pause();

            soundButton.textContent = "SOUND OFF";

        }

    } catch (error) {

        console.error("Erro ao tocar música:", error);

        soundButton.textContent = "AUDIO ERROR";

    }

});
