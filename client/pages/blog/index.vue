<template>
  <div>
    <div v-if="loading">
      <div class="d-flex justify-center align-center" style="width: 100%; height: 90vh">
        <v-progress-circular size="100" color="primary" indeterminate/>
      </div>
    </div>

    <section v-else>
      <div class="news-container">
        <v-card-text class="news-text block-text">Смотри наши новости</v-card-text>

        <div class="news-console">
          <div class="news-console__group">
            <v-card-text class="news-console__text">Кем опубликован</v-card-text>

            <v-item-group class="d-flex flex-row" mandatory
                          v-model="selectedParam">
              <v-item v-for="obj in selectParamsPosts"
                      :key="obj.key" :value="obj.key"
                      v-slot="{ active, toggle }">
                <v-card @click="toggle"
                        v-text="obj.value"
                        class="news-console__button"
                        :color="active ? 'primary white--text' : ''"/>
              </v-item>
            </v-item-group>
          </div>

          <div class="news-console__group">
            <v-card-text class="news-console__text">Действия</v-card-text>
            <v-card @click="$router.push('/blog/create/')"
                    v-text="'Добавить пост'" class="news-console__button"/>
          </div>
        </div>

        <div class="news-list">
          <blog-card v-for="(post, i) in data" :post="post" :key="i"/>

          <div class="d-flex justify-center my-6" style="width: 100%;">
            <v-pagination v-model="pagPage"
                          :length="pagSize"
                          :total-visible="7"/>
          </div>
        </div>
      </div>
    </section>
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
  selectedParam: string = ''
  selectParamsPosts: any = [
    {
      key: 'all',
      value: 'Все'
    },
    {
      key: 'community',
      value: 'Сообщество'
    },
    {
      key: 'my',
      value: 'Только мои'
    }
  ]
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
