// 用户设置(大模型ID与API密钥),存储于 userData/settings.json
const { app } = require('electron')
const fs = require('node:fs')
const path = require('node:path')

const settingsFile = () => path.join(app.getPath('userData'), 'settings.json')

function load() {
  try {
    const data = JSON.parse(fs.readFileSync(settingsFile(), 'utf-8'))
    return { model: data.model || '', apiKey: data.apiKey || '' }
  } catch {
    return { model: '', apiKey: '' }
  }
}

function save(cfg) {
  const data = {
    model: String(cfg.model || '').trim(),
    apiKey: String(cfg.apiKey || '').trim(),
  }
  fs.mkdirSync(path.dirname(settingsFile()), { recursive: true })
  fs.writeFileSync(settingsFile(), JSON.stringify(data, null, 2), 'utf-8')
  return data
}

function isConfigured() {
  const cfg = load()
  return !!(cfg.model && cfg.apiKey)
}

module.exports = { load, save, isConfigured }
