<template>
    <header class="lux-header">
      <div class="lux-header__inner">
        <a class="brand" href="#">
          <span class="brand__mark" aria-hidden="true"></span>
          <span class="brand__name">Одно новое сообщение</span>
        </a>
      </div>
    </header>
</template>

<style lang="scss" scoped>
 
    .lux-header{
        display: none;
  position: absolute; /* можно заменить на fixed при необходимости */
  top: 14px;
  z-index: 10;
  padding: 0 2rem;
  width: 100%;
}

.lux-header.hide {
  transform: translateY(-100%);
}

.lux-header__inner{
  height: var(--headerH);
  padding: 0 var(--padX);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 14px;

  border-radius: var(--radius);
  background:
  linear-gradient(
    180deg,
    rgba(120, 255, 210, 0.25),
    rgba(180, 130, 255, 0.18)
  ),
  rgba(50, 40, 80, 0.6);

border: 1px solid rgba(200, 220, 255, 0.45);

box-shadow:
  0 22px 55px rgba(60, 20, 120, 0.55),
  inset 0 1px 0 rgba(255, 255, 255, 0.2);

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  position:relative;
  overflow:hidden;
}

/* золотая «кромка» */
.lux-header__inner::before{
    content: "";
position: absolute;
inset: -2px;
border-radius: calc(var(--radius) + 2px);
padding: 1px;

background: linear-gradient(
  90deg,
  rgba(110, 255, 225, 0.95),
  rgba(190, 140, 255, 0.65),
  rgba(110, 255, 225, 0.45)
);
-webkit-mask:
  linear-gradient(#000 0 0) content-box,
  linear-gradient(#000 0 0);
-webkit-mask-composite: xor;
        mask-composite: exclude;

pointer-events: none;
opacity: .85;
background-size: 200% 100%;
animation: glow 6s ease-in-out infinite;
}

/* мягкий золотой блик */
.lux-header__inner::after{
  content:"";
  position:absolute;
  left:-30%;
  top:-70%;
  width: 120%;
  height: 220%;
  background: radial-gradient(
  circle at 40% 40%,
  rgba(120, 255, 225, 0.22),
  rgba(190, 150, 255, 0.14),
  transparent 55%
);
  transform: rotate(12deg);
  pointer-events:none;
  mix-blend-mode: screen;
  opacity:.9;
}


.menu{
  width: 44px;
  height: 44px;
  border-radius: 16px;
  background: rgba(55, 45, 85, 0.22);

border: 1px solid rgba(180, 240, 225, 0.45);

box-shadow:
  inset 0 1px 0 rgba(210, 200, 255, 0.14);
  display:grid;
  place-content:center;
  gap: 6px;
  cursor:pointer;
  position:relative;
  z-index:1;
}

.menu__bar{
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(
  90deg,
  rgba(120, 235, 215, 0.90),
  rgba(150, 130, 240, 0.45)
);
  box-shadow: 0 0 12px rgba(255,216,140,.14);
}

.menu:active{ transform: translateY(1px); }

/* Brand */
.brand{
  display:flex;
  align-items:center;
  gap: 12px;
  text-decoration:none;
  color: var(--text);
  position:relative;
  z-index:1;
}

.brand__mark{
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background:
  radial-gradient(
    circle at 35% 30%,
    rgba(170, 255, 240, 0.28),
    transparent 55%
  ),
  linear-gradient(
    180deg,
    rgba(120, 255, 225, 0.22),
    rgba(190, 150, 255, 0.14)
  ),
  rgba(45, 35, 75, 0.30);

border: 1px solid rgba(190, 240, 235, 0.45);

box-shadow:
  0 14px 34px rgba(50, 20, 90, 0.55),
  inset 0 1px 0 rgba(220, 215, 255, 0.16);
  position:relative;
}

/* ромб внутри как «логомарк» */
.brand__mark::before{
  content:"";
  position:absolute;
  inset: 10px;
  border: 1px solid rgba(140, 255, 230, 0.90);
  transform: rotate(45deg);
  border-radius: 6px;
  box-shadow: 0 0 16px rgba(255,216,140,.18);
}

.brand__name{
  font-weight: 650;
  letter-spacing: .5px;
  font-size: 18px;
  line-height: 1;
  text-shadow: 0 10px 18px rgba(0,0,0,.35);
}
@keyframes glow {
  0%   { background-position:   0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position:   0% 50%; }
}
</style>