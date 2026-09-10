import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { usersTable } from './db/schema.js';
import { eq } from 'drizzle-orm';

const app = new Hono()

const db = drizzle(process.env.DB_FILE_NAME!);
app.get('/', async(c) => {
    const students = await db.select().from(usersTable)
  return c.json({students})
})

app.post("/", async(c) => {
   const students = await c.req.json()
  await db.insert(usersTable).values(students);
  return c.json("Create student successful")
} )

app.put("/:id", async(c) => {
  const id = c.req.param('id')
  const students = await c.req.json()
  await db.update(usersTable).set(students).where(eq(usersTable.id, parseInt(id)));
  return c.json("Update successful")
} )

app.delete("/:id", async(c) => {
  const id = c.req.param('id')
  const students = await c.req.json()
  await db.delete(usersTable).where(eq(usersTable.id, parseInt(id)));
  return c.json("Delete successful")
} )

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})



