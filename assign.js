function shuffle(array){

for(let i=array.length-1;i>0;i--){

const j=Math.floor(Math.random()*(i+1))

const temp=array[i]
array[i]=array[j]
array[j]=temp

}

return array

}

function assign(){

let used=new Set()

let result=[]

let leaders=new Set(rallies.map(r=>r.rally))

leaders.forEach(l=>used.add(l))

rallies.forEach(r=>{

r.heroes.forEach(h=>{

let count=h.need

let candidates=players.filter(p=>
p.active!==false &&
p.name!==r.rally &&
!leaders.has(p.name) &&
!used.has(p.name) &&
p.heroes.includes(h.hero)
)

candidates=shuffle([...candidates])

candidates.forEach(p=>{

if(count<=0) return

result.push({
rally:r.rally,
hero:h.hero,
player:p.name
})

used.add(p.name)

count--

})

while(count>0){

result.push({
rally:r.rally,
hero:h.hero,
player:"不在"
})

count--

}

})

})

renderResult(result)

}

function renderResult(data){

let html=`<h2>振り分け結果</h2>`

let groups={}

data.forEach(r=>{
if(!groups[r.rally]) groups[r.rally]=[]
groups[r.rally].push(r)
})

window.copyData={}

Object.keys(groups).forEach(leader=>{

let rally=rallies.find(x=>x.rally===leader)
let rate=rally ? rally.rate : ""

html+=`<div class="result-group">`

html+=`<h3>${leader} ${rate}</h3>`

let text=`${leader} ${rate}\n`

groups[leader].forEach(r=>{

html+=`<div class="result-row">${r.hero} ${r.player}</div>`

text+=`${r.hero} ${r.player}\n`

})

html+=`<button onclick="copyLeader('${leader}')">コピー</button>`

html+=`</div>`

copyData[leader]=text

})

document.getElementById("resultTable").innerHTML=html

}
function copyLeader(name){

navigator.clipboard.writeText(copyData[name])

alert("コピーしました")

}