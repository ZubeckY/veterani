<template>
  <div>
    <div v-if="loading">
      загрузка
    </div>
    <div v-else>

      <v-card v-for="(item, i) in data"
              :key="'blog-' + i"
              class="mx-auto"
              max-width="800">
        <div class="d-flex">
          <div class="ml-2 mr-4" style="font-size: 22px; font-weight: bold">{{ item.id }}</div>
          <div @click="$router.push('/blog/' + item.link)"
               class="ml-2 mr-4 font-weight-bold primary--text"
               style="font-size: 22px; cursor: pointer">{{ item.headLine }}</div>
          <v-spacer/>
          <div class="ml-2 mr-4" style="font-size: 22px; font-weight: bold">{{ userInfo(item.user) }}</div>
          <div>
            <v-btn @click="$router.push('/blog/edit/' + item.link)" icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <blog-delete @deleteItem="deleteItem(item.link)"/>
          </div>
        </div>
      </v-card>

      <!-- пагинация -->
      <v-pagination v-model="pagPage"
                    :length="pagSize"
                    :total-visible="7"/>

      <v-btn @click="$router.push('/blog/create')"
             color="success" fab>
        <v-icon>mdi-plus</v-icon>
      </v-btn>

    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  head(this: Blog): object {
    return {
      title: 'Новости',
    }
  }
})
export default class Blog extends Vue {
  loading: boolean = true;
  data: any = []
  page: number = 1;
  size: number = 10;
  pagPage: number = 1;

  async mounted() {
    await this.getData();
  }

  async getData() {
    this.$axios.get(this.getLink)
      .then(res => {
        console.log(res.data)
        this.data = res.data
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.loading = false;
      })
  }

  async deleteItem(link: string) {
    this.$axios.delete('/api/post/delete/' + link)
      .then(res => {
        console.log(res)
        this.getData();
      })
      .catch((error) => {
        console.log(error)
      })
  }

  userInfo(user: any) {
    return user.id + ', ' + user.firstName + ' ' + user.lastName + ', ' + user.role
  }

  get pagSize(): number {
    return Math.ceil(this.data.length / this.size)
  }

  get getLink(): string {
    return '/api/post/list?page=' + this.page + '&size=' + this.size;
  }
}
</script>
<style scoped>

</style>
