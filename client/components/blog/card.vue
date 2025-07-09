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
          <menu-button v-if="isCurrentUser" :menu="menu"
                       @editItem="$router.push(`/blog/edit/${post.link}`)"
                       @deleteDialog="deleteDialog = true"/>

          <blog-delete :showButton="false"
                       :modelDialog="deleteDialog"
                       @deleteItem="deletePost"/>
        </div>

      </div>
      <div class="news-card__body mt-3">
        <v-card-text class="news-card__text my-0 py-0" v-html="formattedText"/>
        <vertical-spacer/>
        <v-card-text class="news-card__text d-flex align-center my0 py-0" @click.stop>
          <div class="d-flex align-center my-1 py-1">
            <v-avatar class="primary darken-1 ma-0 pa-0 mr-3" size="35">
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
            <div class="ma-0 pa-0" v-text="userInfo"></div>
            <v-chip class="ml-2" :color="getRoleColor(post.user.role)" dark small>
              {{ getRoleTypeText(post.user.role) }}
            </v-chip>
          </div>
          <v-spacer/>
          <date-normalizer :date="new Date(post.created)"></date-normalizer>
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

  deleteDialog: boolean = false;

  roles: Array<any> = []
  colors: Array<string> = [
    'red darken-1', 'green darken-1', 'yellow darken-1', 'blue darken-1',
  ]

  menu: Array<any> = [
    {
      text: 'Изменить',
      color: 'primary--text',
      event: 'editItem'
    },
    {
      text: 'Удалить',
      color: 'red--text',
      event: 'deleteDialog'
    },
  ]

  async mounted() {
    await this.getRoleList()
  }

  async getRoleList() {
    await this.$axios.post('/api/admin/user/role-list/')
      .then((response) => {
        this.roles = response.data.roles;
      })
  }

  async deletePost() {
    await this.$axios.delete('/api/post/delete/' + this.post.link)
      .then((response) => {
        this.$emit('updateList')
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getRoleColor(role: string): any {
    switch (role) {
      case 'admin':
        return this.colors[0]
      case 'manager':
        return this.colors[1]
      case 'user':
        return this.colors[2]
      case 'guest':
        return this.colors[3]
      default:
        return 'red'
    }
  }

  getRoleTypeText(role: string) {
    switch (role) {
      case 'admin':
        return this.roles[0]?.value
      case 'manager':
        return this.roles[1]?.value
      case 'user':
        return this.roles[2]?.value
      case 'guest':
        return this.roles[3]?.value
      default:
        return 'danger'
    }
  }

  get userInfo() {
    return `${this.post.user.firstName} ${this.post.user.lastName}`
  }

  get isCurrentUser() {
    return this.userFromDB.value.id === this.post.user.id
  }

  get formattedText() {
    return this.post.text.length <= 180 ? this.post.text :
      `${this.post.text.slice(0, 180).trim()}... <a href="/blog/${this.post.link}" class="text-decoration-none">далее</a>`;
  }
}
</script>
