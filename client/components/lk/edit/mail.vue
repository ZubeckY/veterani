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
          <v-stepper-content step="1">
            <div class="pt-2">
              <v-text-field label="Старый email (только ручной ввод)"
                            placeholder="your-mail@gmail.com"
                            @paste.prevent
                            outlined dense/>
              <v-text-field label="Новый email (только ручной ввод)"
                            placeholder="your-mail@gmail.com"
                            @paste.prevent
                            outlined dense/>
            </div>
            <v-btn @click="mailStepper = 2"
                   color="primary">
              Продолжить
            </v-btn>

            <v-btn text @click="changeMailDialog = false">
              Отмена
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card elevation="0" :disabled="disabledOldMailInput">
              <div>mail 1</div>
              <v-otp-input length="5"/>
            </v-card>
            <v-btn @click="mailStepper = 3"
                   color="primary">
              Продолжить
            </v-btn>
            <v-btn text @click="changeMailDialog = false">
              Отмена
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card elevation="0" :disabled="disabledNewMailInput">
              <div>mail 2</div>
              <v-otp-input length="5"/>
            </v-card>
            <v-btn @click="mailStepper = 1"
                   color="primary">
              Продолжить
            </v-btn>
            <v-btn text @click="changeMailDialog = false">
              Отмена
            </v-btn>
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

  changeMailDialog: boolean = false;
  disabledOldMailInput: boolean = false;
  disabledNewMailInput: boolean = false;
  mailStepper: number = 1;

  @Watch('changeMailDialog')
  changeStepperValue() {
    this.mailStepper = 1
  }
}
</script>
