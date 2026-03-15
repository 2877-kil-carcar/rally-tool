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
    heroes: []
  });

  save("players", players);
  renderPlayers();
  renderPlayerHeroes();
}

function deletePlayer(index) {
  players.splice(index, 1);
  save("players", players);
  renderPlayers();
  renderPlayerHeroes();
}

function renderPlayers() {
  let html = `
    <h2>プレイヤー登録</h2>
    <input id="playerName" placeholder="プレイヤー名">
    <button onclick="addPlayer(document.getElementById('playerName').value)">追加</button>
    <table>
      <tr><th>プレイヤー</th><th></th></tr>
  `;

  players.forEach((p, i) => {
    html += `<tr><td>${p.name}</td><td><button onclick="deletePlayer(${i})">削除</button></td></tr>`;
  });

  html += `</table>`;

  document.getElementById("players").innerHTML = html;
}

renderPlayers();