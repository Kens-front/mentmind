<template>
  <div id="form" class="form_wrap">
    <form @submit.prevent.stop="onSubmit" class="form">
      <div class="image" :style="{backgroundImage: `url(${image})`}">

      </div>

      <transition>
        <div v-if="status === 'pending'" class="inputs">
          <h2 class="title-main">Свяжемся с Вами в ближайшее время</h2>
          <q-input v-model="formData.name" ref="nameRef" label="Ваше имя" color="white" />
          <q-select v-model="formData.method" label="Предпочтительный способ связи" :options="options" behavior="menu"/>
          <q-input v-model="formData.callbackMethod" ref="methodCallbackRef" :label="userMethod?.label" :placeholder="userMethod?.placeholder" color="white"/>
          <q-input v-model="text" label="Ваш комметарий" type="textarea" color="white"/>
          <div class="checkbox">
            <q-item class="item" tag="label" v-ripple>
              <q-checkbox v-model="formData.checkbox" checked-icon="task_alt"
                          unchecked-icon="highlight_off"/>
              <q-item-section>
                <q-item-label>Я принимаю условия и даю <a target="_blank" href="/api/uploads/policy/agreement.pdf">согласие на обработку данных</a> в соответствии
                  с <a target="_blank" href="/api/uploads/policy/policy.pdf">Политикой обработки персональных данных</a></q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <button  type="submit" class="btn">Связаться</button>
        </div>
      </transition>

      <div class="footer">
        <div class="trust-line">🔒 Работаем официально и бережно относимся к вашим данным</div>
        <div class="footer-divider"></div>
        <div class="legal-line">
          ИП Пасечник Константин Константинович · ИНН 1231231231 ·
          <a href="#">Политика конфиденциальности</a>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { QSelect } from 'quasar';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import image from '../public/assets/4.png';
import MentMind from '../public/assets/mentmind.png';
import { QInput } from 'quasar';
import { ref } from 'vue';
import { metrikaApi } from '~/features/api';
import { useQuasar } from 'quasar'
// Регистрируем плагин
gsap.registerPlugin(ScrollTrigger)
const $q = useQuasar()
const formData = reactive({
  name: '',
  method: 'Email',
  checkbox: true,
  callbackMethod: ''
});

const emailRules = [
  (val:string) => val.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) || 'Введите корректную почту'
]
const text = ref('');
const options = [
  'Телефон',
  'VK',
  'Telegram',
  'Email'
];

const PLACEHOLDERS: Record<string, {label: string, placeholder: string}> = {
  'Телефон': {
    label: 'Ваш телефон',
    placeholder: '+7(xxx)xxx-xx-xx'
  },
  'VK': {
    label: 'Ваш ник',
    placeholder: '@exemaple'
  },
  'Telegram': {
    label: 'Ваш ник',
    placeholder: '@exemaple'
  },
  'Email': {
    label: 'Ваш емайл',
    placeholder: 'exemaple@mail.ru'
  }
}
const status = ref('pending')
const userMethod = computed(() => PLACEHOLDERS[formData.method]);
const nameRef = ref(null)
const methodCallbackRef = ref(null)
async function onSubmit() {
  try {
    
    const {name, method, callbackMethod} = formData;
    const response = await fetch('http://mentmind.ru/api/request', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, method, callbackMethod, text: text.value}),
    })

    $q.notify({
      type: 'positive',
      message: 'Уже обрабатываем Вашу заявку',
      progress: true,
      position: 'top'
    })

    Object.assign(formData, {
      name: '',
      method: 'Email',
      checkbox: true,
      callbackMethod: ''
    });
  } catch(e) {
    $q.notify({
      type: 'negative',
      message: 'Что-то пошло не так, попробуйте чуть позже',
      progress: true,
      position: 'top'
    })
    console.log(e);
  }
}




onMounted( async () => {

  await nextTick();

  const section = document.querySelector('.form_wrap');

  const observer = new IntersectionObserver(onSetMetrik, {
    threshold: 0.8
  })


  if (section) {
    observer.observe(section)
  }


  function onSetMetrik(entries: IntersectionObserverEntry []) {
    if (entries[0]?.isIntersecting) {
      const sessionId = localStorage.getItem('sessionId')
      const dto = {
        event: 'formView',
        id: sessionId
      }

      metrikaApi.create(dto).then(() => {
        observer.unobserve(section!)
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.form_wrap {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100dvh;

  &:after {
    position: absolute;
    z-index: 2;
    right: 0;
    width: 100%;
    height: 100%;
    content: '';
    display: block;
    background: url('../../public/assets/sky.png') no-repeat center/cover;
    mix-blend-mode: color-burn;
  }

  @media screen and (max-width: 768px) {
    display: grid;
    grid-template-rows: 1fr max-content;
  }
}


.form {
  position: relative;
  background: linear-gradient(
          31deg, #3b255fa8, #241437);
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  max-width: 85%;
  margin: 2rem auto;
  width: 100%;
  height: 90%;
  padding: 2rem;
  gap: 2rem;
  color: #fff;
  box-shadow: 1px 1px 40px #2D1B4A;
  border-radius: 2rem;
  box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.08),
      0 30px 80px rgba(0,0,0,0.45);
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media screen and (max-width: 768px) {
    padding: 4rem;
    max-width: 95%;
  }

  &:after {
    position: absolute;
    z-index: 2;
    right: 0;
    width: 100%;
    height: 100%;
    content: '';
    display: block;
    background: url('../public/assets/sky.png') no-repeat center/cover;
    mix-blend-mode: multiply;
  }

  &:hover {

    .image {
      transform: perspective(1200px) rotateY(20deg);
    }
  }
}

.image {
  background-size: contain;
  background-repeat: no-repeat;
  transform: perspective(1200px) rotateY(0deg);
  transition: .8s ease-in-out;

  @media screen and (max-width: 1024px) {
    display: none;
  }
}

.btn {
  background-color: white;
  color: black;
  border-radius: 10em;
  font-size: 17px;
  font-weight: 600;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: 1px solid black;
  box-shadow: 0 0 0 0 black;
  height: max-content;
  align-self: anchor-center;
}

.btn:hover {
  transform: translateY(-4px) translateX(-2px);
  box-shadow: 2px 5px 0 0 black;
};

.btn:active {
  transform: translateY(2px) translateX(1px);
  box-shadow: 0 0 0 0 black;
};

.inputs {
  display: grid;
  position: relative;
  z-index: 5;
}

.footer {
  grid-column: 2 span;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: end;
}


.title {
  font-size: 8rem;
}

.description {
  font-size: 4rem;
}

h3 {
  font-size: 18px;
  font-weight: 400;
  opacity: 0.85;
  margin-bottom: 24px;
  line-height: 100%;

  @media screen and (max-width: 768px) {
    text-align: center;
  }
}

.trust-line {
  font-size: 13px;
  opacity: 0.85;
  margin-top: 16px;

  @media screen and (max-width: 768px) {
    font-size: 10px;
  }
}

.footer-divider {
  margin: 12px 0;
  height: 1px;
  background: linear-gradient(
          to right,
          transparent,
          rgba(255,255,255,0.25),
          transparent
  );
}

.legal-line {
  font-size: 11px;
  opacity: 0.5;
  line-height: 1.4;
}

.legal-line a {
  text-decoration: underline;
}

.checkbox {
  a {
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  & .item {
    padding: 8px 0;
    font-size: 10px;
  }
}

.title-main {
  @media screen and (max-width:1024px) {
    font-size: 6rem;
    text-align: center;
    line-height: 100%;
  }
}
</style>