
export default class EmailService {
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
}