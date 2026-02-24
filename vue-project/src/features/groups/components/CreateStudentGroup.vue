<template>
	<el-form
		label-position="top"
		@submit.prevent="onSubmit"
	>
		<el-form-item label="Название группы">
			<el-input
			v-model="groupData.name" placeholder="Лихие фронтендеры..."/>
		</el-form-item>

		<el-form-item label="Описание группы">
			<el-input
			v-model="groupData.description" placeholder="Группа для уверенно начинающих"/>
		</el-form-item>

		<el-form-item label="Ментор">
			<el-select	v-model="groupData.mentorId">
				<el-option 
					v-for="item in mentors"
					:key="item.id"
					:label="item.fullname"
					:value="item.id"
 
				/>
			</el-select>
		</el-form-item>

		<el-form-item label="Студенты">
			<el-select v-model="groupData.studentIds" multiple>
				<el-option 	
					v-for="item in students"
					:key="item.id"
					:label="item.fullname"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>

		<el-button native-type="submit">Создать</el-button>
	</el-form>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { RoleList, type TUserFull } from "@/features/users/types";
import { userApi } from "@/features/users/api";
import { useGroupStore } from "../store";
import type { ICreateGroupDto } from "../types";
import { LESSON_TYPES } from "@/features/lessons/types";

const emits = defineEmits(['close'])

const groupStore = useGroupStore()
const users = ref<TUserFull[]>([])

const mentors = computed(() => users.value.filter(user => user.role === RoleList.MENTOR));
const students = computed(() => users.value.filter(user => user.role === RoleList.STUDENT && user.student_profile?.lessonFormat === LESSON_TYPES.GROUP));

const groupData = reactive<ICreateGroupDto>({
	name: '',
	description: '',
	mentorId: null,
	studentIds: [],
});

async function getUsers() {
	try {
		const {data} = await userApi.getAll({onlyGroup: 1})
		users.value = data
	} catch {

	}
}

async function onSubmit() {
	try {

		if (groupData.mentorId && groupData.studentIds.length == 2) {
			await groupStore.create(groupData)
			emits('close')
		}
 
	}
	catch {

	}
}


onMounted(() => getUsers())
</script>

<style lang="scss" scoped>
.CreateStudentGroup {
	//
}
</style>
