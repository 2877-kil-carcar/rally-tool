function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

function assign() {
  if (rallies.length === 0) {
    renderResult([]);
    return;
  }

  let usedPlayers = new Set();
  let result = [];

  let leaders = new Set(rallies.map(r => r.rally));
  leaders.forEach(name => usedPlayers.add(name));

  rallies.forEach(r => {
    r.heroes.forEach(h => {
      let count = h.need;

      let candidates = players.filter(p =>
        p.name !== r.rally &&
        !leaders.has(p.name) &&
        !usedPlayers.has(p.name) &&
        (p.heroes || []).includes(h.hero)
      );

      candidates = shuffle([...candidates]);

      candidates.forEach(p => {
        if (count <= 0) return;

        result.push({
          rally: r.rally,
          hero: h.hero,
          player: p.name
        });

        usedPlayers.add(p.name);
        count--;
      });

      while (count > 0) {
        result.push({
          rally: r.rally,
          hero: h.hero,
          player: "不在"
        });

        count--;
      }
    });
  });

  renderResult(result);
}

function renderResult(data){

let html=`<h2>振り分け結果</h2>`

if(data.length===0){
html+="<p>集結設定がありません</p>"
document.getElementById("resultTable").innerHTML=html
return
}

// 集結主ごとにグループ化
let groups={}

data.forEach(r=>{
if(!groups[r.rally]) groups[r.rally]=[]
groups[r.rally].push(r)
})

Object.keys(groups).forEach(leader=>{

html+=`<div class="result-group">`

html+=`<h3>${leader}</h3>`

let copyText=`${leader}\n`

groups[leader].forEach(r=>{

html+=`
<div class="result-row">
${r.hero} ${r.player}
</div>
`

copyText+=`${r.hero} ${r.player}\n`

})

html+=`
<button onclick="copyLeader('${leader}')">コピー</button>
`

html+=`</div>`

// コピー用保存
window._copyLeaderData=window._copyLeaderData||{}
window._copyLeaderData[leader]=copyText

})

document.getElementById("resultTable").innerHTML=html

}

function copyLeader(name){

if(!window._copyLeaderData) return

navigator.clipboard.writeText(window._copyLeaderData[name])

alert("コピーしました")

}