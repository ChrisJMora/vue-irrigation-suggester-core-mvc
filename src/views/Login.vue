<template>
    <div class='login-container'>
      <h1>Iniciar Sesión</h1>
      <form @submit.prevent='login'>
        <div>
          <label for='username'>Usuario:</label>
          <input v-model='username' id='username' type='text' required />
        </div>
        <div>
          <label for='password'>Contraseña:</label>
          <input v-model='password' id='password' type='password' required />
        </div>
        <button type='submit'>Iniciar Sesión</button>
      </form>
      <p v-if='errorMessage' class='error'>{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        errorMessage: null,
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('https://irrigation-suggester-mini-core-service.onrender.com/login', {
            username: this.username,
            password: this.password,
          });
  
          // Extraer el token de la respuesta
          const token = response.data.token;
          // Guardar el token en localStorage
          localStorage.setItem('token', token);
          this.$router.push('/agriculture/crops');
        } catch (error) {
          // Manejar errores
          if (error.response && error.response.status === 401) {
            this.errorMessage = 'Usuario o contraseña incorrectos.';
          } else {
            this.errorMessage = 'Ocurrió un error al iniciar sesión.';
          }
        }
      },
    },
  };
  </script>