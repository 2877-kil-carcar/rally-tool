function allianceOptions(){

  const alliances = getState("alliances")

  let html = `<option value="">なし</option>`

  alliances.forEach(a=>{
    html += `<option value="${escapeHtml(a.name)}">${escapeHtml(a.name)}</option>`
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

  await window.db.collection("players").add({
    name: name,
    alliance: alliance,
    heroes: [],
    active: true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
}

async function togglePlayer(id, current){

  await window.db.collection("players").doc(id).update({
    active: !current
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

      const count = groups[alliance].length
      const name = alliance || "未所属"

      text += `${name.toUpperCase()} ${count}名\n`
    })

  navigator.clipboard.writeText(text)
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

  <input id="playerName" placeholder="プレイヤー名">

  <select id="playerAlliance">
  ${allianceOptions()}
  </select>

  <button onclick="addPlayer()">追加</button>
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
    <tr></th>
    <th></th>
    <th>プレイヤー</th>
    <th>参加</th>
    </tr>
    `      
    groups[alliance].forEach(p=>{

      const isGorgeous = ["ディスティニー"].includes(p.name)

      html += `
      <tr class="${isGorgeous ? "destiny-highlight" : ""}">
      <td>
        <input type="checkbox" id="chk_${p.id}">
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
      <label class="switch">
      <input type="checkbox"
        ${p.active !== false ? "checked" : ""}
        onchange="togglePlayer('${p.id}', ${p.active !== false})">
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

  players.forEach(p=>{

    const chk = document.getElementById("chk_" + p.id)

    if(chk && chk.checked){

      batch.update(
        window.db.collection("players").doc(p.id),
        { alliance: alliance }
      )

      count++
    }
  })

  if(count === 0){
    alert("対象が選択されていません")
    return
  }

  await batch.commit()

  alert(`${count}件変更しました`)
}

function applyDestinyOverlay(){

  const overlay = document.getElementById("destiny-global-overlay")
  if(!overlay) return

  const row = document.querySelector(".destiny-highlight")
  if(!row){
    overlay.style.display = "none"
    return
  }

  const rect = row.getBoundingClientRect()

  overlay.style.display = "block"
  overlay.style.top = (window.scrollY + rect.top) + "px"
  overlay.style.left = (window.scrollX + rect.left) + "px"
  overlay.style.width = rect.width + "px"
  overlay.style.height = rect.height + "px"
}

subscribe("players", renderPlayers)
subscribe("alliances", renderPlayers)
renderPlayers()

window.addPlayer = addPlayer
window.togglePlayer = togglePlayer
window.deletePlayer = deletePlayer
window.renderPlayers = renderPlayers
window.copyAllianceCounts = copyAllianceCounts
window.bulkChangeAlliance = bulkChangeAlliance
window.applyDestinyOverlay = applyDestinyOverlay

window.addEventListener("scroll", applyDestinyOverlay)
window.addEventListener("resize", applyDestinyOverlay)