<template>
    <div>
        <h1>TOP 3 cultivos más regados</h1>
        <ErrorMessage v-if="errorMessage" :message="errorMessage"/>
        
        <div>
            <label for="startDate">Fecha de inicio:</label>
            <input type="date" id="startDate" v-model="timeInterval.startDate" />

            <label for="endDate">Fecha de fin:</label>
            <input type="date" id="endDate" v-model="timeInterval.endDate" />

            <button @click="refreshData">Buscar</button>
        </div>

        <div v-if="isLoading">Cargando datos...</div>
        <table v-else-if="crops">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Veces regadas</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(data, index) in crops" :key="index">
                    <td>{{ data.crop.id }}</td>
                    <td>{{ data.crop.name }}</td>
                    <td>{{ data.totalWaterIrrigated }}</td>
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
            crops: null,
            timeInterval: {
                startDate: null,
                endDate: null,
            }
        };
    },

    methods: {
        async getTopThreeMostIrrigatedCrops() {
            try {
                const response = await axios.post('https://irrigation-suggester-mini-core-service.onrender.com/api/crop/top', this.timeInterval, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                if (response.data.status === 'SUCCESS') {
                    this.serviceStatus = response.data.status;
                    this.crops = response.data.data;
                }
            } catch (error) {
                if (error.response.status === 403) {
                    this.$router.push({ name: 'login' });
                } else if (error.response.status === 404) {
                    this.errorMessage = `Error al buscar cultivos: ${error.response.data.message}`;
                } else if (error.response.status === 500) {
                    this.errorMessage = 'Error interno del servidor. Inténtalo de nuevo más tarde.';
                } else {
                    console.error(error);
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
            this.getTopThreeMostIrrigatedCrops()
            this.errorMessage = null;
        },
    },

    mounted() {
        this.refreshData();
    },
};
</script>