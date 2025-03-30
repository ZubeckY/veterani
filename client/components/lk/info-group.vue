<template>
  <div class="lk-info__group">
    <div class="lk-info__title" v-text="group.label"></div>
    <div class="lk-info__value" v-text="group.value"></div>
    <div class="lk-info__value" v-if="useContent">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({})
export default class infoGroup extends Vue {
  @Prop({}) readonly group!: any;
  @Prop({}) readonly useContent!: boolean;
}
</script>
