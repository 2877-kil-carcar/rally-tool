let heroMaster = load("heroMaster");

function addHero(name) {
  const heroName = (name || "").trim();

  if (!heroName) {
    alert("英雄名を入力してください");
    return;
  }

  if (heroMaster.includes(heroName)) {
    alert("登録済みです");
    return;
  }

  heroMaster.push(heroName);
  save("heroMaster", heroMaster);
  renderHeroes();
  renderPlayerHeroes();
}

function deleteHero(index) {
  heroMaster.splice(index, 1);
  save("heroMaster", heroMaster);
  renderHeroes();
  renderPlayerHeroes();
}

function renderHeroes() {
  let html = `
    <h2>英雄登録</h2>
    <input id="heroName" placeholder="英雄名">
    <button onclick="addHero(document.getElementById('heroName').value)">追加</button>
    <table>
      <tr><th>英雄</th><th></th></tr>
  `;

  heroMaster.forEach((h, i) => {
    html += `<tr><td>${h}</td><td><button onclick="deleteHero(${i})">削除</button></td></tr>`;
  });

  html += `</table>`;

  document.getElementById("heroes").innerHTML = html;
}

renderHeroes();