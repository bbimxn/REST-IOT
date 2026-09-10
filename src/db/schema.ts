import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  surname: text().notNull(),
  dob: int({mode:"timestamp_ms"}).notNull(),
  gender : text({enum:["male","female"]})
});
