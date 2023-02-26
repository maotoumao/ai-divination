import redis from 'redis';
import { REDIS_PSWD, REDIS_URL } from '../config';


/** 缓存结果 */
const redisReqClient = redis.createClient({
    url: REDIS_URL,
    password: REDIS_PSWD
});


async function init() {
    await redisReqClient.connect();
}


const getReqClient = () => redisReqClient;

const queryReqResult = async (reqId) => {
    return await redisReqClient.get(`CHATGPT:${reqId}`);
}

export default {
    init,
    getReqClient,
    getSessionClient,
    queryReqResult
}