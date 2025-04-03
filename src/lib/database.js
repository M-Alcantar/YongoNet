import { PUBLIC_HOST, PUBLIC_PORT, PUBLIC_DATABASE, PUBLIC_USERNAME, PUBLIC_PASSWORD } from "$env/static/public"

import postgres from 'postgres'

const db = postgres({ 
    host: PUBLIC_HOST,
    port: parseInt(PUBLIC_PORT),
    database: PUBLIC_DATABASE,
    username: PUBLIC_USERNAME,
    password: PUBLIC_PASSWORD
})

export default db