<template>
    <div>
        <Modal ref="modal" buttonText="Crear nuevo cultivo">
            <h2>Agregar nuevo cultivo</h2>
            <form @submit.prevent="addCrop">
                <!-- Campo para el nombre del cultivo -->
                <label for="cropName">Nombre:</label>
                <input type="text" id="cropName" v-model="newCrop.cropData.name" required>
                <br>

                <!-- Campo para el total de agua requerida del cultivo -->
                <label for="cropWaterRequired">Agua requerida:</label>
                <input type="number" id="cropWaterRequired" v-model="newCrop.cropData.waterRequired" step="0.01" min="0.1" required>
                l/m^2</input>
                <br>

                <!-- Campo para la altura promedio de la raíz del cultivo -->
                <label for="cropRootHeight">Altura promedio de la raíz:</label>
                <input type="number" id="cropRootHeight" v-model="newCrop.cropData.rootHeight" step="0.01" min="0.1" required>
                m</input>
                <br>

                <!-- Campo para el número de sensores que tiene el cultivo -->
                <label for="numberOfSensors">Número de sensores:</label>
                <input type="number" id="numberOfSensors" v-model="newCrop.numberOfSensors" step="1" min="1" required>
                <br>

                <!-- Campo para el número de aspersores que tiene el cultivo -->
                <label for="numberOfSprinklers">Número de aspersores:</label>
                <input type="number" id="numberOfSprinklers" v-model="newCrop.numberOfSprinklers" step="1" min="1" required>
                <br>

                <!-- Campo para seleccionar el tipo de irrigación de los aspersores -->
                <label for="irrigationTypes">Tipo de irrigación:</label>
                <select v-model="newCrop.irrigationType" id="irrigationTypes">
                <option value="" disabled selected>-- Selecciona un tipo de irrigación --</option>
                <option v-for="name in irrigationTypes" :key="name" :value="name">
                    {{ name }}
                </option>
                </select>
                <br>

                <button type="submit">Agregar</button>
            </form>
        </Modal>
    </div>
</template>


<script>
    import axios from 'axios';
    import Modal from '../modals/Modal.vue';

    export default {
        components: {
            Modal
        },

        data() {
            return {
                serviceStatus: '',
                irrigationTypes: [],
                errorMessage:  null,
                newCrop: {
                    cropData: {
                        name: '',
                        waterRequired: null,
                        rootHeight: null,
                    },
                    numberOfSensors: null,
                    numberOfSprinklers: null,
                    irrigationType: '',
                },
            };
        },

        methods: {
            async fetchIrrigationTypes() {
                try {
                    const response = await axios.get('https://irrigation-suggester-mini-core-service.onrender.com/api/sprinkler/irrigation/types', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        }
                    });
                    if (response.data.status === 'SUCCESS') {
                        this.serviceStatus = response.data.status;
                        this.irrigationTypes = response.data.data;
                    }
                } catch (error) {
                    if (error.response.status === 403) {
						this.$router.push({ name: 'login' });
                    } else { 
                        console.error(error)
                    }
                }
            },

            async addCrop() {
                try {
                    if (!this.newCrop.irrigationType) {
                        this.triggerError('Por favor, selecciona un tipo de irrigación.');
                        return;
                    } else {
                        this.errorMessage = null;
                    }
                    const response = await axios.post('https://irrigation-suggester-mini-core-service.onrender.com/api/crop/create', this.newCrop, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    if (response.data.status === 'SUCCESS') {
                        this.$emit('cropAdded');
                        this.$refs.modal.closeModal();
                        this.resetForm();
                    }
                } catch (error) {
                    if (error.response.status === 403) {
						this.$router.push({ name: 'login' });
                    } else if (error.response.status === 404) {
						this.triggerError(`Error al agregar el cultivo: ${error.response.data.message}`); 
                    } else if (error.response.status === 422) {
						this.triggerError(`Error al agregar el cultivo: ${error.response.data.message}`);
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
                this.newCrop = {
                    cropData: {
                        name: '',
                        waterRequired: null,
                        rootHeight: null,
                    },
                    numberOfSensors: null,
                    numberOfSprinklers: null,
                    irrigationType: null,
                };
            },
        },

        mounted() {
            this.fetchIrrigationTypes();
        },
    };
</script>

