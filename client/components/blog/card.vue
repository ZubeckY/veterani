<template>
  <article class="news-card" @click="$router.push(`/blog/${post.link}`)">
    <div class="news-card__container">
      <div class="news-card__image" @click.stop>
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

        <div class="news-card__image-buttons">
          <v-card elevation="0"
                  v-text="post.headLine"
                  class="news-card__image-title"
                  @click="$router.push(`/blog/${post.link}`)"/>

          <v-menu v-if="isCurrentUser" :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-card class="news-card__image-title ml-3"
                      v-bind="attrs" v-on="on"
                      elevation="0">
                <v-icon dark>mdi-dots-horizontal</v-icon>
              </v-card>
            </template>

            <v-list dense>
              <v-list-item v-for="i in 3" :key="i">
                <v-list-item-title>asdasd</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

      </div>
      <div class="news-card__body mt-3">
        <v-card-text class="news-card__text my-0 py-0" v-text="post.text"/>
        <vertical-spacer/>

        <v-card-text class="news-card__text d-flex align-center my0 py-0 ">
          <div class="d-flex align-center my-1 py-1">
            <v-avatar class="primary darken-1 ma-0 pa-0 mr-3" size="35">
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
            <div class="ma-0 pa-0">{{ userInfo(post.user) }}</div>
          </div>
          <v-spacer/>
          <div>{{ getCreatedDate(new Date(post.created)) }}</div>
        </v-card-text>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop, Inject} from 'vue-property-decorator';

@Component({})
export default class Card extends Vue {
  @Inject('userFromDB') userFromDB: any;
  @Prop({required: true}) post!: any

  getCreatedDate(created: Date) {
    return new Date(created).toLocaleDateString("ru", {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  userInfo(user: any) {
    return user.firstName + ' ' + user.lastName
  }

  get isCurrentUser() {
    return this.userFromDB.value.id === this.post.user.id
  }
}
</script>
