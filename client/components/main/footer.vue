<template>
  <footer>
    <v-card elevation="0" color="mainBlue" rounded="0" min-height="300">
      <div class="footer-container">

      </div>
    </v-card>
  </footer>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({})
export default class Footer extends Vue {
  @Prop() infoData: any
}
</script>
