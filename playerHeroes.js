function renderPlayerHeroes(){

let html="<h2>Š‰p—Y“o˜^</h2>"

html+=`<select id="playerSelect">`

players.forEach(p=>{
html+=`<option>${p.name}</option>`
})

html+="</select>"

html+="<div id='heroList'></div>"

html+="<button onclick='savePlayerHeroes()'>•Û‘¶</button>"

playerHeroes.innerHTML=html

renderHeroCheckbox()

}

function renderHeroCheckbox(){

let html=""

heroMaster.forEach(h=>{

html+=`
<label>
<input type="checkbox" value="${h}">
${h}
</label><br>
`

})

heroList.innerHTML=html

}

function savePlayerHeroes(){

let name = playerSelect.value

let checked=[...heroList.querySelectorAll("input:checked")]
.map(x=>x.value)

let p = players.find(x=>x.name===name)

p.heroes = checked

save("players",players)

}