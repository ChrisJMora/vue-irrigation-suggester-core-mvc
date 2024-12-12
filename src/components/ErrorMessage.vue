<template>
    <div v-if="message" class="error-message">
        {{ message }}
    </div>
</template>
  
<script>
    export default {
        props: {
        message: {
            type: String,
            required: true,
        },
        },
    };
</script>
  
<style scoped>
    .error-message {
        color: red;
        font-size: 16px;
        margin: 10px 0;
        padding: 10px;
        border: 1px solid red;
        background-color: #ffe6e6;
        border-radius: 5px;
    }
</style>