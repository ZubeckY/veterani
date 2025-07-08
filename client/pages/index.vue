<template>
  <div>
    <main-carousel/>
    <div class="flag-bkg mainFlagBlock" :style="'background-image: url('+ bkgFlagImage +');'">
      <section class="aboutUs" id="about-us">
        <div class="aboutUs-container mainContainer">
          <v-card-title class="aboutUs-title block-title">О нас</v-card-title>
          <v-card-text class="aboutUs-text block-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </v-card-text>
          <div class="aboutUs-video">
            <v-img class="aboutUs-video__content" src="/aboutUs.png" width="100%" height="590px"/>
          </div>
        </div>
      </section>

      <section class="imageGroup">
        <div class="imageGroup-container flexCenter">
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
      <div class="ourTeam-container mainContainer">
        <v-card-title class="ourTeam-title block-title">Наша команда</v-card-title>
        <v-card-text class="ourTeam-text block-text">Познакомьтесь с нашей командой</v-card-text>
        <div class="ourTeam-members flexCenter">
          <org-card v-for="(item, i) in team" :key="i" :item="item"/>
        </div>
      </div>
    </section>

    <section class="news">
      <div class="news-container mainContainer">
        <v-card-title class="news-title block-title">Новости</v-card-title>
        <v-card-text class="news-text block-text">Смотри наши новости</v-card-text>
        <div class="news-wrapper">
          <div class="news-list">
            <blog-card v-for="(post, i) in posts"
                       :post="post" :key="i"
                       @updateList="getData"/>
          </div>

          <div class="mx-auto" style="width: fit-content">
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
      <div class="pleaseDonate-container mainContainer">
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

    <iframe :src="mapping" width="100%" height="540" frameborder="0"/>

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
  readonly pleaseDonateText = 'Поддержите нашу деятельность, сканировав QR код, можете\nотправить любую сумму'
  readonly bkgFlagImage: any = bkgFlagImage;
  posts: Array<any> = [];
  team: Array<any> = [];

  async mounted() {
    await this.getData();
    await this.getOrgTeam();
  }

  async getOrgTeam() {
    await this.$axios.get('/api/user/our-team/')
      .then(res => {
        this.team = res.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  async getData() {
    this.$axios.get(this.getLink)
      .then(res => {
        this.posts = res.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  get mapping() {
    return this.infoData.value.mapping ?? ''
  }

  get getLink(): string {
    return '/api/post/list?give=' + 6
  }
}
</script>
