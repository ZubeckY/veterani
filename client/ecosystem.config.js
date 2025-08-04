module.exports = {
    apps: [
        {
            name: 'VClient',
            exec_mode: 'cluster',
            instances: 'max',
            script: "node_modules/nuxt-start/bin/nuxt-start.js",
            args: 'start'
        }
    ]
}
