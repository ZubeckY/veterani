<template>
  <div>
    <div class="header-carousel">

      <v-carousel height="100vh" hide-delimiters>
        <v-carousel-item v-for="(item,i) in items" :key="i">
          <v-img :src="item.src" :lazy-src="item.src" contain/>
        </v-carousel-item>
      </v-carousel>

      <div class="header-carousel__content">
        <div class="header-carousel__content-container">

          <v-card style="border-radius: 13px"
                  elevation="0"
                  class="white--text"
                  color="mainBlueTransparent"
                  width="100%" min-height="80%">
            asfasfas
          </v-card>

        </div>
      </div>

    </div>

    <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A0d1b68e21fa797ec4e13fe0f17a586d57858fa3af35d57a4488319675ea84521&amp;source=constructor"
            width="100%" height="540" frameborder="0">
    </iframe>

  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  head(this: Pages): object {
    return {
      title: 'Главная страница',
    }
  }
})
export default class Pages extends Vue {
  items: any = [
    {
      src: '/api/media/24-03-2025-df69489b-fbcd-4a62-88f3-661be8e94a0b.png'
    },
    {
      src: '/api/media/23-03-2025-bac14db0-1cb6-4f12-ab09-2af77e2af72c.jpeg'
    },
  ]
}
</script>
