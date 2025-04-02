import postgres from 'postgres'

const db = postgres({ 
    host: "localhost",
    port: 5432,
    database: "YongoNet",
    username: "public_user",
    password: "50m05y0n60"
})

export default db