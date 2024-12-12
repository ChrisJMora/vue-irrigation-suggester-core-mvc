<template>
    <div>
        <Modal ref="modal" buttonText="Actualizar">
            <h2>Actualizar cronograma de riego</h2>
            <form @submit.prevent="updateSchedule">
                <!-- Campo para ingresar la hora de inicio -->
                <label for="scheduleStartTime">Hora de inicio:</label>
                <input type="time" id="scheduleStartTime" name="scheduleStartTime" v-model="scheduleData.startTime" min="00:00" max="23:59" step="1" required>
                <br>

                <!-- Campo para ingresar la duración de irrigación -->
                <label for="scheduleDuration">Duración:</label>
                <input type="time" id="scheduleDuration" name="scheduleDuration" v-model="duration" min="00:00:00" max="23:59:59" step="1" required>
                <br>

                <button type="submit">Actualizar</button>
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

        props: {
            scheduleId: {
                type: Number,
                required: true,
                default: null,
            },
            scheduleStartTime: {
                type: String,
                required: true,
                default: '00:00:00',
            },
            scheduleEndTime: {
                type: String,
                required: true,
                default: '00:00:00',
            },
        },

        data() {
            return {
                serviceStatus: '',
                duration: null,
                scheduleData: {
                    id: null,
                    startTime: null,
                    endTime: null,
                }
            };
        },

        methods: {

            async updateSchedule() {
                try {
                    this.scheduleData.id = this.scheduleId;
                    this.scheduleData.endTime = TimeService.calculateEndTime(this.scheduleData.startTime, this.duration);
                    const response = await axios.post('https://irrigation-suggester-mini-core-service.onrender.com/api/schedule/update', this.scheduleData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    if (response.data.status === 'SUCCESS') {
                        this.$emit('scheduleUpdated');
                        this.resetForm();
                    }
                } catch (error) {
                    if (error.response.status === 403) {
						this.$router.push({ name: 'login' });
                    } else if (error.response.status === 422) {
						this.triggerError(`Error al actualizar el cultivo: ${error.response.data.message}`);
					} else if (error.response.status === 500) {
						this.triggerError('Error interno del servidor. Inténtalo de nuevo más tarde.');
					} else {
						console.error(error)
					}
                } finally {
                    this.$refs.modal.closeModal();
                }
            },

            triggerError(error) {
				this.errorMessage = error;
				this.$emit('errorOccurred', this.errorMessage);
			},

            resetForm() {
                this.duration = null,
                this.scheduleData = {
                    id: null,
                    startTime: null,
                    endTime: null,
                };
            },

        },

        mounted() {
            this.scheduleData.startTime = this.scheduleStartTime;
            this.duration = TimeService.calculateDuration(this.scheduleStartTime, this.scheduleEndTime);
        }
    }

</script>