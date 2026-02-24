# Рефакторинг Update Lesson Slot Handler

## Дата: 21 января 2026

## Файл: `src/lesson-slots/handlers/update-lesson-slot.handler.ts`

---

## Критические проблемы, которые были исправлены

### 1. Неправильная логика расчета штрафа (строка 189)

**Было:**
```typescript
finalAmount = finalAmount * (lesson.finePercent / 100) // ОШИБКА!
fineAmount = lesson.finePercent / 100; // ОШИБКА!
```

**Проблема:**
- Умножение вместо вычитания приводило к неправильному результату
- `fineAmount` был процентом, а не суммой
- Результат был математически некорректен

**Стало:**
```typescript
if (finePercent > 0) {
    fineAmount = Math.round(basePayoutAmount * (finePercent / 100));
    finalAmount = basePayoutAmount - fineAmount;
} else {
    finalAmount = basePayoutAmount;
}
```

---

### 2. Несогласованность в сценарии STUDENT_NO_SHOW

**Было:**
```typescript
case LESSON_STATUS_CHANGE_REASON.STUDENT_NO_SHOW:
    finalAmount = lesson.price * 0.2; // Фиксированное значение без учета ментора
    payoutStatus = 'pending';
    break;
```

**Проблема:**
- Не учитывался уровень ментора
- Фиксированный коэффициент 0.2 применялся ко всем
- Игнорировалась длительность занятия

**Стало:**
```typescript
case LESSON_STATUS_CHANGE_REASON.STUDENT_NO_SHOW:
    // Ментор получает полную оплату (не его вина)
    finalAmount = basePayoutAmount;
    break;
```

---

### 3. Дублирование логики в SCHEDULED_RESCHEDULE

**Было:**
```typescript
case LESSON_STATUS_CHANGE_REASON.SCHEDULED_RESCHEDULE:
    if (lessonPackage) {
        lessonPackage.usedCount = (lessonPackage.usedCount || 0) - 1;
        await entityManager.save(LessonPackage, lessonPackage);
    }
    // Использовалась логика MENTOR_LATE - НЕПРАВИЛЬНО!
    await this.createMentorPayout(entityManager, lessonSlot.lesson, mentorParticipant.userId, 'mentor_late');
    break;
```

**Проблема:**
- Плановый перенос обрабатывался как опоздание ментора
- Неправильно применялся штраф

**Стало:**
```typescript
case LESSON_STATUS_CHANGE_REASON.SCHEDULED_RESCHEDULE:
    // Возвращаем занятие в пакет
    if (lessonPackage) {
        lessonPackage.usedCount = Math.max(0, (lessonPackage.usedCount || 0) - 1);
        await entityManager.save(LessonPackage, lessonPackage);
    }
    // Без оплаты и штрафов (плановый перенос)
    finalAmount = 0;
    break;
```

---

### 4. Неполный набор коэффициентов ментора

**Было:**
```typescript
const MENTOR_KOEFICIENTS = {
    [MENTOR_TYPES.BASE]: 0.5,
    [MENTOR_TYPES.PREMIUM]: 0.75,
};
```

**Проблема:**
- Отсутствовали коэффициенты для JUNIOR, MIDDLE, SENIOR
- Менторы этих уровней получали 0 (дефолтное значение)

**Стало:**
```typescript
const MENTOR_COEFFICIENTS = {
    [MENTOR_TYPES.JUNIOR]: 0.4,
    [MENTOR_TYPES.MIDDLE]: 0.5,
    [MENTOR_TYPES.SENIOR]: 0.6,
    [MENTOR_TYPES.BASE]: 0.5,
    [MENTOR_TYPES.PREMIUM]: 0.75,
};
```

---

### 5. Путаница между amount, fineAmount и finalAmount

**Было:**
- `amount` использовался непоследовательно
- `fineAmount` иногда был процентом, иногда суммой
- `finalAmount` рассчитывался некорректно

**Стало:**
- `amount` = базовая цена занятия (lesson.price)
- `fineAmount` = сумма штрафа в рублях
- `finalAmount` = итоговая выплата ментору (может быть 0)

---

## Структурные улучшения

### 1. Добавлен интерфейс PayoutCalculation

```typescript
interface PayoutCalculation {
    amount: number;
    fineAmount: number;
    finalAmount: number;
    payoutStatus: string;
}
```

**Зачем:** Четкая типизация результатов расчета

---

### 2. Разделение логики на методы

**Было:** Один большой метод `createMentorPayout` со всей логикой

**Стало:** Два метода с четким разделением ответственности:
- `createMentorPayout()` - создание выплаты
- `calculatePayoutByScenario()` - расчет суммы выплаты

**Преимущества:**
- Легче тестировать
- Легче понимать логику
- Легче расширять функциональность

---

### 3. Улучшена валидация

**Добавлено:**
```typescript
if (!mentorParticipant.user?.mentor_profile) {
    throw new HttpException('Mentor profile not found', 404);
}
```

**Зачем:** Предотвращение ошибок при отсутствии профиля ментора

