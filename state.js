const CHANNEL_NAME = "tambola_channel_v1";
const STORAGE_KEY = "tambola_state_v1";

function nowISO(){ return new Date().toISOString(); }

export function defaultState(){
  return {
    version: 1,
    called: [],         // numbers in order
    last: null,         // last confirmed number
    updatedAt: nowISO()
  };
}

export function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const s = JSON.parse(raw);
    if(!s || !Array.isArray(s.called)) return defaultState();
    return s;
  }catch(e){
    return defaultState();
  }
}

export function saveState(state){
  state.updatedAt = nowISO();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(){
  const s = defaultState();
  saveState(s);
  return s;
}

export function isValidNumber(n){ return Number.isInteger(n) && n>=1 && n<=90; }

export function remainingNumbers(state){
  const calledSet = new Set(state.called);
  const rem = [];
  for(let i=1;i<=90;i++) if(!calledSet.has(i)) rem.push(i);
  return rem;
}

export function pickRandomRemaining(state){
  const rem = remainingNumbers(state);
  if(rem.length === 0) return null;
  const idx = Math.floor(Math.random() * rem.length);
  return rem[idx];
}

export function confirmNumber(state, n){
  if(!isValidNumber(n)) throw new Error("Invalid number");
  if(state.called.includes(n)) throw new Error("Already called");
  state.called.push(n);
  state.last = n;
  saveState(state);
  return state;
}

export function undoLast(state){
  if(state.called.length === 0) return state;
  const removed = state.called.pop();
  state.last = state.called.length ? state.called[state.called.length-1] : null;
  saveState(state);
  return { state, removed };
}

export function broadcast(state, extra={}){
  try{
    const bc = new BroadcastChannel(CHANNEL_NAME);
    bc.postMessage({ type:"STATE", state, ...extra });
    bc.close();
  }catch(e){
    // ignore
  }
}

export function subscribe(handler){
  let bc = null;
  try{
    bc = new BroadcastChannel(CHANNEL_NAME);
    bc.onmessage = (evt)=>{
      if(!evt?.data) return;
      handler(evt.data);
    };
  }catch(e){
    // ignore
  }
  // also listen to storage events (other tabs)
  const onStorage = (e)=>{
    if(e.key === STORAGE_KEY){
      handler({ type:"STORAGE", state: loadState() });
    }
  };
  window.addEventListener("storage", onStorage);

  return ()=>{
    if(bc) bc.close();
    window.removeEventListener("storage", onStorage);
  };
}