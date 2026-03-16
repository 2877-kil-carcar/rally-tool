function renderPlayerHeroes() {
  const container = document.getElementById("playerHeroes");

  if (!container) return;

  if (players.length === 0) {
    container.innerHTML = "<h2>所持英雄登録</h2><p>先にプレイヤーを登録してください。</p>";
    return;
  }

  let html = `
    <h2>所持英雄登録</h2>
    <select id="playerSelect" onchange="renderHeroCheckbox()">
  `;

  players.forEach(p => {
    html += `<option value="${p.name}">${p.name}</option>`;
  });

  html += `
    </select>
    <div id="heroList"></div>
    <button onclick="savePlayerHeroes()">保存</button>
  `;

  container.innerHTML = html;
  renderHeroCheckbox();
}

function renderHeroCheckbox() {
  const playerSelect = document.getElementById("playerSelect");
  const heroList = document.getElementById("heroList");

  if (!playerSelect || !heroList) return;

  const player = players.find(p => p.name === playerSelect.value);
  const ownedHeroes = player ? (player.heroes || []) : [];

  let html = "";

  heroMaster.forEach(h => {
    const checked = ownedHeroes.includes(h) ? "checked" : "";
    html += `
      <label>
        <input type="checkbox" value="${h}" ${checked}>
        ${h}
      </label><br>
    `;
  });

  heroList.innerHTML = html;
}

function savePlayerHeroes() {
  const playerSelect = document.getElementById("playerSelect");
  const heroList = document.getElementById("heroList");

  if (!playerSelect || !heroList) return;

  const checked = [...heroList.querySelectorAll("input:checked")].map(x => x.value);
  const player = players.find(p => p.name === playerSelect.value);

  if (!player) return;

  player.heroes = checked;
  save("players", players);
  alert("保存しました");

  if (typeof renderRally === "function") {
    renderRally();
  }
}

renderPlayerHeroes();