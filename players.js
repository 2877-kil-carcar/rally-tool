function groupOptions(selected){

  const groups = getState("groups")

  let html = `<option value="">なし</option>`

  groups.forEach(g=>{
    html += `<option value="${escapeHtml(g.name)}" ${selected === g.name ? 'selected' : ''}>${escapeHtml(g.name)}</option>`
  })

  return html
}

function allianceOptions(){

  const alliances = getState("alliances")

  let html = `<option value="">なし</option>`

  alliances.forEach(a=>{
    html += `<option value="${escapeHtml(a.name)}">${escapeHtml(a.name)}</option>`
  })

  return html
}

function timeOptions(selected){

  const times = []
  for(let h = 21; h <= 23; h++){
    times.push(`${String(h).padStart(2,'0')}:00`)
    times.push(`${String(h).padStart(2,'0')}:30`)
  }
  times.push("24:00")

  let html = `<option value="">--</option>`
  times.forEach(t=>{
    html += `<option value="${t}" ${selected === t ? 'selected' : ''}>${t}</option>`
  })

  return html
}

async function addPlayer(){

  const players = getState("players")

  let name = document.getElementById("playerName").value.trim()
  let alliance = document.getElementById("playerAlliance").value

  if(!name){
    alert("プレイヤー名を入力してください")
    return
  }

  if(players.some(p=>p.name === name)){
    alert("登録済み")
    return
  }

  let group = document.getElementById("playerGroup").value

  await window.db.collection("players").add({
    name: name,
    alliance: alliance,
    group: group,
    heroes: [],
    active: true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
}

async function togglePlayer(id, current){

  const update = { active: !current }
  if(current) update.joinTime = ""

  await window.db.collection("players").doc(id).update(update)
}

async function updatePlayerTime(id, time){

  await window.db.collection("players").doc(id).update({
    joinTime: time
  })
}

async function updatePlayerGroup(id, group){

  await window.db.collection("players").doc(id).update({
    group: group
  })
}

async function updatePlayerPriority(id, checked){

  await window.db.collection("players").doc(id).update({
    priority: checked
  })
}

async function deletePlayer(id){

  const players = getState("players")
  const rallies = getState("rallies")

  const target = players.find(p=>p.id === id)
  if(!target) return

  if(!confirm(`プレイヤー「${target.name}」を削除しますか？`)){
    return
  }

  const batch = window.db.batch()

  batch.delete(window.db.collection("players").doc(id))

  rallies.forEach(r=>{
    if(r.leaderId === id){
      batch.delete(window.db.collection("rallies").doc(r.id))
    }
  })

  await batch.commit()
}

// ★追加：同盟人数コピー
function copyAllianceCounts(groups){

  let text = ""

  Object.keys(groups)
    .sort((a,b)=>a.localeCompare(b))
    .forEach(alliance=>{

      const activePlayers = groups[alliance].filter(p=>p.active !== false)
      if(activePlayers.length === 0) return

      const name = (alliance === "未所属" ? "未所属" : alliance).toUpperCase()

      const timeCounts = {}
      activePlayers.forEach(p=>{
        const t = p.joinTime || "未定"
        timeCounts[t] = (timeCounts[t] || 0) + 1
      })

      const sortedTimes = Object.keys(timeCounts).sort((a,b)=>{
        if(a === "未定") return 1
        if(b === "未定") return -1
        return a.localeCompare(b)
      })

      const pad = " ".repeat(name.length + 1)

      sortedTimes.forEach((t, i)=>{
        if(i === 0){
          text += `${name} ${t} ${timeCounts[t]}名\n`
        } else {
          text += `${pad}${t} ${timeCounts[t]}名\n`
        }
      })
    })

  navigator.clipboard.writeText(text.trim())
    .then(()=>{
      alert("コピーしました")
    })
    .catch(()=>{
      alert("コピー失敗")
    })
}

function renderPlayers(){

  const players = getState("players")

  let html = `
  <h2>プレイヤー登録</h2>

  <input id="playerName" placeholder="プレイヤー名" oninput="checkAddInput('playerName','addPlayerBtn')">

  <select id="playerGroup">
  ${groupOptions("")}
  </select>

  <select id="playerAlliance">
  ${allianceOptions()}
  </select>

  <button id="addPlayerBtn" onclick="addPlayer()" disabled>追加</button>
  <button onclick="copyAllianceCounts(window._allianceGroups)">同盟参加人数コピー</button>
  
  <hr>

  <h3>同盟一括変更</h3>

  <select id="bulkAlliance">
  ${allianceOptions()}
  </select>

  <button onclick="bulkChangeAlliance()">一括変更</button>
  `

  const sorted = players.slice().sort((a,b)=>{

    let aAlliance = a.alliance || ""
    let bAlliance = b.alliance || ""

    let c = aAlliance.localeCompare(bAlliance)
    if(c !== 0) return c

    return a.name.localeCompare(b.name)
  })

  const groups = {}

  sorted.forEach(p=>{
    const key = p.alliance || "未所属"
    if(!groups[key]) groups[key] = []
    groups[key].push(p)
  })

  // ★コピー用に保持
  window._allianceGroups = groups

  Object.keys(groups).forEach(alliance=>{

    const count = groups[alliance].length

    html += `<h3>${escapeHtml(alliance)}　計${count}人</h3>`

    html += `
    <table>
    <tr>
    <th>一括変更</th>
    <th>プレイヤー</th>
    <th>グループ</th>
    <th>参加</th>
    <th>参加時間</th>
    <th>優先</th>
    <th></th>
    </tr>
    `
    groups[alliance].forEach(p=>{

      const isGorgeous = ["ディスティニー"].includes(p.name)
      const isActive = p.active !== false

      html += `
      <tr class="${isGorgeous ? "destiny-highlight" : ""}">
      <td>
        <input type="checkbox" id="chk_${p.id}" onchange="updateBulkChangeBtn()">
      </td>
      <td>
        <div style="text-align:center;">
          <input
            id="name_${p.id}"
            value="${escapeHtml(p.name)}"
            oninput="onPlayerNameInput('${p.id}')"
          >
        </div>

        <button
          id="btn_${p.id}"
          onclick="updatePlayerName('${p.id}')"
          disabled
        >
          更新
        </button>
      </td>
      <td>
      <select onchange="updatePlayerGroup('${p.id}', this.value)">
        ${groupOptions(p.group || "")}
      </select>
      </td>
      <td>
      <label class="switch">
      <input type="checkbox"
        ${isActive ? "checked" : ""}
        onchange="togglePlayer('${p.id}', ${isActive})">
      <span class="slider"></span>
      </label>
      </td>
      <td>
      <select
        id="time_${p.id}"
        onchange="updatePlayerTime('${p.id}', this.value)"
        ${!isActive ? "disabled" : ""}
      >
        ${timeOptions(p.joinTime || "")}
      </select>
      </td>
      <td>
      <label class="switch">
      <input type="checkbox"
        ${p.priority ? "checked" : ""}
        onchange="updatePlayerPriority('${p.id}', this.checked)">
      <span class="slider"></span>
      </label>
      </td>
      <td>
      <button onclick="deletePlayer('${p.id}')">削除</button>
      </td>
      </tr>
      `
    })

    html += `</table>`
  })

  document.getElementById("players").innerHTML = html
  initPlayerInputs() 
  afterRender()
  applyDestinyOverlay()
}

async function updatePlayerName(id){

  const input = document.getElementById("name_" + id)
  const btn = document.getElementById("btn_" + id)

  if(!input || !btn) return

  const newName = input.value.trim()

  if(!newName){
    alert("名前を入力してください")
    return
  }

  const players = getState("players")

  if(players.some(p => p.name === newName && p.id !== id)){
    alert("同名のプレイヤーが存在します")
    return
  }

  // ★即無効化（2回押し防止の本体）
  btn.disabled = true

  try{
    await window.db.collection("players").doc(id).update({
      name: newName
    })
  }
  catch(e){
    console.error(e)
    alert("更新失敗")

    // ★失敗時だけ戻す
    btn.disabled = false
  }
}

function onPlayerNameInput(id){

  const input = document.getElementById("name_" + id)
  const btn = document.getElementById("btn_" + id)

  if(!input || !btn) return

  const original = input.dataset.original || ""
  const current = input.value.trim()

  const changed = original !== current

  btn.disabled = !changed

  // ★色変化
  if(changed){
    input.classList.add("changed-input")
  }else{
    input.classList.remove("changed-input")
  }
}

function hasUnsavedChanges(){

  const inputs = document.querySelectorAll("input[id^='name_']")

  for(const input of inputs){
    const original = input.dataset.original || ""
    const current = input.value.trim()

    if(original !== current){
      return true
    }
  }

  return false
}

window.addEventListener("beforeunload", function (e){

  if(!hasUnsavedChanges()) return

  e.preventDefault()
  e.returnValue = ""
})

function updateBulkChangeBtn(){

  const btn = document.querySelector("button[onclick='bulkChangeAlliance()']")
  if(!btn) return

  // 管理者以外は触らない（applyPermission が制御）
  if(!window.currentUser?.isAdmin) return

  const anyChecked = Array.from(document.querySelectorAll("input[id^='chk_']"))
    .some(chk => chk.checked)

  btn.disabled = !anyChecked
}

function initPlayerInputs(){

  const inputs = document.querySelectorAll("input[id^='name_']")

  inputs.forEach(input=>{

    const id = input.id.replace("name_", "")
    const btn = document.getElementById("btn_" + id)

    const current = input.value.trim()

    // ★必ずここで揃える
    input.dataset.original = current

    // ★状態確定
    if(btn){
      btn.disabled = true
    }

    input.classList.remove("changed-input")
  })
}

async function bulkChangeAlliance(){

  const players = getState("players")
  const alliance = document.getElementById("bulkAlliance").value

  if(!confirm("選択したプレイヤーの同盟を変更しますか？")){
    return
  }

  const batch = window.db.batch()

  let count = 0
  const targets = []

  players.forEach(p=>{

    const chk = document.getElementById("chk_" + p.id)

    if(chk && chk.checked){

      batch.update(
        window.db.collection("players").doc(p.id),
        { alliance: alliance }
      )

      targets.push(p)
      count++
    }
  })

  if(count === 0){
    alert("対象が選択されていません")
    return
  }

  await batch.commit()

  // 対象プレイヤーごとにログ出力
  if(typeof saveLog === "function"){
    targets.forEach(p=>{
      saveLog("プレイヤー", "一括変更", `${p.name}：${p.alliance || "未所属"} → ${alliance || "未所属"}`)
    })
  }

  alert(`${count}件変更しました`)
}

function applyDestinyOverlay(){

  // 既存削除
  document.querySelectorAll(".destiny-global-overlay-item")
    .forEach(el => el.remove())

  const rows = document.querySelectorAll(".destiny-highlight")
  if(rows.length === 0) return

  rows.forEach(row => {

    const rect = row.getBoundingClientRect()

    if(rect.width === 0 || rect.height === 0) return

    const overlay = document.createElement("div")
    overlay.className = "destiny-global-overlay-item"

    overlay.style.position = "absolute"
    overlay.style.pointerEvents = "none"
    overlay.style.zIndex = "999"

    overlay.style.top = (window.scrollY + rect.top) + "px"
    overlay.style.left = (window.scrollX + rect.left) + "px"
    overlay.style.width = rect.width + "px"
    overlay.style.height = rect.height + "px"

    document.body.appendChild(overlay)
  })
}

subscribe("players", renderPlayers)
subscribe("alliances", renderPlayers)
subscribe("groups", renderPlayers)
renderPlayers()

window.updateBulkChangeBtn = updateBulkChangeBtn
window.addPlayer = addPlayer
window.togglePlayer = togglePlayer
window.updatePlayerTime = updatePlayerTime
window.updatePlayerGroup = updatePlayerGroup
window.updatePlayerPriority = updatePlayerPriority
window.deletePlayer = deletePlayer
window.renderPlayers = renderPlayers
window.copyAllianceCounts = copyAllianceCounts
window.bulkChangeAlliance = bulkChangeAlliance
window.applyDestinyOverlay = applyDestinyOverlay

window.addEventListener("scroll", applyDestinyOverlay)
window.addEventListener("resize", applyDestinyOverlay)