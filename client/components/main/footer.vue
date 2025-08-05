<template>
  <footer class="footer">
    <v-card class=""
            min-height="300"
            color="mainBlue"
            elevation="0"
            rounded="0" dark>
      <div class="footer-container">
        <div class="mainContainer py-3">
          <div class="d-flex justify-center align-center flex-wrap mt-5">
            <v-btn class="white--text text-decoration-none pa-0 ma-0"
                   href="https://vk.com/club216108156"
                   width="fit-content"
                   height="fit-content"
                   target="_blank" text>
              <links-vk/>
            </v-btn>

            <v-card-title class="text-uppercase">
              <a class="white--text text-decoration-none"
                 :href="'tel:'+infoData.value.phone">
                <v-icon>mdi-phone</v-icon>
                <span v-text="infoData.value.phone"></span>
              </a>
            </v-card-title>

            <v-card-title>
              <a class="white--text text-decoration-none"
                 :href="'mailto:'+infoData.value.email">
                <v-icon>mdi-mail</v-icon>
                <span v-text="infoData.value.email"></span>
              </a>
            </v-card-title>
          </div>

          <v-card-title class="justify-center">
            Наш адрес: {{infoData.value.address}}
          </v-card-title>
        </div>

        <v-divider class="my-4"/>

        <article class="footer-bottom">
          <v-card-subtitle class="ma-0 pa-0">
            © {{ new Date().getFullYear() }} - Союз Ветеранов боевых действий и Вооруженных конфликтов
          </v-card-subtitle>
        </article>

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
