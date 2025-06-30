<template>
  <div>
    <div class="d-flex justify-center align-center" style="height: 80vh">
      <div>
        <v-card-title class="justify-center ma-0 pa-0">Пока нет документов</v-card-title>
        <v-card-text class="justify-center ma-0 pa-0">Скоро здесь будут Наши публичные документы</v-card-text>
      </div>
    </div>

    <div>

    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  head(this: Docs): object {
    return {
      title: 'Документы',
    }
  }
})
export default class Docs extends Vue {
}
</script>
