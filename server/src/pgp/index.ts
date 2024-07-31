import pgPromise from "pg-promise";

const pgp = pgPromise();

const db = pgp("postgres://admin:come@mebro@localhost:5432");

export async function checkDatabase(name: string) {
  try {
    const result = await db.one(
      "SELECT 1 FROM pg_database WHERE datname = $1;",
      [name],
    );
    if (Object.values(result).length > 0) {
      return true;
    }
  } catch (err: any) {
    console.log(err.message);
    if ((err.message = "No data returned from the query.")) return false;
    return err;
  }
}
