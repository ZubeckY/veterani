<template>
  <v-app>
    <div class="flag-bkg" :style="'background-image: url('+ bkgFlagImage +');'">
      <div class="fullSize d-flex justify-center align-center">
        <Nuxt/>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
//@ts-ignore
import bkgFlagImage from '~/static/flag-russia.png'
import {Vue, Component} from 'vue-property-decorator';

@Component({})
export default class Auth extends Vue {
  bkgFlagImage: any = bkgFlagImage;
}
</script>
<style> @import "@/assets/styles/auth.css"; </style>
