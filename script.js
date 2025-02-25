// Variáveis do jogo
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let telaInicial = document.getElementById('telaInicial');
let habilitarSomBtn = document.getElementById('habilitarSom');
let iniciarJogoBtn = document.getElementById('iniciarJogo');

let jogador = {
    x: 50,
    y: 0,
    largura: 110, // Aumentar o tamanho do jogador
    altura: 175, // Aumentar o tamanho do jogador
    velocidade: 0,
    gravidade: 0.5,
    pulosRestantes: 2
};
let obstaculos = [];
let velocidadeJogo = 3; // Aumentar a velocidade do jogo
let pontuacao = 0;
let imagemJogador = new Image();
let imagemObstaculo = new Image();
let imagemFundo = new Image();
let audioFundo = new Audio();
let jogoIniciado = false;
let somHabilitado = false;

let tempoAtual = 0; // Tempo atual em segundos
let faseAtual = 0; // Fase atual do loop (0 = 2 segundos, 1 = 3 segundos, etc.)
let obstaculosPorFase = [1, 2, 2, 1]; // Quantidade de obstáculos por fase
let tempoPorFase = [3000, 6000, 3500, 5000]; // Tempo por fase em milissegundos
let ultimaAdicao = Date.now(); // Marca o tempo da última adição de obstáculo

// Carregar imagens
imagemJogador.src = 'player.png';
imagemObstaculo.src = 'obstacle.png';
imagemFundo.src = 'background.png';

// Configurar áudio
audioFundo.src = 'sound.mp3';
audioFundo.loop = true;

// Eventos de carregamento de imagem
imagemJogador.onload = function() {
    console.log('Imagem do jogador carregada');
};
imagemJogador.onerror = function() {
    console.error('Erro ao carregar a imagem do jogador');
};

imagemObstaculo.onload = function() {
    console.log('Imagem do obstáculo carregada');
};
imagemObstaculo.onerror = function() {
    console.error('Erro ao carregar a imagem do obstáculo');
};

imagemFundo.onload = function() {
    console.log('Imagem do fundo carregada');
};
imagemFundo.onerror = function() {
    console.error('Erro ao carregar a imagem do fundo');
};

// Funções de desenho
function desenharFundo() {
    ctx.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height);
}

function desenharJogador() {
    ctx.drawImage(imagemJogador, jogador.x, jogador.y, jogador.largura, jogador.altura);
}

function desenharObstaculos() {
    for (let i = 0; i < obstaculos.length; i++) {
        ctx.drawImage(imagemObstaculo, obstaculos[i].x, obstaculos[i].y, obstaculos[i].largura, obstaculos[i].altura);
    }
}

// Função para adicionar obstáculos
function adicionarObstaculos() {
    tempoAtual = (Date.now() - ultimaAdicao) / 1000; // Calcula o tempo decorrido desde a última adição

    if (tempoAtual >= tempoPorFase[faseAtual] / 1000) {
        // Adicionar obstáculos da fase atual
        for (let i = 0; i < obstaculosPorFase[faseAtual]; i++) {
            obstaculos.push({
                x: canvas.width,
                y: canvas.height - 90, // Ajustar a altura dos obstáculos
                largura: 130, // Aumentar o tamanho dos obstáculos
                altura: 105 // Aumentar o tamanho dos obstáculos
            });
        }

        // Avançar para a próxima fase
        faseAtual = (faseAtual + 1) % obstaculosPorFase.length; // Loop infinito
        ultimaAdicao = Date.now(); // Resetar o tempo
    }
}

// Função para atualizar o jogo
function atualizarJogo() {
    if (!jogoIniciado) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharFundo();

    // Atualizar jogador
    jogador.velocidade += jogador.gravidade;
    jogador.y += jogador.velocidade;

    if (jogador.y + jogador.altura > canvas.height) {
        jogador.y = canvas.height - jogador.altura;
        jogador.velocidade = 0;
        jogador.pulosRestantes = 2; // Reiniciar pulos ao tocar o chão
    }

    desenharJogador();

    // Atualizar obstáculos
    for (let i = obstaculos.length - 1; i >= 0; i--) {
        obstaculos[i].x -= velocidadeJogo;

        if (obstaculos[i].x < -obstaculos[i].largura) {
            obstaculos.splice(i, 1);
        }
    }

    desenharObstaculos();

    // Verificar colisões
    for (let i = 0; i < obstaculos.length; i++) {
        if (verificarColisao(jogador, obstaculos[i])) {
            alert('Game Over!');
            reiniciarJogo();
        }
    }

    // Adicionar novos obstáculos com base no tempo
    adicionarObstaculos();

    // Atualizar pontuação
    pontuacao++;
    document.title = `Pontuação: ${pontuacao}`;

    requestAnimationFrame(atualizarJogo);
}

// Função para verificar colisões
function verificarColisao(obj1, obj2) {
    if (obj1.x + obj1.largura > obj2.x &&
        obj1.x < obj2.x + obj2.largura &&
        obj1.y + obj1.altura > obj2.y &&
        obj1.y < obj2.y + obj2.altura) {
        return true;
    }
    return false;
}

// Eventos de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp') {
        if (jogador.pulosRestantes > 0) {
            jogador.velocidade = -12; // Aumentar a força do pulo
            jogador.pulosRestantes--;
        }
    } else if (e.key === 'ArrowDown') {
        // Agachar (não implementado aqui)
    }
});

// Funções de controle do jogo
function iniciarJogo() {
    jogoIniciado = true;
    telaInicial.style.display = 'none';
    canvas.style.display = 'block';
    jogador.y = canvas.height - jogador.altura;
    ultimaAdicao = Date.now(); // Resetar o tempo
    atualizarJogo();
    if (somHabilitado) {
        audioFundo.play();
    }
}

function habilitarSom() {
    somHabilitado = true;
    audioFundo.play();
}

function reiniciarJogo() {
    jogoIniciado = false;
    obstaculos = [];
    pontuacao = 0;
    jogador.pulosRestantes = 2;
    telaInicial.style.display = 'block';
    canvas.style.display = 'none';
    audioFundo.pause();
    audioFundo.currentTime = 0;
}

// Event listeners para os botões
habilitarSomBtn.addEventListener('click', habilitarSom);
iniciarJogoBtn.addEventListener('click', iniciarJogo);
