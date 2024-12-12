<template>
    <div>
        <Modal ref="modal" buttonText="Crear nuevo cronograma de riego">
            <h2>Agregar nuevo cronograma de riego</h2>
            <form @submit.prevent="addSchedule">
                <!-- Campo para ingresar la hora de inicio -->
                <label for="scheduleStartTime">Hora de inicio:</label>
                <input type="time" id="scheduleStartTime" name="scheduleStartTime" v-model="scheduleData.startTime" min="00:00" max="23:59" step="1" required>
                <br>

                <!-- Campo para ingresar la duración de irrigación -->
                <label for="scheduleDuration">Duración:</label>
                <input type="time" id="scheduleDuration" name="scheduleDuration" v-model="duration" min="00:00" max="23:59" step="1" required>
                <br>

                <!-- Campo para ingresar la id del cultivo -->
                <label for="scheduleCropId">ID del cultivo:</label>
                <input type="number" id="scheduleCropId" name="scheduleCropId" v-model="scheduleData.cropId" step="1" min="1" required>
                <br>

                <button type="submit">Agregar</button>
            </form>
        </Modal>
    </div>
</template>

<script>

    import axios from 'axios';
    import Modal from '../modals/Modal.vue';
    import TimeService from '../../services/TimeService';

    export default {

        components: {
            Modal,
        },

        data() {
            return {
                serviceStatus: '',
                duration: null,
                scheduleData: {
                    startTime: null,
                    endTime: null,
                    cropId: null,
                }
            };
        },

        methods: {

            async addSchedule() {
                try {
                    this.scheduleData.endTime = TimeService.calculateEndTime(this.scheduleData.startTime, this.duration);
                    const response = await axios.post('http://localhost:8082/api/schedule/create', this.scheduleData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    if (response.data.status === 'SUCCESS') {
                        this.$emit('scheduleAdded');
                        this.$refs.modal.closeModal();
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
                this.duration = null,
                this.scheduleData = {
                    startTime: null,
                    endTime: null,
                    cropId: null,
                };
            },

        },
    }

</script>