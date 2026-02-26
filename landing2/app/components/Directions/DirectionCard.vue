<template>
    <div class="card">
        <div class="top">
            <div>
                <i :class="item.class"></i>
            </div>
            <span class="title">{{ item.title  }}</span>
        </div>
 
        <div class="description">
            {{ item?.description }}
        </div>


        <div class="chip">
            {{ item.label }}
        </div>
 
    </div>
</template>

<script setup lang="ts">
 interface IProps {
    item: any
 }

 defineProps<IProps>()
</script>
<style lang="scss" scoped>
.chip {
    position: relative;
    z-index: 10;
}
.card {
    position: relative;
    padding: 2rem;
    overflow: hidden;
    border-radius: 2rem;
    display: grid;
    grid-template-rows: max-content max-content 1fr;
    align-items: self-end;

    &:before {
        position: absolute;
        right: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        content: '';
        display: block;
        background: linear-gradient(to left, rgb(245 246 248 / 25%), rgba(245, 246, 248, 0));
    }

    &:after {
        position: absolute;
        z-index: 2;
        right: 0;
        width: 100%;
        height: 100%;
        content: '';
        display: block;
        background: url('../../../public/assets/sky.png') no-repeat center/cover;
    }

  @media screen and (max-width: 1024px) {
    text-align: left;
  }
}

.top {
    position: relative;
    z-index: 12;
    display: grid;
    grid-template-columns: max-content 1fr;
    font-size: 5rem;
    gap: 2rem;
  
    @media screen and (max-width: 1024px) {
      grid-template-columns: max-content max-content;
    }
}

.title {
    font-size: 3rem;
    font-weight: 700;
    line-height: 100%;

    @media screen and (max-width: 768px) {
        font-size: 5rem;
    }
}

.description {
    font-size: 2.4rem;
    position: relative;
    z-index: 12;

    @media screen and (max-width: 768px) {
        font-size: 3.4rem;
        max-width: 50%;
    }

    @media screen and (max-width: 500px) {
        font-size: 3.6vw;
        max-width: 50%;
    }
}

.chip {
  position: absolute;
  bottom: 16px;
  left: 16px;

  padding: 6px 14px;
  border-radius: 999px;

  font-size: 12px;
  font-weight: 500;

  color: #1f6b5a;

  background: linear-gradient(
    120deg,
    rgba(160, 230, 210, 0.75),
    rgba(200, 240, 230, 0.75),
    rgba(170, 220, 235, 0.75)
  );

  background-size: 200% 200%;

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  animation: chipGradient 8s ease-in-out infinite;

  @media screen and (max-width: 768px) {
        left: unset;
        right: 0;
    }
}

@keyframes chipGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

