let players = load("players")

function addPlayer(name){

if(players.some(p=>p.name===name)){
alert("“o˜^Ï‚İ")
return
}

players.push({
name:name,
heroes:[]
})

save("players",players)

renderPlayers()

}

function renderPlayers(){

let html="<h2>ƒvƒŒƒCƒ„[“o˜^</h2>"

html+=`
<input id="playerName">
<button onclick="addPlayer(playerName.value)">’Ç‰Á</button>
`

html+="<table>"

players.forEach(p=>{
html+=`<tr><td>${p.name}</td></tr>`
})

html+="</table>"

playersDiv.innerHTML=html

}

renderPlayers()