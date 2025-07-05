<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zap Menu</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: #000;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            position: relative;
        }

        /* Генерация эффектных частиц фона */
        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            overflow: hidden;
        }

        .particle {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(135deg, #8a2be2, #4b0082, #9400d3);
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.7);
            animation: float 15s infinite ease-in-out;
        }

        @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(100px, 100px); }
            50% { transform: translate(200px, -100px); }
            75% { transform: translate(-100px, 200px); }
        }

        /* Основной контейнер */
        .container {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 800px;
            padding: 40px;
            text-align: center;
        }

        h1 {
            font-size: 4.5rem;
            margin-bottom: 30px;
            background: linear-gradient(45deg, #8a2be2, #ff00ff, #00ffff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 20px rgba(138, 43, 226, 0.3);
            letter-spacing: 2px;
            animation: glow 3s infinite alternate;
        }

        @keyframes glow {
            from { text-shadow: 0 0 10px #8a2be2, 0 0 20px #9400d3; }
            to { text-shadow: 0 0 20px #8a2be2, 0 0 30px #ff00ff, 0 0 40px #00ffff; }
        }

        .subtitle {
            font-size: 1.5rem;
            color: #bbb;
            margin-bottom: 60px;
            line-height: 1.6;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .menu-container {
            position: fixed;
            top: 30px;
            right: 30px;
            z-index: 1000;
        }

        .menu-button {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(20, 20, 30, 0.6);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(138, 43, 226, 0.4);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.4s ease;
            opacity: 0.4;
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.2);
        }

        .menu-button:hover {
            opacity: 1;
            transform: scale(1.1);
            box-shadow: 0 0 30px rgba(138, 43, 226, 0.5);
            border: 2px solid rgba(138, 43, 226, 0.8);
        }

        .menu-line {
            width: 40px;
            height: 4px;
            background: #fff;
            margin: 4px 0;
            border-radius: 2px;
            transition: all 0.4s ease;
        }

        .menu-open .menu-line:nth-child(1) {
            transform: translateY(12px) rotate(45deg);
        }

        .menu-open .menu-line:nth-child(2) {
            opacity: 0;
        }

        .menu-open .menu-line:nth-child(3) {
            transform: translateY(-12px) rotate(-45deg);
        }

        .menu-panel {
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background: rgba(15, 15, 25, 0.95);
            backdrop-filter: blur(15px);
            border-left: 1px solid rgba(138, 43, 226, 0.3);
            box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            z-index: 999;
        }

        .menu-panel.open {
            transform: translateX(-400px);
        }

        .menu-header {
            padding: 30px;
            border-bottom: 1px solid rgba(138, 43, 226, 0.2);
        }

        .menu-title {
            font-size: 2.5rem;
            color: #fff;
            text-align: left;
            background: linear-gradient(45deg, #8a2be2, #00ffff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        .menu-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .menu-items {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .menu-item {
            padding: 25px;
            margin: 15px 0;
            background: rgba(30, 30, 45, 0.7);
            border-radius: 12px;
            border: 1px solid rgba(138, 43, 226, 0.2);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            position: relative;
            overflow: hidden;
        }

        .menu-item:hover {
            transform: translateX(10px);
            background: rgba(50, 15, 80, 0.8);
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.4);
            border: 1px solid rgba(138, 43, 226, 0.6);
        }

        .menu-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 8px;
            height: 100%;
            background: linear-gradient(to bottom, #8a2be2, #00ffff);
        }

        .item-icon {
            font-size: 2rem;
            margin-right: 20px;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(138, 43, 226, 0.2);
        }

        .item-text {
            font-size: 1.8rem;
            color: #fff;
            flex: 1;
            text-align: left;
            font-weight: 500;
        }

        .item-badge {
            background: linear-gradient(45deg, #ff00ff, #00ffff);
            color: #000;
            font-weight: bold;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 1.3rem;
        }

        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 998;
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s ease;
        }

        .overlay.visible {
            opacity: 1;
            visibility: visible;
        }

        .demo-buttons {
            display: flex;
            gap: 25px;
            justify-content: center;
            margin-top: 50px;
        }

        .demo-button {
            padding: 18px 35px;
            font-size: 1.4rem;
            border: none;
            border-radius: 50px;
            background: linear-gradient(45deg, #8a2be2, #ff00ff);
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
            letter-spacing: 1px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 0 15px rgba(138, 43, 226, 0.5);
        }

        .demo-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(138, 43, 226, 0.8);
        }

        .demo-button::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #00ffff, #ff00ff);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .demo-button:hover::after {
            opacity: 0.3;
        }

        .demo-button:nth-child(2) {
            background: linear-gradient(45deg, #00ffff, #8a2be2);
        }

        /* Эффект неоновой рамки */
        .neon-border {
            position: relative;
            padding: 3px;
            border-radius: 12px;
            background: linear-gradient(45deg, #ff00ff, #00ffff, #8a2be2);
            animation: border-glow 3s infinite alternate;
        }

        @keyframes border-glow {
            0% { box-shadow: 0 0 10px #ff00ff; }
            50% { box-shadow: 0 0 20px #00ffff; }
            100% { box-shadow: 0 0 30px #8a2be2; }
        }
    </style>
</head>
<body>
    <div class="particles" id="particles"></div>

    <div class="menu-container">
        <div class="menu-button" id="menuButton">
            <div class="menu-line"></div>
            <div class="menu-line"></div>
            <div class="menu-line"></div>
        </div>
    </div>

    <div class="menu-panel" id="menuPanel">
        <div class="menu-header">
            <h2 class="menu-title">Главное меню</h2>
        </div>
        <div class="menu-content">
            <ul class="menu-items">
                <li class="menu-item">
                    <div class="item-icon">🏠</div>
                    <div class="item-text">Главная страница</div>
                    <div class="item-badge">NEW</div>
                </li>
                <li class="menu-item">
                    <div class="item-icon">⚙️</div>
                    <div class="item-text">Настройки профиля</div>
                </li>
                <li class="menu-item">
                    <div class="item-icon">💬</div>
                    <div class="item-text">Сообщения</div>
                    <div class="item-badge">12</div>
                </li>
                <li class="menu-item">
                    <div class="item-icon">🛒</div>
                    <div class="item-text">Мои заказы</div>
                </li>
                <li class="menu-item">
                    <div class="item-icon">📊</div>
                    <div class="item-text">Статистика</div>
                </li>
                <li class="menu-item">
                    <div class="item-icon">🔔</div>
                    <div class="item-text">Уведомления</div>
                    <div class="item-badge">3</div>
                </li>
                <li class="menu-item">
                    <div class="item-icon">👥</div>
                    <div class="item-text">Друзья</div>
                </li>
                <li class="menu-item">
                    <div class="item-icon">🎮</div>
                    <div class="item-text">Игры</div>
                    <div class="item-badge">5</div>
                </li>
                <li class="menu-item">
                    <div class="item-icon">🔒</div>
                    <div class="item-text">Безопасность</div>
                </li>
                <li class="menu-item">
                    <div class="item-icon">❓</div>
                    <div class="item-text">Помощь</div>
                </li>
            </ul>
        </div>
    </div>

    <div class="overlay" id="overlay"></div>

    <script>
        const menuButton = document.getElementById('menuButton');
        const menuPanel = document.getElementById('menuPanel');
        const overlay = document.getElementById('overlay');
        let menuOpen = false;

        menuButton.addEventListener('click', () => {
            menuOpen = !menuOpen;

            if (menuOpen) {
                menuButton.classList.add('menu-open');
                menuPanel.classList.add('open');
                overlay.classList.add('visible');
            } else {
                menuButton.classList.remove('menu-open');
                menuPanel.classList.remove('open');
                overlay.classList.remove('visible');
            }
        });

        overlay.addEventListener('click', () => {
            if (menuOpen) {
                menuButton.classList.remove('menu-open');
                menuPanel.classList.remove('open');
                overlay.classList.remove('visible');
                menuOpen = false;
            }
        });

        const particlesContainer = document.getElementById('particles');
        const colors = ['#8a2be2', '#9400d3', '#4b0082', '#ff00ff', '#00ffff'];

        function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Размер частицы
            const size = Math.random() * 100 + 20;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Позиция
            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * window.innerHeight;
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;

            // Цвет
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = `radial-gradient(circle, ${color}, transparent)`;
            particle.style.boxShadow = `0 0 30px ${color}`;

            // Анимация
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;

            particlesContainer.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        }

        for (let i = 0; i < 15; i++) {
            createParticle();
        }

        setInterval(createParticle, 2000);

        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Создаем эффект пульсации
                const pulse = document.createElement('div');
                pulse.style.position = 'absolute';
                pulse.style.width = '100%';
                pulse.style.height = '100%';
                pulse.style.top = '0';
                pulse.style.left = '0';
                pulse.style.background = 'radial-gradient(circle, rgba(138,43,226,0.5), transparent)';
                pulse.style.borderRadius = '12px';
                pulse.style.opacity = '0';
                pulse.style.animation = 'pulse 1s forwards';

                item.appendChild(pulse);

                // Удаляем эффект после завершения анимации
                setTimeout(() => {
                    pulse.remove();
                }, 1000);
            });

            item.addEventListener('click', () => {
                item.style.background = 'rgba(70, 15, 100, 0.9)';
                item.style.boxShadow = '0 0 30px rgba(138, 43, 226, 0.8)';

                setTimeout(() => {
                    item.style.background = '';
                    item.style.boxShadow = '';
                }, 300);
            });
        });

        // Добавляем стиль для анимации пульсации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(0.8); opacity: 0.7; }
                100% { transform: scale(1.5); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    </script>
</body>
</html>