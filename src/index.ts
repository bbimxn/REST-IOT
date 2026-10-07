import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { usersTable } from './db/schema.js';
import { eq } from 'drizzle-orm';

const app = new Hono()
const db = drizzle(process.env.DB_FILE_NAME!);

app.get('/', async (c) => {
  const students = await db.select().from(usersTable)
  return c.json({ students })
})

app.post('/', async (c) => {
  const body = await c.req.json()
  const studentData = {
    ...body,
    dob: new Date(body.dob)
  }
  
  await db.insert(usersTable).values(studentData);
  return c.json({ message: "Create student successful" })
})

app.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()

  const studentData = {
    ...body,
    ...(body.dob && { dob: new Date(body.dob) })
  }

  await db.update(usersTable)
    .set(studentData)
    .where(eq(usersTable.id, parseInt(id)));

  return c.json({ message: "Update successful" })
})

app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  // เอา c.req.json() ออกเพื่อป้องกัน Error กรณีไม่มี Body ส่งมา
  await db.delete(usersTable).where(eq(usersTable.id, parseInt(id)));
  return c.json({ message: "Delete successful" })
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})