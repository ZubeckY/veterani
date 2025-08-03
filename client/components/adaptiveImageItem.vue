<template>
  <div class="adaptiveImage-item">
    <div class="adaptiveImage-item__container">
      <v-dialog v-model="dialog" width="auto">
        <template v-slot:activator="{ on, attrs }">
          <img class="adaptiveImage-item__image"
               alt="adaptive image"
               v-bind="attrs"
               v-on="on"
               :src="path"/>
        </template>
        <div class="adaptiveImage-item__dialog">
          <div class="adaptiveImage-item__dialogClose">
            <v-btn @click="dialog = false"
                   color="red lighten-1"
                   fab small dark>
              <v-icon size="28">mdi-close</v-icon>
            </v-btn>
          </div>
          <img class="adaptiveImage-item__image"
               alt="adaptive image"
               :src="path"/>
        </div>
      </v-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
@Component({})
export default class adaptiveImageItem extends Vue {
  @Prop() path!: string;
  dialog: boolean = false;
}
</script>
