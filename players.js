let players = load("players");

function addPlayer(name) {
  const playerName = (name || "").trim();

  if (!playerName) {
    alert("プレイヤー名を入力してください");
    return;
  }

  if (players.some(p => p.name === playerName)) {
    alert("登録済みです");
    return;
  }

players.push({
name: playerName,
heroes: [],
active: true
});

  save("players", players);

  renderPlayers();

  if (typeof renderPlayerHeroes === "function") {
    renderPlayerHeroes();
  }

  if (typeof renderRally === "function") {
    renderRally();
  }
}

function deletePlayer(index) {
  const playerName = players[index].name;

  players.splice(index, 1);
  save("players", players);

  rallies = rallies.filter(r => r.rally !== playerName);
  save("rallies", rallies);

  renderPlayers();

  if (typeof renderPlayerHeroes === "function") {
    renderPlayerHeroes();
  }

  if (typeof renderRally === "function") {
    renderRally();
  }
}

function renderPlayers() {
  let html = `
    <h2>プレイヤー登録</h2>
    <input id="playerName" placeholder="プレイヤー名">
    <button onclick="addPlayer(document.getElementById('playerName').value)">追加</button>
    <table>
<tr>
<th>プレイヤー</th>
<th>参加</th>
<th></th>
</tr>
  `;

  players.forEach((p, i) => {
html += `
<tr>
<td>${p.name}</td>

<td>
<label class="switch">
<input type="checkbox" ${p.active!==false?"checked":""} onchange="togglePlayer(${i})">
<span class="slider"></span>
</label>
</td>

<td>
<button onclick="deletePlayer(${i})">削除</button>
</td>
</tr>
`  });

  html += `</table>`;

  document.getElementById("players").innerHTML = html;
}

function togglePlayer(i){

players[i].active=!players[i].active

save("players",players)

renderPlayers()

}

renderPlayers();