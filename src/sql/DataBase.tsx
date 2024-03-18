import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";

const DataBase = process.env.DATABASE_URL as string;

export const db = async () => {
  const datasource = new DataSource({
    type: "mysql", // Reemplaza "mysql" con el tipo de base de datos que estás utilizando
    url: DataBase, // Reemplaza "DataBase" con el nombre de tu base de datos
    host: "planetscale",
    ssl: {
      rejectUnauthorized: false,
    },
    database: "onimaedb",
  });
  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });
  console.log(db.allTables.map((t) => t.tableName));
};
