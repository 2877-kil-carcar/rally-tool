// auth.js

const ADMIN_PASSWORD = "destiny" // ←好きに変えてOK

let isAdmin = false

function selectRole(admin){

  if(admin){
    document.getElementById("adminLogin").style.display="block"
  }else{
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

  document.getElementById("loginModal").style.display="none"

  applyPermission()
}

/* 権限制御 */
function applyPermission(){

  if(isAdmin) return

  // 一般ユーザー制限
  document.querySelectorAll("button").forEach(btn=>{

    if(btn.innerText.includes("自動振り分け")) return

    btn.disabled = true
  })

  document.querySelectorAll("input,select").forEach(el=>{
    el.disabled = true
  })

  // タブ制限
  document.querySelectorAll(".tabs button").forEach(btn=>{
    if(btn.innerText !== "結果"){
      btn.disabled = true
    }
  })

  // 強制的に結果タブ
  showTab("result")
}