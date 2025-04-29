<template>
  <div>
    <v-form class="mt-5 ml-5" style="width: 20vw">
      <v-card-title class="pl-0 justify-center">Данные организации</v-card-title>
      <v-text-field class="authCard__input"
                    v-model="model.phone"
                    label="Телефон"
                    type="text"
                    v-mask="`+7 (###) ###-##-##`"
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

      <div class="d-flex flex-column align-center">
        <v-btn class="authCard__button"
               large
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
    this.UpdateInfo()
  }

  async UpdateInfo() {
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
    this.UpdateInfo()
  }
}
</script>

<style scoped>

</style>
