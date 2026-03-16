let rallies = load("rallies")

function heroOptions(){

let html=`<option value="">なし</option>`

heroMaster.forEach(h=>{
html+=`<option value="${h}">${h}</option>`
})

return html

}

function addRally(){

let leader=document.getElementById("rallyLeader").value

let r1=Number(rate1.value)
let r2=Number(rate2.value)
let r3=Number(rate3.value)

if(r1+r2+r3!==100){
alert("割合合計は100にしてください")
return
}

let rate=`${r1}.${r2}.${r3}`

let heroes=[]

function getHero(h,n){

let hero=document.getElementById(h).value
let need=Number(document.getElementById(n).value)

if(!hero) return

heroes.push({hero:hero,need:need})

}

getHero("hero1","need1")
getHero("hero2","need2")
getHero("hero3","need3")
getHero("hero4","need4")

rallies.push({
rally:leader,
rate:rate,
heroes:heroes,
active:true
})

save("rallies",rallies)

renderRally()

}

function toggleRally(i){

rallies[i].active=!rallies[i].active

save("rallies",rallies)

renderRally()

}

function renderRally(){

let html=`
<h2>集結設定</h2>

集結主
<select id="rallyLeader">
`

// プレイヤーソート
let sortedPlayers = players.slice().sort((a,b)=>{

let aAlliance=a.alliance||""
let bAlliance=b.alliance||""

let c=aAlliance.localeCompare(bAlliance)
if(c!==0) return c

return a.name.localeCompare(b.name)

})

// 同盟グループ
let playerGroups={}

sortedPlayers.forEach(p=>{

let key=p.alliance||"未所属"

if(!playerGroups[key]) playerGroups[key]=[]

playerGroups[key].push(p)

})

// プルダウン生成
Object.keys(playerGroups).forEach(alliance=>{

html+=`<optgroup label="${alliance}">`

playerGroups[alliance].forEach(p=>{
html+=`<option>${p.name}</option>`
})

html+=`</optgroup>`

})

html+=`
</select>

割合
<input id="rate1" class="rate-input">
.
<input id="rate2" class="rate-input">
.
<input id="rate3" class="rate-input">
`

html+=`
<div class="rally-row">
英雄 <select id="hero1">${heroOptions()}</select>
人数 <input id="need1" type="number" min="1" max="4">
</div>

<div class="rally-row">
英雄 <select id="hero2">${heroOptions()}</select>
人数 <input id="need2" type="number">
</div>

<div class="rally-row">
英雄 <select id="hero3">${heroOptions()}</select>
人数 <input id="need3" type="number">
</div>

<div class="rally-row">
英雄 <select id="hero4">${heroOptions()}</select>
人数 <input id="need4" type="number">
</div>

<button onclick="addRally()">追加</button>
`

// rallyを同盟グループ化
let rallyGroups={}

rallies.forEach(r=>{

let player=players.find(p=>p.name===r.rally)

let alliance=player?player.alliance:"未所属"

if(!rallyGroups[alliance]) rallyGroups[alliance]=[]

rallyGroups[alliance].push(r)

})

// 表示
Object.keys(rallyGroups).forEach(alliance=>{

html+=`<h3>${alliance}</h3>`

html+=`
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

rallyGroups[alliance].forEach((r,i)=>{

r.heroes.forEach((h,index)=>{

html+=`
<tr>

<td>${index===0?r.rally:""}</td>

<td>
${index===0?`<label class="switch">
<input type="checkbox" ${r.active?"checked":""} onchange="toggleRally(${i})">
<span class="slider"></span>
</label>`:""}
</td>

<td>${index===0?r.rate:""}</td>

<td>${h.hero}</td>
<td>${h.need}</td>
<td>
${index===0?`<button onclick="deleteRally(${i})">削除</button>`:""}
</td>

</tr>
`

})

})

html+=`</table>`

})

document.getElementById("rally").innerHTML=html

}

function deleteRally(i){

if(!confirm("削除しますか？")) return

rallies.splice(i,1)

save("rallies",rallies)

renderRally()

}

renderRally()