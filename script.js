// ربط العناصر من الهيكل
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

// تهيئة اللعبة
const game = new Chess();
let selectedSquare = null;

// المؤثرات الصوتية الملحمية
const sounds = {
    move: new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3'),
    capture: new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3'),
    check: new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-check.mp3'),
    gameover: new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3')
};

// أشكال القطع
const piecesMap = {
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
    'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔'
};

// إخفاء شاشة البداية وبدء اللعبة (لتفعيل الصوت في المتصفح)
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    renderBoard();
    updateStatus('بدأت المعركة - دور الأبيض');
});

// رسم الرقعة والقطع
function renderBoard() {
    boardElement.innerHTML = '';
    const boardState = game.board();

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement('div');
            const isWhite = (r + c) % 2 === 0;
            square.className = `square ${isWhite ? 'white' : 'black'}`;
            
            // تحديد إحداثيات المربع (مثال: e4)
            const file = String.fromCharCode(97 + c);
            const rank = 8 - r;
            const squareId = file + rank;
            
            // وضع القطع في أماكنها
            const piece = boardState[r][c];
            if (piece) {
                const pieceElement = document.createElement('span');
                pieceElement.className = 'piece';
                pieceElement.style.color = piece.color === 'w' ? '#f8f8f8' : '#111';
                pieceElement.textContent = piecesMap[piece.color === 'w' ? piece.type.toUpperCase() : piece.type];
                square.appendChild(pieceElement);
            }

            // تظليل المربع المحدد
            if (selectedSquare === squareId) square.classList.add('selected');

            // إضافة التفاعل عند النقر
            square.addEventListener('click', () => handleSquareClick(squareId));
            boardElement.appendChild(square);
        }
    }
}

// معالجة نقرات اللاعب
function handleSquareClick(squareId) {
    if (game.game_over() || game.turn() === 'b') return; // منع اللعب إذا انتهت اللعبة أو كان دور الكمبيوتر

    if (selectedSquare) {
        // محاولة تنفيذ الحركة (الترقية الافتراضية للوزير 'q')
        const move = game.move({ from: selectedSquare, to: squareId, promotion: 'q' });

        if (move) {
            triggerVFX(move);
            selectedSquare = null;
            renderBoard();
            updateStatus('الكمبيوتر يخطط...');
            
            // دور الكمبيوتر بعد 800 جزء من الثانية
            window.setTimeout(makeComputerMove, 800);
        } else {
            // إذا ضغط اللاعب على قطعة أخرى تابعة له، يتم تغيير التحديد
            const clickedPiece = game.get(squareId);
            if (clickedPiece && clickedPiece.color === game.turn()) {
                selectedSquare = squareId;
            } else {
                selectedSquare = null;
            }
            renderBoard();
        }
    } else {
        // تحديد القطعة للمرة الأولى
        const clickedPiece = game.get(squareId);
        if (clickedPiece && clickedPiece.color === game.turn()) {
            selectedSquare = squareId;
            renderBoard();
        }
    }
}

// عقل الكمبيوتر (الذكاء الاصطناعي)
function makeComputerMove() {
    if (game.game_over()) return;

    const possibleMoves = game.moves({ verbose: true });
    if (possibleMoves.length === 0) return;

    // استراتيجية هجومية بسيطة: الأولوية لأكل قطع الخصم
    let move = possibleMoves.find(m => m.captured);
    if (!move) {
        // إذا لم يوجد أكل، اختار حركة عشوائية قانونية
        move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    game.move(move.san);
    triggerVFX(move);
    renderBoard();
    updateStatus();
}

// المؤثرات السينمائية (الصوت والاهتزاز)
function triggerVFX(move) {
    if (move.captured) {
        sounds.capture.play();
        // إعادة تشغيل الأنيميشن الخاص بالاهتزاز
        boardElement.classList.remove('cinematic-shake');
        void boardElement.offsetWidth; // حيلة تقنية لإعادة تفعيل الأنيميشن
        boardElement.classList.add('cinematic-shake');
    } else {
        sounds.move.play();
    }
}

// تحديث حالة المعركة
function updateStatus(customMessage = null) {
    if (customMessage) {
        statusElement.textContent = customMessage;
        return;
    }

    let status = 'دور ' + (game.turn() === 'w' ? 'سلطان الأبيض' : 'سلطان الأسود');
    
    if (game.in_checkmate()) {
        sounds.gameover.play();
        status = `انتهت الحرب! انتصر ${game.turn() === 'w' ? 'الأسود' : 'الأبيض'} بالضربة القاضية 👑`;
    } else if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
        sounds.gameover.play();
        status = 'هدنة (تعادل)! الجيوش منهكة 🏳️';
    } else if (game.in_check()) {
        sounds.check.play();
        status += ' - ⚠️ كش ملك! السلطان في خطر ⚠️';
    }
    
    statusElement.textContent = status;
}
