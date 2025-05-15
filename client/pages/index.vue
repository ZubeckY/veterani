<template>
  <div>
    <section class="header-carousel">
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
    </section>

    <div class="flag-bkg mainFlagBlock" :style="'background-image: url('+ bkgFlagImage +');'">
      <section class="aboutUs" id="about-us">
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
    `
    <section class="news">
      <div class="news-container">
        <v-card-title class="news-title block-title">Новости</v-card-title>
        <v-card-text class="news-text block-text">Смотри наши новости</v-card-text>
        <div class="news-list">
          <article class="news-card" v-for="i in 4" :key="i">
            <div class="news-card__container">
              <div class="news-card__image">
                <v-carousel class="news-card__image-carousel"
                            height="280px"
                            show-arrows-on-hover
                            delimiter-icon="mdi-minus-thick"
                            hide-delimiter-background>
                  <v-carousel-item v-for="i in 3" :key="i">
                    <v-img src="/imageGroup1.png"
                           height="100%"
                           contain
                           class="grey lighten-1"/>
                  </v-carousel-item>
                </v-carousel>
                <div class="news-card__image-title">Название поста</div>
              </div>
              <div class="news-card__body mt-3">
                <v-card-text class="news-card__text my-0 py-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                </v-card-text>
                <vertical-spacer/>
                <v-card-text class="news-card__text my-0 py-0">
                  {{ getCreatedDate(new Date()) }}
                </v-card-text>
              </div>
            </div>
          </article>
          <div class="mx-auto">
            <v-btn class="news-card__button px-9 mt-5"
                   @click.prevent="$router.push('/blog')"
                   outlined large>
              Смотреть еще
            </v-btn>
          </div>
        </div>
      </div>
    </section>

    <section class="pleaseDonate">
      <div class="pleaseDonate-container">
        <v-card-title class="pleaseDonate-title block-title">Поддержите нас</v-card-title>
        <v-card-text class="pleaseDonate-text block-text" v-text="pleaseDonateText"></v-card-text>
        <div class="d-flex justify-center align-center">
          <div>
            <v-img width="300px" src="/qrCode.jpg"/>
          </div>

          <div class="text-pre">
            Реквизиты банка: КБ «Кубань кредит»
            ООО ОГРН - 1022300003703
            Кор счет -30101810200000000722
            Расчетный счет – 40703810700840000010
            БИК – 040349722
            ИНН - 2368011780
            КПП - 231001001
          </div>

        </div>

      </div>
    </section>

    <iframe :src="mapping"
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
  readonly pleaseDonateText = 'Поддержите нашу деятельность, отсканировав QR код, можете\nотправить любую сумму'
  readonly bkgFlagImage: any = bkgFlagImage;

  activeSlide: number = 0;
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
