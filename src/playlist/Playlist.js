import"https://cdn.jsdelivr.net/npm/sortablejs@1.14.0/Sortable.min.js";import"https://cdn.jsdelivr.net/gh/beatgammit/base64-js@1.5.1/base64js.min.js";import{decodeHTML,wait}from"../util/util.js";import Player from"../player/Player.js";import EventClass from"../util/EventClass.js";const progressBar=document.getElementById("progress-bar"),playlistOrder=document.getElementById("playlist-order");Sortable.create(playlistOrder);export default class Playlist extends EventClass{loadedPlayers=new Map;currentPlayer;repeatMode=0;createPlayer(e,t,a){let r="";e.name&&(e.originalAuthor&&(r+=e.originalAuthor,r+=e.author?" & ":" - "),e.author&&(r+=e.author+" - "),r+=e.name);var s=r||a,a=this.loadedPlayers.get(s);if(a)return this.currentPlayer=a;const l=new Player(e);l.name=s,l.arrayBuffer=t,l.addEventListener("end",async()=>{await this.nextPlayer()});const n=document.createElement("li");return n.innerHTML=s,n.addEventListener("click",async e=>{await this.switchTo(e.target.innerHTML),this.emit("clickChange")}),l.element=n,playlistOrder.prepend(n),this.loadedPlayers.set(s,l),this.currentPlayer=l,l.checkLooping(this.loadedPlayers.size),l}async nextPlayer(){if(1===this.repeatMode)this.currentPlayer.reset();else{this.currentPlayer.pause();var a=playlistOrder.children;let t=!1;for(let e=0;e<a.length;e++){const r=a[e];if(r.classList.contains("playing")){if(e+1>=a.length)break;const s=a[e+1];s.classList.add("playing"),r.classList.remove("playing"),this.currentPlayer=this.loadedPlayers.get(decodeHTML(s.innerHTML)),t=!0;break}}if(!t){if(2!==this.repeatMode)return void this.emit("playlistEnd");{const e=this.loadedPlayers.get(decodeHTML(a[0].innerHTML));e.element.classList.add("playing"),this.currentPlayer.element.classList.remove("playing"),this.currentPlayer=e}}}return await wait(1e3),await this.currentPlayer.reset(),this.currentPlayer.play(),this.currentPlayer}async switchTo(e){await this.pauseAll();for(const t of playlistOrder.children)if(t.innerHTML===e){t.classList.add("playing"),this.currentPlayer=this.loadedPlayers.get(decodeHTML(e));break}}async pauseAll(){await this.stopAll(async e=>{await e.pause()})}async resetAll(){await this.stopAll(async e=>{await e.reset(),progressBar.value=0})}async stopAll(e){for(const t of this.loadedPlayers.values())await e?.(t),t.element.classList.remove("playing")}async export(){const t={repeatMode:this.repeatMode,songs:[]},a=playlistOrder.children;for(let e=0;e<a.length;e++){var r=this.loadedPlayers.get(decodeHTML(a[e].innerHTML)),s=base64js.fromByteArray(new Uint8Array(r.arrayBuffer));t.songs.push({filename:r.name,data:s}),a[e].classList.contains("playing")&&(t.playing=e)}var e=JSON.stringify(t),e=new Blob([e],{type:"application/json"}),e=URL.createObjectURL(e);const l=document.createElement("a");l.download="playlist.json",l.href=e,document.body.append(l),l.click(),l.remove()}async import(e){const t=[];for(const s of e.songs.reverse()){var a=base64js.toByteArray(s.data),r=await a.buffer;t.push({name:a.filename,buffer:r})}return{songs:t,playing:e.playing,repeatMode:e.repeatMode}}}