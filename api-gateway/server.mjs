'use strcit'

import dotenv from 'dotenv'

dotenv.config()

const serverPort = process.env.SERVER_PORT || 3000

const env = (new URL(import.meta.url)).searchParams.get('env') || 'PROD'
console.log(`Environment: ${env}`)

const { default: app} = import('./app.mjs')

const server = app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}`)
    console.log(`Server is running in ${env} mode`)
    }
)

for (let signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
        console.log(`Received ${signal}. Shutting down server...`)
        server.close(() => {
            console.log('Server shut down gracefully.')
            process.exit(0)
        })
    })
}
