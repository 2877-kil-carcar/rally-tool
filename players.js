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

function renderPlayers(){

  const players = getState("players")

  let html = `
  <h2>プレイヤー登録</h2>

  <input id="playerName" placeholder="プレイヤー名">

  <select id="playerAlliance">
  ${allianceOptions()}
  </select>

  <button onclick="addPlayer()">追加</button>
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

  Object.keys(groups).forEach(alliance=>{

    html += `<h3>${escapeHtml(alliance)}</h3>`

    html += `
    <table>
    <tr>
    <th>プレイヤー</th>
    <th>参加</th>
    <th></th>
    </tr>
    `

    groups[alliance].forEach(p=>{
      html += `
      <tr>
      <td>${escapeHtml(p.name)}</td>
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
  afterRender()
}

subscribe("players", renderPlayers)
subscribe("alliances", renderPlayers)
renderPlayers()

window.addPlayer = addPlayer
window.togglePlayer = togglePlayer
window.deletePlayer = deletePlayer
window.renderPlayers = renderPlayers