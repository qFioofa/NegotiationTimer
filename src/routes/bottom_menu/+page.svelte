<script>
    import { fly, fade } from 'svelte/transition';
    import { onMount } from 'svelte';

    export let title = "Панель";
    let isOpen = false;
    let isHovered = false;

    let menuItems = [
        { id: 1, name: "Настройки профиля", icon: "⚙️" },
        { id: 2, name: "Уведомления", icon: "🔔", badge: 3 },
        { id: 3, name: "Статистика", icon: "📊" },
        { id: 4, name: "Безопасность", icon: "🔒" },
        { id: 5, name: "Внешний вид", icon: "🎨" },
        { id: 6, name: "Звуки", icon: "🔊" },
        { id: 7, name: "Язык", icon: "🌐" },
        { id: 8, name: "Справка", icon: "❓" },
        { id: 9, name: "О программе", icon: "ℹ️" },
        { id: 10, name: "Выход", icon: "🚪" }
    ];

    function toggleMenu() {
        isOpen = !isOpen;
    }

    onMount(() => {
    });
</script>

<div class="menu-system">
    <button
        class="menu-trigger"
        class:open={isOpen}
        class:hovered={isHovered}
        on:mouseenter={() => isHovered = true}
        on:mouseleave={() => isHovered = false}
        on:click={toggleMenu}
    >
        <div class="trigger-content">
            <div class="trigger-icon">≡</div>
            <div class="trigger-text">Меню</div>
        </div>
    </button>

    {#if isOpen}
        <div class="menu-overlay" transition:fade on:click={toggleMenu} />
    {/if}

    <div class="menu-panel" class:open={isOpen}>
        <div class="panel-header">
            <h2>{title}</h2>
            <button class="close-button" on:click={toggleMenu}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>

        <div class="panel-content">
            <ul class="menu-items">
                {#each menuItems as item (item.id)}
                    <li class="menu-item">
                        {#if item.icon}
                            <span class="item-icon">{item.icon}</span>
                        {/if}
                        <span class="item-text">{item.name}</span>
                        {#if item.badge}
                            <span class="item-badge">{item.badge}</span>
                        {/if}
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>

<style>
    .menu-system {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
    }

    .menu-trigger {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 60px;
        background: rgba(30, 30, 45, 0.7);
        backdrop-filter: blur(10px);
        border: none;
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        color: white;
        font-size: 1.2rem;
        font-weight: 600;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        opacity: 0.5;
        overflow: hidden;
        z-index: 1001;
    }

    .menu-trigger:hovered {
        opacity: 1;
        transform: translateX(-50%) scale(1.05);
        background: rgba(70, 30, 100, 0.8);
        box-shadow: 0 6px 25px rgba(138, 43, 226, 0.4);
    }

    .menu-trigger.open {
        opacity: 0;
        transform: translateX(-50%) translateY(100px);
    }

    .trigger-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        height: 100%;
    }

    .trigger-icon {
        font-size: 1.8rem;
    }

    .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        z-index: 998;
    }

    .menu-panel {
        position: fixed;
        bottom: -500px;
        left: 0;
        width: 100%;
        height: 450px;
        background: rgba(20, 20, 35, 0.98);
        backdrop-filter: blur(15px);
        border-radius: 30px 30px 0 0;
        box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
        z-index: 999;
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .menu-panel.open {
        transform: translateY(-500px);
    }

    .panel-header {
        padding: 25px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .panel-header h2 {
        margin: 0;
        font-size: 2rem;
        color: white;
        font-weight: 600;
        background: linear-gradient(45deg, #8a2be2, #00ffff);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .close-button {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
        padding: 5px;
        border-radius: 4px;
    }

    .close-button:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
    }

    .panel-content {
        height: calc(100% - 80px);
        overflow-y: auto;
        padding: 15px 25px;
    }

    .menu-items {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .menu-item {
        padding: 20px;
        margin: 10px 0;
        background: rgba(30, 30, 45, 0.5);
        border-radius: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(138, 43, 226, 0.2);
    }

    .menu-item:hover {
        background: rgba(50, 15, 80, 0.7);
        transform: translateX(10px);
        border: 1px solid rgba(138, 43, 226, 0.6);
        box-shadow: 0 5px 15px rgba(138, 43, 226, 0.3);
    }

    .menu-item:active {
        background: rgba(70, 25, 100, 0.8);
    }

    .item-icon {
        font-size: 1.8rem;
        margin-right: 15px;
        width: 40px;
        text-align: center;
    }

    .item-text {
        flex: 1;
        font-size: 1.4rem;
        color: white;
    }

    .item-badge {
        background: linear-gradient(45deg, #ff00ff, #00ffff);
        color: black;
        font-weight: bold;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 1.1rem;
        min-width: 30px;
        text-align: center;
    }

    /* Стили для скролла */
    .panel-content::-webkit-scrollbar {
        width: 8px;
    }

    .panel-content::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }

    .panel-content::-webkit-scrollbar-thumb {
        background: linear-gradient(45deg, #8a2be2, #00ffff);
        border-radius: 10px;
    }

    @keyframes item-appear {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    .menu-item {
        animation: item-appear 0.4s ease forwards;
        opacity: 0;
    }
</style>