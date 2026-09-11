const { app } = require('electron')
const fs = require('node:fs')
const path = require('node:path')
const { MAX_HISTORY_CONVERSATIONS } = require('./config')

const dataFile = path.join(app.getPath('userData'), 'data.json')

let cache = null

function load() {
  if (cache) return cache
  try {
    cache = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  } catch {
    cache = { conversations: [] }
  }
  if (!Array.isArray(cache.conversations)) cache.conversations = []
  return cache
}

function save() {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true })
  fs.writeFileSync(dataFile, JSON.stringify(cache, null, 2), 'utf-8')
}

function newConversation() {
  return { id: Date.now() + '' + Math.floor(Math.random() * 1000), title: '', createdAt: Date.now(), messages: [] }
}

// 将对话归档进历史(最多保留 MAX_HISTORY_CONVERSATIONS 条,新的在前)
function archive(conv) {
  if (!conv || !conv.messages.length) return
  const data = load()
  data.conversations = data.conversations.filter(c => c.id !== conv.id)
  conv.title = (conv.messages.find(m => m.role === 'user')?.content || '新对话').slice(0, 20)
  data.conversations.unshift(conv)
  data.conversations = data.conversations.slice(0, MAX_HISTORY_CONVERSATIONS)
  save()
}

function getHistory() {
  return load().conversations
}

function getConversation(id) {
  return load().conversations.find(c => c.id === id) || null
}

module.exports = { newConversation, archive, getHistory, getConversation }
