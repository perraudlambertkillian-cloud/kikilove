const KEY="kikilove-demo-v1";
const defaultData={
 profiles:[{
  name:"Kiki",age:24,location:"Vendée, France",interest:"Aventure",
  bio:"Toujours partant pour une nouvelle aventure… Et si on écrivait la prochaine ensemble ?",
  tags:["🎬 Spectacle","🏋️ Sport","⛰️ Aventure","☀️ Voyage","🎮 Gaming","🐾 Animaux"],
  photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85"
 }],
 insta:"https://instagram.com/",snap:"https://snapchat.com/"
};
let data=JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(defaultData);
let index=0, matched=false;

const $=id=>document.getElementById(id);
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function render(){
 const p=data.profiles[index%data.profiles.length];
 $("profilePhoto").src=p.photo||defaultData.profiles[0].photo;
 $("profileName").textContent=`${p.name}, ${p.age}`;
 $("profileLocation").textContent=`♡ ${p.location}`;
 $("profileBio").textContent=`“${p.bio}”`;
 $("counter").textContent=`${(index%data.profiles.length)+1} / ${data.profiles.length}`;
 $("profileTags").innerHTML=(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join("");
}
function next(){index=(index+1)%data.profiles.length;render()}
function match(){
 matched=true; $("gift").classList.remove("hidden");
 $("matchModal").classList.remove("hidden");
}
$("nextBtn").onclick=next;
$("likeBtn").onclick=()=>{match();};
$("continueBtn").onclick=()=>{$("matchModal").classList.add("hidden");next()};
$("closeMatch").onclick=()=>{$("matchModal").classList.add("hidden")};
$("gift").onclick=()=>{
 $("instaLink").href=data.insta||"#"; $("snapLink").href=data.snap||"#";
 $("giftModal").classList.remove("hidden");
};
$("closeGift").onclick=()=>$("giftModal").classList.add("hidden");

function adminRender(){
 $("adminProfiles").innerHTML=data.profiles.map((p,i)=>`
 <div class="admin-profile" data-i="${i}">
  <h3>Profil ${i+1}</h3>
  <label>Nom<input data-k="name" value="${esc(p.name)}"></label>
  <label>Âge<input data-k="age" type="number" value="${esc(p.age)}"></label>
  <label>Lieu<input data-k="location" value="${esc(p.location)}"></label>
  <label>Centre d'intérêt<input data-k="interest" value="${esc(p.interest||"")}"></label>
  <label>Photo (URL)<input data-k="photo" value="${esc(p.photo)}"></label>
  <label>Description<textarea data-k="bio">${esc(p.bio)}</textarea></label>
  <label>Tags (séparés par des virgules)<input data-k="tags" value="${esc((p.tags||[]).join(", "))}"></label>
  <button class="delete" data-del="${i}">Supprimer</button>
 </div>`).join("");
 $("adminInsta").value=data.insta||"";
 $("adminSnap").value=data.snap||"";
 document.querySelectorAll(".admin-profile").forEach(box=>{
   box.querySelectorAll("[data-k]").forEach(inp=>inp.oninput=()=>{
     const i=+box.dataset.i,k=inp.dataset.k;
     data.profiles[i][k]=k==="tags"?inp.value.split(",").map(x=>x.trim()).filter(Boolean):inp.value;
     save(); render();
   });
 });
 document.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{
   data.profiles.splice(+b.dataset.del,1); if(!data.profiles.length)data.profiles.push(structuredClone(defaultData.profiles[0]));
   index=0;save();render();adminRender();
 });
}
$("openAdmin").onclick=()=>{$("admin").classList.remove("hidden");adminRender()};
$("closeAdmin").onclick=()=>$("admin").classList.add("hidden");
$("addProfile").onclick=()=>{data.profiles.push({name:"Kiki",age:24,location:"",interest:"",bio:"Nouvelle version de moi…",tags:["✨ Nouveau"],photo:defaultData.profiles[0].photo});save();adminRender();render()};
$("saveSettings").onclick=()=>{data.insta=$("adminInsta").value;data.snap=$("adminSnap").value;save();$("admin").classList.add("hidden")};
$("resetDemo").onclick=()=>{if(confirm("Réinitialiser la démo ?")){data=structuredClone(defaultData);index=0;matched=false;save();render();adminRender()}};
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
render();
