window.playerHeroesSelectedPlayerId = ""

function renderPlayerHeroes(){

  const players = getState("players")
  const heroes = getState("heroes")
  const container = document.getElementById("playerHeroes")

  if(players.length === 0){
    container.innerHTML = "<h2>所持英雄登録</h2><p>先にプレイヤー登録</p>"
    afterRender()
    return
  }

  if(!window.playerHeroesSelectedPlayerId || !players.some(p=>p.id === window.playerHeroesSelectedPlayerId)){
    window.playerHeroesSelectedPlayerId = players[0].id
  }

  let html = `
  <h2>所持英雄登録</h2>

  <select id="playerSelect" onchange="changePlayerHeroTarget(this.value)">
  `

  players.forEach(p=>{
    html += `<option value="${p.id}" ${p.id === window.playerHeroesSelectedPlayerId ? "selected" : ""}>${escapeHtml(p.name)}</option>`
  })

  html += `
  </select>

  <div id="heroList"></div>

  <button onclick="savePlayerHeroes()">保存</button>
  `

  container.innerHTML = html

  renderHeroCheckbox()
  afterRender()
}

function changePlayerHeroTarget(playerId){
  window.playerHeroesSelectedPlayerId = playerId
  renderHeroCheckbox()
}

function renderHeroCheckbox(){

  const players = getState("players")
  const heroMaster = getState("heroes")

  const player = players.find(p=>p.id === window.playerHeroesSelectedPlayerId)

  if(!player){
    heroList.innerHTML = ""
    return
  }

  const owned = Array.isArray(player.heroes) ? player.heroes : []

  let html = ""

  heroMaster.forEach(h=>{
    let checked = owned.includes(h.name) ? "checked" : ""

    html += `
    <label>
    <input type="checkbox" value="${escapeHtml(h.name)}" ${checked}>
    ${escapeHtml(h.name)}
    </label><br>
    `
  })

  if(heroMaster.length === 0){
    html = "<p>先に英雄登録</p>"
  }

  heroList.innerHTML = html
}

async function savePlayerHeroes(){

  const players = getState("players")
  const player = players.find(p=>p.id === window.playerHeroesSelectedPlayerId)

  if(!player){
    alert("プレイヤーが見つかりません")
    return
  }

  const checked = [...heroList.querySelectorAll("input:checked")].map(x=>x.value)

  await window.db.collection("players").doc(player.id).update({
    heroes: checked
  })

  alert("保存しました")
}

subscribe("players", renderPlayerHeroes)
subscribe("heroes", renderPlayerHeroes)
renderPlayerHeroes()

window.renderPlayerHeroes = renderPlayerHeroes
window.renderHeroCheckbox = renderHeroCheckbox
window.savePlayerHeroes = savePlayerHeroes
window.changePlayerHeroTarget = changePlayerHeroTarget