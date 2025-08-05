<template>
  <v-dialog v-model="changeMailDialog" max-width="420">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field label="Email"
                    hide-details
                    :value="mail"
                    v-bind="attrs"
                    v-on="on"
                    readonly
                    outlined
                    dense/>
    </template>

    <v-card class="ma-0 pa-0" elevation="0">
      <v-card-title class="text-h5 pb-0">Редактирование email</v-card-title>
      <v-stepper elevation="0" v-model="mailStepper">
        <v-stepper-items class="ma-0 pa-0">
          <v-stepper-content class="pt-2" step="1">
            <v-form class="pt-2" v-model="form" @submit.prevent>
              <v-card class="pa-0 ma-0" :loading="loading" :disabled="loading" elevation="0">
                <v-text-field label="Старый email (только ручной ввод)"
                              placeholder="your-mail@gmail.com"
                              v-model="modelMail.oldMail"
                              :rules="[rules.email, rules.required]"
                              @paste.prevent
                              outlined dense/>
                <v-text-field label="Новый email (только ручной ввод)"
                              placeholder="your-mail@gmail.com"
                              v-model="modelMail.newMail"
                              :rules="[rules.email, rules.required]"
                              @paste.prevent
                              outlined dense/>
                <v-btn width="fit-content"
                       height="fit-content"
                       class="ma-0 pa-0"
                       color="primary" text
                       @click="checkMailInputAndSubmit"
                       :disabled="!form">
                  Продолжить
                </v-btn>
                <v-btn width="fit-content"
                       height="fit-content"
                       class="ma-0 pa-0"
                       color="red" text
                       @click="changeMailDialog = false">
                  Отмена
                </v-btn>
              </v-card>
            </v-form>
          </v-stepper-content>

          <v-stepper-content class="pt-2" step="2">
            <v-card elevation="0" :disabled="disabledNewMailInput">
              <div>Введите код, который мы отправили Вам на <b>{{ modelMail.newMail }}</b></div>
              <v-otp-input v-model="activatedCode" length="5"
                           @finish="tryActivateAccount"/>
              <v-btn width="fit-content"
                     height="fit-content"
                     class="ma-0 pa-0"
                     color="red" text
                     @click="changeMailDialog = false">
                Отмена
              </v-btn>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({})
export default class Mail extends Vue {
  @Prop() readonly mail!: string;
  activatedCode: string = ''

  changeMailDialog: boolean = false;
  disabledNewMailInput: boolean = false;
  mailStepper: number = 1;

  form: boolean = false;
  loading: boolean = false;

  rules: any = {
    email: (v: any) => /.+@.+\..+/.test(v) ||
      'Введите действительный адрес электронной почты',
    required: (v: any) => !!v || "Это поле обязательно к заполнению"
  }

  modelMail: any = {
    oldMail: '',
    newMail: ''
  }

  @Watch('changeMailDialog')
  changeStepperValue() {
    this.form = false;
    this.mailStepper = 1
  }

  checkMailInputAndSubmit() {
    this.loading = true;
    this.$axios.post('/api/user/email/check-mail-and-change/', this.modelMail)
      .then(res => {
        this.mailStepper++
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        this.loading = false;
      })
  }

  async tryActivateAccount() {
    this.disabledNewMailInput = true
    this.$axios.post('/api/user/email/change/', {
      oldValue: this.modelMail.oldMail,
      newValue: this.modelMail.newMail,
      activatedCode: this.activatedCode
    })
      .then((res) => {
        this.$emit('success', res.data.tokens.refreshToken);
        this.changeMailDialog = false;
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.disabledNewMailInput = false
      })
  }
}
</script>
