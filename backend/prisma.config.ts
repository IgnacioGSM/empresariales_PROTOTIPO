import "dotenv/config"

export default {
  datasource: {
    url: process.env.DATABASE_URL
  },
  migrations: {
    seed: 'node seed/seed.js'
  }
}