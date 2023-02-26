import Koa from 'koa';
import { koaBody } from "koa-body";

import mq from './mq/index.js';
import redis from './redis/index.js';
import predictRouter from './router/predict.js';

const app = new Koa();


app.use(koaBody({
  multipart: true
}));


app.use(predictRouter.routes());


async function run() {
  await redis.init();
  await mq.initMq();

  app.listen(9520, () => {
    console.log("启动服务")
  });

}

run();