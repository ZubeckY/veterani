export default class AdminUser {
    id
    firstName
    lastName
    email
    role
    created
    activated
    block

    constructor(model: any) {
        this.id = model.id
        this.firstName = model.firstName
        this.lastName = model.lastName
        this.email = model.email
        this.role = model.role
        this.created = model.created
        this.activated = model.activated
        this.block = model.block
    }
}