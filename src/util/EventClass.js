class EventClass{listeners=new Map;addEventListener(s,e){this.listeners.set(s,e)}emit(s,e={}){for(var[t,n]of this.listeners)t===s&&n(e)}}export{EventClass};