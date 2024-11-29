var player = "X";
var numJog = 0;

function checkjogo(id) {
    var opt = verificaSrc(id);

    if (opt == "transp.png") {
        document.getElementById(id).src = "img/" + (player === "X" ? "sol.gif" : "lua.gif");
        numJog++;

        limparVencedores();

        if (wincheck()) {
            document.getElementById('resultado').innerHTML = "Fim de jogo! " + player + " venceu!";
            return false;
        }

        if (numJog >= 9) {
            document.getElementById('resultado').innerHTML = "Fim de jogo! Deu Velha!";
            return false;
        }

        player = (player == "X") ? "O" : "X";

        if (document.getElementById('cpu').checked && player == "O") {
            setTimeout(() => checkjogo(jogoDoPc()), 500);
        }
    }
}

function verificaSrc(id) {
    var file = document.getElementById(id).src;
    return file.substring(file.length - 10, file.length);
}

function wincheck() {
    var vencedor = false;

    if (verificaSrc('c1') == verificaSrc('c2') && verificaSrc('c1') == verificaSrc('c3') && verificaSrc('c1') != "transp.png") {
        marcarVencedor(['c1', 'c2', 'c3']);
        vencedor = true;
    } else if (verificaSrc('c4') == verificaSrc('c5') && verificaSrc('c4') == verificaSrc('c6') && verificaSrc('c4') != "transp.png") {
        marcarVencedor(['c4', 'c5', 'c6']);
        vencedor = true;
    } else if (verificaSrc('c7') == verificaSrc('c8') && verificaSrc('c7') == verificaSrc('c9') && verificaSrc('c7') != "transp.png") {
        marcarVencedor(['c7', 'c8', 'c9']);
        vencedor = true;
    } else if (verificaSrc('c1') == verificaSrc('c4') && verificaSrc('c1') == verificaSrc('c7') && verificaSrc('c1') != "transp.png") {
        marcarVencedor(['c1', 'c4', 'c7']);
        vencedor = true;
    } else if (verificaSrc('c2') == verificaSrc('c5') && verificaSrc('c2') == verificaSrc('c8') && verificaSrc('c2') != "transp.png") {
        marcarVencedor(['c2', 'c5', 'c8']);
        vencedor = true;
    } else if (verificaSrc('c3') == verificaSrc('c6') && verificaSrc('c3') == verificaSrc('c9') && verificaSrc('c3') != "transp.png") {
        marcarVencedor(['c3', 'c6', 'c9']);
        vencedor = true;
    } else if (verificaSrc('c1') == verificaSrc('c5') && verificaSrc('c1') == verificaSrc('c9') && verificaSrc('c1') != "transp.png") {
        marcarVencedor(['c1', 'c5', 'c9']);
        vencedor = true;
    } else if (verificaSrc('c3') == verificaSrc('c5') && verificaSrc('c3') == verificaSrc('c7') && verificaSrc('c3') != "transp.png") {
        marcarVencedor(['c3', 'c5', 'c7']);
        vencedor = true;
    }

    return vencedor;
}

function marcarVencedor(casas) {
    casas.forEach(function(casa) {
        document.getElementById(casa).classList.add('vencedor');
    });
}

function limparVencedores() {
    var celulas = document.querySelectorAll('td');
    celulas.forEach(function(celula) {
        celula.classList.remove('vencedor');
    });
}

function jogoDoPc() {
    const dificuldade = document.getElementById('dificuldade').value;

    if (dificuldade === "facil") {
        return jogadaAleatoria();
    } else if (dificuldade === "medio") {
        return jogadaMedia();
    } else if (dificuldade === "dificil") {
        return jogadaMinimax();
    }
}

function jogadaAleatoria() {
    let casa;
    do {
        casa = 'c' + Math.floor((Math.random() * 9) + 1);
    } while (verificaSrc(casa) !== "transp.png");
    return casa;
}

