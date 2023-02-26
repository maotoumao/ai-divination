import mongoose from "mongoose";
import { MONGO_HOST } from "./config.js";

const schema = mongoose.Schema;

mongoose.connect(MONGO_HOST, {
    useNewUrlParser: true,
});

const resultsSchema = new schema({
    reqId: {
        type: String,
        required: true,
    },
    /** 请求结果 */
    result: {
        type: Object,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: {
            expires: "1h",
        },
    },
});

const ResultModel = mongoose.model("Result", resultsSchema);

const saveResult = (reqId, data) => {
    const result = new ResultModel({
        reqId,
        result: data,
    });
    result.save().catch(() => { });
};

export { saveResult };
