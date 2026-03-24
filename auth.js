const ADMIN_PASSWORD = "prev"

let isAdmin = false

function selectRole(admin){

  if(admin){
    document.getElementById("adminLogin").style.display = "block"
  }
  else{
    isAdmin = false
    finishLogin()
  }
}

function loginAdmin(){

  const pass = document.getElementById("adminPass").value

  if(pass !== ADMIN_PASSWORD){
    alert("パスワード違います")
    return
  }

  isAdmin = true
  finishLogin()
}

function finishLogin(){

  document.getElementById("loginModal").style.display = "none"

  if(isAdmin){
    showTab("heroes")
  }
  else{
    showTab("result")
  }

  applyPermission()
}

function applyPermission(){

  if(document.getElementById("loginModal").style.display !== "none"){
    return
  }

  if(isAdmin){
    document.querySelectorAll("button,input,select").forEach(el=>{
      // ★更新ボタンは除外
      if(el.id && (el.id.startsWith("btn_") || el.id.startsWith("alliance_btn_"))) return
      el.disabled = false
    })
    return
  }

  document.querySelectorAll("button").forEach(btn=>{

    if(btn.closest("#loginModal")) return
    if(btn.innerText.includes("自動振り分け")) return

    btn.disabled = true
  })

  document.querySelectorAll("input,select").forEach(el=>{
    if(el.id === "adminPass") return
    el.disabled = true
  })

  document.querySelectorAll(".tabs button").forEach(btn=>{
    btn.disabled = btn.innerText !== "結果"
  })

  showTab("result")
}

window.selectRole = selectRole
window.loginAdmin = loginAdmin
window.finishLogin = finishLogin
window.applyPermission = applyPermission