let rallies = load("rallies");

function addRally() {
  const leaderEl = document.getElementById("rallyLeader");
  if (!leaderEl) return;

  const leader = leaderEl.value.trim();

  if (!leader) {
    alert("集結主を選択してください");
    return;
  }

  if (rallies.some(r => r.rally === leader)) {
    alert("同じ集結主は登録できません");
    return;
  }

  function getHero(heroId, needId) {
    const hero = document.getElementById(heroId).value;
    const needValue = document.getElementById(needId).value;
    const need = Number(needValue);

    if (hero === "") {
      return null;
    }

    if (!needValue) {
      alert("英雄を選択した場合は人数を入力してください");
      throw new Error("人数未入力");
    }

    if (need < 1 || need > 4) {
      alert("人数は1～4で入力してください");
      throw new Error("人数範囲エラー");
    }

    return { hero: hero, need: need };
  }

  let heroes = [];

  try {
    let h1 = getHero("hero1", "need1");
    let h2 = getHero("hero2", "need2");
    let h3 = getHero("hero3", "need3");
    let h4 = getHero("hero4", "need4");

    if (h1) heroes.push(h1);
    if (h2) heroes.push(h2);
    if (h3) heroes.push(h3);
    if (h4) heroes.push(h4);
  } catch {
    return;
  }

  if (heroes.length === 0) {
    alert("英雄を登録してください");
    return;
  }

  const heroNames = heroes.map(h => h.hero);
  const uniqueHeroNames = new Set(heroNames);

  if (heroNames.length !== uniqueHeroNames.size) {
    alert("同じ英雄は登録できません");
    return;
  }

  const totalNeed = heroes.reduce((sum, h) => sum + h.need, 0);

  if (totalNeed > 4) {
    alert("1つの集結で登録できる人数合計は4までです");
    return;
  }

  rallies.push({
    rally: leader,
    heroes: heroes
  });

  save("rallies", rallies);

  renderRally();
}

function deleteRally(i) {
  rallies.splice(i, 1);
  save("rallies", rallies);
  renderRally();
}

function heroOptions() {
  let html = `<option value="">なし</option>`;

  heroMaster.forEach(h => {
    html += `<option value="${h}">${h}</option>`;
  });

  return html;
}

function setNeedDisabled(heroId, needId) {
  const heroEl = document.getElementById(heroId);
  const needEl = document.getElementById(needId);

  if (!heroEl || !needEl) return;

  if (heroEl.value === "") {
    needEl.value = "";
    needEl.disabled = true;
  } else {
    needEl.disabled = false;
  }
}

function updateNeedState() {
  setNeedDisabled("hero1", "need1");
  setNeedDisabled("hero2", "need2");
  setNeedDisabled("hero3", "need3");
  setNeedDisabled("hero4", "need4");
}

function renderRally() {
  let html = `<h2>集結設定</h2>`;

  html += `<div class="rally-header">集結主 
<select id="rallyLeader">`;

  if (players.length === 0) {
    html += `<option value="">プレイヤー未登録</option>`;
  } else {
    html += `<option value="">選択してください</option>`;
    players.forEach(p => {
      html += `<option value="${p.name}">${p.name}</option>`;
    });
  }

  html += `</select></div>`;

  if (heroMaster.length === 0) {
    html += `<p>先に英雄を登録してください。</p>`;
  }

  html += `
<div class="rally-row">
  <span class="rally-label">英雄</span>
  <select id="hero1" onchange="updateNeedState()">${heroOptions()}</select>
  <span class="rally-label">人数</span>
  <input id="need1" type="number" min="1" max="4">
</div>

<div class="rally-row">
  <span class="rally-label">英雄</span>
  <select id="hero2" onchange="updateNeedState()">${heroOptions()}</select>
  <span class="rally-label">人数</span>
  <input id="need2" type="number" min="1" max="4">
</div>

<div class="rally-row">
  <span class="rally-label">英雄</span>
  <select id="hero3" onchange="updateNeedState()">${heroOptions()}</select>
  <span class="rally-label">人数</span>
  <input id="need3" type="number" min="1" max="4">
</div>

<div class="rally-row">
  <span class="rally-label">英雄</span>
  <select id="hero4" onchange="updateNeedState()">${heroOptions()}</select>
  <span class="rally-label">人数</span>
  <input id="need4" type="number" min="1" max="4">
</div>

<button onclick="addRally()">追加</button>
`;

  html += `<table>
<tr>
<th>集結主</th>
<th>英雄</th>
<th>人数</th>
<th></th>
</tr>
`;

  rallies.forEach((r, i) => {
    r.heroes.forEach((h, index) => {
      html += `
<tr>
<td>${index === 0 ? r.rally : ""}</td>
<td>${h.hero}</td>
<td>${h.need}</td>
<td>${index === 0 ? `<button onclick="deleteRally(${i})">削除</button>` : ""}</td>
</tr>
`;
    });
  });

  html += `</table>`;

  document.getElementById("rally").innerHTML = html;

  updateNeedState();
}

renderRally();