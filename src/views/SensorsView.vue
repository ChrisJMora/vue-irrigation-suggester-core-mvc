<template>
	<div>
		<h1>Registros de los sensores de humdedad</h1>
		<ErrorMessage v-if="errorMessage" :message="errorMessage"/>
		<div v-if="isLoading">Cargando datos...</div>
		<table v-else-if="sensorRecords">
			<thead>
			<tr>
				<th>Cantidad de precipitación</th>
				<th>Fecha</th>
				<th>Hora</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(item, index) in sensorRecords" :key="index">
				<td>{{ (item.humidity * 100).toFixed(2) }} %</td>
				<td>{{ item.date }}</td>
				<td>{{ item.time }}</td>
			</tr>
			</tbody>
		</table>
	</div>
  </template>
  
<script>

	import axios from 'axios';
	import ErrorMessage from '../components/ErrorMessage.vue';

	export default {

		components: {
			ErrorMessage,
      	},

		data() {
			return {
				isLoading: true,
				errorMessage: null,
				serviceStatus: "",
				sensorRecords: null,
			};
		},

		methods: {
			async fetchSensorsRecords() {
				try {
                    const response = await axios.get('http://localhost:8082/api/sensor/all',
                    {
                        headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        }
                    }
                    )
                    if (response.data.status === 'SUCCESS') {
						this.serviceStatus = response.data.status;
						this.sensorRecords = response.data.data;
                    }
                } catch (error) {
                    if (error.response.status === 403) {
						this.$router.push({ name: 'login' });
                    } else if (error.response.status === 404) {
						this.errorMessage = `Error al buscar registros de sensores: ${error.response.data.message}`;
					} else if (error.response.status === 500) {
						this.errorMessage = 'Error interno del servidor. Inténtalo de nuevo más tarde.';
					} else {
						console.error(error)
					}
                } finally {
					this.isLoading = false;
				}
			},

			refreshData() {
				this.isLoading = true;
				this.fetchSensorsRecords();
				this.errorMessage = null;
			},

		},

		mounted() {
			this.refreshData();
		},
	};
</script>
  