
<style>
      .poline-picker__circprev {
      width: 12vmin;
      height: 12vmin;
      background: conic-gradient(var(--prev));
      border-radius: 50%;
      position: absolute;
      top: 100%;
      left: 50%;
      z-index: 3;
      transition: transform 0.5s cubic-bezier(0.3, 0.7, 0, 1);
      box-shadow: 0 0 0 0.7vmin var(--bg);
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0.4);
    }
</style>
<div class="poline-picker__circprev"></div>