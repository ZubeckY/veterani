<template>
  <div>
    <div v-if="loading">
      <div class="d-flex justify-center align-center" style="width: 100%; height: 90vh">
        <v-progress-circular size="100" color="primary" indeterminate/>
      </div>
    </div>

    <section v-else>
      <div class="news-container mainContainer">
        <div class="newsConsole" v-if="showConsole">
          <div class="newsConsole-group">
            <v-card-text class="newsConsole-text">Кем опубликован</v-card-text>

            <v-item-group class="d-flex flex-row"
                          v-model="selectedParam"
                          mandatory>
              <v-item v-for="obj in selectParamsPosts"
                      :key="obj.key" :value="obj.key"
                      v-slot="{ active, toggle }">
                <div @click="getData" class="ml-2">
                  <v-card @click="toggle"
                          v-text="obj.value"
                          class="newsConsole-button"
                          :color="active ? 'primary white--text' : ''"/>
                </div>
              </v-item>
            </v-item-group>
          </div>

          <div class="newsConsole-group">
            <v-card-text class="newsConsole-text">Действия</v-card-text>
            <v-card @click="$router.push('/blog/create/')"
                    v-text="'Добавить пост'" class="newsConsole-button"/>
          </div>
        </div>

        <div class="news-list">
          <blog-card v-for="(post, i) in data"
                     :post="post" :key="i"
                     @updateList="getData"/>

          <div class="d-flex justify-center my-6" style="width: 100%;">
            <v-pagination v-model="pagModel"
                          :length="pagSize"
                          :total-visible="7"/>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Watch, InjectReactive} from 'vue-property-decorator';

@Component({
  head(this: Blog): object {
    return {
      title: 'Новости',
    }
  }
})
export default class Blog extends Vue {
  @InjectReactive('userFromDB') userFromDB: any;
  data: any = []                  // все посты с бд
  count: number = 1;              // количество постов (всего)
  take: number = 10;              // кол-во постов на странице
  pagModel: number = 1;           // модель для пагинации

  selectedParam: string = 'all'
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
      key: 'author',
      value: 'Только мои'
    }
  ]

  loading: boolean = true;
  showConsole: boolean = true;

  async mounted() {
    await this.getData();
  }

  @Watch('pagModel')
  async getData() {
    this.$axios.get(this.getLink)
      .then(res => {
        this.data = res.data.result
        this.count = res.data.count
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

  get getLink(): string {
    return '/api/post/list?take=' + this.take
      + '&page=' + this.pagModel
      + '&author=' + this.selectedParam;
  }

  get pagSize(): number {
    return Math.ceil(this.count / this.take)
  }
}
</script>
