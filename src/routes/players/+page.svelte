<script>
    export let player1Name = "";
    export let player2Name = "";

    // Обработчики изменения имен
    function updatePlayer1Name(event) {
        player1Name = event.target.value.slice(0, 40);
    }

    function updatePlayer2Name(event) {
        player2Name = event.target.value.slice(0, 40);
    }
</script>

<div class="players-container">
    <!-- Игрок 1 -->
    <div class="player-card player1">
        <div class="player-number">1</div>
        <div class="name-input-container">
            <input
                type="text"
                class="player-name-input"
                placeholder="Игрок 1"
                value={player1Name}
                on:input={updatePlayer1Name}
                maxlength="40"
            />
            <div class="char-counter">{player1Name.length}/40</div>
        </div>
    </div>

    <!-- VS разделитель -->
    <div class="vs-container">
        <div class="vs-text">VS</div>
    </div>

    <!-- Игрок 2 -->
    <div class="player-card player2">
        <div class="player-number">2</div>
        <div class="name-input-container">
            <input
                type="text"
                class="player-name-input"
                placeholder="Игрок 2"
                value={player2Name}
                on:input={updatePlayer2Name}
                maxlength="40"
            />
            <div class="char-counter">{player2Name.length}/40</div>
        </div>
    </div>
</div>

<style>
    .players-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
        padding: 30px;
        position: relative;
    }

    .player-card {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;
        border-radius: 20px;
        background: rgba(20, 20, 30, 0.7);
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        min-height: 300px;
        position: relative;
        overflow: hidden;
        z-index: 10;
    }

    .player-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        border-color: rgba(138, 43, 226, 0.5);
    }

    .player1 {
        margin-right: 10px;
        border-left: 8px solid #ff00ff;
    }

    .player2 {
        margin-left: 10px;
        border-right: 8px solid #00ffff;
    }

    .player-number {
        font-size: 12rem;
        font-weight: 800;
        line-height: 1;
        margin: 20px 0;
        background: linear-gradient(45deg, #8a2be2, #ff00ff);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-shadow: 0 0 20px rgba(138, 43, 226, 0.3);
        position: relative;
    }

    .player1 .player-number {
        background: linear-gradient(45deg, #ff00ff, #8a2be2);
    }

    .player2 .player-number {
        background: linear-gradient(45deg, #00ffff, #4b0082);
    }

    .name-input-container {
        width: 100%;
        margin-top: 20px;
        position: relative;
    }

    .player-name-input {
        width: 100%;
        padding: 18px 25px;
        font-size: 1.5rem;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        color: white;
        text-align: center;
        transition: all 0.3s ease;
    }

    .player-name-input:focus {
        outline: none;
        border-color: rgba(138, 43, 226, 0.8);
        box-shadow: 0 0 20px rgba(138, 43, 226, 0.4);
        background: rgba(0, 0, 0, 0.7);
    }

    .char-counter {
        position: absolute;
        bottom: -30px;
        right: 10px;
        color: #aaa;
        font-size: 0.9rem;
        opacity: 0.7;
    }

    .vs-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20;
    }

    .vs-text {
        font-size: 3rem;
        font-weight: 800;
        background: linear-gradient(45deg, #ff00ff, #00ffff);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
        padding: 15px 25px;
        border-radius: 50%;
        background: rgba(20, 20, 30, 0.9);
        border: 3px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
        animation: pulse 2s infinite alternate;
    }

    @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); }
        100% { transform: translate(-50%, -50%) scale(1.1); }
    }

    /* Эффекты фона */
    .player-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(138, 43, 226, 0.1), transparent 70%);
        z-index: -1;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .player-card:hover::before {
        opacity: 1;
    }

    .player1::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: linear-gradient(to right, #ff00ff, #8a2be2);
        opacity: 0.7;
    }

    .player2::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: linear-gradient(to right, #4b0082, #00ffff);
        opacity: 0.7;
    }

    /* Адаптивность */
    @media (max-width: 768px) {
        .players-container {
            flex-direction: column;
            gap: 40px;
        }

        .player-card {
            width: 100%;
            margin: 0 !important;
        }

        .vs-container {
            position: relative;
            top: 0;
            left: 0;
            transform: none;
            margin: 20px 0;
        }

        .vs-text {
            animation: none;
        }

        .player-number {
            font-size: 8rem;
        }
    }
</style>