<template>
  <article class="uploader-card">
    <v-img v-if="fileType(file)"
           class="uploader-card__img"
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
