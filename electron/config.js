// API 密钥与模型由用户在设置中配置,持久化于本地 settings.json,源码不包含任何密钥
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

// 上下文携带的最大历史消息条数
const MAX_CONTEXT_MESSAGES = 30
// 本地保存的最大历史对话数
const MAX_HISTORY_CONVERSATIONS = 10

module.exports = {
  ZHIPU_API_URL,
  MAX_CONTEXT_MESSAGES,
  MAX_HISTORY_CONVERSATIONS,
}
