<template>
  <v-menu offset-y>
    <template v-slot:activator="{ attrs, on }">
      <v-card class="menu-button ml-3"
              elevation="0" v-bind="attrs" v-on="on">
        <v-icon :dark="dark">mdi-dots-horizontal</v-icon>
      </v-card>
    </template>
    <v-list class="pa-0" dense>
      <v-list-item @click="createEmit(item.event)"
                   :class="item.color + ' py-0'"
                   v-for="item in menu"
                   :key="item.text" link>
        <v-list-item-title v-text="item.text"/>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({})
export default class MenuButton extends Vue {
  @Prop({default: true}) readonly dark?: boolean
  @Prop() readonly menu?: Array<any>

  createEmit(emit: string) {
    return this.$emit(emit ?? 'click');
  }
}
</script>
