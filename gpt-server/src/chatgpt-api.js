import { ChatGPTAPI } from "chatgpt";

// key列表
let keyLists = [];
// key-API
let apiInfo = new Map();


keyLists.forEach(key => {
    const api = new ChatGPTAPI({
        apiKey: key,
    });
    apiInfo.set(key, api);
});



function getRandomKey() {
    return keyLists[Math.floor(keyLists.length * Math.random())];
}

/**
 * 发送请求
 * @param {string} message 对话内容
 */
async function request(message, options) {
    // 获取一个idleKey
    const idleKey = getRandomKey();
    const api = apiInfo.get(idleKey);

    let result;
    try {
        const res = await api.sendMessage(message, options);
        result = {
            isOk: true,
            model: res
        };
    } catch (e) {
        result = {
            isOk: false,
            errMsg: e?.message
        }
    }
    return result;
}


export default {
    request,
}