<script setup lang="ts">
import {LESSON_DURATION} from "@/features/payments/types";
import {computed, reactive, watch} from "vue";
import {studentPaymentApi} from "@/features/payments/api";
import StartPayment from "@/features/payments/components/StartPayment.vue";
import {LESSON_TYPES} from "@/features/lessons/types";
interface IProps {
  title: string;
}

interface IData {
  duration: LESSON_DURATION | null;
  lessonType: LESSON_TYPES | null;
  lessonCount: number | null;
}
const data: IData = {
  duration: null,
  lessonCount: null,
  lessonType: null,
}

const durations = [LESSON_DURATION.MIN, LESSON_DURATION.AVERAGE, LESSON_DURATION.MAX];
const lessonCount = [5, 10, 15, 20];
const lessonTypes = [{label: 'Базовый', value: LESSON_TYPES.BASE}, {label: 'Групповой', value: LESSON_TYPES.GROUP}];
const paymentData = reactive({...data})

const calculatedData = reactive({
  amount: 0,
  description: '',
})

const isDisabled = computed(() => paymentData.lessonType === LESSON_TYPES.GROUP);

const body = computed(() => {
  if (!paymentData.duration || !paymentData.lessonType || !paymentData.lessonCount) {
    return;
  }
  
  return {
    amount: calculatedData.amount,
    lesson_duration: paymentData.duration,
    lessons_count: paymentData.lessonCount,
    lessonType: paymentData.lessonType,
  }
})
async function calculatePayment() {
  try {
    const {data} = await studentPaymentApi.calculatePayment(paymentData)
    
    calculatedData.amount = data.amount
    calculatedData.description = data.description
  }
  
  catch (error) {
    console.log(error);
  }
}

watch(paymentData, async (value) => {
  if (!value.lessonCount || !value.duration) {
    return
  }
  
  calculatePayment()
  
})

watch(isDisabled, async (value) => {
  if (value) {
    paymentData.duration = LESSON_DURATION.AVERAGE
    paymentData.lessonCount = 10
  }
})
</script>

<template>
  <div>
    <el-form class="selects" label-position="top">
      
      <el-form-item label="Длительность занятий" >
        <el-select v-model="paymentData.duration" placeholder="Длительность занятий" :disabled="isDisabled">
          <el-option
              v-for="option of durations"
              :key="option"
              :label="option"
              :value="option"
          />
        </el-select>
      </el-form-item>
 

      <el-form-item label="Количество занятий">
        <el-select v-model="paymentData.lessonCount" placeholder="Количество занятий" :disabled="isDisabled">
          <el-option
              v-for="option of lessonCount"
              :key="option"
              :label="option"
              :value="option"
          />
        </el-select>    
      </el-form-item>

      <el-form-item label="Тип занятий">
        <el-select v-model="paymentData.lessonType" placeholder="Тип занятий">
          <el-option
              v-for="option of lessonTypes"
              :key="option.value"
              :label="option.label"
              :value="option.value"
          />
        </el-select>
      </el-form-item>
 

      <div class="content">
        <div v-if="calculatedData.description" v-html="calculatedData.description"/>

        <h4 v-if="calculatedData.amount">Итого к оплате: {{calculatedData.amount}} рублей</h4>
      </div>
      
      <StartPayment 
          v-if="calculatedData.amount && calculatedData.description"
          :body="body"
      />
    </el-form>
 
 
  </div>
</template>

<style scoped lang="scss">
.selects {
  display:grid;
  grid-template-columns: 1fr;
}

.content {
  display: grid;
  row-gap: 1rem;
}
</style>