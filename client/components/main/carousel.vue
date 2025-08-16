<template>
  <section class="headerCarousel">
    <v-carousel v-model="activeSlide"
                :show-arrows="false"
                height="100vh"
                hide-delimiters>
      <v-carousel-item class="headerCarousel-item grey lighten-3"
                       v-for="(item, i) in items" :key="i">
        <v-img class="d-block my-2 mx-auto"
               height="98%" contain
               :src="formattedPhoto(item)"
               :lazy-src="formattedPhoto(item)"/>
      </v-carousel-item>
    </v-carousel>
    <div class="headerCarousel-content">
      <div class="headerCarousel-content__container mainContainer">
        <v-carousel v-model="activeSlide"
                    :cycle="false"
                    :continuous="false"
                    height="100%"
                    hide-delimiters>
          <v-carousel-item v-for="(item, i) in items" :key="i">
            <v-card class="headerCarousel-content__card flexCenter d-flex"
                    color="mainBlueTransparent">
              <div class="headerCarousel-content__card-container">
                <v-card-title class="headerCarousel-content-title block-title" v-text="item.headLine"/>
                <v-card-text class="headerCarousel-content-text block-text" v-html="formattedText(item)"/>
                <v-card-text class="headerCarousel-content-text block-text">
                  <date-normalizer :date="new Date(item.created)"></date-normalizer>
                </v-card-text>
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
  items: Array<any> = [];
  activeSlide: number = 0;

  async mounted() {
    await this.getSliderOnlyPosts()
  }

  async getSliderOnlyPosts() {
    await this.$axios.get('/api/post/slider-only/')
      .then((response) => {
        this.items = response.data
      })
      .catch((error) => {
        console.log(error);
      })
  }

  formattedText(item: any): string {
    return item.text.length <= 450 ? item.text :
      `${item.text.slice(0, 450).trim()}... <a href="/blog/${item.link}" class="blue--text text--accent-4">далее</a>`;
  }

  formattedPhoto(item: any): string {
    return item.files.length ? '/api/' + item.files[0].path : '/imageGroup1.png';
  }
}
</script>
