<template>
    <button @click="showModal = true">{{ buttonText }}</button>
    
    <div v-if="showModal" @click="closeModal">
      <div @click.stop>
          <slot></slot>
          <button @click="closeModal">Cerrar</button>
      </div>
    </div>
</template>

<script>
    export default {
        props: {
            buttonText: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                showModal: false
            }
        },
        methods: {
            closeModal() {
                this.showModal = false;
            },
        },
    }
</script>