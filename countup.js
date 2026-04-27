let countupState = {
  group: "",
  rows: []
}

window.copyData = {}

// --- 描画 ---

function renderCountup(){

  const players = getState("players")
  const rallies = getState("rallies")
  const groups = getState("groups")

  let html = `
  <h2>カウントアップ</h2>

  グループ
  <select id="countupGroup" onchange="changeGroup(this.value)">
  <option value="">選択してください</option>
  `

  groups.forEach(g=>{
    const sel = g.name === countupState.group ? "selected" : ""
    html += `<option value="${escapeHtml(g.name)}" ${sel}>${escapeHtml(g.name)}</option>`
  })

  html += `</select>`

  html += `<button onclick="addCountupRow()">行追加</button>`

  // active集結主（グループ絞り込み）
  const activeLeaders = rallies
    .filter(r=>r.active)
    .map(r=>{
      const p = players.find(p=>p.id === r.leaderId)
      return p ? { id:p.id, name:p.name, alliance:p.alliance||"", group:p.group||"" } : null
    })
    .filter(x=>x && x.group === countupState.group)

  html += `<table>
  <tr>
    <th>順</th>
    <th>集結</th>
    <th>間隔</th>
    <th></th>
  </tr>`

  countupState.rows.forEach((row,i)=>{

    html += `<tr>`

    html += `<td>${i+1}</td>`

    html += `<td>
      <select onchange="changeLeader(${i}, this.value)">
      <option value="">選択</option>`

    activeLeaders.forEach(l=>{
      const selected = l.id === row.leaderId ? "selected" : ""
      html += `<option value="${l.id}" ${selected}>${escapeHtml(l.name)}</option>`
    })

    html += `</select>
    </td>`

    html += `<td>
      <input type="number" value="${row.interval||0}" onchange="changeInterval(${i}, this.value)">
    </td>`

    html += `<td>
      <button onclick="removeRow(${i})">削除</button>
    </td>`

    html += `</tr>`
  })

  html += `</table>`

  html += `<button onclick="calcCountup()">計算</button>`

  html += `<div id="countupResult"></div>`

  document.getElementById("countupTab").innerHTML = html
}

// --- 操作系 ---

function changeGroup(val){
  countupState.group = val
  countupState.rows = []
  renderCountup()
}

function addCountupRow(){

  if(countupState.rows.length >= 10){
    alert("最大10件までです")
    return
  }

  countupState.rows.push({ leaderId:"", interval:0 })
  renderCountup()
}

function removeRow(i){
  countupState.rows.splice(i,1)
  renderCountup()
}

function changeLeader(i, leaderId){

  // 重複チェック
  const exists = countupState.rows.some((r,idx)=> idx!==i && r.leaderId === leaderId)
  if(exists){
    alert("同じ集結主は選べません")
    renderCountup()
    return
  }

  countupState.rows[i].leaderId = leaderId
}

function changeInterval(i,val){
  countupState.rows[i].interval = Number(val)||0
}

// --- 計算 ---

function calcCountup(){

  const rallies = getState("rallies")
  const players = getState("players")

  const list = countupState.rows.filter(r=>r.leaderId)

  if(list.length === 0){
    alert("データがありません")
    return
  }

  const rows = list.map(r=>{
    const rally = rallies.find(x=>x.leaderId === r.leaderId && x.active)
    const player = players.find(p=>p.id === r.leaderId)

    return {
      leaderId: r.leaderId,
      name: player?.name || "不明",
      alliance: player?.alliance || "未所属",
      interval: r.interval,
      marchTime: rally?.marchTime || 0
    }
  })

  const base = Math.max(...rows.map(r=>r.marchTime))

  const result = rows.map(r=>{

    let time = 0

    if(r.marchTime !== base){
      time = (base - r.marchTime) + r.interval
    }

    return { ...r, time }
  })
  .sort((a,b)=>a.time - b.time)

  renderCountupResult(result)
}

// --- 結果表示 + コピー（同盟グループ対応）---

function renderCountupResult(data){

  let html = `<h3>結果</h3>`
  let text = ""

  const groups = {}

  data.forEach(r=>{
    if(!groups[r.alliance]){
      groups[r.alliance] = []
    }
    groups[r.alliance].push(r)
  })

  Object.keys(groups).sort().forEach(alliance=>{

    html += `<div><strong>${escapeHtml(alliance)}</strong></div>`
    text += `${alliance}\n`

    groups[alliance].forEach(r=>{
      html += `<div>${escapeHtml(r.name)}　${r.time}</div>`
      text += `${r.name} ${r.time}\n`
    })

    html += `<br>`
    text += `\n`
  })

  html += `<button onclick="copyCountup()">コピー</button>`

  document.getElementById("countupResult").innerHTML = html

  window.copyData["countup"] = text
}

// --- コピー ---

function copyCountup(){

  const text = window.copyData["countup"] || ""

  navigator.clipboard.writeText(text)
  .then(()=>{
    alert("コピーしました")
  })
  .catch(()=>{
    alert("コピーに失敗しました")
  })
}

// --- export ---

window.renderCountup = renderCountup
window.calcCountup = calcCountup
window.copyCountup = copyCountup