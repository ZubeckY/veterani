<template>
  <div class="newsItem">
    <div class="newsItem-container mainContainer">
      <article class="newsItem-card pb-2">
        <v-carousel class="newsItem-card__carousel"
                    v-if="model.files.length > 0"
                    :cycle="false"
                    :continuous="false"
                    hide-delimiters>
          <v-carousel-item v-for="(item, index) in model.files" :key="index">
            <adaptive-image-item :path="'/api/' + item.path"/>
          </v-carousel-item>
        </v-carousel>
        <v-card-title class="newsItem-title" v-text="model.headLine"></v-card-title>
        <v-card-text class="newsItem-text pb-1" v-text="model.text"></v-card-text>
        <vertical-spacer/>
        <v-card-text class="newsItem-text pt-1 d-flex align-center ">
          <aside class="newsItem-chip">
            <v-card-text class="news-card__text d-flex align-center py-0" v-if="model.user">
              <div class="d-flex align-center my-1 py-1">
                <v-avatar class="primary darken-1 ma-0 pa-0 mr-3" size="35">
                  <v-icon dark>mdi-account-circle</v-icon>
                </v-avatar>
                <div class="ma-0 pa-0" v-text="userInfo"></div>
                <v-chip class="ml-2" :color="getRoleColor(model.user.role)" dark small>
                  {{ getRoleTypeText(model.user.role) }}
                </v-chip>
              </div>
            </v-card-text>
          </aside>
          <v-spacer/>
          <date-normalizer :date="new Date(model.created)"></date-normalizer>
        </v-card-text>
      </article>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({})
export default class _link extends Vue {
  model: any = {
    headLine: '',
    text: '',
    files: []
  };

  roles: Array<any> = []
  colors: Array<string> = [
    'red darken-1', 'green darken-1', 'yellow darken-1', 'blue darken-1',
  ]

  async mounted() {
    await this.getRoleList()
    const getLink = this.$router.currentRoute.params.link
    await this.$axios.get('/api/post/' + getLink)
      .then((res) => {
        this.model = res.data;
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async getRoleList() {
    await this.$axios.post('/api/admin/user/role-list/')
      .then((response) => {
        this.roles = response.data.roles;
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
    return `${this.model.user.firstName} ${this.model.user.lastName}`
  }
}
</script>
