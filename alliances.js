async function addAlliance(name){

  const allianceName = (name || "").trim()

  if(!allianceName){
    alert("同盟名を入力してください")
    return
  }

  const alliances = getState("alliances")

  if(alliances.some(a=>a.name === allianceName)){
    alert("登録済み")
    return
  }

  await window.db.collection("alliances").add({
    name: allianceName,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
}

async function deleteAlliance(id){

  const alliances = getState("alliances")
  const players = getState("players")

  const target = alliances.find(a=>a.id === id)
  if(!target) return

  if(!confirm(`同盟「${target.name}」を削除しますか？`)){
    return
  }

  const batch = window.db.batch()

  batch.delete(window.db.collection("alliances").doc(id))

  players.forEach(player=>{
    if(player.alliance === target.name){
      batch.update(
        window.db.collection("players").doc(player.id),
        {
          alliance: ""
        }
      )
    }
  })

  await batch.commit()
}

function renderAlliances(){

  const alliances = getState("alliances")

  let html = `
  <h2>同盟登録</h2>

  <input id="allianceName" placeholder="同盟名">

  <button onclick="addAlliance(document.getElementById('allianceName').value)">追加</button>

  <table>
  <tr>
  <th>同盟</th>
  <th></th>
  </tr>
  `

  alliances.forEach(a=>{
    html += `
    <tr>
    <td>${escapeHtml(a.name)}</td>
    <td><button onclick="deleteAlliance('${a.id}')">削除</button></td>
    </tr>
    `
  })

  html += `</table>`

  document.getElementById("alliances").innerHTML = html
  afterRender()
}

subscribe("alliances", renderAlliances)
renderAlliances()

window.addAlliance = addAlliance
window.deleteAlliance = deleteAlliance
window.renderAlliances = renderAlliances