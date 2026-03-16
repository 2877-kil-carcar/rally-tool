let rallies = load("rallies")

function addRally(){

let leader=document.getElementById("rallyLeader").value.trim()
let rate=document.getElementById("rallyRate").value.trim()

if(!leader){
alert("集結主を選択してください")
return
}

if(!/^\d{3}$/.test(rate)){
alert("割合は3桁で入力してください (例:630)")
return
}

if(rallies.some(r=>r.rally===leader)){
alert("同じ集結主は登録できません")
return
}

function getHero(heroId,needId){

let hero=document.getElementById(heroId).value
let need=Number(document.getElementById(needId).value)

if(hero==="") return null

if(!need){
alert("人数を入力してください")
throw "人数エラー"
}

return {hero:hero,need:need}

}

let heroes=[]

try{

let h1=getHero("hero1","need1")
let h2=getHero("hero2","need2")
let h3=getHero("hero3","need3")
let h4=getHero("hero4","need4")

if(h1) heroes.push(h1)
if(h2) heroes.push(h2)
if(h3) heroes.push(h3)
if(h4) heroes.push(h4)

}catch{
return
}

if(heroes.length===0){
alert("英雄を登録してください")
return
}

let names=heroes.map(h=>h.hero)
let unique=new Set(names)

if(names.length!==unique.size){
alert("同じ英雄は登録できません")
return
}

let total=heroes.reduce((s,h)=>s+h.need,0)

if(total>4){
alert("人数合計は4まで")
return
}

rallies.push({
rally:leader,
rate:rate,
heroes:heroes
})

save("rallies",rallies)

renderRally()

}

function deleteRally(i){

rallies.splice(i,1)

save("rallies",rallies)

renderRally()

}

function heroOptions(){

let html=`<option value="">なし</option>`

heroMaster.forEach(h=>{
html+=`<option value="${h}">${h}</option>`
})

return html

}

function updateNeed(hero,need){

let h=document.getElementById(hero)
let n=document.getElementById(need)

if(h.value===""){
n.value=""
n.disabled=true
}else{
n.disabled=false
}

}

function renderRally(){

let html=`<h2>集結設定</h2>`

html+=`<div class="rally-header">

集結主
<select id="rallyLeader">`

if(players.length===0){
html+=`<option value="">プレイヤー未登録</option>`
}else{

html+=`<option value="">選択</option>`

players.forEach(p=>{
html+=`<option value="${p.name}">${p.name}</option>`
})

}

html+=`</select>

割合
<input id="rallyRate" maxlength="3" placeholder="630">

</div>`

html+=`

<div class="rally-row">
英雄 <select id="hero1" onchange="updateNeed('hero1','need1')">${heroOptions()}</select>
人数 <input id="need1" type="number" min="1" max="4">
</div>

<div class="rally-row">
英雄 <select id="hero2" onchange="updateNeed('hero2','need2')">${heroOptions()}</select>
人数 <input id="need2" type="number" min="1" max="4">
</div>

<div class="rally-row">
英雄 <select id="hero3" onchange="updateNeed('hero3','need3')">${heroOptions()}</select>
人数 <input id="need3" type="number" min="1" max="4">
</div>

<div class="rally-row">
英雄 <select id="hero4" onchange="updateNeed('hero4','need4')">${heroOptions()}</select>
人数 <input id="need4" type="number" min="1" max="4">
</div>

<button onclick="addRally()">追加</button>

`

html+=`<table>
<tr>
<th>集結主</th>
<th>割合</th>
<th>英雄</th>
<th>人数</th>
<th></th>
</tr>
`

rallies.forEach((r,i)=>{

r.heroes.forEach((h,index)=>{

html+=`
<tr>
<td>${index===0 ? r.rally : ""}</td>
<td>${index===0 ? r.rate : ""}</td>
<td>${h.hero}</td>
<td>${h.need}</td>
<td>${index===0 ? `<button onclick="deleteRally(${i})">削除</button>` : ""}</td>
</tr>
`

})

})

html+=`</table>`

document.getElementById("rally").innerHTML=html

}