const is_prod = true

const config: any = {
    port: 4000,
    // DB
    DB_PORT: 5432,
    DB_HOST: dbHost(),
    DB_TYPE: "postgres",
    DB_USERNAME: dbUsername(),
    DB_PASSWORD: dbPassword(),
    DB_DATABASE: dbDATABASE(),
}

export default config

function dbHost(): string {
    return is_prod ? '31.129.98.120' : 'localhost'
}

function dbUsername(): string {
    return is_prod ? 'serverUser' : 'postgres'
}

function dbPassword(): string {
    return is_prod ? 'mQBeWsb134' : '1234root'
}

function dbDATABASE(): string {
    return is_prod ? 'main' : 'testForm'
}

