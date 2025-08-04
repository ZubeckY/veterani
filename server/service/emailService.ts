import config from "../config";
import * as nodemailer from "nodemailer";

export default class EmailService {
    transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: false,
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    generateOTPCode(): string {
        const digits = '0123456789abcdefghijklmnopqrstuvwxyz'
        const len = digits.length
        const OTP_LEN = 5

        let OTP = ''

        for (let i = 0; i < OTP_LEN; i++) {
            OTP += digits[Math.floor(Math.random() * len)]
        }

        return OTP.toUpperCase()
    }

    async sendActivationCode(to: string, code: string) {
        try {
            const message = `
                <div>
                  <h1>Ваш код активации: ${code}</h1>
                  <br />
                  <p>Если действие выполняете не вы, проигнорируйте это письмо</p>
                </div>
              `

            await this.transporter.sendMail({
                from: config.SMTP_USER,
                to,
                subject: 'Код активации аккаунта',
                text: '',
                html: message,
            })
        } catch (error) {
            console.log(error);
        }
    }

    async sendAcceptCode(to: string, code: string) {
        try {
            const message = `
                <div>
                  <h1>Ваш код потверждения: ${code}</h1>
                  <br />
                  <p>Если действие выполняете не вы, проигнорируйте это письмо</p>
                </div>
              `

            await this.transporter.sendMail({
                from: config.SMTP_USER,
                to,
                subject: 'Код потверждения смены почты',
                text: '',
                html: message,
            })
        } catch (error) {
            console.log(error);
        }
    }

    async sendSuccessChangeEmail(to: string, oldMail: string) {
        try {
            const message = `
                <div>
                  <h1>Вы успешно изменили Email</h1>
                  <br />
                  <p>Вами указана новая почта ${to} привязана к Вашему аккаунту.
                   Не стоить переживать по старой почте ${oldMail}. 
                   Она послужила Вам верой и правдой на Этом сайте, и Мы её отпускаем из системы.
                  </p>
                </div>
              `

            await this.transporter.sendMail({
                from: config.SMTP_USER,
                to,
                subject: 'Код потверждения смены почты',
                text: '',
                html: message,
            })
        } catch (error) {
            console.log(error);
        }
    }

    async tryingToChangeEmail(to: string, newMail: string) {
        try {
            const message = `
                <div>
                  <h1>Попытка изменить email адрес</h1>
                  <br />
                  <p>Вами указана новая почта: ${newMail}, если это делали не Вы, обратитесь в поддержку</p>
                </div>
              `

            await this.transporter.sendMail({
                from: config.SMTP_USER,
                to,
                subject: 'Код потверждения смены почты',
                text: '',
                html: message,
            })
        } catch (error) {
            console.log(error);
        }
    }

    async sendMessageYouActivated(to: string) {
        try {
            const message = `
                <div>
                  <h1>Ваш аккаунт активирован</h1>
                  <br />
                  <p>Ваш аккаунт активирован! Теперь Вы являетесь полноценным пользователем сайта</p>
                </div>
              `

            await this.transporter.sendMail({
                from: config.SMTP_USER,
                to,
                subject: 'Ваш аккаунт активирован',
                text: '',
                html: message,
            })
        } catch (error) {
            console.log(error)
        }
    }

    //уведомление о блокировке
    async sendEmailNotificationBlock(to: string, block: boolean) {
        try {
            const stroke: string = block ? "заблокирован" : "разблокирован"

            const message = `
                <div>
                  <h1>Ваш аккаунт ${stroke}</h1>
                  <br />
                  <p>Ваш аккаунт ${stroke}! Теперь вы можете создавать посты</p>
                </div>
              `

            await this.transporter.sendMail({
                from: config.SMTP_USER,
                to,
                subject: `Ваш аккаунт ${stroke}`,
                text: '',
                html: message,
            })
        } catch (error) {
            console.log(error)
        }
    }

    //уведомление об удалении учётной записи
    async sendEmailNotificationDelete(to: string) {
        try {
            const message = `
                <div>
                  <h1>Ваш аккаунт был удалён</h1>
                  <br />
                  <p>Ваша учётная запись была удалена администрацией!</p>
                </div>
              `

            await this.transporter.sendMail({
                from: config.SMTP_USER,
                to,
                subject: `Ваша учётная запись заблокирована`,
                text: '',
                html: message,
            })
        } catch (error) {
            console.log(error)
        }
    }
}