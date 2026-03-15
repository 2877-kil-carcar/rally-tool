function assign(){

let used=new Set()

let result=[]

rallies.forEach(r=>{

let count=r.need

players.forEach(p=>{

if(
p.heroes.includes(r.hero)
&& !used.has(p.name)
&& count>0
){

result.push({
rally:r.rally,
hero:r.hero,
player:p.name
})

used.add(p.name)

count--

}

})

if(count>0){

result.push({
rally:r.rally,
hero:r.hero,
player:"•sİ"
})

}

})

renderResult(result)

}