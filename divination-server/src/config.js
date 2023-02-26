// 配置
const host = 'xx.xx.xx.xx';


const redisConfig = {
    port: 66,
    pswd: "password"
};

const mongodbConfig = {
    dbName: 'dbName',
    userName: 'userName',
    pswd: "password",
    port: 27019
}


/** 导出 */
export const REDIS_URL = `redis://${host}:${redisConfig.port}`;

export const REDIS_PSWD = redisConfig.pswd;

export const MONGO_HOST = `mongodb://${mongodbConfig.userName}:${mongodbConfig.host}@${host}:${mongodbConfig.port}/${mongodbConfig.dbName}`;

export const RABBITMQ_HOST = `amqp://${host}?heartbeat=120`;