function heroOptions(){

  const heroMaster = getState("heroes")

  let html = `<option value="">なし</option>`

  heroMaster.forEach(h=>{
    html += `<option value="${escapeHtml(h.name)}">${escapeHtml(h.name)}</option>`
  })

  return html
}

async function addRally(){

  const rallies = getState("rallies")
  const players = getState("players")

  const leaderId = document.getElementById("rallyLeader").value

  const r1 = Number(document.getElementById("rate1").value || 0)
  const r2 = Number(document.getElementById("rate2").value || 0)
  const r3 = Number(document.getElementById("rate3").value || 0)

  if(!leaderId){
    alert("集結主を選択してください")
    return
  }

  if(rallies.some(r=>r.leaderId === leaderId)){
    alert("同じ集結主は登録できません")
    return
  }

  if(r1 + r2 + r3 !== 100){
    alert("割合合計は100にしてください")
    return
  }

  const rate = `${r1}.${r2}.${r3}`

  const heroes = []
  const heroNames = new Set()

  function getHero(heroId, needId){

    const hero = document.getElementById(heroId).value
    const needRaw = document.getElementById(needId).value

    if(!hero){
      return
    }

    const need = Number(needRaw)

    if(!Number.isInteger(need) || need < 1 || need > 4){
      throw new Error("人数は1～4で入力してください")
    }

    if(heroNames.has(hero)){
      throw new Error("同じ英雄は同一集結に重複登録できません")
    }

    heroNames.add(hero)
    heroes.push({ hero: hero, need: need })
  }

  try{
    getHero("hero1","need1")
    getHero("hero2","need2")
    getHero("hero3","need3")
    getHero("hero4","need4")
  }
  catch(e){
    alert(e.message)
    return
  }

  if(heroes.length === 0){
    alert("英雄を1つ以上登録してください")
    return
  }

  const leader = players.find(p=>p.id === leaderId)
  if(!leader){
    alert("集結主が見つかりません")
    return
  }

  await window.db.collection("rallies").add({
    leaderId: leaderId,
    rate: rate,
    heroes: heroes,
    active: true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
}

async function toggleRally(id, current){

  await window.db.collection("rallies").doc(id).update({
    active: !current
  })
}

async function deleteRally(id){

  if(!confirm("削除しますか？")) return

  await window.db.collection("rallies").doc(id).delete()
}

function renderRally(){

  const players = getState("players")
  const rallies = getState("rallies")

  let html = `
  <h2>集結設定</h2>

  集結主
  <select id="rallyLeader">
  `

  const sortedPlayers = players.slice().sort((a,b)=>{

    let aAlliance = a.alliance || ""
    let bAlliance = b.alliance || ""

    let c = aAlliance.localeCompare(bAlliance)
    if(c !== 0) return c

    return a.name.localeCompare(b.name)
  })

  const playerGroups = {}

  sortedPlayers.forEach(p=>{
    const key = p.alliance || "未所属"
    if(!playerGroups[key]) playerGroups[key] = []
    playerGroups[key].push(p)
  })

  Object.keys(playerGroups).forEach(alliance=>{

    html += `<optgroup label="${escapeHtml(alliance)}">`

    playerGroups[alliance].forEach(p=>{
      html += `<option value="${p.id}">${escapeHtml(p.name)}</option>`
    })

    html += `</optgroup>`
  })

  html += `
  </select>

  割合
  <input id="rate1" class="rate-input" type="number" min="0" max="100">
  .
  <input id="rate2" class="rate-input" type="number" min="0" max="100">
  .
  <input id="rate3" class="rate-input" type="number" min="0" max="100">
  `

  html += `
  <div class="rally-row">
  英雄 <select id="hero1">${heroOptions()}</select>
  人数 <input id="need1" type="number" min="1" max="4">
  </div>

  <div class="rally-row">
  英雄 <select id="hero2">${heroOptions()}</select>
  人数 <input id="need2" type="number" min="1" max="4">
  </div>

  <div class="rally-row">
  英雄 <select id="hero3">${heroOptions()}</select>
  人数 <input id="need3" type="number" min="1" max="4">
  </div>

  <div class="rally-row">
  英雄 <select id="hero4">${heroOptions()}</select>
  人数 <input id="need4" type="number" min="1" max="4">
  </div>

  <button onclick="addRally()">追加</button>
  `

  const rallyGroups = {}

  rallies.forEach(r=>{

    const player = players.find(p=>p.id === r.leaderId)
    const alliance = player && player.alliance ? player.alliance : "未所属"

    if(!rallyGroups[alliance]) rallyGroups[alliance] = []

    rallyGroups[alliance].push({
      ...r,
      leaderName: player ? player.name : "不明"
    })
  })

  Object.keys(rallyGroups).sort((a,b)=>a.localeCompare(b)).forEach(alliance=>{

    html += `<h3>${escapeHtml(alliance)}</h3>`

    html += `
    <table>
    <tr>
    <th>集結主</th>
    <th>参加</th>
    <th>割合</th>
    <th>英雄</th>
    <th>人数</th>
    <th></th>
    </tr>
    `

    rallyGroups[alliance]
      .sort((a,b)=>a.leaderName.localeCompare(b.leaderName))
      .forEach(r=>{

        const heroes = Array.isArray(r.heroes) ? r.heroes : []

        heroes.forEach((h,index)=>{

          html += `
          <tr>
          <td>${index === 0 ? escapeHtml(r.leaderName) : ""}</td>

          <td>
          ${index === 0 ? `<label class="switch">
          <input type="checkbox" ${r.active ? "checked" : ""} onchange="toggleRally('${r.id}', ${r.active})">
          <span class="slider"></span>
          </label>` : ""}
          </td>

          <td>${index === 0 ? escapeHtml(r.rate) : ""}</td>
          <td>${escapeHtml(h.hero)}</td>
          <td>${escapeHtml(h.need)}</td>
          <td>${index === 0 ? `<button onclick="deleteRally('${r.id}')">削除</button>` : ""}</td>
          </tr>
          `
        })
      })

    html += `</table>`
  })

  document.getElementById("rally").innerHTML = html
  afterRender()
}

subscribe("players", renderRally)
subscribe("heroes", renderRally)
subscribe("rallies", renderRally)
renderRally()

window.addRally = addRally
window.toggleRally = toggleRally
window.deleteRally = deleteRally
window.renderRally = renderRally