import {ref} from "vue";

export const frontTitle = 'Frontend крут, потому что позволяет создавать интерактивные и визуально привлекательные интерфейсы, которые напрямую влияют на пользовательский опыт'
export const backTitle = 'Бэкенд крут, потому что обеспечивает надежную работу серверов, баз данных и логики приложений'
export const archTitle = `Архитектура и паттерны в веб-программировании помогают писать код так, чтобы его было легко понимать, менять и дополнять. .`






export const frontendSkills = ref([
    {title: 'Vue', description: 'Лёгкий старт и быстрая разработка', label: 'Подходит новичкам', class: 'devicon-vuejs-plain'},
    {title: 'React',  description: 'База для крупных компаний', label: 'Фаворит на рынке', class: 'devicon-react-original colored' },
    {title: 'Typescript',  description: 'Контроль типов = меньше багов', label: 'Must-have в 2026', class: 'devicon-typescript-plain colored' },
    {title: 'Javascript',  description: 'Основа всего фронтенда', label: 'Это база', class:  'devicon-javascript-plain colored',  },

])

export const frontendAchievments = ref([
    {title: 'Верстать современные интерфейсы',   label: 'Практика', class: 'devicon-vuejs-plain'},
    {title: 'Работать с состоянием и API', label: 'Поддержка', class: 'devicon-react-original colored' },
    {title: 'Писать чистый код', label: 'Конкурентность', class: 'devicon-typescript-plain colored' },
    {title: 'Создавать мощный аккаунт в GIT',  label: 'Актуально в 2026', class:  'devicon-javascript-plain colored',  },

])

export const contentsBack = ref([
    {
        title: 'Node.js',
        description: 'Высокая скорость и масштабируемость',
        label: 'Де-факто стандарт',
        class: 'devicon-nodejs-plain colored'
    },
    {
        title: 'NestJS',
        description: 'Архитектура и порядок из коробки',
        label: 'Выбор для продакшена',
        class: 'devicon-nestjs-plain colored'
    },
    {
        title: 'Python',
        description: 'Быстрая разработка и аналитика',
        label: 'Любимчик data-команд',
        class: 'devicon-python-plain colored'
    },
    {
        title: 'FastAPI',
        description: 'Асинхронность и высокая производительность',
        label: 'Тренд 2026',
        class: 'devicon-fastapi-plain colored'
    },
])


export const backendAchievments = ref([
    {
        title: 'Проектировать и писать API',
        label: 'Основа бэкенда',
        class: 'devicon-nodejs-plain colored'
    },
    {
        title: 'Реализовывать бизнес-логику',
        label: 'Ценность продукта',
        class: 'devicon-nestjs-plain colored'
    },
    {
        title: 'Обеспечивать безопасность и авторизацию',
        label: 'Обязательный навык',
        class: 'devicon-lock-plain'
    },
    {
        title: 'Готовить сервис к продакшену',
        label: 'Реальный мир',
        class: 'devicon-docker-plain colored'
    }
])

export const contentsArch = ref([

    {
        title: 'MVVM',
        description: 'Удобная работа с состоянием и UI',
        label: 'Популярен во фронтенде',
        class: 'devicon-bazel-plain colored'
    },

    {
        title: 'CQRS',
        description: 'Разделение команд и запросов',
        label: 'Для сложной бизнес-логики',
        class: 'devicon-ionic-original colored'
    },
    {
        title: 'FSD',
        description: 'Feature-Sliced подход к структуре фронтенда',
        label: 'Стандарт современного UI',
        class: 'devicon-detaspace-line colored'
    },
    {
        title: 'Microservices',
        description: 'Независимые сервисы и масштабирование',
        label: 'Enterprise-уровень',
        class: 'devicon-cloudflare-plain colored'
    },
])

export const architectureAchievments = ref([
    {
        title: 'Выбирать архитектуру под задачу',
        label: 'Инженерное мышление',
        class: 'devicon-architecture-line'
    },
    {
        title: 'Разделять ответственность в коде',
        label: 'Поддерживаемость',
        class: 'devicon-architecture-line'
    },
    {
        title: 'Структурировать фронтенд по FSD',
        label: 'Современный стандарт',
        class: 'devicon-architecture-line'
    },
    {
        title: 'Масштабировать приложение без переписывания',
        label: 'Взгляд в будущее',
        class: 'devicon-architecture-line'
    }
])