import {DictionaryValue} from "./DictionaryValue";

export enum Role {
    admin = "admin",
    manager = "manager",
    user = "user",
    guest = "guest",
}

export const roleTypeText : DictionaryValue<Role> = {
    [Role["admin"]]: "администратор",
    [Role["manager"]]: "менеджер",
    [Role["user"]]: "пользователь",
    [Role["guest"]]: "гость",
}