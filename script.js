// ================= 1. المتغيرات والروابط =================
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const historyEl = document.getElementById('move-history');
const screens = {
    start: document.getElementById('start-screen'),
    gameOver: document.getElementById('game-over-screen')
};

const game = new Chess();
let selectedSquare = null;
let gameMode = 'PVC';
let lastMoveSquares = [];
let moveCount = 1;

// المؤقتات
let timers = { w: 600, b: 600 }; // الثواني
let timerInterval = null;

// الأصوات
const sfx = {
    move: new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3'),
    capture: new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3'),
    check: new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-check.mp3'),
    end: new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3')
};

const PIECES = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚', P: '♙', N: '♘', B: '♗', R: '♖', Q: '♕', K: '♔' };

// ================= 2. التهيئة والبدء =================
document.getElementById('btn-pvp').addEventListener('click', () => initGame('PVP'));
document.getElementById('btn-pvc').addEventListener('click', () => initGame('PVC'));

function initGame(mode) {
    gameMode = mode;
    const mins = parseInt(document.getElementById('time-input').value) || 10;
    timers = { w: mins * 60, b: mins * 60 };
    
    screens.start.classList.add('hidden');
    updateTimerDisplay();
    startClocks();
    renderBoard();
    updateStatus('بدأت المعركة - دور الأبيض');
}

// ================= 3. إدارة المؤقتات =================
function startClocks() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (game.game_over()) return clearInterval(timerInterval);
        const turn = game.turn();
        timers[turn]--;
        updateTimerDisplay();
        
        if (timers[turn] <= 0) {
            clearInterval(timerInterval);
            endGame(`نفد الوقت! انتصر السلطان ${turn === 'w' ? 'الأسود' : 'الأبيض'}`);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const format = (t) => `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;
    document.getElementById('timer-white').innerText = format(timers.w);
    document.getElementById('timer-black').innerText = format(timers.b);
}

// ================= 4. رسم الرقعة والواجهة =================
function renderBoard() {
    boardEl.innerHTML = '';
    const state = game.board();

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div');
            const file = String.fromCharCode(97 + c);
            const rank = 8 - r;
            const id = file + rank;
            
            sq.className = `square ${(r + c) % 2 === 0 ? 'white' : 'black'}`;
            if (id === selectedSquare) sq.classList.add('selected');
            if (lastMoveSquares.includes(id)) sq.classList.add('last-move');

            const piece = state[r][c];
            if (piece) {
                const pEl = document.createElement('span');
                pEl.className = 'piece';
                pEl.style.color = piece.color === 'w' ? '#fff' : '#000';
                pEl.innerText = PIECES[piece.color === 'w' ? piece.type.toUpperCase() : piece.type];
                sq.appendChild(pEl);
            }

            sq.addEventListener('click', () => handleSquareClick(id));
            boardEl.appendChild(sq);
        }
    }
    updateCapturedPieces();
}

function updateCapturedPieces() {
    const history = game.history({ verbose: true });
    let capW = '', capB = '';
    history.forEach(m => {
        if (m.captured) {
            const icon = PIECES[m.color === 'w' ? m.captured : m.captured.toUpperCase()];
            m.color === 'w' ? capW += icon : capB += icon;
        }
    });
    document.getElementById('captured-by-white').innerText = capW; // الأبيض يأكل الأسود
    document.getElementById('captured-by-black').innerText = capB; // الأسود يأكل الأبيض
}

function addMoveToHistory(move) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${moveCount}.</span> ${move.color === 'w' ? 'الأبيض' : 'الأسود'} نقل إلى ${move.to}`;
    historyEl.prepend(li);
    if (move.color === 'b') moveCount++;
}

// ================= 5. منطق اللعب والتفاعلات =================
function handleSquareClick(id) {
    if (game.game_over() || (gameMode === 'PVC' && game.turn() === 'b')) return;

    if (selectedSquare) {
        const move = game.move({ from: selectedSquare, to: id, promotion: 'q' });
        if (move) {
            processValidMove(move);
            if (gameMode === 'PVC' && !game.game_over()) {
                updateStatus('الذكاء الاصطناعي يخطط...');
                setTimeout(makeAIMove, 500);
            }
        } else {
            const p = game.get(id);
            selectedSquare = (p && p.color === game.turn()) ? id : null;
            renderBoard();
        }
    } else {
        const p = game.get(id);
        if (p && p.color === game.turn()) {
            selectedSquare = id;
            renderBoard();
        }
    }
}

function processValidMove(move) {
    lastMoveSquares = [move.from, move.to];
    selectedSquare = null;
    addMoveToHistory(move);
    triggerVFX(move);
    renderBoard();
    checkGameState();
}

function triggerVFX(move) {
    if (move.captured) {
        sfx.capture.play();
        boardEl.classList.remove('cinematic-shake');
        void boardEl.offsetWidth; 
        boardEl.classList.add('cinematic-shake');
    } else {
        sfx.move.play();
    }
}

// ================= 6. الذكاء الاصطناعي المتقدم =================
function evaluateBoard(board) {
    const values = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
    let score = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p) {
                const val = values[p.type];
                score += p.color === 'b' ? val : -val; // الأسود يسعى لتعظيم الرقم
            }
        }
    }
    return score;
}

function makeAIMove() {
    if (game.game_over()) return;
    const moves = game.moves({ verbose: true });
    
    // خوارزمية بحث (مبسطة لتقييم النقلة الحالية)
    let bestMove = null;
    let bestScore = -Infinity;

    moves.forEach(m => {
        game.move(m.san);
        // تقييم الرقعة بعد الحركة
        const score = evaluateBoard(game.board()) + (m.captured ? 5 : 0); // مكافأة على الأكل
        if (score > bestScore) {
            bestScore = score;
            bestMove = m;
        }
        game.undo(); // إرجاع النقلة الوهمية
    });

    if (!bestMove) bestMove = moves[Math.floor(Math.random() * moves.length)];
    
    const actualMove = game.move(bestMove.san);
    processValidMove(actualMove);
}

// ================= 7. حالات النهاية =================
function checkGameState() {
    if (game.game_over()) {
        sfx.end.play();
        clearInterval(timerInterval);
        if (game.in_checkmate()) endGame(`انتصر ${game.turn() === 'w' ? 'الأسود' : 'الأبيض'} بكش ملك!`);
        else if (game.in_draw()) endGame("انتهت المعركة بالتعادل (هدنة).");
        else endGame("انتهت اللعبة!");
    } else if (game.in_check()) {
        sfx.check.play();
        updateStatus("⚠️ السلطان في خطر (كش) ⚠️");
    } else {
        updateStatus(`دور السلطان ${game.turn() === 'w' ? 'الأبيض' : 'الأسود'}`);
    }
}

function updateStatus(msg) { document.getElementById('status').innerText = msg; }

function endGame(msg) {
    screens.gameOver.classList.remove('hidden');
    document.getElementById('winner-text').innerText = msg;
    document.getElementById('reason-text').innerText = "المعركة القادمة تنتظر...";
}