function jogadaMedia() {
    const possibilidades = [
        ['c1', 'c2', 'c3'], ['c4', 'c5', 'c6'], ['c7', 'c8', 'c9'], // Horizontais
        ['c1', 'c4', 'c7'], ['c2', 'c5', 'c8'], ['c3', 'c6', 'c9'], // Verticais
        ['c1', 'c5', 'c9'], ['c3', 'c5', 'c7']                     // Diagonais
    ];

    for (const linha of possibilidades) {
        const [a, b, c] = linha;
        if (verificaSrc(a) === verificaSrc(b) && verificaSrc(a) === "sol.gif" && verificaSrc(c) === "transp.png") {
            return c;
        }
        if (verificaSrc(a) === verificaSrc(c) && verificaSrc(a) === "sol.gif" && verificaSrc(b) === "transp.png") {
            return b;
        }
        if (verificaSrc(b) === verificaSrc(c) && verificaSrc(b) === "sol.gif" && verificaSrc(a) === "transp.png") {
            return a;
        }
    }

    return jogadaAleatoria();
}

function jogadaMinimax() {
    const tabuleiro = Array.from({ length: 9 }, (_, i) => verificaSrc('c' + (i + 1)));
    const melhorMovimento = minimax(tabuleiro, "lua.gif").index; // CPU é lua.gif
    return 'c' + (melhorMovimento + 1);
}

function minimax(tabuleiro, jogadorAtual) {
    const jogadorHumano = "sol.gif"; // Jogador humano é o sol
    const jogadorCPU = "lua.gif"; // CPU é a lua

    // Encontra todas as casas livres
    const casasLivres = tabuleiro
        .map((val, i) => (val === "transp.png" ? i : null))
        .filter(i => i !== null);

    // Verifica condições de vitória ou empate
    if (verificaVitoria(tabuleiro, jogadorHumano)) return { score: -10 };
    if (verificaVitoria(tabuleiro, jogadorCPU)) return { score: 10 };
    if (casasLivres.length === 0) return { score: 0 }; // Empate

    // Movimentos possíveis
    const movimentos = [];

    for (const index of casasLivres) {
        const movimento = { index };
        tabuleiro[index] = jogadorAtual;

        if (jogadorAtual === jogadorCPU) {
            // Maximiza a pontuação para a CPU
            movimento.score = minimax(tabuleiro, jogadorHumano).score;
        } else {
            // Minimiza a pontuação para o jogador humano
            movimento.score = minimax(tabuleiro, jogadorCPU).score;
        }

        tabuleiro[index] = "transp.png"; // Reverte a jogada
        movimentos.push(movimento);
    }

    // Escolhe o melhor movimento baseado no jogador atual
    let melhorMovimento;
    if (jogadorAtual === jogadorCPU) {
        // CPU quer maximizar
        let melhorScore = -Infinity;
        movimentos.forEach(mov => {
            if (mov.score > melhorScore) {
                melhorScore = mov.score;
                melhorMovimento = mov;
            }
        });
    } else {
        // Jogador humano quer minimizar
        let melhorScore = Infinity;
        movimentos.forEach(mov => {
            if (mov.score < melhorScore) {
                melhorScore = mov.score;
                melhorMovimento = mov;
            }
        });
    }

    return melhorMovimento;
}

function verificaVitoria(tabuleiro, jogador) {
    const possibilidades = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];
    return possibilidades.some(combinacao =>
        combinacao.every(index => tabuleiro[index] === jogador)
    );
}


function resetarJogo() {
    var imagens = document.querySelectorAll('img');
    imagens.forEach(function(img) {
        img.src = "img/transp.png";
    });
    limparVencedores();
    document.getElementById('resultado').innerHTML = "";
    player = "X";
    numJog = 0;
}

function mostrarDificuldade() {
    document.getElementById('dificuldade-container').style.display = 'block';
}

function esconderDificuldade() {
    document.getElementById('dificuldade-container').style.display = 'none';
}


