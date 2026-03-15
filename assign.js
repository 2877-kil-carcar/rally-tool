function renderResult() {
  const result = document.getElementById("result");
  if (!result) return;

  result.innerHTML = `
    <h2>結果</h2>
    <p>ここは次の段階で集結設定と自動振り分けを実装します。</p>
  `;
}

renderResult();
showTab("heroes");