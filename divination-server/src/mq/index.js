import { connect } from 'amqplib';
import { RABBITMQ_HOST } from '../config.js';
import redis from '../redis/index.js';

let mqChannel;
// 交换机名称
const exchangeName = "chat-gpt-exchange";
const key = "request-queue";
const namespace = 'CHATGPT:';

async function initMq() {
    const connection = await connect(RABBITMQ_HOST);

    // 消费请求
    mqChannel = await connection.createChannel();

    await mqChannel.assertExchange(exchangeName, 'direct', {
        durable: true,
    })
    await mqChannel.assertQueue(key);
}

/** 发送消息 */
async function sendMessage(id, msg) {
    // redis缓存
    const rds = redis.getReqClient();
    await rds.set(`${namespace}${id}`, 1, {
        EX: 600
    });

    // 推入消息队列
    mqChannel?.publish(exchangeName, key, Buffer.from(JSON.stringify({
        id,
        msg,
    })));
}


export default { initMq, sendMessage }