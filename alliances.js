let alliances=load("alliances")

function addAlliance(name){

let n=(name||"").trim()

if(!n){
alert("同盟名を入力してください")
return
}

if(alliances.includes(n)){
alert("登録済み")
return
}

alliances.push(n)

save("alliances",alliances)

renderAlliances()

renderPlayers()

}

function deleteAlliance(i){

let name=alliances[i]

alliances.splice(i,1)

players.forEach(p=>{
if(p.alliance===name){
p.alliance=""
}
})

save("players",players)
save("alliances",alliances)

renderAlliances()
renderPlayers()

}

function renderAlliances(){

let html=`
<h2>同盟登録</h2>

<input id="allianceName" placeholder="同盟名">

<button onclick="addAlliance(document.getElementById('allianceName').value)">追加</button>

<table>
<tr>
<th>同盟</th>
<th></th>
</tr>
`

alliances.forEach((a,i)=>{

html+=`
<tr>
<td>${a}</td>
<td><button onclick="deleteAlliance(${i})">削除</button></td>
</tr>
`

})

html+=`</table>`

document.getElementById("alliances").innerHTML=html

}

renderAlliances()