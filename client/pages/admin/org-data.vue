<template>
  <div class="d-flex justify-center align-center">
    <v-form class="mt-5 ml-5" style="width: 100%; max-width: 720px">
      <v-card-title class="pa-0 pb-2 justify-center">Данные организации</v-card-title>

      <div class="d-flex justify-space-between flex-row flex-wrap">
        <div style="width: 350px">
          <v-text-field class="authCard__input"
                        v-mask="`+7 (###) ###-##-##`"
                        v-model="model.phone"
                        label="Телефон"
                        type="text"
                        dense
                        outlined/>
          <v-text-field class="authCard__input"
                        v-model="model.email"
                        label="Email"
                        type="email"
                        dense
                        outlined/>
          <v-text-field class="authCard__input"
                        v-model="model.address"
                        label="Адрес"
                        type="text"
                        dense
                        outlined/>
          <v-text-field class="authCard__input"
                        v-model="model.mapping"
                        label="Карта"
                        type="text"
                        dense
                        outlined/>
        </div>

        <iframe :src="model.mapping"
                width="350"
                height="260"
                frameborder="0">
        </iframe>
      </div>

      <div class="d-flex flex-column align-center mt-4">
        <v-btn class="authCard__button px-9"
               width="fit-content"
               @click.prevent="save"
               outlined>Сохранить
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  layout: 'admin',
  head(this: OrgData): object {
    return {
      title: 'Админ панель - Данные организации',
    }
  }
})
export default class OrgData extends Vue {
  model: any = {
    id: 0,
    phone: "",
    email: "",
    address: "",
    mapping: "",
  }

  exist = false;

  async mounted() {
    await this.updateInfo()
  }

  async updateInfo() {
    await this.$axios.get("/api/admin/contactInfo/get")
      .then((res) => {
        const data = res.data
        if (data && data.length > 0) {
          this.model = data[0];
          this.exist = true;
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  async save() {
    if (this.exist) {
      await this.$axios.put(`/api/admin/contactInfo/${this.exist}`, this.model)
        .catch((err) => {
          console.log(err);
        })
    } else {
      await this.$axios.post(`/api/admin/contactInfo/${this.exist}`, this.model)
        .catch((err) => {
          console.log(err);
        })
    }
    await this.updateInfo()
  }
}
</script>

<style scoped>

</style>
