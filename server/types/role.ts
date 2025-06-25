import {DictionaryValue} from "./DictionaryValue";

export enum Role {
    admin = "admin",
    manager = "manager",
    user = "user",
    guest = "guest",
}

export const roleTypeText : DictionaryValue<Role> = {
    [Role["admin"]]: "Администратор",
    [Role["manager"]]: "Менеджер",
    [Role["user"]]: "Пользователь",
    [Role["guest"]]: "Гость",
}