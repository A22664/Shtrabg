:root {
    --primary-color: #ffd700;
    --bg-dark: #0f172a;
    --board-light: #cbd5e1;
    --board-dark: #475569;
    --glass-bg: rgba(30, 41, 59, 0.7);
    --glass-border: rgba(255, 255, 255, 0.1);
}

body {
    background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
    color: #fff;
    font-family: 'Segoe UI', system-ui, sans-serif;
    margin: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

/* تأثير الزجاج الحديث (Glassmorphism) */
.glass-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.overlay {
    position: absolute;
    inset: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
}

.hidden { display: none !important; }

/* القائمة والأزرار */
.menu {
    text-align: center;
    padding: 40px;
    border-radius: 20px;
    width: 90%;
    max-width: 500px;
}

.main-title {
    color: var(--primary-color);
    font-size: clamp(32px, 5vw, 48px);
    margin: 0 0 10px 0;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.subtitle { color: #94a3b8; font-size: 20px; margin-bottom: 30px; }

.buttons-container { display: flex; flex-direction: column; gap: 15px; }

.epic-btn {
    padding: 15px 20px;
    font-size: 18px;
    background: linear-gradient(45deg, #7f1d1d, #b91c1c);
    color: white;
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.epic-btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 10px 20px rgba(220, 38, 38, 0.4);
}

.settings { margin-top: 20px; font-size: 18px; }
.settings input { width: 60px; padding: 5px; border-radius: 5px; text-align: center; font-size: 16px;}

/* هيكل ساحة المعركة الرئيسي */
#game-wrapper {
    display: flex;
    gap: 20px;
    width: 95vw;
    max-width: 1200px;
    height: 90vh;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
}

/* اللوحة الجانبية (التاريخ والمؤقتات) */
.side-panel {
    flex: 1;
    min-width: 250px;
    max-width: 350px;
    height: 100%;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
}

.timer {
    font-size: 32px;
    font-weight: bold;
    font-family: monospace;
    background: rgba(0,0,0,0.5);
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    margin: 10px 0;
    color: var(--primary-color);
}

.captured-pieces { min-height: 30px; font-size: 24px; display: flex; flex-wrap: wrap; gap: 5px; }

.move-history-container {
    flex-grow: 1;
    overflow-y: auto;
    background: rgba(0,0,0,0.3);
    border-radius: 8px;
    padding: 10px;
    margin: 15px 0;
}

#move-history { list-style: none; padding: 0; margin: 0; }
#move-history li {
    padding: 5px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    font-family: monospace;
    font-size: 16px;
}
#move-history li span { color: var(--primary-color); display: inline-block; width: 30px; }

/* الرقعة */
.board-container {
    padding: 20px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.status-text { font-size: 24px; font-weight: bold; margin: 0 0 15px 0; color: #f8fafc; }

.board {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    width: 75vmin;
    max-width: 600px;
    height: 75vmin;
    max-height: 600px;
    border: 4px solid #334155;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
}

.square { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; font-size: clamp(30px, 7vmin, 60px); cursor: pointer; user-select: none; position: relative; }
.white { background-color: var(--board-light); }
.black { background-color: var(--board-dark); }
.selected { background-color: rgba(234, 179, 8, 0.6) !important; box-shadow: inset 0 0 20px rgba(0,0,0,0.5); }
.last-move { background-color: rgba(132, 204, 22, 0.4); }

.piece { text-shadow: 2px 4px 6px rgba(0,0,0,0.6); pointer-events: none; transition: transform 0.2s; }

/* مؤثرات الانفجار والاهتزاز */
@keyframes shake-and-bleed {
    0% { transform: translate(2px, 2px); box-shadow: inset 0 0 30px red; }
    20% { transform: translate(-4px, 0px); box-shadow: inset 0 0 50px darkred; }
    40% { transform: translate(4px, -2px); box-shadow: inset 0 0 80px red; }
    60% { transform: translate(-4px, 2px); box-shadow: inset 0 0 50px darkred; }
    80% { transform: translate(-2px, -2px); box-shadow: inset 0 0 30px red; }
    100% { transform: translate(0px, 0px); }
}
.cinematic-shake { animation: shake-and-bleed 0.5s ease-in-out; }

/* التجاوب مع شاشات الموبايل */
@media (max-width: 800px) {
    #game-wrapper { flex-direction: column; overflow-y: auto; height: 100vh; justify-content: flex-start; }
    .side-panel { width: 100%; max-width: 100%; min-height: 300px; }
    .board-container { width: 100%; padding: 10px; }
    .board { width: 90vw; height: 90vw; }
}
