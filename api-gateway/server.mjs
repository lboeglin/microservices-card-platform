'use strict'

import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Server and database configurations
const serverPort = process.env.SERVER_PORT || 3000

// Set environment (default to 'PROD' if not specified)
const env = (new URL(import.meta.url)).searchParams.get('env') || process.env.ENV || 'PROD'
console.log(`Environment: ${env}`)


// Dynamically import the app
const { default: app } = await import('./app.mjs')

// Start the server
const server = app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}`)
    console.log(`Server is running in ${env} mode`)
})

// Graceful shutdown handling
for (let signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
        console.log(`Received ${signal}. Shutting down server...`)
        server.close(async () => {
            console.log('Server shut down gracefully.')
            process.exit(0)
        })
    })
}

export default server
