# Документация UpdateProfile.vue

## Описание изменений

Компонент `UpdateProfile.vue` был обновлен для корректной отправки данных формы с файлом (аватаром) на сервер.

## Проблемы в старой версии

1. **Неполный FormData**: В FormData добавлялся только файл аватара, остальные поля формы не включались
2. **Неиспользуемая логика**: Объект `ROLE_FORMDATA` создавался, но не использовался
3. **Смешанный подход**: Данные передавались и как объект, и как FormData одновременно
4. **Два запроса**: Данные пользователя и файл отправлялись отдельными запросами

## Новая реализация

### Вариант 1: Единый FormData запрос (ТЕКУЩИЙ)

**Описание**: Все данные формы (текстовые поля + файл) отправляются в одном `multipart/form-data` запросе.

**Преимущества**:
- ✅ Один HTTP запрос вместо двух
- ✅ Атомарность операции (все данные обновляются вместе)
- ✅ Стандартный подход для форм с файлами
- ✅ Меньше нагрузка на сервер

**Требования к бэкенду**:
Эндпоинт `PATCH /user/full/:id` должен:
- Принимать `Content-Type: multipart/form-data`
- Обрабатывать текстовые поля из FormData
- Обрабатывать файл аватара из FormData
- Корректно парсить JSON-строки (например, `learn_directions`)

**Пример запроса**:
```javascript
// FormData содержит:
{
  avatar: File,                              // файл изображения
  first_name: "Иван",                        // строка
  last_name: "Иванов",                       // строка
  email: "ivan@example.com",                 // строка
  phone: "+79123456789",                     // строка
  about: "О себе...",                        // строка (опционально)
  status: "active",                          // строка (опционально)
  level: "junior",                           // строка (опционально)
  role: "student",                           // строка
  learn_direction: "1",                      // строка (ID)
  learn_directions: "[1, 2, 3]",            // JSON-строка (массив ID)
  mentorId: "42"                            // строка (ID)
}
```

### Вариант 2: Два отдельных запроса (АЛЬТЕРНАТИВНЫЙ)

**Описание**: Текстовые данные и файл отправляются отдельными запросами.

**Когда использовать**:
- Бэкенд не поддерживает прием всех данных в одном multipart/form-data запросе
- Есть отдельные эндпоинты для данных и файла

**Реализация**:
См. комментарии в коде `UpdateProfile.vue` и `store.ts` с пометкой "АЛЬТЕРНАТИВНЫЙ ВАРИАНТ".

## Структура изменений

### 1. UpdateProfile.vue

**Функция `onSubmit()`**:
```typescript
async function onSubmit() {
    const formData = new FormData()
    
    // Добавляем файл
    if (imageFile.value) {
        formData.append('avatar', imageFile.value)   
    }
    
    // Добавляем все текстовые поля
    formData.append('first_name', form.first_name || '')
    formData.append('last_name', form.last_name || '')
    // ... остальные поля
    
    // Отправляем
    await userStore.updateProfile(id, formData, imageFile.value !== null)
}
```

### 2. store.ts

**Функция `updateProfile()`**:
```typescript
async function updateProfile(id: number, formData: FormData, hasFile: boolean) {
    return userApi.updateProfileWithFormData(id, formData)
}
```

### 3. api/index.ts

**Новый метод API**:
```typescript
updateProfileWithFormData(id, formData) {
    return axiosInstance.patch(`/user/full/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
```

## Как использовать

### Для фронтенда

Компонент готов к использованию. Просто передайте нужные props:

```vue
<UpdateProfile :role="RoleList.STUDENT" :id="userId" />
```

### Для бэкенда

Убедитесь, что эндпоинт `PATCH /user/full/:id` настроен для приема multipart/form-data:

**Node.js (Express + multer)**:
```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.patch('/user/full/:id', upload.single('avatar'), async (req, res) => {
    const { id } = req.params;
    const file = req.file;           // файл аватара
    const data = req.body;           // текстовые поля
    
    // Обработка данных
    // Не забудьте распарсить JSON-строки:
    if (data.learn_directions) {
        data.learn_directions = JSON.parse(data.learn_directions);
    }
    
    // Обновление пользователя...
});
```

**NestJS**:
```typescript
@Patch('/user/full/:id')
@UseInterceptors(FileInterceptor('avatar'))
async updateProfile(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateProfileDto
) {
    // dto.learn_directions - может быть строкой, нужно распарсить
    if (typeof dto.learn_directions === 'string') {
        dto.learn_directions = JSON.parse(dto.learn_directions);
    }
    
    // Обновление пользователя...
}
```

## Тестирование

### Проверка отправки данных

Откройте DevTools → Network → XHR и проверьте запрос:

1. **Request URL**: `PATCH /user/full/{id}`
2. **Content-Type**: `multipart/form-data; boundary=...`
3. **Request Payload**: должен содержать все поля + файл

### Типичные проблемы

| Проблема | Причина | Решение |
|----------|---------|---------|
| Бэкенд не получает текстовые поля | Не настроен парсер multipart/form-data | Добавьте middleware (multer, busboy) |
| Массивы приходят как строки | FormData не поддерживает массивы напрямую | Отправляйте как JSON-строки и парсите на бэкенде |
| Файл не приходит | Неверное имя поля | Убедитесь, что используется `formData.append('avatar', file)` |
| 415 Unsupported Media Type | Неверный Content-Type | Проверьте заголовок `Content-Type: multipart/form-data` |

## Миграция со старой версии

Если вы используете старую версию с двумя запросами:

1. Обновите бэкенд для поддержки multipart/form-data
2. Замените код в `UpdateProfile.vue` новой версией
3. Обновите `store.ts` и `api/index.ts`
4. Протестируйте отправку формы

## Дополнительные возможности

### Валидация перед отправкой

```typescript
async function onSubmit() {
    // Валидация
    if (!form.first_name || !form.last_name) {
        notifyError('Заполните обязательные поля');
        return;
    }
    
    // Отправка...
}
```

### Индикатор загрузки

```typescript
const isLoading = ref(false);

async function onSubmit() {
    try {
        isLoading.value = true;
        // Отправка...
    } finally {
        isLoading.value = false;
    }
}
```

## Заключение

Обновленный компонент реализует стандартный и корректный подход к отправке форм с файлами. Все данные отправляются в одном запросе, что повышает производительность и атомарность операции.
