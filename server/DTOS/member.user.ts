interface userFile {
    id: number | null;
    path: string | null;
}

export default class MemberUser {
    id
    firstName
    lastName
    memberRole
    memberRoleTitle
    file: userFile

    constructor(model: any) {
        this.id = model.id
        this.firstName = model.firstName
        this.lastName = model.lastName
        this.memberRole = model.memberRole
        this.memberRoleTitle = model.memberRoleTitle
        this.file = model.file
    }
}