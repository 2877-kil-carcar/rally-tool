// Firestore 版 storage.js

const COLLECTION = "data"
const DOC_ID = "app"

/* ローカルキャッシュ */
let cache = {
  players: [],
  rallies: [],
  alliances: [],
  heroMaster: []
}

/* 初期化 */
window.initStorage = async function () {

  const { doc, getDoc, setDoc, onSnapshot } = window._fs
  const db = window._db

  const ref = doc(db, COLLECTION, DOC_ID)

  let snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, cache)
  } else {
    cache = snap.data() || {}

    cache.players = Array.isArray(cache.players) ? cache.players : []
    cache.rallies = Array.isArray(cache.rallies) ? cache.rallies : []
    cache.alliances = Array.isArray(cache.alliances) ? cache.alliances : []
    cache.heroMaster = Array.isArray(cache.heroMaster) ? cache.heroMaster : []
  }

  // リアルタイム同期
  onSnapshot(ref, (docSnap) => {

    if (!docSnap.exists()) return

    cache = docSnap.data() || {}

    cache.players = Array.isArray(cache.players) ? cache.players : []
    cache.rallies = Array.isArray(cache.rallies) ? cache.rallies : []
    cache.alliances = Array.isArray(cache.alliances) ? cache.alliances : []
    cache.heroMaster = Array.isArray(cache.heroMaster) ? cache.heroMaster : []

    // 再描画
    if (typeof renderHeroes === "function") renderHeroes()
    if (typeof renderPlayers === "function") renderPlayers()
    if (typeof renderAlliances === "function") renderAlliances()
    if (typeof renderPlayerHeroes === "function") renderPlayerHeroes()
    if (typeof renderRally === "function") renderRally()

  })
}

/* 保存 */
async function save(key, data) {

  const { doc, updateDoc } = window._fs
  const db = window._db

  cache[key] = data

  const ref = doc(db, COLLECTION, DOC_ID)

  await updateDoc(ref, {
    [key]: data
  })
}

/* 読み込み */
function load(key) {
  return Array.isArray(cache[key]) ? cache[key] : []
}

/* タブ */
function showTab(id){

  document.querySelectorAll(".tab").forEach(t=>{
    t.style.display="none"
  })

  // ▼追加：ボタンの状態管理
  document.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.classList.remove("active")
  })

  // onclickからid逆引き
  document.querySelectorAll(".tab-btn").forEach(btn=>{
    if(btn.getAttribute("onclick").includes(`'${id}'`)){
      btn.classList.add("active")
    }
  })

  let el=document.getElementById(id)

  if(el){
    el.style.display="block"
  }

  if(id==="heroes" && typeof renderHeroes==="function") renderHeroes()
  if(id==="alliances" && typeof renderAlliances==="function") renderAlliances()
  if(id==="players" && typeof renderPlayers==="function") renderPlayers()
  if(id==="playerHeroes" && typeof renderPlayerHeroes==="function") renderPlayerHeroes()
  if(id==="rally" && typeof renderRally==="function") renderRally()
}