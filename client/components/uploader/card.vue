<template>
  <article class="uploader-card">
    <v-dialog v-model="dialog"
              v-if="fileType(file)"
              width="fit-content"
              max-width="60%">
      <template v-slot:activator="{ on, attrs }">
        <v-img class="uploader-card__img"
               v-bind="attrs"
               v-on="on"
               :src="src"
               :lazy-src="src">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0"
                   align="center"
                   justify="center">
              <v-progress-circular indeterminate color="primary"/>
            </v-row>
          </template>
        </v-img>
      </template>

      <div class="uploader-card__info">
        <div class="uploader-card__close-dialog">
          <v-btn @click="dialog = false" color="red" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="d-flex justify-center align-center">
          <v-img class="uploader-card__big-img"
                 width="100%"
                 :src="src"
                 :lazy-src="src"/>
        </div>
      </div>
    </v-dialog>
    <div v-else>
      <v-icon size="150">mdi-file</v-icon>
    </div>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({})
export default class Card extends Vue {
  @Prop({}) readonly file!: any;
  @Prop({}) readonly src?: any;
  @Prop({default: false}) readonly multiple?: boolean;

  dialog: boolean = false;

  fileType(file: any) {
    if (file?.type && !this.multiple) {
      return file.type.includes('image')
    }

    if (this.multiple) {
      const data = file.split(';')[0]
      const type = data.split('data:')[1]
      return type.includes('image')
    }
  }
}
</script>
