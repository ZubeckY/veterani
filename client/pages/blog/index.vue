<template>
  <div>
    <div v-if="loading">
      загрузка
    </div>
    <div v-else>

      <div v-for="(item, i) in data" :key="'blog-' + i">
        <div>{{item.headLine}}</div>
        <div>
          <v-btn @click="$router.push('/blog/edit/' + item.link)" icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <blog-delete @deleteItem="deleteItem(item.link)"/>
        </div>
      </div>

      <!-- пагинация -->
      <v-pagination v-model="pagPage"
                    :length="pagSize"
                    :total-visible="7"/>

    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  head(this: Blog): object  {
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
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        this.loading = false;
      })
  }

  async deleteItem(link: string) {
    this.$axios.delete('/api/post/delete/' + link)
      .then(res => {
        console.log(res)
        await this.getData();
      })
      .catch((err) => {
        console.log(err)
      })
  }

  get pagSize (): number {
    return Math.ceil(this.data.length / this.size)
  }

  get getLink(): string {
    return '/api/post/getMany?page=' + this.page + '&size=' + this.size;
  }
}
</script>
<style scoped>

</style>
