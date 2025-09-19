// migrate.mjs
import 'dotenv/config';
import sqlite3 from 'sqlite3';
import { Client } from 'pg';

(async () => {
  // 1) Open SQLite read-only
  const sq = new sqlite3.Database(
    './.tmp/data.db',
    sqlite3.OPEN_READONLY,
    err => {
      if (err) {
        console.error('❌ Failed to open SQLite file:', err);
        process.exit(1);
      }
    }
  );

  // 2) Discover your tables, skipping Strapi internals & any *_user_lnk
  let tables = await new Promise((res, rej) => {
    sq.all(
      `SELECT name
         FROM sqlite_master
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
          AND name NOT LIKE 'knex_%'
          AND name NOT LIKE 'strapi_migrations%'
          AND name NOT LIKE 'strapi_database_schema'
          AND name NOT LIKE 'strapi_core_store_settings'
          AND name NOT LIKE 'strapi_releases%'
          AND name NOT LIKE 'strapi_history_versions'
          AND name NOT LIKE 'strapi_webhooks'
          AND name NOT LIKE 'strapi_workflows%'
          AND name NOT LIKE '%_user_lnk'                -- skip any user link tables
          AND name NOT IN (
            'files','upload_folders','files_related_mph','files_folder_lnk','upload_folders_parent_lnk',
            'i18n_locale',
            'up_permissions','up_roles','up_users','up_permissions_role_lnk','up_users_role_lnk',
            'admin_permissions','admin_users','admin_roles','admin_permissions_role_lnk','admin_users_roles_lnk',
            'strapi_api_tokens','strapi_api_token_permissions',
            'strapi_transfer_tokens','strapi_transfer_token_permissions',
            'strapi_api_token_permissions_token_lnk','strapi_transfer_token_permissions_token_lnk',
            'strapi_release_actions_release_lnk',
            'strapi_workflows_stage_required_to_publish_lnk',
            'strapi_workflows_stages_workflow_lnk',
            'strapi_workflows_stages_permissions_lnk'
          );`,
      (err, rows) => (err ? rej(err) : res(rows.map(r => r.name)))
    );
  });

  console.log('→ Discovered tables:', tables);

  // 3) Sort tables: entities first, then component tables, then link tables
  const entityTables = tables.filter(
    t => !t.endsWith('_cmps') && !t.endsWith('_lnk')
  );
  const componentTables = tables.filter(t => t.endsWith('_cmps'));
  const linkTables = tables.filter(t => t.endsWith('_lnk'));
  tables = [...entityTables, ...componentTables, ...linkTables];

  console.log('→ Migration order:', tables);

  // 4) Connect to Postgres (use env vars or DATABASE_URL)
  const connectionConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        host: process.env.PGHOST || process.env.DATABASE_HOST,
        port: Number(process.env.PGPORT || process.env.DATABASE_PORT || 5432),
        database: process.env.PGDATABASE || process.env.DATABASE_NAME,
        user: process.env.PGUSER || process.env.DATABASE_USERNAME,
        password: process.env.PGPASSWORD || process.env.DATABASE_PASSWORD,
        ssl:
          process.env.PGSSL === 'disable' || process.env.DATABASE_SSL === 'false'
            ? false
            : { rejectUnauthorized: false }
      };

  const pg = new Client(connectionConfig);
  await pg.connect();

  // 5) Migrate tables in order
  for (const tbl of tables) {
    // 5a) Fetch all rows from SQLite
    const rows = await new Promise((res, rej) => {
      sq.all(`SELECT * FROM "${tbl}"`, (e, data) => (e ? rej(e) : res(data)));
    });
    if (!rows.length) {
      console.log(`— skipping empty table "${tbl}"`);
      continue;
    }

    // 5b) Fetch column metadata
    const metaRes = await pg.query(
      `SELECT column_name, data_type, character_maximum_length, numeric_precision
         FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name   = $1;`,
      [tbl]
    );
    const maxLens = {};
    const intCols = {};
    for (const r of metaRes.rows) {
      if (r.character_maximum_length) {
        maxLens[r.column_name] = r.character_maximum_length;
      }
      if (r.data_type === 'integer' && r.numeric_precision) {
        intCols[r.column_name] = r.numeric_precision;
      }
    }

    // 5c) Filter out admin-FK columns
    const cols = Object.keys(rows[0]).filter(
      c => c !== 'created_by_id' && c !== 'updated_by_id'
    );

    // 5d) Build INSERT SQL
    const quotedCols = cols.map(c => `"${c}"`).join(', ');
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
    const insertSQL = `
      INSERT INTO "${tbl}" (${quotedCols})
      VALUES (${placeholders})
      ON CONFLICT DO NOTHING
    `;

    // 5e) Insert each row, handling types and limits
    for (const row of rows) {
      const values = cols.map(col => {
        let v = row[col];

        // Timestamp conversion
        if (
          (typeof v === 'number' && v > 1e12) ||
          (typeof v === 'string' && /^\d+$/.test(v) && Number(v) > 1e12)
        ) {
          return new Date(Number(v));
        }
        // Truncate overly long strings
        if (typeof v === 'string' && maxLens[col] && v.length > maxLens[col]) {
          console.warn(
            `⚠ Truncating "${col}" in "${tbl}" ${v.length}→${maxLens[col]} chars`
          );
          return v.slice(0, maxLens[col]);
        }
        // Clamp integers to 32-bit
        if (intCols[col] === 32) {
          const num = Number(v);
          const maxInt = 2 ** 31 - 1;
          const minInt = -(2 ** 31);
          if (!Number.isNaN(num)) {
            if (num > maxInt) return maxInt;
            if (num < minInt) return minInt;
          }
        }
        return v;
      });

      await pg.query(insertSQL, values);
    }

    console.log(`✅ Migrated ${rows.length} row(s) from "${tbl}"`);
  }

  // 6) Clean up
  await pg.end();
  sq.close(err => {
    if (err) console.error('Error closing SQLite:', err);
    else console.log('🎉 Migration complete!');
  });
})().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
