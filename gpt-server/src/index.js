import './polyfill.js';
import { connect } from 'amqplib';
import chatgptApi from './chatgpt-api.js';
import redis from 'redis';
import { REDIS_URL, REDIS_PSWD, RABBITMQ_HOST } from './config.js';
import { saveResult } from './db.js';



const redisClient = redis.createClient({
    url: REDIS_URL,
    password: REDIS_PSWD
})
const namespace = 'CHATGPT:';

let channel;
let queueLen = 10;

/** 消息队列 */
async function startListenMq() {
    await redisClient.connect();

    let connection = await connect(RABBITMQ_HOST);

    // 交换机名称
    const exchangeName = "chat-gpt-exchange";
    const key = "request-queue";

    // 消费请求
    channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', {
        durable: true,
    })
    await channel.assertQueue(key);
    await channel.bindQueue(key, exchangeName, key);
    await channel.prefetch(queueLen);
    await channel.consume(key, async msg => {
        try {
            const content = msg.content.toString();
            const jsonContent = JSON.parse(content);
            const result = await chatgptApi.request(jsonContent.msg, jsonContent.options);
            const id = jsonContent.id;

            // 写入redis, ttl  10分钟
            redisClient.set(`${namespace}${id}`, JSON.stringify(result), {
                EX: 600
            });
            const payload = jsonContent.payload;
            saveResult(id, result, payload?.tag, payload?.extra);
        } catch {
        }
        channel.ack(msg);
    }, {
        noAck: false,
    })


}


startListenMq()


