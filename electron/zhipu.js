const { ZHIPU_API_URL, MAX_CONTEXT_MESSAGES } = require('./config')
const { SYSTEM_PROMPT } = require('./prompt')

// SSE 流式调用大模型;cfg = { model, apiKey } 由用户在设置中配置
async function streamChat(messages, onChunk, cfg) {
  if (!cfg || !cfg.model || !cfg.apiKey) {
    throw new Error('missing model config')
  }
  const body = {
    model: cfg.model,
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-MAX_CONTEXT_MESSAGES),
    ],
  }
  const res = await fetch(ZHIPU_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(`API请求失败(${res.status}): ${await res.text()}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buf = ''
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop()
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const payload = trimmed.slice(5).trim()
      if (payload === '[DONE]') continue
      try {
        const delta = JSON.parse(payload).choices?.[0]?.delta?.content
        if (delta) {
          full += delta
          onChunk(delta)
        }
      } catch { /* 忽略不完整的行 */ }
    }
  }
  return full
}

module.exports = { streamChat }
