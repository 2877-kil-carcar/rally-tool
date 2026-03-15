let heroMaster = load("heroMaster")

function addHero(name){

if(heroMaster.includes(name)){
alert("“o˜^Ï‚İ")
return
}

heroMaster.push(name)

save("heroMaster",heroMaster)

renderHeroes()

}

function renderHeroes(){

let html="<h2>‰p—Y“o˜^</h2>"

html+=`
<input id="heroName">
<button onclick="addHero(heroName.value)">’Ç‰Á</button>
`

html+="<table>"

heroMaster.forEach(h=>{
html+=`<tr><td>${h}</td></tr>`
})

html+="</table>"

heroes.innerHTML=html

}

renderHeroes()