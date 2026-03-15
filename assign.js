function shuffle(array){

for(let i=array.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1))

[array[i],array[j]]=[array[j],array[i]]

}

return array

}



function assign(){

let used=new Set()

let result=[]


rallies.forEach(r=>{

let count=r.need


// 英雄を持っているプレイヤー取得
let candidates=players.filter(p=>

p.heroes.includes(r.hero)

)


// ランダム化
candidates=shuffle([...candidates])


candidates.forEach(p=>{

if(count<=0) return

if(!used.has(p.name)){

result.push({
rally:r.rally,
hero:r.hero,
player:p.name
})

used.add(p.name)

count--

}

})


while(count>0){

result.push({
rally:r.rally,
hero:r.hero,
player:"不在"
})

count--

}

})


renderResult(result)

}



function renderResult(data){

let html=`<h2>振り分け結果</h2>`

html+=`<button onclick="assign()">再振り分け</button>`


html+=`
<table>
<tr>
<th>集結</th>
<th>英雄</th>
<th>プレイヤー</th>
</tr>
`


data.forEach(r=>{

html+=`
<tr>
<td>${r.rally}</td>
<td>${r.hero}</td>
<td>${r.player}</td>
</tr>
`

})


html+=`</table>`


document.getElementById("result").innerHTML=html

}