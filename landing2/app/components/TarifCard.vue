<template>
        <div class="tariff-card-wrapper">
      <!-- Внешняя карточка с фиолетовым эффектом -->
      <div class="tariff-card-outer">
        
        <!-- Внутренняя карточка с чёрным фоном -->
        <div class="tariff-card-inner">
          
          <!-- Бейдж скидки -->
          <div class="discount-badge">-{{tarif.percent}}%</div>

          <!-- Заголовок тарифа -->
          <h3 class="tariff-title">{{ tarif.title }}</h3>

          <!-- Цена -->
          <div class="price-container">
            <p>
                <span class="line"></span>
                <span class="price-old">3600/час</span>
            </p>

            <span class="price-new">{{ tarif.newPrice }}<span class="price-unit">/час</span></span>
          </div>

          <!-- Список преимуществ -->
          <ul class="features-list">
            <li
                v-for="value of tarif.features"
                :key="value"
                class="feature-item">
                    <span class="check-icon">✓</span>
                    <span class="feature-text">{{ value }}</span>
            </li>
          </ul>

          <!-- Кнопка -->
          <button class="cta-button">Связаться</button>

        </div>
      </div>
    </div>


    <!-- <div class="tarif">
        <div class="tarif-top">
          <div>
            <span class="tarif-label">-{{tarif.percent}}%</span>
          </div>
            <h4 class="tarif-title">{{ tarif.title }}</h4>
        </div>
        <div class="tarif-price">
            <p>
                <span class="line"></span>
                <span>{{ tarif.oldPrice }}/час</span>
            </p>
            <p>{{ tarif.newPrice }}<span class="suffix">/час</span></p>
        </div>

        <div class="tarif-features">
            <div 
                v-for="value of tarif.features"
                :key="value"
                class="tarif-feature"
            >
                <QIcon name='check_circle_outline'/>
                <p>{{ value }}</p>
            </div>
        </div>

        <a href="#form" class="btn">Связаться</a>
    </div> -->
</template>

<script setup lang="ts">
interface IProps {
    tarif: {percent: number, title: string, oldPrice: number, newPrice: number, features:  string []},
}

const {tarif } = defineProps<IProps>()
</script>


<style lang="scss" scoped>
    .tarif {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: max-content max-content 2fr max-content;
    row-gap: 1rem;
    border: 1px solid;
    padding: 1rem;
    border-radius: 1rem;
    position: relative;
    border-radius: 18px;
    padding: 20px;
    background: rgba(255,255,255,0.65);
    border: 1px solid rgba(20,20,20,0.06);
    box-shadow:
        0 10px 30px rgba(15, 23, 42, 0.06),
        0 1px 0 rgba(255,255,255,0.7) inset;
    overflow: hidden;
    backdrop-filter: blur(10px);
    box-shadow: 1px 1px 12px violet;

    @media screen and (max-width:1024px) {
        min-height: 90vh;
    }

    &-features {
        display: grid;
        row-gap: 3rem;
        grid-auto-rows: max-content;
        box-shadow: 1px 5px 20px;
        border-radius: 2rem;
        padding: 2rem;
        line-height: 150%;
    }

    &-feature {
        display: grid;
        grid-template-columns: max-content 1fr ;
        column-gap: 1.6rem;
        align-items: start;
        font-size: 2.8rem;
        
        & p {
            font-size: 2rem;
            margin: 0;

            @media screen and (max-width: 1024px) {
                font-size: 4.2rem;
            }
        }

        @media screen and (max-width: 1024px) {
            font-size: 5.4rem;
        }
    }

    &-label {
        padding: .3rem 1.6rem;
        background-color: rgb(111, 36, 111);
        border-radius: 10rem;
        color: white;
        width: max-content;
    }

    &-top {
        display: grid;
        row-gap: 1rem;
        border-bottom: 1px solid #E2E8F0;
        
        @media screen and (max-width: 1024px){
            font-size: 4rem;
            padding-bottom: 2rem;
        }
    }

    &-title {
        font-size: inherit;
        font-weight: 800;
        text-transform: uppercase;
    }

    &-price {
        display: grid;
        grid-template-columns: max-content max-content ;
        column-gap: 2rem;
        align-items: center;

        & p {
            &:first-child {
                position: relative;
                font-size: 2.2rem;

                & .line {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    height: .2rem;
                    background-color: #40e0c0;
                    width: 0%;
                }

                        
                @media screen and (max-width: 1024px){
                    font-size: 4rem;
                }
 
            }
            &:last-child {
                font-size: 3.2rem;
                font-weight: bold;

                        
                @media screen and (max-width: 1024px){
                    font-size: 6rem;
                }
            }
        }
    }
}

.tarif::before{
  content:"";
  position:absolute;
  inset:-2px;
  border-radius: inherit;
  z-index:-1;

  /* по умолчанию — выключено, включаем классами ниже */
  background: transparent;
}

/* лёгкое свечение по краю */
.tarif::after{
  content:"";
  position:absolute;
  inset:0;
  border-radius: inherit;
  pointer-events:none;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.2));
  opacity: 0.55;
  mix-blend-mode: overlay;
}


