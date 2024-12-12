<template>
    <div>
        <Modal ref="modal" buttonText="Actualizar cultivo">
            <h2>Actualizar cultivo</h2>
            <form @submit.prevent="updateCrop">
                <!-- Campo para el nombre del cultivo -->
                <label for="cropName">Nombre:</label>
                <input type="text" id="cropName" v-model="cropData.name" required>
                <br>

                <!-- Campo para el total de agua requerida del cultivo -->
                <label for="cropWaterRequired">Agua requerida:</label>
                <input type="number" id="cropWaterRequired" v-model="cropData.waterRequired" step="0.01" min="0.1" required>
                l/m^2</input>
                <br>

                <!-- Campo para la altura promedio de la raíz del cultivo -->
                <label for="cropRootHeight">Altura promedio de la raíz:</label>
                <input type="number" id="cropRootHeight" v-model="cropData.rootHeight" step="0.01" min="0.1" required>
                m</input>
                <br>

                <button type="submit">Actualizar</button>
            </form>
        </Modal>
    </div>
</template>

<script>
    import axios from 'axios';
    import Modal from '../modals/Modal.vue';

    export default {

        props: {
            cropData: {
                type: Object,
                required: true,
                default: () => ({
                    id: null,
                    name: '',
                    waterRequired: null,
                    rootHeight: null,
                }),
            },
        },

        components: {
            Modal
        },

        data() {
            return {
                serviceStatus: '',
                errorMessage: null,
            };
        },

        methods: {

            async updateCrop() {
                try {
                    console.log(this.cropData.id);
                    const response = await axios.put(`http://localhost:8082/api/crop/update/${this.cropData.id}`, this.cropData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    if (response.data.status === 'SUCCESS') {
                        this.$emit('cropUpdated');
                    }
                } catch (error) {
                    if (error.response.status === 400) {
                        this.triggerError(`Error al actualizar el cultivo: ${error.response.data.message}`); 
                    } else if (error.response.status === 403) {
						this.$router.push({ name: 'login' });
                    } else if (error.response.status === 404) {
						this.triggerError(`Error al actualizar el cultivo: ${error.response.data.message}`); 
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
        }
    }

</script>