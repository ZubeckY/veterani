<template>
  <section class="header-carousel">
    <v-carousel v-model="activeSlide"
                :show-arrows="false"
                height="100vh"
                hide-delimiters>
      <v-carousel-item v-for="(item, i) in items" :key="i"
                       class="grey lighten-1">
        <v-img height="95%"
               :src="item.src ?? '/imageGroup1.png'"
               :lazy-src="item.src ?? '/imageGroup1.png'"/>
      </v-carousel-item>
    </v-carousel>
    <div class="header-carousel__content">
      <div class="header-carousel__content-container">
        <v-carousel v-model="activeSlide"
                    :cycle="false"
                    :continuous="false"
                    height="fit-content"
                    hide-delimiters>
          <v-carousel-item v-for="(item, i) in items" :key="i">
            <v-card class="header-carousel__content-card d-flex"
                    color="mainBlueTransparent">
              <div class="header-carousel__content-card-container">
                <v-card-title class="header-carousel__content-title block-title" v-text="item.headLine"/>
                <v-card-text class="header-carousel__content-text block-text" v-text="item.text"/>
                <v-card-text class="header-carousel__content-text block-text"
                             v-text="getCreatedDate(new Date(item.created))"/>
              </div>
            </v-card>
          </v-carousel-item>
        </v-carousel>
      </div>
    </div>
  </section>

</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';

@Component({})
export default class Carousel extends Vue {
  activeSlide: number = 0;
  items: Array<any> = [];

  async mounted() {
    await this.$axios.get('/api/post/slider-only/')
      .then((response) => {
        this.items = response.data
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getCreatedDate(created: Date) {
    return new Date(created).toLocaleDateString("ru", {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
}
</script>