---

### 4. Улучшена обработка ошибок

**Было:**
```typescript
default:
    console.warn(`Unknown reason for status change: ${reason}`);
    break;
```

**Стало:**
```typescript
default:
    throw new HttpException(`Unknown reason for status change: ${reason}`, 400);
```

**Зачем:** Явное уведомление об ошибке вместо молчаливого игнорирования

---

## Правильная логика расчета

### Базовая формула

```typescript
// 1. Рассчитываем базовую выплату ментору
basePayoutAmount = lesson.price * mentorCoef * durationCoef

// 2. Применяем сценарий
switch (scenario) {
    case COMPLETED_SUCCESSFULLY:
        fineAmount = basePayoutAmount * (finePercent / 100)
        finalAmount = basePayoutAmount - fineAmount
        
    case STUDENT_NO_SHOW:
        finalAmount = basePayoutAmount // полная оплата
        
    case MENTOR_NO_SHOW:
        fineAmount = lesson.price * 0.5 // штраф 50%
        finalAmount = 0 // не получает оплату
        
    case MENTOR_LATE:
        fineAmount = lesson.price * 0.2 // штраф 20%
        finalAmount = basePayoutAmount * 0.5 // 50% оплаты
        
    case SCHEDULED_RESCHEDULE:
        finalAmount = 0 // без оплаты и штрафов
}
```

---

## Примеры исправления багов

### Баг 1: Ментор PREMIUM на занятии 5000 руб со штрафом 10%

**Было:**
```
finalAmount = 3750 * 0.1 = 375 руб ❌
fineAmount = 0.1 руб ❌
```

**Стало:**
```
basePayoutAmount = 5000 * 0.75 = 3750 руб
fineAmount = 3750 * 0.1 = 375 руб ✅
finalAmount = 3750 - 375 = 3375 руб ✅
```

---

### Баг 2: Ученик не пришел, ментор MIDDLE, занятие 4000 руб

**Было:**
```
finalAmount = 4000 * 0.2 = 800 руб ❌ (игнорируется уровень ментора)
```

**Стало:**
```
basePayoutAmount = 4000 * 0.5 = 2000 руб
finalAmount = 2000 руб ✅ (ментор получает полную оплату)
```

---

### Баг 3: Плановый перенос использовал логику опоздания

**Было:**
```
fineAmount = 4000 * 0.2 = 800 руб ❌ (штраф за плановый перенос!)
finalAmount = 0 руб
```

**Стало:**
```
fineAmount = 0 руб ✅
finalAmount = 0 руб ✅
usedCount -= 1 ✅ (возврат в пакет)
```

---

## Тестирование

### Рекомендуемые тест-кейсы:

1. **COMPLETED_SUCCESSFULLY**
   - Без штрафа (finePercent = 0)
   - Со штрафом 10%, 20%, 50%
   - Разные уровни менторов
   - Разная длительность занятий

2. **STUDENT_NO_SHOW**
   - Все уровни менторов
   - Проверка полной выплаты

3. **MENTOR_NO_SHOW**
   - Проверка нулевой выплаты
   - Проверка штрафа 50%
   - Возврат занятия в пакет

4. **MENTOR_LATE**
   - Проверка 50% выплаты
   - Проверка штрафа 20%

5. **SCHEDULED_RESCHEDULE**
   - Проверка нулевой выплаты
   - Отсутствие штрафа
   - Возврат занятия в пакет

---

## Безопасность

### Транзакции
Все операции выполняются в транзакции:
```typescript
return await this.entityManager.transaction(async transactionalEntityManager => {
    // Обновление слота
    // Создание выплаты
    // Обновление пакета занятий
});
```

### Защита от ошибок
- Проверка наличия ментора и ученика
- Проверка наличия профиля ментора
- Валидация сценария
- Использование `Math.max(0, ...)` при работе с usedCount

---

## Логирование

Добавлено подробное логирование расчетов:
```typescript
console.log('Payout calculation:', {
    scenario,
    mentorLevel,
    baseAmount,
    duration: lesson.duration,
    finePercent: lesson.finePercent,
    result: payoutCalculation
});
```

Это поможет в отладке и анализе выплат.

---

## Обратная совместимость

### Изменения в API: НЕТ
Сигнатура команды `UpdateLessonSlotCommand` не изменилась

### Изменения в БД: НЕТ
Структура таблиц не менялась

### Изменения в контрактах: НЕТ
DTO остались без изменений

---

## Рекомендации по развертыванию

1. Протестировать на staging окружении
2. Проверить все 5 сценариев с реальными данными
3. Проверить логи расчетов
4. Сравнить результаты со старой версией
5. После успешного тестирования - развернуть на production

---

## Дополнительные улучшения (возможны в будущем)

1. Вынести коэффициенты в конфигурацию БД
2. Добавить историю изменений выплат
3. Добавить возможность отмены/корректировки выплат
4. Добавить систему уведомлений для менторов
5. Добавить аналитику по выплатам
