<template>
	<div>
		<h1>Cultivos</h1>
		<ErrorMessage v-if="errorMessage" :message="errorMessage"/>
      	<CreateCropModal 
		@cropAdded="refreshData"
		@errorOccurred="handleError"/>
		<div v-if="isLoading">Cargando datos...</div>
      	<table v-else-if="crops">
			<thead>
				<tr>
					<th>ID</th>
					<th>Nombre</th>
					<th>Agua mínima requerida</th>
					<th>Altura de la raíz</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(crop, index) in crops" :key="index">
					<td>{{ crop.id }}</td>
					<td>{{ crop.name }}</td>
					<td>{{ crop.waterRequired }} l/m2</td>
					<td>{{ crop.rootHeight }} m</td>
					<td><UpdateCropModal 
						:cropData="{ ...crop }" 
						@cropUpdated="refreshData"
						@errorOccurred="handleError"/>
					</td>
				</tr>
			</tbody>
      	</table>
    </div>
</template>
  
<script>

    import axios from 'axios';
    import CreateCropModal from '../components/modals/CreateCropModal.vue';
	import UpdateCropModal from '../components/modals/UpdateCropModal.vue';
	import ErrorMessage from '../components/ErrorMessage.vue';

    export default {
		components: {
        	CreateCropModal,
			UpdateCropModal,
			ErrorMessage,
      	},

      	data() {
        	return {
			isLoading: true,
			errorMessage: null,
          	serviceStatus: "",
          	crops: null,
        	};
      	},

      	methods: {
			async fetchCrops() {
                try {
                    const response = await axios.get('http://localhost:8082/api/crop/all',
                    {
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
				this.fetchCrops();
				this.errorMessage = null;
			},
      },

      mounted() {
        this.refreshData();
      },

    };

  </script>
  