let rallyLeaders = load("rallyLeaders")
let rallies = load("rallies")

function addRallyLeader(name){

let n = (name || "").trim()

if(!n){
alert("WŒ‹–¼‚ğ“ü—Í‚µ‚Ä‚­‚¾‚³‚¢")
return
}

if(rallyLeaders.includes(n)){
alert("“o˜^Ï‚İ‚Å‚·")
return
}

rallyLeaders.push(n)

save("rallyLeaders",rallyLeaders)

renderRally()

}

function deleteRallyLeader(i){

rallyLeaders.splice(i,1)

save("rallyLeaders",rallyLeaders)

renderRally()

}

function addRallySetting(){

let rally = rallySelect.value
let hero = rallyHeroSelect.value
let need = Number(rallyNeed.value)

if(!rally || !hero || !need){
alert("“ü—Í‚µ‚Ä‚­‚¾‚³‚¢")
return
}

rallies.push({
rally:rally,
hero:hero,
need:need
})

save("rallies",rallies)

renderRally()

}

function deleteRallySetting(i){

rallies.splice(i,1)

save("rallies",rallies)

renderRally()

}

function renderRally(){

let html=`<h2>WŒ‹å“o˜^</h2>

<input id="rallyLeaderName" placeholder="WŒ‹–¼">
<button onclick="addRallyLeader(rallyLeaderName.value)">’Ç‰Á</button>

<table>
<tr><th>WŒ‹å</th><th></th></tr>
`

rallyLeaders.forEach((r,i)=>{
html+=`<tr>
<td>${r}</td>
<td><button onclick="deleteRallyLeader(${i})">íœ</button></td>
</tr>`
})

html+=`</table>`


html+=`<h2>WŒ‹İ’è</h2>`

html+=`<select id="rallySelect">`

rallyLeaders.forEach(r=>{
html+=`<option>${r}</option>`
})

html+=`</select>`


html+=`<select id="rallyHeroSelect">`

heroMaster.forEach(h=>{
html+=`<option>${h}</option>`
})

html+=`</select>`

html+=`
<input id="rallyNeed" type="number" min="1" placeholder="l”">
<button onclick="addRallySetting()">’Ç‰Á</button>
`

html+=`<table>
<tr>
<th>WŒ‹</th>
<th>‰p—Y</th>
<th>l”</th>
<th></th>
</tr>
`

rallies.forEach((r,i)=>{
html+=`
<tr>
<td>${r.rally}</td>
<td>${r.hero}</td>
<td>${r.need}</td>
<td><button onclick="deleteRallySetting(${i})">íœ</button></td>
</tr>
`
})

html+=`</table>`

document.getElementById("rally").innerHTML=html

}

renderRally()