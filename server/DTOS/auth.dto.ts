export default class AuthDto {
    id
    email

    constructor(model: any) {
        this.id = model.id
        this.email = model.email
    }
}