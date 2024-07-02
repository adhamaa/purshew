import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: 'src/drizzle/schema/**/*.ts',
  out: 'db/migrations/',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  },
  verbose: false,
  strict: false,
})
