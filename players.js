let players = load("players")

function allianceOptions(){

let html=`<option value="">なし</option>`

alliances.forEach(a=>{
html+=`<option value="${a}">${a}</option>`
})

return html

}

function addPlayer(){

let name=document.getElementById("playerName").value.trim()
let alliance=document.getElementById("playerAlliance").value

if(!name){
alert("プレイヤー名を入力してください")
return
}

if(players.some(p=>p.name===name)){
alert("登録済み")
return
}

players.push({
name:name,
alliance:alliance,
heroes:[],
active:true
})

save("players",players)

renderPlayers()

}

function togglePlayer(i){

players[i].active=!players[i].active

save("players",players)

renderPlayers()

}

function deletePlayer(i){

players.splice(i,1)

save("players",players)

renderPlayers()

}

function renderPlayers(){

let html=`
<h2>プレイヤー登録</h2>

<input id="playerName" placeholder="プレイヤー名">

<select id="playerAlliance">
${allianceOptions()}
</select>

<button onclick="addPlayer()">追加</button>
`

// 同盟→名前ソート
let sorted = players.slice().sort((a,b)=>{

let aAlliance=a.alliance||""
let bAlliance=b.alliance||""

let c=aAlliance.localeCompare(bAlliance)
if(c!==0) return c

return a.name.localeCompare(b.name)

})

// 同盟グループ化
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

let i=players.findIndex(x=>x.name===p.name)

html+=`
<tr>

<td>${p.name}</td>

<td>
<label class="switch">
<input type="checkbox" ${p.active!==false?"checked":""} onchange="togglePlayer(${i})">
<span class="slider"></span>
</label>
</td>

<td>
<button onclick="deletePlayer(${i})">削除</button>
</td>

</tr>
`

})

html+=`</table>`

})

document.getElementById("players").innerHTML=html

}

renderPlayers()