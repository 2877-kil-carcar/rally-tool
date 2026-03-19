function renderPlayerHeroes(){
    
  let players = window.players || []

  if(!Array.isArray(players)) return

const container=document.getElementById("playerHeroes")

if(players.length===0){
container.innerHTML="<h2>所持英雄登録</h2><p>先にプレイヤー登録</p>"
return
}

let html=`
<h2>所持英雄登録</h2>

<select id="playerSelect" onchange="renderHeroCheckbox()">
`

players.forEach(p=>{
html+=`<option value="${p.name}">${p.name}</option>`
})

html+=`
</select>

<div id="heroList"></div>

<button onclick="savePlayerHeroes()">保存</button>
`

container.innerHTML=html

renderHeroCheckbox()

}

function renderHeroCheckbox(){

let player=players.find(p=>p.name===playerSelect.value)

let owned=player?player.heroes:[]

let html=""

heroMaster.forEach(h=>{

let checked=owned.includes(h)?"checked":""

html+=`
<label>
<input type="checkbox" value="${h}" ${checked}>
${h}
</label><br>
`

})

heroList.innerHTML=html

}

function savePlayerHeroes(){

let checked=[...heroList.querySelectorAll("input:checked")].map(x=>x.value)

let player=players.find(p=>p.name===playerSelect.value)

player.heroes=checked

save("players",players)

alert("保存しました")

}

renderPlayerHeroes()