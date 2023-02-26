import mongoose from 'mongoose';
import { MONGO_HOST } from '../config';

const schema = mongoose.Schema;

const gptDb = mongoose.createConnection(MONGO_HOST, {
    useNewUrlParser: true
})

const resultsSchema = new schema({
    reqId: {
        type: String,
        required: true
    },
    result: {
        type: Object
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: {
            expires: '10m'
        }
    }
});

const ResultModel = gptDb.model('Result', resultsSchema);


const queryByReqId = async (reqId) => {
    try {
        const result = await ResultModel.findOne({
            reqId
        }).exec();

        if (!result) {
            return null;
        }
        return result.result;
    } catch {
        return null;
    }
}




export default {
    queryByReqId
};