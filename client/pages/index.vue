<template>
  <div>
    <div class="header-carousel">

      <v-carousel v-model="activeSlide" height="100vh" hide-delimiters>
        <v-carousel-item v-for="(item,i) in items" :key="i">
          <v-img :src="item.src" :lazy-src="item.src" contain/>
        </v-carousel-item>
      </v-carousel>

      <div class="header-carousel__content">
        <div class="header-carousel__content-container">

          <v-card class="header-carousel__content-card d-flex"
                  color="mainBlueTransparent"
                  width="100%" min-height="80%">
            <div class="header-carousel__content-card-container">
              <v-card-title class="header-carousel__content-title block-title">Lorem ipsum dolor</v-card-title>
              <v-card-text class="header-carousel__content-text block-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </v-card-text>
              <v-card-text class="header-carousel__content-text block-text">
                {{ getCreatedDate(new Date()) }}
              </v-card-text>
            </div>
          </v-card>

        </div>
      </div>
    </div>

    <div class="flag-bkg mainFlagBlock" :style="'background-image: url('+ bkgFlagImage +');'">
      <section class="aboutUs">
        <div class="aboutUs-container">
          <v-card-title class="aboutUs-title block-title">О нас</v-card-title>
          <v-card-text class="aboutUs-text block-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </v-card-text>
          <div class="aboutUs-video">
            <v-img contain src="/aboutUs.png" width="100%" height="590px"></v-img>
          </div>
        </div>
      </section>

      <section class="imageGroup">
        <div class="imageGroup-container">

          <article class="imageGroup-card">
            <v-img class="imageGroup-card__image"
                   width="610px" height="420px"
                   src="/imageGroup1.png"/>

            <v-card-text class="imageGroup-text block-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </v-card-text>
          </article>

          <article class="imageGroup-card">
            <v-img class="imageGroup-card__image"
                   width="610px" height="420px"
                   src="/imageGroup2.png"/>

            <v-card-text class="imageGroup-text block-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </v-card-text>
          </article>
        </div>
      </section>
    </div>

    <section class="ourTeam">
      <div class="ourTeam-container">
        <v-card-title class="ourTeam-title block-title">Наша команда</v-card-title>
        <v-card-text class="ourTeam-text block-text">Познакомьтесь с нашей командой</v-card-text>
        <div class="ourTeam-members">
          <article class="ourTeam-card" v-for="i in 4" :key="i">
            <div class="ourTeam-card__container">
              <v-img class="ourTeam-card__image" src="/placeholder_lk.jpg"/>
              <v-card-text class="ourTeam-card__name">Фамилия Имя Отчество</v-card-text>
              <v-card-text class="ourTeam-card__memberLabel">Член нашей команды</v-card-text>
            </div>
          </article>
        </div>
      </div>
    </section>

    <iframe :src="mapping"
            style="margin-top: 80px;"
            width="100%" height="540"
            frameborder="0">
    </iframe>

  </div>
</template>

<script lang="ts">
// @ts-ignore
import bkgFlagImage from '~/static/flag-russia.png'
import {Vue, Component, Inject} from 'vue-property-decorator';

@Component({
  head(this: Pages): object {
    return {
      title: 'Главная страница',
    }
  }
})
export default class Pages extends Vue {
  @Inject('infoData') infoData: any

  activeSlide: number = 0;
  bkgFlagImage: any = bkgFlagImage;
  items: any = [
    {
      src: '/api/media/24-03-2025-df69489b-fbcd-4a62-88f3-661be8e94a0b.png'
    },
    {
      src: '/api/media/23-03-2025-bac14db0-1cb6-4f12-ab09-2af77e2af72c.jpeg'
    },
  ]

  get mapping() {
    return this.infoData.value.mapping ?? ''
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
