<template>
    <nav>
      <div>
        <ul>
          <li><a href="/agriculture/crops">Cultivos</a></li>
          <li><a href="/agriculture/forecasts">Pronósticos</a></li>
          <li><a href="/agriculture/sensors">Sensores</a></li>
          <li><a href="/agriculture/schedules">Cronogramas</a></li>
          <li><a href="/agriculture/schedules/suggested">Cronogramas sugeridos</a></li>
          <li><a href="/agriculture/report">Reporte</a></li>
        </ul>
        <button @click="logout">Cerrar sesión</button>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        localStorage.setItem('isAuthenticated', 'false');
        this.$router.push('/login');
      },
    },
  };
  </script>
  