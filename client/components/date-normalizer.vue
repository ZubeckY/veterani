<template>
  <div v-text="dateNormalizer"></div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({})
export default class DateNormalizer extends Vue {
  @Prop() date!: Date;

  get dateNormalizer() {
    return new Date(this.date).toLocaleDateString("ru", {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
}
</script>
