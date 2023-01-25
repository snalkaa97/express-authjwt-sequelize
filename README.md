
# Implement Auth JWT, Redis, Express, Sequelize

Middleware Authentication using JWT, and Redis Caching CRUD using Expres and Sequelize




## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SECRET`




## Install

To Install this project run

```bash
  npm install
```

If you haven't installed Redis, see the [Redis Documentation](https://developer.redis.com/howtos/quick-start) on your Operating System

To Migrate Table in Sequelize
```bash
  npx sequelize:cli db:migrate
```   

And Run this project
```bash
  node server.js
```
## Caching Position

Controllers are defined at `app/api/pegawai.js`. Cached data is saved as JSON.stringify and loaded as JSON.parse
 - Set Cache from Redis (when C, U, D)
    - `list`
    -  `getById`
    -  `add`
    - `udpate`
    - `delete`

