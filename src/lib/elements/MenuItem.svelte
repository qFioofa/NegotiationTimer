<script>
    export let icon;
    export let text;
    export let badge = null;

    let isClicked = false;

    function handleClick() {
      isClicked = true;
      setTimeout(() => isClicked = false, 300);
    }
  </script>

  <li class="menu-item" on:mouseenter on:click={handleClick} class:clicked={isClicked}>
    <div class="item-icon">{icon}</div>
    <div class="item-text">{text}</div>
    {#if badge}
      <div class="item-badge">{badge}</div>
    {/if}
  </li>

  <style>
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

    .menu-item.clicked {
      background: rgba(70, 15, 100, 0.9);
      box-shadow: 0 0 30px rgba(138, 43, 226, 0.8);
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
  </style>
