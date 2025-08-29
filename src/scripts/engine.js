const state = {
    // Armazena pontuações, elementos visuais e referências aos campos de cartas
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.getElementById("player-cards"),
        computer: "computer-cards",
        computerBOX: document.getElementById("computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons/";

// Dados das cartas, incluindo imagem, tipo e regras de vitória/derrota
const cardData = [
    { id: 0, name: "Blue Eyes White Dragon", type: "Paper", img: `${pathImages}dragon.png`, WinOf: [1], LoseOf: [2] },
    { id: 1, name: "Dark Magician", type: "Rock", img: `${pathImages}magician.png`, WinOf: [2], LoseOf: [0] },
    { id: 2, name: "Exodia", type: "Scissors", img: `${pathImages}exodia.png`, WinOf: [0], LoseOf: [1] }
];

// Retorna um ID de carta aleatório
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

// Cria a imagem da carta para o campo do jogador ou do computador
async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    // Se for carta do jogador, adiciona eventos de clique e hover
    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(Number(cardImage.getAttribute("data-id")));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(IdCard);
        });
    }

    return cardImage;
}

// Coloca as cartas selecionadas nos campos e verifica resultado do duelo
async function setCardsField(cardId) {
    await removeAllCardsImages();

    const computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    const duelResults = checkDuelResults(cardId, computerCardId);

    updateScore();      // Atualiza o placar
    drawButton(duelResults);  // Mostra botão de próximo duelo
}

// Verifica quem ganhou o duelo e atualiza pontuação
function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw";
    const playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "Win";
        state.score.playerScore++;
    } else if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Lose";
        state.score.computerScore++;
    }
    playAudio(duelResults);  // Toca som de vitória/derrota

    return duelResults;
}

// Atualiza o texto do placar na tela
function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose : ${state.score.computerScore}`;
}

// Exibe o botão para iniciar o próximo duelo
function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
    state.actions.button.onclick = resetDuel;
}

// Reinicia o duelo, limpando cartas e redesenhando o campo
function resetDuel() {
    state.actions.button.style.display = "none";
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
}

// Remove todas as imagens de cartas dos campos
async function removeAllCardsImages() {
    const { computerBOX, player1BOX } = state.playerSides;
    computerBOX.querySelectorAll("img").forEach(img => img.remove());
    player1BOX.querySelectorAll("img").forEach(img => img.remove());
}

// Atualiza o painel lateral mostrando detalhes da carta selecionada
function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

// Desenha várias cartas aleatórias no campo do jogador ou computador
async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

// Toca um som de vitória, derrota ou empate
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play();
}

// Inicializa o jogo, desenha as cartas e toca música de fundo
function init() {
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

// Inicia o jogo automaticamente ao carregar a página
init();
