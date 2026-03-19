import { db } from "./firebase.js"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

let players = []
let alliances = []

// ----------------------
// 初期ロード
// ----------------------
export async function initPlayers() {

  // --- 同盟取得 ---
  const appDoc = await getDoc(doc(db, "app", "config"))

  if (appDoc.exists()) {
    const data = appDoc.data()
    alliances = Array.isArray(data.alliances) ? data.alliances : []
  } else {
    alliances = []
  }

  // --- プレイヤー取得 ---
  const snapshot = await getDocs(collection(db, "players"))

  players = []
  snapshot.forEach(d => {
    players.push({
      id: d.id,
      ...d.data()
    })
  })

  renderPlayers()
}

// ----------------------
// 同盟プルダウン
// ----------------------
function allianceOptions(){

  let html = `<option value="">なし</option>`

  alliances.forEach(a=>{
    html += `<option value="${a}">${a}</option>`
  })

  return html
}

// ----------------------
// 追加
// ----------------------
async function addPlayer(){

  let name = document.getElementById("playerName").value.trim()
  let alliance = document.getElementById("playerAlliance").value

  if(!name){
    alert("プレイヤー名を入力してください")
    return
  }

  if(players.some(p=>p.name===name)){
    alert("登録済み")
    return
  }

  await addDoc(collection(db,"players"),{
    name:name,
    alliance:alliance,
    heroes:[],
    active:true
  })

  await initPlayers()
}

// ----------------------
// ON/OFF切替
// ----------------------
async function togglePlayer(id, current){

  await updateDoc(doc(db,"players",id),{
    active: !current
  })

  await initPlayers()
}

// ----------------------
// 削除
// ----------------------
async function deletePlayer(id){

  await deleteDoc(doc(db,"players",id))

  await initPlayers()
}

// ----------------------
// 描画
// ----------------------
function renderPlayers(){

  let html=`
  <h2>プレイヤー登録</h2>

  <input id="playerName" placeholder="プレイヤー名">

  <select id="playerAlliance">
  ${allianceOptions()}
  </select>

  <button onclick="addPlayer()">追加</button>
  `

  // ソート（同盟→名前）
  let sorted = players.slice().sort((a,b)=>{

    let aAlliance=a.alliance||""
    let bAlliance=b.alliance||""

    let c=aAlliance.localeCompare(bAlliance)
    if(c!==0) return c

    return a.name.localeCompare(b.name)
  })

  // グループ化
  let groups={}

  sorted.forEach(p=>{
    let key=p.alliance||"未所属"
    if(!groups[key]) groups[key]=[]
    groups[key].push(p)
  })

  Object.keys(groups).forEach(alliance=>{

    html+=`<h3>${alliance}</h3>`

    html+=`
    <table>
    <tr>
    <th>プレイヤー</th>
    <th>参加</th>
    <th></th>
    </tr>
    `

    groups[alliance].forEach(p=>{

      html+=`
      <tr>

      <td>${p.name}</td>

      <td>
      <label class="switch">
      <input type="checkbox"
        ${p.active!==false?"checked":""}
        onchange="togglePlayer('${p.id}', ${p.active!==false})">
      <span class="slider"></span>
      </label>
      </td>

      <td>
      <button onclick="deletePlayer('${p.id}')">削除</button>
      </td>

      </tr>
      `
    })

    html+=`</table>`
  })

  document.getElementById("players").innerHTML=html
}

// ----------------------
// グローバル公開（重要）
// ----------------------
window.addPlayer = addPlayer
window.togglePlayer = togglePlayer
window.deletePlayer = deletePlayer

// ----------------------
// 起動
// ----------------------
initPlayers()