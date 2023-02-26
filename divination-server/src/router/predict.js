import KoaRouter from 'koa-router';
import { nanoid } from 'nanoid';
import mq from '../mq/index.js';
import redis from '../redis/index.js';
import db from '../db/chatgptDb.js';

const predictRouter = new KoaRouter({
    prefix: '/predict'
});

/** 开始预测 */
predictRouter.post('/start', async ctx => {
    const { name, gender, birth } = ctx.request.body ?? {};
    const reqId = nanoid();


    mq.sendMessage(reqId, `我要你担任算命先生。我会提供关于一个人的性别、生日等相关基本信息，你需要根据这些属性去推算出这个人的命运。您应该为用户提供详细的运势分析。您的第一个任务是：“请推算一个出生在${birth}的${name ? '名为' + name + '的' : ''}${gender}性的命运”。`, {
        promptPrefix: ' ',
        promptSuffix: ' '
    })
    ctx.body = {
        isOk: true,
        model: {
            reqId: reqId
        }
    }
})

/** 查询结果 */
predictRouter.post('/query', async ctx => {
    const { reqId } = ctx.request.body ?? {};
    try {
        const result = await redis.queryReqResult(reqId);
        if (result === "1") {
            // 空白的
            ctx.body = {
                isOk: true,
                model: {
                    pending: true
                }
            }
        } else if (result) {
            const parsed = JSON.parse(result);
            if (parsed.isOk) {
                ctx.body = {
                    isOk: true,
                    model: {
                        done: true,
                        text: parsed.model.text
                    }
                }
            } else {
                ctx.body = {
                    isOk: false,
                    model: {
                        done: true
                    },
                    errMsg: parsed.errMsg
                }
            }
        } else {
            // 查询mongodb，如果没有就抛异常
            const dbResult = await db.queryByReqId(reqId);
            if (dbResult) {
                ctx.body = {
                    isOk: dbResult.isOk ?? false,
                    model: {
                        done: true,
                        text: dbResult?.model?.text
                    },
                    errMsg: dbResult?.errMsg
                };
            } else {
                ctx.body = {
                    isOk: false,
                    model: {
                        done: true,
                    },
                    errMsg: ""
                }
            }

        }

    } catch {
        ctx.body = {
            isOk: false,
            model: {},
            errMsg: ""
        }
    }
})


/** 路由 */
export default predictRouter;
