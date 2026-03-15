function save(key,data){

localStorage.setItem(key,JSON.stringify(data))

}

function load(key){

return JSON.parse(localStorage.getItem(key)||"[]")

}

function showTab(id){

document.querySelectorAll(".tab").forEach(t=>{
t.style.display="none"
})

document.getElementById(id).style.display="block"

}