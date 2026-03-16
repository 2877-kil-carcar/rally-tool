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

// 集結主一覧
let leaders=new Set(
rallies.filter(r=>r.active!==false).map(r=>r.rally)
)

// 集結主は最初から使用済み
leaders.forEach(l=>used.add(l))

rallies.filter(r=>r.active!==false).forEach(r=>{

// 集結主プレイヤー
let leaderPlayer=players.find(p=>p.name===r.rally)

let rallyAlliance=leaderPlayer?leaderPlayer.alliance:""

r.heroes.forEach(h=>{

let count=h.need

// 候補
let candidates=players.filter(p=>

p.active!==false &&              // 参加ON
p.name!==r.rally &&              // 自分の集結は乗らない
!leaders.has(p.name) &&          // 他の集結主も乗らない
!used.has(p.name) &&             // 他集結に乗らない
p.heroes.includes(h.hero) &&     // 英雄所持
p.alliance===rallyAlliance       // 同盟一致
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

// 同盟→集結主順
let sortedRallies=[...new Set(data.map(x=>x.rally))].sort((a,b)=>{

let pa=players.find(p=>p.name===a)
let pb=players.find(p=>p.name===b)

let aa=pa&&pa.alliance?pa.alliance:""
let ab=pb&&pb.alliance?pb.alliance:""

let c=aa.localeCompare(ab)
if(c!==0) return c

return a.localeCompare(b)

})

window.copyData={}

sortedRallies.forEach(leader=>{

let rally=rallies.find(x=>x.rally===leader)
let rate=rally?rally.rate:""

let leaderPlayer=players.find(p=>p.name===leader)
let alliance=leaderPlayer&&leaderPlayer.alliance?leaderPlayer.alliance:"未所属"

html+=`<div class="result-group">`

html+=`<h3>${alliance}</h3>`
html+=`<div class="result-row"><strong>${leader} ${rate}</strong></div>`

let text=`${alliance}\n${leader} ${rate}\n`

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