<template>
	<div>
		<h1>Cronogramas de riego</h1>
		<ErrorMessage v-if="errorMessage" :message="errorMessage"/>
		<CreateScheduleModal 
		@scheduleAdded="refreshData"
		@errorOccurred="handleError"/>
		<div v-if="isLoading">Cargando datos...</div>
		<table v-else-if="schedules">
		<thead>
			<tr>
				<th>Fecha de riego</th>
				<th>Hora de inicio</th>
				<th>Hora de fin</th>
				<th>Estado</th>
				<th>Cultivo</th>
				<th>Creado</th>
				<th>Actualizado</th>
				<th>Acción</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(schedule, index) in schedules" :key="index">
				<td>{{ schedule.date }}</td>
				<td>{{ schedule.startTime }}</td>
				<td>{{ schedule.endTime }}</td>
				<td>{{ schedule.status }}</td>
				<td>{{ schedule.cropName }}</td>
				<td>{{ schedule.createdAt }}</td>
				<td>{{ schedule.updatedAt }}</td>
				<td v-if="schedule.status === 'Pendiente'">
					<button @click="cancelSchedule(schedule.id)">Cancelar</button>
					<UpdateScheduleModal
					:scheduleId="schedule.id"
					:scheduleStartTime="schedule.startTime"
					:scheduleEndTime="schedule.endTime"
					@scheduleUpdated="refreshData"
					@errorOccurred="handleError"/>
				</td>
			</tr>
		</tbody>
		</table>
	</div>
</template>

<script>
	import axios from "axios";
	import CreateScheduleModal from '../components/modals/CreateScheduleModal.vue';
	import UpdateScheduleModal from "../components/modals/UpdateScheduleModal.vue";
	import ErrorMessage from '../components/ErrorMessage.vue';

	export default {
		components: {
			CreateScheduleModal,
			UpdateScheduleModal,
			ErrorMessage,
		},
		
		data() {
			return {
				isLoading: true,
				errorMessage: null,
				serviceStatus: "",
				schedules: null,
			};
		},

		methods: {
			async cancelSchedule(id) {
				try {
					const response = await axios.post(`https://irrigation-suggester-mini-core-service.onrender.com/api/schedule/cancel`, {}, {
						params: { id },
						headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					});
					if (response.data.status === "SUCCESS") {
						this.refreshData();
					}
				} catch (error) {
					if (error.response.status === 403) {
							this.$router.push({ name: 'login' });
						} else if (error.response.status === 404) {
							this.errorMessage = `Error al cancelar el cronograma de riego: ${error.response.data.message}`;
						} else if (error.response.status === 422) {
							this.errorMessage = `Error al cancelar el cronograma de riego: ${error.response.data.message}`;
						} else if (error.response.status === 500) {
							this.errorMessage = 'Error interno del servidor. Inténtalo de nuevo más tarde.';
						} else {
							console.error(error)
						}
				}
			},

			async fetchSchedules() {
				try {
					const response = await axios.get("https://irrigation-suggester-mini-core-service.onrender.com/api/schedule/all", {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					});
					if (response.data.status === 'SUCCESS') {
						this.serviceStatus = response.data.status;
						this.schedules = response.data.data;
					}
				} catch (error) {
					if (error.response.status === 403) {
							this.$router.push({ name: 'login' });
						} else if (error.response.status === 404) {
							this.errorMessage = `Error al buscar cronogramas de riego: ${error.response.data.message}`;
						} else if (error.response.status === 500) {
							this.errorMessage = 'Error interno del servidor. Inténtalo de nuevo más tarde.';
						} else {
							console.error(error)
						}
					} finally {
						this.isLoading = false;
					}
			},

			handleError(message) {
				this.errorMessage = message;
			},

			refreshData() {
				this.isLoading = true;
				this.fetchSchedules();
				this.errorMessage = null;
			},
		},

			mounted() {
				this.refreshData();
			},

	};
</script>

<style>
	.loading-indicator {
	font-size: 18px;
	color: #555;
	margin: 20px 0;
	}
	table {
	width: 100%;
	border-collapse: collapse;
	}
	th, td {
	border: 1px solid #ddd;
	padding: 8px;
	}
	th {
	background-color: #f4f4f4;
	}
</style>
