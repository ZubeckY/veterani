<template>
  <v-app>
    <main-header/>

    <v-main>
      <Nuxt/>
    </v-main>

    <footer>Footer</footer>

  </v-app>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({})
export default class Default extends Vue {

}
</script>
