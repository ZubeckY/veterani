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
        } catch (e) {
            console.log(e);
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
        } catch (e) {
            console.log(e)
        }
    }
}