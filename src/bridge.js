// 渲染进程统一的 IPC 便捷封装(依赖 preload 暴露的 window.electron)
export const invoke = (channel, ...args) => window.electron.invoke(channel, ...args)
export const send = (channel, ...args) => window.electron.send(channel, ...args)
export const on = (channel, cb) => window.electron.on(channel, cb)
