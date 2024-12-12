<template>
	<div>
		<h1>Prónosticos de lluvia</h1>
		<ErrorMessage v-if="errorMessage" :message="errorMessage"/>
		<button @click="setRandomForecast()">Actualizar pronóstico de hoy</button>
		<div v-if="isLoading">Cargando datos...</div>
		<table v-else-if="forecasts">
			<thead>
			<tr>
				<th>Cantidad de precipitación</th>
				<th>Fecha</th>
				<th>Latitud</th>
				<th>Longitud</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(forecast, index) in forecasts" :key="index">
				<td>{{ forecast.precipitation }} l/m2</td>
				<td>{{ forecast.date }}</td>
				<td>{{ forecast.location.latitude }}</td>
				<td>{{ forecast.location.longitude }}</td>
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
				forecasts: null,
			};
		},

		methods: {

			async setRandomForecast() {
                try {
                    const response = await axios.post('http://localhost:8082/api/forecast/random', {}, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    if (response.data.status === 'SUCCESS') {
						this.serviceStatus = response.data.status;
						this.refreshData();
                    }
                } catch (error) {
					if (error.response.status === 403) {
						this.$router.push({ name: 'login' });
                    } else if (error.response.status === 404) {
						this.errorMessage = `Error al modificar pronóstico de hoy: ${error.response.data.message}`;
					} else if (error.response.status === 422) {
						this.errorMessage = `Error al modificar pronóstico de hoy: ${error.response.data.message}`;
					} else if (error.response.status === 500) {
						this.errorMessage = 'Error interno del servidor. Inténtalo de nuevo más tarde.';
					} else {
						console.error(error)
					}
                }
            },

			async fetchForecasts() {
				try {
                    const response = await axios.get('http://localhost:8082/api/forecast/all',
                    {
                        headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        }
                    }
                    )
                    if (response.data.status === 'SUCCESS') {
						this.serviceStatus = response.data.status;
						this.forecasts = response.data.data;
                    }
                } catch (error) {
                    if (error.response.status === 403) {
						this.$router.push({ name: 'login' });
                    } else if (error.response.status === 404) {
						this.errorMessage = `Error al buscar pronósticos: ${error.response.data.message}`;
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
				this.fetchForecasts();
				this.errorMessage = null;
			},
		},

		mounted() {
			this.refreshData();
		},
	};
</script>
  