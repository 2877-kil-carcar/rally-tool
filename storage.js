function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function load(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function showTab(id) {

  document.querySelectorAll(".tab").forEach(t=>{
    t.style.display="none"
  })

  const el=document.getElementById(id)

  if(el){
    el.style.display="block"
  }

  // タブごとの再描画
  if(id==="heroes" && typeof renderHeroes==="function"){
    renderHeroes()
  }

  if(id==="players" && typeof renderPlayers==="function"){
    renderPlayers()
  }

  if(id==="playerHeroes" && typeof renderPlayerHeroes==="function"){
    renderPlayerHeroes()
  }

  if(id==="rally" && typeof renderRally==="function"){
    renderRally()
  }

}