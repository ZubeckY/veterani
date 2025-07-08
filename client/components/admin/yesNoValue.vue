<template>
  <td :class="'text-start ' + getCurrentColor(value)" v-text="getYesNoValue(value)" />
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({})
export default class yesNoValue extends Vue {
  @Prop({ default: false }) readonly value!: boolean;

  getYesNoValue(value: boolean): string {
    return value ? 'Да' : 'Нет'
  }

  getCurrentColor(value: boolean) {
    return value ? 'green--text' : 'red--text'
  }
}
</script>
