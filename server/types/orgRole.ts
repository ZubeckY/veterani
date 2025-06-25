import {DictionaryValue} from "./DictionaryValue";

export enum OrgRole {
    user = "user",
    member = "member",
}

export const orgRoleTypeText : DictionaryValue<OrgRole> = {
    [OrgRole["user"]]: "Пользователь",
    [OrgRole["member"]]: "Член организации",
}