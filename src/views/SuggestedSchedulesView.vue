<template>
	<div>
		<h1>Cronogramas de riego sugeridos</h1>
		<ErrorMessage v-if="errorMessage" :message="errorMessage"/>
		<div v-if="isLoading">Cargando datos...</div>
		<table v-else-if="suggestedSchedules">
			<thead>
				<tr>
					<th>Tiempo de riego</th>
					<th>Estado</th>
					<th>Cultivo</th>
					<th>Creado</th>
					<th>Actualizado</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="suggestedSchedule in suggestedSchedules" :key="suggestedSchedule.id">
					<td>{{ suggestedSchedule.delayTime }}</td>
					<td>{{ suggestedSchedule.status }}</td>
					<td>{{ suggestedSchedule.cropName }}</td>
					<td>{{ suggestedSchedule.createdAt }}</td>
					<td>{{ suggestedSchedule.updatedAt }}</td>
					<td v-if="suggestedSchedule.status === 'Pendiente'">
						<AcceptSuggestedScheduleModal 
						:suggestedScheduleId="suggestedSchedule.id"
						:cropId="suggestedSchedule.cropId"
						:irrigationDuration="suggestedSchedule.delayTime"
						@suggestedScheduleAccepted="refreshData"
						@errorOccurred="handleError"/>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import axios from "axios";
	import AcceptSuggestedScheduleModal from "../components/modals/AcceptSuggestedScheduleModal.vue";
	import ErrorMessage from "../components/ErrorMessage.vue";

	export default {

		components: {
			AcceptSuggestedScheduleModal,
			ErrorMessage,
		},

		data() {
			return {
				isLoading: true,
				errorMessage: null,
				serviceStatus: "",
				suggestedSchedules: null,
			};
		},

		methods: {
			async fetchSuggestedSchedules() {
				try {
					const response = await axios.get('https://irrigation-suggester-mini-core-service.onrender.com/api/schedule/suggested/all',
					{
						headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						}
					}
					)
					if (response.data.status === 'SUCCESS') {
						this.serviceStatus = response.data.status;
						this.suggestedSchedules = response.data.data;
					}
				} catch (error) {
					if (error.response.status === 403) {
						this.$router.push({ name: 'login' });
                    } else if (error.response.status === 404) {
						this.errorMessage = `Error al buscar cronogramas de riego sugeridos: ${error.response.data.message}`;
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
				this.fetchSuggestedSchedules();
				this.errorMessage = null;
			}
		},

		mounted() {
			this.refreshData();
		},
	};
</script>
