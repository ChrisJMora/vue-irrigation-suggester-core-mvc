<template>
	<div>
		<Modal ref="modal" buttonText="Aceptar sugerencia">
			<h2>Crear cronograma de riego</h2>
			<form @submit.prevent="addSchedule">
                <!-- Campo para ingresar la hora de inicio -->
                <label for="scheduleStartTime">Hora de inicio:</label>
                <input type="time" id="scheduleStartTime" name="scheduleStartTime" v-model="scheduleData.startTime" min="00:00" max="23:59" step="1" required>
                <br>

                <button type="submit">Aceptar</button>
            </form>
		</Modal>
	</div>
</template>

<script>
	import axios from 'axios';
	import Modal from '../modals/Modal.vue'
	import TimeService from '../../services/TimeService';

	export default {
		
		components: {
			Modal,
		},

		props: {
			cropId: {
				type: Number,
				required: true,
				default: null,
			},
			suggestedScheduleId: {
				type: Number,
				required: true,
				default: null,
			},
			irrigationDuration: {
				type: String,
				required: true,
				default: '00:00',
			}
		},

		data() {
			return {
				serviceStatus: '',
				errorMessage: null,
				scheduleData: {
					startTime: null,
					endTime: null,
					cropId: null,
				}
			};
		},

		methods: {

			async acceptSchedule() {
				try {
					const response = await axios.post(`http://localhost:8082/api/schedule/suggested/accept?id=${this.suggestedScheduleId}`, {}, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
							'Content-Type': 'application/json',
						}
					});
					if (response.data.status === 'SUCCESS') {
						this.$emit('suggestedScheduleAccepted');
						this.resetForm();
					}
				} catch (error) {
					if (error.response.status === 403) {
						this.$router.push({ name: 'login' });
                    } else if (error.response.status === 404) {
						this.triggerError(`Error al aceptar el cronograma de riego: ${error.response.data.message}`);
					} else if (error.response.status === 422) {
						this.triggerError(`Error al aceptar el cronograma de riego: ${error.response.data.message}`);
					} else if (error.response.status === 500) {
						this.triggerError('Error interno del servidor. Inténtalo de nuevo más tarde.');
					} else {
						console.error(error)
					}
				}
			},

			async addSchedule() {
				try {
					this.scheduleData.endTime = TimeService.calculateEndTime(this.scheduleData.startTime, this.irrigationDuration);
					this.scheduleData.cropId = this.cropId;
					const response = await axios.post('http://localhost:8082/api/schedule/create', this.scheduleData, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
							'Content-Type': 'application/json',
						}
					});
					if (response.data.status === 'SUCCESS') {
						this.$emit('scheduleAdded');
						this.acceptSchedule();
						this.resetForm();
					}
				} catch (error) {
					if (error.response.status === 403) {
						this.$router.push({ name: 'login' });
                    } else if (error.response.status === 422) {
						this.triggerError(`Error al agregar el cronograma de riego: ${error.response.data.message}`);
					} else if (error.response.status === 500) {
						this.triggerError('Error interno del servidor. Inténtalo de nuevo más tarde.');
					} else {
						console.error(error)
					}
				}
			},

			triggerError(error) {
				this.errorMessage = error;
				this.$emit('errorOccurred', this.errorMessage);
			},

			resetForm() {
                this.scheduleData = {
                    startTime: null,
					endTime: null,
                };
            },
		},
	};
</script>

<style>
	.error-message {
	color: red;
	margin-top: 10px;
	}
</style>
