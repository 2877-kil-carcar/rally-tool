const listeners = {}

window.appState = {
  heroes: [],
  alliances: [],
  players: [],
  rallies: []
}

function cloneValue(value){
  if(Array.isArray(value)){
    return value.map(v=>{
      if(v && typeof v === "object"){
        return { ...v }
      }
      return v
    })
  }

  if(value && typeof value === "object"){
    return { ...value }
  }

  return value
}

function getState(key){
  return cloneValue(window.appState[key])
}

function setState(key, value){
  window.appState[key] = Array.isArray(value) ? value : []
  notify(key)
  notify("*")
}

function notify(key){
  if(!listeners[key]) return

  listeners[key].forEach(fn=>{
    try{
      fn(getState(key), key)
    }
    catch(err){
      console.error(err)
    }
  })
}

function subscribe(key, fn){
  if(!listeners[key]){
    listeners[key] = []
  }

  listeners[key].push(fn)
}

function escapeHtml(value){
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function afterRender(){
  if(typeof applyPermission === "function"){
    applyPermission()
  }
}

window.getState = getState
window.setState = setState
window.subscribe = subscribe
window.escapeHtml = escapeHtml
window.afterRender = afterRender