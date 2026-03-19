window.copyData = {}

function shuffle(array){

  for(let i = array.length - 1; i > 0; i--){

    const j = Math.floor(Math.random() * (i + 1))

    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }

  return array
}

function assign(){

  const players = getState("players")
  const rallies = getState("rallies")

  const playerMap = {}
  players.forEach(p=>{
    playerMap[p.id] = p
  })

  const activeRallies = rallies.filter(r=>{
    if(r.active === false) return false

    const leader = playerMap[r.leaderId]
    if(!leader) return false
    if(leader.active === false) return false

    return true
  })

  const usedPlayerIds = new Set()
  const leaderIds = new Set(activeRallies.map(r=>r.leaderId))
  const result = []

  leaderIds.forEach(id=>usedPlayerIds.add(id))

  activeRallies.forEach(r=>{

    const leader = playerMap[r.leaderId]
    if(!leader) return

    const rallyAlliance = leader.alliance || ""

    ;(Array.isArray(r.heroes) ? r.heroes : []).forEach(h=>{

      let count = Number(h.need) || 0

      let candidates = players.filter(p=>

        p.active !== false &&
        p.id !== r.leaderId &&
        !leaderIds.has(p.id) &&
        !usedPlayerIds.has(p.id) &&
        Array.isArray(p.heroes) &&
        p.heroes.includes(h.hero) &&
        (p.alliance || "") === rallyAlliance
      )

      candidates = shuffle([...candidates])

      candidates.forEach(p=>{

        if(count <= 0) return

        result.push({
          leaderId: r.leaderId,
          leaderName: leader.name,
          alliance: rallyAlliance || "未所属",
          rate: r.rate || "",
          hero: h.hero,
          playerName: p.name
        })

        usedPlayerIds.add(p.id)
        count--
      })

      while(count > 0){

        result.push({
          leaderId: r.leaderId,
          leaderName: leader.name,
          alliance: rallyAlliance || "未所属",
          rate: r.rate || "",
          hero: h.hero,
          playerName: "不在"
        })

        count--
      }
    })
  })

  renderResult(result)
}

function renderResult(data){

  let html = `<h2>振り分け結果</h2>`

  const groups = {}

  data.forEach(r=>{
    if(!groups[r.leaderId]){
      groups[r.leaderId] = []
    }
    groups[r.leaderId].push(r)
  })

  const sortedLeaders = Object.keys(groups).sort((a,b)=>{

    const aa = groups[a][0].alliance || ""
    const bb = groups[b][0].alliance || ""

    const c = aa.localeCompare(bb)
    if(c !== 0) return c

    return groups[a][0].leaderName.localeCompare(groups[b][0].leaderName)
  })

  window.copyData = {}

  sortedLeaders.forEach(leaderId=>{

    const rows = groups[leaderId]
    const first = rows[0]

    html += `<div class="result-group">`
    html += `<h3>${escapeHtml(first.alliance)}</h3>`
    html += `<div class="result-row"><strong>${escapeHtml(first.leaderName)} ${escapeHtml(first.rate)}</strong></div>`

    let text = `${first.alliance}\n${first.leaderName} ${first.rate}\n`

    rows.forEach(r=>{
      html += `<div class="result-row">${escapeHtml(r.hero)} ${escapeHtml(r.playerName)}</div>`
      text += `${r.hero} ${r.playerName}\n`
    })

    html += `<button onclick="copyLeader('${leaderId}')">コピー</button>`
    html += `</div>`

    window.copyData[leaderId] = text
  })

  if(data.length === 0){
    html += `<p>結果はまだありません</p>`
  }

  document.getElementById("resultTable").innerHTML = html
  afterRender()
}

function copyLeader(id){

  const text = window.copyData[id] || ""

  navigator.clipboard.writeText(text)
  .then(()=>{
    alert("コピーしました")
  })
  .catch(()=>{
    alert("コピーに失敗しました")
  })
}

window.assign = assign
window.renderResult = renderResult
window.copyLeader = copyLeader