<template>
    <div class="tarif">
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

        <button  class="btn">Связаться</button>
    </div>
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
                font-size: 3.2rem;
            }
        }

        @media screen and (max-width: 1024px) {
            font-size: 4.4rem;
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
            font-size: 3rem;
        }

        @media screen and (max-width: 768px){
            row-gap: 3rem;
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
                    font-size: 3rem;
                }

                @media screen and (max-width: 768px){
                    font-size: 3.4rem;
                }
            }
            &:last-child {
                font-size: 3.2rem;
                font-weight: bold;

                        
                @media screen and (max-width: 1024px){
                    font-size: 5rem;
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
</style>