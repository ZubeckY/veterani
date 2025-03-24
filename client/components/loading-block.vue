<template>
  <div class="loadingBlock d-flex flex-column justify-center align-center">
    <v-progress-circular color="primary" size="120" indeterminate/>
    <v-card-title class="mt-3">Загрузка...</v-card-title>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({})
export default class loadingBlock extends Vue {
}
</script>