.tarif::before{
    background:
    linear-gradient(120deg,
      rgba(59, 130, 246, 0.22),
      rgba(168, 85, 247, 0.18),
      rgba(20, 184, 166, 0.18),
      rgba(59, 130, 246, 0.22)
    );
  background-size: 300% 300%;
  filter: blur(10px) saturate(1.15);
  opacity: 0.85;
  animation: silk 4s ease-in-out infinite;
}

@keyframes silk{
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.btn {
    margin-top: 3rem;
    background-color: transparent;
    color: black;
    border-radius: 10em;
    font-size: 14px;
    padding: 1rem 2rem;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    border: 3px solid #f9fafc;
    box-shadow: 0 0 0 0 black;
    height: max-content;
    align-self: anchor-center;
    letter-spacing: 0.04em;
    text-align: center;

    @media screen and (max-width: 1024px) {
        font-size: 5rem;
        color: inherit;
        font-weight: 600;
    }
}

.btn:hover {
  transform: translateY(-4px) translateX(-2px);
  box-shadow: 2px 5px 0 0 black;
};

.btn:active {
  transform: translateY(2px) translateX(1px);
  box-shadow: 0 0 0 0 black;
};

.suffix {
    font-size: 3rem;
    font-weight: normal;
}


 

/* --- Внешняя карточка (фиолетовое свечение) --- */
.tariff-card-outer {
  background: 
    radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.25) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(45, 212, 191, 0.2) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 60%),
    linear-gradient(145deg, #2d1f4e 0%, #1a1a2e 50%, #0f0f1e 100%);
  border-radius: 24px;
  padding: 24px;
  position: relative;
  box-shadow: 
    0 0 60px rgba(139, 92, 246, 0.3),
    inset 0 0 60px rgba(139, 92, 246, 0.1);
}

/* --- Внутренняя карточка (тёмная) --- */
.tariff-card-inner {
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 50%, #0a0a15 100%);
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 16px;
  padding: 30px 24px 24px;
  position: relative;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

/* Фиолетовая линия сверху */
.tariff-card-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(139, 92, 246, 0.8) 50%, 
    transparent 100%
  );
}

/* --- Бейдж скидки (фиолетовый градиент) --- */
.discount-badge {
  position: absolute;
  top: 0;
  left: 24px;
  background: linear-gradient(180deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%);
  color: #ffffff;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  z-index: 10;
}

/* --- Заголовок тарифа (фиолетовый) --- */
.tariff-title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--primary-color);
  text-align: center;
  margin: 15px 0 20px;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}

/* --- Контейнер цены --- */
.price-container {
    display: grid;
    justify-content: center;
    text-align: center;
    text-align: center;
    margin-bottom: 25px;

  & p {
    &:first-child {
        position: relative;
        width: max-content;
        font-size: 2.2rem;
        margin: 0 auto;

        & .line {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            height: .2rem;
            background-color: #40e0c0;
            width: 0%;
        }

                
        @media screen and (max-width: 1024px){
            font-size: 4rem;
        }

    }
    &:last-child {
        font-size: 3.2rem;
        font-weight: bold;

                
        @media screen and (max-width: 1024px){
            font-size: 6rem;
        }
    }
}
}

.price-old {
  display: block;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: line-through;
  margin-bottom: 5px;
}

.price-new {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-color);
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}

.price-unit {
  font-size: 18px;
  font-weight: 400;
  color: rgba(139, 92, 246, 0.7);
}

/* --- Список преимуществ --- */
.features-list {
  list-style: none;
  text-align: left;
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.check-icon {
  color: var(--accent-color);
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 2px;
}

.gift-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 1px;
}

.feature-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
}

/* --- Кнопка (фиолетовая с градиентом) --- */
.cta-button {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(180deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 4px 15px rgba(139, 92, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-transform: none;
  letter-spacing: 0.5px;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px rgba(139, 92, 246, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.cta-button:active {
  transform: translateY(0);
  box-shadow: 
    0 2px 10px rgba(139, 92, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* --- Адаптивность --- */
@media (max-width: 480px) {
  .section-title {
    font-size: 26px;
  }

  .tariff-card-outer {
    padding: 20px;
    border-radius: 20px;

    @media screen and (max-width: 1024px) {
        padding: 10px;
    }
  }

  .tariff-card-inner {
    padding: 25px 20px 20px;
    border-radius: 14px;
  }

  .discount-badge {
    padding: 8px 16px;
    font-size: 14px;
    left: 20px;
  }

  .tariff-title {
    font-size: 24px;
    margin-top: 10px;

    @media screen and (max-width: 1024px) {
        margin-top: 30px;
    }
  }

  .price-new {
    font-size: 32px;
  }

  .price-old {
    font-size: 14px;
  }

  .features-list {
    padding: 15px;
  }

  .feature-text {
    font-size: 13px;
  }

  .cta-button {
    padding: 14px 20px;
    font-size: 16px;
  }
}
</style>