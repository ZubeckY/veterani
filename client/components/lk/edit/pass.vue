<template>
  <v-dialog v-model="changePassDialog" max-width="420">
    <template v-slot:activator="{ on, attrs }">
      <v-btn width="fit-content"
             height="fit-content"
             class="ma-0 pa-0"
             color="primary"
             v-bind="attrs"
             v-on="on"
             text>
        Изменить пароль
      </v-btn>
    </template>

    <v-card class="ma-0 pa-0" elevation="0">
      <v-card-title class="text-h5 pb-0">Редактирование пароля</v-card-title>

      <div class="mt-4 mx-5">
        <v-text-field label="Старый пароль"
                      v-model="passwordVal.oldValue"
                      :append-icon="showPass.oldValue ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPass.oldValue ? 'text' : 'password'"
                      @click:append="showPass.oldValue = !showPass.oldValue"
                      outlined dense/>

        <v-text-field label="Новый пароль"
                      v-model="passwordVal.newValue"
                      :append-icon="showPass.newValue ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPass.newValue ? 'text' : 'password'"
                      @click:append="showPass.newValue = !showPass.newValue"
                      outlined dense/>

        <v-text-field label="Повторите новый пароль"
                      v-model="passwordVal.repeatNewValue"
                      :append-icon="showPass.repeatNewValue? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPass.repeatNewValue ? 'text' : 'password'"
                      @click:append="showPass.repeatNewValue = !showPass.repeatNewValue"
                      outlined dense/>
      </div>

      <div class="d-flex pa-5 pt-0">
        <v-btn width="fit-content"
               height="fit-content"
               class="ma-0 pa-0 mr-4"
               color="primary"
               text>
          Сохранить
        </v-btn>
        <v-btn width="fit-content"
               height="fit-content"
               class="ma-0 pa-0"
               color="red" text
               @click="changePassDialog = false">
          Отмена
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({})
export default class Pass extends Vue {
  @Prop() passwordVal: any

  changePassDialog: boolean = false;
  showPass: any = {
    oldValue: false,
    newValue: false,
    repeatNewValue: false,
  }

  @Watch('changePassDialog')
  passCleaner() {
    return this.$emit('cleanPassValues')
  }
}
</script>
