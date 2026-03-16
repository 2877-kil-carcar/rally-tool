let heroMaster=load("heroMaster")

function addHero(name){

let hero=(name||"").trim()

if(!hero){
alert("英雄名を入力してください")
return
}

if(heroMaster.includes(hero)){
alert("登録済みです")
return
}

heroMaster.push(hero)

save("heroMaster",heroMaster)

renderHeroes()

}

function deleteHero(i){

heroMaster.splice(i,1)

save("heroMaster",heroMaster)

renderHeroes()

}

function renderHeroes(){

let html=`
<h2>英雄登録</h2>

<input id="heroName" placeholder="英雄名">

<button onclick="addHero(document.getElementById('heroName').value)">追加</button>

<table>
<tr>
<th>英雄</th>
<th></th>
</tr>
`

heroMaster.forEach((h,i)=>{

html+=`
<tr>
<td>${h}</td>
<td><button onclick="deleteHero(${i})">削除</button></td>
</tr>
`

})

html+=`</table>`

document.getElementById("heroes").innerHTML=html

}

renderHeroes()