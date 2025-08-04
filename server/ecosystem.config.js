module.exports = {
    apps: [
        {
            name: 'VServer',
            script: './node_modules/.bin/ts-node',
            exec_mode: 'cluster',
            instances: 'max',
            args: 'index.ts'
        },
    ],
};