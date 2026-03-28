import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────── GLOBAL STYLES ─────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;overflow:hidden;}

:root{
  --bg0:#050709;--bg1:#080c12;--bg2:#0d1320;--bg3:#111928;--bg4:#162035;
  --border:#ffffff0d;--border2:#ffffff14;--border3:#ffffff1f;
  --cyan:#22d3ee;--cyan2:#06b6d4;--cyan-glow:rgba(34,211,238,0.18);
  --teal:#2dd4bf;--teal-glow:rgba(45,212,191,0.15);
  --violet:#a78bfa;--violet-glow:rgba(167,139,250,0.15);
  --rose:#f87171;--rose-glow:rgba(248,113,113,0.15);
  --amber:#fbbf24;--amber-glow:rgba(251,191,36,0.12);
  --green:#4ade80;--green-glow:rgba(74,222,128,0.15);
  --text1:#f1f5f9;--text2:#94a3b8;--text3:#475569;--text4:#1e293b;
  --mono:'IBM Plex Mono',monospace;--sans:'Outfit',sans-serif;
  --r4:4px;--r8:8px;--r12:12px;--r16:16px;--r20:20px;--r999:999px;
}

::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--border3);border-radius:2px;}
::-webkit-scrollbar-thumb:hover{background:rgba(34,211,238,0.3);}

body{font-family:var(--sans);background:var(--bg0);color:var(--text1);}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideLeft{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideRight{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
@keyframes popIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes ripple{0%{transform:scale(0);opacity:0.6}100%{transform:scale(2.5);opacity:0}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 12px var(--cyan-glow)}50%{box-shadow:0 0 28px rgba(34,211,238,0.4)}}

.anim-fadeUp{animation:fadeUp 0.2s ease both;}
.anim-slideLeft{animation:slideLeft 0.25s ease both;}
.anim-slideRight{animation:slideRight 0.28s ease both;}
.anim-popIn{animation:popIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both;}
.anim-pulse{animation:pulse 2s ease infinite;}
.blink{animation:pulse 1.6s ease infinite;}

/* ── LAYOUT ── */
.app{display:flex;height:100vh;overflow:hidden;background:var(--bg0);position:relative;}
.app::before{
  content:'';position:absolute;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(ellipse 60% 40% at 20% 0%,rgba(34,211,238,0.04) 0%,transparent 70%),
             radial-gradient(ellipse 40% 60% at 80% 100%,rgba(167,139,250,0.03) 0%,transparent 70%);
}

/* ── SIDEBAR ── */
.sidebar{
  width:256px;min-width:256px;background:var(--bg1);border-right:1px solid var(--border);
  display:flex;flex-direction:column;flex-shrink:0;position:relative;z-index:1;
  transition:all 0.3s cubic-bezier(0.4,0,0.2,1);overflow:hidden;
}
.sidebar.collapsed{width:0;min-width:0;}

.sidebar-logo{
  display:flex;align-items:center;gap:10px;padding:16px;
  border-bottom:1px solid var(--border);flex-shrink:0;
}
.logo-icon{
  width:34px;height:34px;border-radius:var(--r8);display:flex;align-items:center;
  justify-content:center;font-size:16px;flex-shrink:0;position:relative;
  background:linear-gradient(135deg,#22d3ee,#2dd4bf);
  box-shadow:0 0 20px rgba(34,211,238,0.4);
  animation:glowPulse 3s ease infinite;
}
.logo-text{font-weight:800;font-size:16px;letter-spacing:-0.02em;}
.live-badge{
  margin-left:auto;display:flex;align-items:center;gap:4px;
  font-family:var(--mono);font-size:8px;font-weight:600;
  color:var(--cyan);background:rgba(34,211,238,0.1);
  border:1px solid rgba(34,211,238,0.25);padding:3px 8px;border-radius:var(--r999);
  letter-spacing:0.1em;
}

.sidebar-section{padding:16px 10px 6px;}
.section-label{
  font-family:var(--mono);font-size:8px;color:var(--text3);
  text-transform:uppercase;letter-spacing:0.2em;padding:0 8px 8px;
}
.ch-btn{
  width:100%;display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:var(--r8);
  font-size:13px;font-weight:500;color:var(--text2);background:transparent;border:none;
  cursor:pointer;transition:all 0.12s;margin-bottom:2px;text-align:left;font-family:var(--sans);
  position:relative;overflow:hidden;
}
.ch-btn::before{content:'';position:absolute;inset:0;background:transparent;transition:background 0.12s;}
.ch-btn:hover{color:var(--text1);background:var(--border);}
.ch-btn.active{color:var(--cyan);background:rgba(34,211,238,0.08);}
.ch-btn.active::after{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:var(--cyan);border-radius:0 2px 2px 0;}
.ch-badge{
  margin-left:auto;font-family:var(--mono);font-size:9px;font-weight:700;
  padding:2px 7px;border-radius:var(--r999);flex-shrink:0;
}
.ch-badge.red{background:var(--rose);color:#fff;}
.ch-badge.cyan{background:var(--cyan);color:#000;}

.sidebar-bottom{padding:10px;border-top:1px solid var(--border);margin-top:auto;}
.quick-label{font-family:var(--mono);font-size:8px;color:var(--text3);text-transform:uppercase;letter-spacing:0.18em;padding:0 8px 8px;}
.quick-btn{
  width:100%;display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:var(--r8);
  font-family:var(--mono);font-size:11px;color:var(--text3);background:transparent;border:none;
  cursor:pointer;transition:all 0.12s;margin-bottom:1px;text-align:left;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis;
}
.quick-btn:hover{color:var(--teal);background:var(--border);}

.me-row{display:flex;align-items:center;gap:10px;padding:12px 16px;border-top:1px solid var(--border);}
.online-dot{width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0;}

/* ── MAIN ── */
.main{display:flex;flex-direction:column;flex:1;min-width:0;overflow:hidden;position:relative;z-index:1;}

/* ── TOPBAR ── */
.topbar{
  display:flex;align-items:center;gap:10px;padding:12px 20px;
  background:var(--bg1);border-bottom:1px solid var(--border);flex-shrink:0;
}
.topbar-info{flex:1;min-width:0;}
.topbar-name{font-weight:700;font-size:15px;letter-spacing:-0.01em;}
.topbar-members{font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:1px;}
.topbar-pills{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.pill{
  display:inline-flex;align-items:center;gap:4px;padding:4px 9px;border-radius:var(--r999);
  font-family:var(--mono);font-size:10px;cursor:pointer;transition:all 0.12s;border:1px solid;white-space:nowrap;
}
.pill-teal{color:var(--teal);background:var(--teal-glow);border-color:rgba(45,212,191,0.25);}
.pill-teal:hover{background:rgba(45,212,191,0.22);}
.pill-rose{color:var(--rose);background:var(--rose-glow);border-color:rgba(248,113,113,0.25);}
.pill-rose:hover{background:rgba(248,113,113,0.22);}
.pill-violet{color:var(--violet);background:var(--violet-glow);border-color:rgba(167,139,250,0.25);}
.pill-violet:hover{background:rgba(167,139,250,0.22);}

.icon-btn{
  width:32px;height:32px;border-radius:var(--r8);display:flex;align-items:center;justify-content:center;
  background:transparent;border:1px solid var(--border2);color:var(--text3);
  cursor:pointer;font-size:14px;transition:all 0.12s;flex-shrink:0;
}
.icon-btn:hover{color:var(--text1);border-color:var(--border3);background:var(--border);}
.icon-btn.active{color:var(--cyan);border-color:rgba(34,211,238,0.35);background:rgba(34,211,238,0.08);}
.menu-btn{background:transparent;border:none;color:var(--text3);cursor:pointer;font-size:18px;padding:4px;transition:color 0.12s;flex-shrink:0;}
.menu-btn:hover{color:var(--text1);}

/* ── CONTEXT PANEL ── */
.ctx-panel{
  background:var(--bg2);border-bottom:1px solid var(--border);flex-shrink:0;
  overflow:hidden;transition:max-height 0.3s cubic-bezier(0.4,0,0.2,1);
}
.ctx-tabs{display:flex;align-items:center;padding:10px 16px 0;gap:2px;}
.ctx-tab{
  display:flex;align-items:center;gap:5px;padding:7px 12px;
  font-family:var(--mono);font-size:10px;font-weight:600;
  background:transparent;border:none;border-bottom:2px solid transparent;
  cursor:pointer;transition:all 0.12s;letter-spacing:0.02em;
}
.ctx-tab.t-teal{color:var(--text3);}
.ctx-tab.t-teal.active{color:var(--teal);border-bottom-color:var(--teal);}
.ctx-tab.t-rose{color:var(--text3);}
.ctx-tab.t-rose.active{color:var(--rose);border-bottom-color:var(--rose);}
.ctx-tab.t-violet{color:var(--text3);}
.ctx-tab.t-violet.active{color:var(--violet);border-bottom-color:var(--violet);}
.ctx-count{border-radius:var(--r999);padding:1px 5px;font-size:8px;background:var(--border2);}

.ctx-cards{display:flex;gap:10px;padding:10px 16px 12px;overflow-x:auto;}
.ctx-card{
  flex-shrink:0;border-radius:var(--r12);border:1px solid var(--border2);
  background:var(--bg3);padding:12px;cursor:pointer;transition:all 0.18s ease;
  position:relative;overflow:hidden;
}
.ctx-card::before{
  content:'';position:absolute;inset:0;opacity:0;transition:opacity 0.18s;
  background:linear-gradient(135deg,rgba(255,255,255,0.03),transparent);
}
.ctx-card:hover::before{opacity:1;}
.ctx-card:hover{transform:translateY(-2px);}
.ctx-card-f{width:176px;}
.ctx-card-e{width:210px;}
.ctx-card-p{width:196px;}
.ctx-card:hover.hover-teal{border-color:rgba(45,212,191,0.3);box-shadow:0 4px 20px var(--teal-glow);}
.ctx-card:hover.hover-rose{border-color:rgba(248,113,113,0.3);box-shadow:0 4px 20px var(--rose-glow);}
.ctx-card:hover.hover-violet{border-color:rgba(167,139,250,0.3);box-shadow:0 4px 20px var(--violet-glow);}
.card-attached{border-color:rgba(34,211,238,0.4)!important;box-shadow:0 0 0 1px rgba(34,211,238,0.2)!important;}
.card-attached-badge{
  position:absolute;top:6px;right:6px;width:16px;height:16px;border-radius:50%;
  background:var(--cyan);display:flex;align-items:center;justify-content:center;
  font-size:8px;color:#000;font-weight:800;animation:popIn 0.2s ease;
}

/* ── MESSAGES ── */
.msg-area{flex:1;overflow-y:auto;padding:12px 0;}
.day-divider{display:flex;align-items:center;gap:12px;padding:4px 20px;margin-bottom:4px;}
.day-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--border3),transparent);opacity:0.5;}
.day-label{font-family:var(--mono);font-size:9px;color:var(--text3);flex-shrink:0;letter-spacing:0.1em;}

.msg-row{
  display:flex;gap:12px;padding:5px 16px;border-radius:var(--r12);
  transition:background 0.1s;position:relative;group:true;
}
.msg-row:hover{background:rgba(255,255,255,0.015);}
.msg-row:hover .msg-actions{opacity:1;transform:translateY(0);}
.msg-actions{
  position:absolute;right:16px;top:4px;
  display:flex;gap:3px;background:var(--bg3);
  border:1px solid var(--border2);border-radius:var(--r8);
  padding:3px;opacity:0;transform:translateY(-4px);
  transition:all 0.15s;z-index:10;
}
.action-btn{
  width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;
  font-size:13px;background:transparent;border:none;cursor:pointer;color:var(--text2);transition:all 0.1s;
}
.action-btn:hover{background:var(--border2);color:var(--text1);}

.msg-avatar{flex-shrink:0;margin-top:2px;}
.msg-content{flex:1;min-width:0;}
.msg-header{display:flex;align-items:baseline;gap:8px;margin-bottom:3px;}
.msg-name{font-weight:700;font-size:13px;}
.msg-role-badge{
  font-family:var(--mono);font-size:8px;font-weight:600;padding:2px 6px;
  border-radius:var(--r4);border:1px solid;letter-spacing:0.05em;
}
.msg-time{font-family:var(--mono);font-size:9px;color:var(--text3);}
.msg-body{font-size:13.5px;line-height:1.65;color:rgba(241,245,249,0.82);}

/* Inline tags */
.tag-mention{
  color:var(--cyan);background:rgba(34,211,238,0.1);border-radius:var(--r4);
  padding:1px 5px;font-weight:700;cursor:pointer;transition:background 0.1s;display:inline;
}
.tag-mention:hover{background:rgba(34,211,238,0.2);}
.tag-file{
  display:inline-flex;align-items:center;gap:3px;color:var(--teal);
  background:var(--teal-glow);border:1px solid rgba(45,212,191,0.2);
  border-radius:var(--r4);padding:1px 6px;font-family:var(--mono);font-size:11px;cursor:pointer;
  transition:background 0.1s;vertical-align:middle;
}
.tag-file:hover{background:rgba(45,212,191,0.2);}
.tag-err{
  display:inline-flex;align-items:center;gap:3px;color:var(--rose);
  background:var(--rose-glow);border:1px solid rgba(248,113,113,0.2);
  border-radius:var(--r4);padding:1px 6px;font-family:var(--mono);font-size:11px;cursor:pointer;
  transition:background 0.1s;vertical-align:middle;
}
.tag-err:hover{background:rgba(248,113,113,0.2);}
.tag-proj{
  display:inline-flex;align-items:center;gap:3px;color:var(--violet);
  background:var(--violet-glow);border:1px solid rgba(167,139,250,0.2);
  border-radius:var(--r4);padding:1px 6px;font-family:var(--mono);font-size:11px;cursor:pointer;
  transition:background 0.1s;vertical-align:middle;
}
.tag-proj:hover{background:rgba(167,139,250,0.2);}

/* Code block */
.code-block{margin-top:8px;border-radius:var(--r12);overflow:hidden;border:1px solid var(--border2);background:#030508;}
.code-header{
  display:flex;align-items:center;gap:8px;padding:8px 14px;
  border-bottom:1px solid var(--border);background:rgba(255,255,255,0.02);
}
.code-dots{display:flex;gap:5px;}
.code-dot{width:9px;height:9px;border-radius:50%;}
.code-lang{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:0.08em;margin-left:4px;}
.code-copy{
  margin-left:auto;font-family:var(--mono);font-size:9px;
  padding:3px 9px;border-radius:var(--r4);border:1px solid var(--border2);
  background:transparent;cursor:pointer;transition:all 0.12s;color:var(--text3);
}
.code-copy:hover{color:var(--cyan);border-color:rgba(34,211,238,0.3);}
.code-body{padding:12px 14px;font-family:var(--mono);font-size:11.5px;line-height:1.7;overflow-x:auto;color:rgba(241,245,249,0.7);}

/* Reactions */
.reactions{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;}
.rxn-btn{
  display:inline-flex;align-items:center;gap:4px;padding:3px 9px;
  border-radius:var(--r999);font-size:12px;cursor:pointer;transition:all 0.13s;border:1px solid;
}
.rxn-btn.mine{color:var(--cyan);background:rgba(34,211,238,0.08);border-color:rgba(34,211,238,0.35);}
.rxn-btn.other{color:var(--text2);background:rgba(255,255,255,0.03);border-color:var(--border2);}
.rxn-btn.other:hover{color:var(--text1);border-color:var(--border3);}
.rxn-add{
  display:inline-flex;align-items:center;padding:3px 8px;border-radius:var(--r999);
  font-size:12px;cursor:pointer;border:1px solid var(--border);background:transparent;
  color:var(--text3);transition:all 0.12s;
}
.rxn-add:hover{color:var(--text1);border-color:var(--border3);}

/* Thread bar */
.thread-bar{
  display:flex;align-items:center;gap:8px;padding:4px 8px;margin-top:6px;
  border-radius:var(--r8);background:transparent;border:none;cursor:pointer;
  transition:background 0.12s;width:fit-content;border:1px solid transparent;
}
.thread-bar:hover{background:rgba(34,211,238,0.05);border-color:rgba(34,211,238,0.15);}
.thread-avatars{display:flex;}
.thread-count{color:var(--cyan);font-size:12px;font-weight:700;}
.thread-hint{color:var(--text3);font-family:var(--mono);font-size:10px;}

/* ── INPUT ── */
.input-zone{padding:8px 16px 14px;background:var(--bg0);flex-shrink:0;}
.attached-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;}
.attached-chip{
  display:flex;align-items:center;gap:6px;padding:4px 10px;
  border-radius:var(--r8);font-family:var(--mono);font-size:11px;
  border:1px solid;transition:all 0.12s;animation:popIn 0.18s ease;
}
.chip-remove{
  background:transparent;border:none;cursor:pointer;color:inherit;opacity:0.4;
  padding:0;line-height:1;transition:opacity 0.12s;
}
.chip-remove:hover{opacity:1;}

.input-box{
  background:var(--bg3);border:1px solid var(--border2);border-radius:var(--r16);
  overflow:hidden;transition:all 0.2s;position:relative;
}
.input-box:focus-within{border-color:rgba(34,211,238,0.3);box-shadow:0 0 0 3px rgba(34,211,238,0.06);}
.input-ta{
  width:100%;background:transparent;padding:13px 18px 8px;
  font-size:13.5px;color:var(--text1);font-family:var(--sans);
  border:none;line-height:1.6;resize:none;
}
.input-ta::placeholder{color:var(--text3);}
.input-ta:focus{outline:none;}
.input-toolbar{display:flex;align-items:center;gap:4px;padding:0 12px 10px;}
.tb-btn{
  width:30px;height:30px;display:flex;align-items:center;justify-content:center;
  border-radius:var(--r8);font-size:14px;color:var(--text3);background:transparent;border:none;
  cursor:pointer;transition:all 0.12s;
}
.tb-btn:hover{color:var(--text1);background:var(--border);}
.tb-sep{width:1px;height:18px;background:var(--border2);margin:0 3px;}
.tb-fmt{
  width:28px;height:28px;display:flex;align-items:center;justify-content:center;
  border-radius:var(--r4);font-family:var(--mono);font-size:11px;color:var(--text3);
  background:transparent;border:none;cursor:pointer;transition:all 0.12s;
}
.tb-fmt:hover{color:var(--text1);background:var(--border);}
.send-btn{
  margin-left:auto;display:flex;align-items:center;gap:5px;
  padding:7px 18px;border-radius:var(--r12);font-family:var(--sans);
  font-size:12px;font-weight:700;color:#000;border:none;cursor:pointer;
  background:linear-gradient(135deg,var(--cyan),var(--teal));
  box-shadow:0 0 18px rgba(34,211,238,0.35);transition:all 0.2s;
}
.send-btn:hover:not(:disabled){box-shadow:0 0 28px rgba(34,211,238,0.55);transform:translateY(-1px);}
.send-btn:disabled{opacity:0.3;cursor:not-allowed;transform:none;}
.send-hint{font-family:var(--mono);font-size:9px;color:var(--text3);}

/* ── MENTION DROPDOWN ── */
.mention-dd{
  position:absolute;bottom:calc(100% + 6px);left:0;right:0;
  background:var(--bg3);border:1px solid var(--border2);border-radius:var(--r12);
  overflow:hidden;box-shadow:0 -8px 32px rgba(0,0,0,0.6);z-index:100;
  animation:popIn 0.15s ease;
}
.mention-header{padding:7px 12px;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:8px;color:var(--text3);letter-spacing:0.2em;text-transform:uppercase;}
.mention-row{
  display:flex;align-items:center;gap:10px;padding:8px 12px;
  cursor:pointer;transition:background 0.1s;
}
.mention-row.sel{background:rgba(34,211,238,0.06);}
.mention-row:hover{background:var(--border);}
.mention-kbd{margin-left:auto;font-family:var(--mono);font-size:8px;color:var(--text3);}

/* ── THREAD PANEL ── */
.thread-panel{
  width:384px;min-width:384px;display:flex;flex-direction:column;
  background:var(--bg1);border-left:1px solid var(--border);
  animation:slideRight 0.25s ease;
}
.thread-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 16px;border-bottom:1px solid var(--border);flex-shrink:0;
}
.thread-title{font-weight:700;font-size:15px;letter-spacing:-0.01em;}
.thread-sub{font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:2px;}
.thread-close{
  width:30px;height:30px;border-radius:var(--r8);display:flex;align-items:center;justify-content:center;
  background:transparent;border:1px solid transparent;cursor:pointer;color:var(--text3);
  font-size:16px;transition:all 0.12s;
}
.thread-close:hover{color:var(--rose);background:var(--rose-glow);border-color:rgba(248,113,113,0.3);}
.thread-divider{margin:8px 14px;height:1px;background:linear-gradient(90deg,transparent,var(--border3),transparent);}
.thread-input{padding:10px;border-top:1px solid var(--border);flex-shrink:0;}
.thread-box{
  background:var(--bg2);border:1px solid var(--border2);border-radius:var(--r12);overflow:hidden;
  transition:border-color 0.2s;
}
.thread-box:focus-within{border-color:rgba(34,211,238,0.25);}
.thread-ta{
  width:100%;background:transparent;padding:10px 14px 6px;
  font-size:12.5px;color:var(--text1);font-family:var(--sans);
  border:none;resize:none;line-height:1.5;
}
.thread-ta::placeholder{color:var(--text3);}
.thread-ta:focus{outline:none;}
.thread-foot{display:flex;align-items:center;padding:0 10px 8px;}

/* ── STATUS BAR ── */
.statusbar{
  display:flex;align-items:center;gap:12px;padding:5px 16px;
  background:var(--bg1);border-top:1px solid var(--border);flex-shrink:0;
  font-family:var(--mono);font-size:9px;color:var(--text3);
}
.status-dot{width:5px;height:5px;border-radius:50%;}

/* ── AVATAR ── */
.av{
  display:flex;align-items:center;justify-content:center;
  font-family:var(--mono);font-weight:700;user-select:none;flex-shrink:0;letter-spacing:-0.5px;
}

/* Typing indicator */
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.typing-dot{width:4px;height:4px;border-radius:50%;background:var(--text3);display:inline-block;margin:0 1px;}
.typing-dot:nth-child(1){animation:bounce 1.2s ease 0s infinite;}
.typing-dot:nth-child(2){animation:bounce 1.2s ease 0.2s infinite;}
.typing-dot:nth-child(3){animation:bounce 1.2s ease 0.4s infinite;}

/* New msg badge */
.new-badge{
  position:absolute;bottom:80px;left:50%;transform:translateX(-50%);
  background:var(--cyan);color:#000;font-family:var(--mono);font-size:10px;font-weight:700;
  padding:5px 14px;border-radius:var(--r999);cursor:pointer;
  box-shadow:0 4px 16px rgba(34,211,238,0.4);animation:fadeUp 0.2s ease;
  z-index:20;border:none;
}
`;

/* ─────────────────────────── DATA ─────────────────────────── */
const USERS = [
  { id:0, name:'Arjun Mehra',  initials:'AM', color:'#22d3ee', bg:'rgba(34,211,238,0.14)',  role:'Lead Dev'  },
  { id:1, name:'Priya Nair',   initials:'PN', color:'#a78bfa', bg:'rgba(167,139,250,0.14)', role:'Backend'   },
  { id:2, name:'Rohan Das',    initials:'RD', color:'#4ade80', bg:'rgba(74,222,128,0.14)',  role:'DevOps'    },
  { id:3, name:'Sneha Kumar',  initials:'SK', color:'#fbbf24', bg:'rgba(251,191,36,0.14)',  role:'Frontend'  },
  { id:4, name:'Vikram Iyer',  initials:'VI', color:'#f87171', bg:'rgba(248,113,113,0.14)', role:'Architect' },
];
const ME = USERS[0];

const FILES = [
  { id:'f1', name:'engine.ts',          lang:'TypeScript', lines:847,  icon:'󰛦',  emoji:'📄' },
  { id:'f2', name:'knowledge-graph.ts', lang:'TypeScript', lines:412,  icon:'󰎙',  emoji:'🕸️' },
  { id:'f3', name:'session.model.ts',   lang:'TypeScript', lines:203,  icon:'󰋙',  emoji:'📋' },
  { id:'f4', name:'ChatView.tsx',       lang:'React',      lines:318,  icon:'󰜈',  emoji:'⚛️' },
];
const ERRORS = [
  { id:'e1', name:'TypeError: null dereference',  file:'engine.ts:234',   sev:'error'   },
  { id:'e2', name:'useEffect missing dependency', file:'ChatView.tsx:89', sev:'warning' },
  { id:'e3', name:'Unhandled Promise rejection',  file:'session.ts:67',   sev:'error'   },
];
const PROJECTS = [
  { id:'p1', name:'CKC-OS Core',         status:'Active',    tasks:14, pct:68 },
  { id:'p2', name:'Knowledge Engine v2', status:'In Review', tasks:7,  pct:45 },
  { id:'p3', name:'DevOps Pipeline',     status:'Staging',   tasks:3,  pct:90 },
];
const CHANNELS = [
  { id:'engine-dev',  label:'engine-dev',    icon:'#',  badge:3, section:'Channels' },
  { id:'general',     label:'general',       icon:'#',  badge:0, section:'Channels' },
  { id:'errors',      label:'errors & bugs', icon:'🐛', badge:5, section:'Channels' },
  { id:'devops',      label:'devops',        icon:'⚙️', badge:0, section:'Channels' },
  { id:'dm-priya',    label:'Priya Nair',    icon:null, badge:1, section:'Direct', user:USERS[1] },
  { id:'dm-rohan',    label:'Rohan Das',     icon:null, badge:0, section:'Direct', user:USERS[2] },
];

const INIT_MSGS = [
  { id:'m1', uid:1, time:'9:42 AM', head:true,
    segments:[{t:'text',v:'Hey '},{t:'mention',user:USERS[0]},{t:'text',v:' — pushed a fix for the '},{t:'err',ref:ERRORS[0]},{t:'text',v:' in '},{t:'file',ref:FILES[0]},{t:'text',v:'. Can you review before we merge to staging? I also hardened the fallback path.'}],
    reactions:[{e:'👀',n:2,mine:false},{e:'✅',n:1,mine:true}], thread:['t1-0','t1-1','t1-2'] },
  { id:'m2', uid:4, time:'9:50 AM', head:true,
    segments:[{t:'text',v:'Root cause is in the graph builder — null check missing before the merge call:'}],
    code:{lang:'typescript', body:`// CKC-OS · Knowledge Engine
async function analyzeCode(session: Session) {
  const graph = await buildKnowledgeGraph(session.code);
  const state = detectCognitiveState(session.tokens);
  // ❌ graph can be null when session.code is empty
  return graph.merge(state.context);
}`},
    reactions:[{e:'🔥',n:3,mine:false},{e:'💡',n:2,mine:true}], thread:['t2-0'] },
  { id:'m3', uid:2, time:'10:05 AM', head:true,
    segments:[{t:'text',v:'Deploying the fix now. '},{t:'mention',user:USERS[0]},{t:'text',v:' & '},{t:'mention',user:USERS[1]},{t:'text',v:' — monitoring the '},{t:'proj',ref:PROJECTS[0]},{t:'text',v:' pipeline. Should go green in ~3 min ✅'}],
    reactions:[{e:'🚀',n:5,mine:true}], thread:[] },
  { id:'m4', uid:3, time:'10:14 AM', head:true,
    segments:[{t:'text',v:'Updated UI bindings in '},{t:'file',ref:FILES[3]},{t:'text',v:' to handle null graphs gracefully. Also silenced the '},{t:'err',ref:ERRORS[1]},{t:'text',v:' — confirmed false positive.'}],
    reactions:[], thread:['t4-0'] },
];
const INIT_THREADS = {
  m1:[
    { id:'t1-0', uid:0, time:'9:44 AM', head:true, segments:[{t:'text',v:'On it — checking the diff. We need a null guard before the merge call.'}], reactions:[] },
    { id:'t1-1', uid:1, time:'9:47 AM', head:true, segments:[{t:'text',v:'Also handle empty `graph.nodes` — added that check too.'}], reactions:[{e:'👍',n:1,mine:false}] },
    { id:'t1-2', uid:4, time:'9:50 AM', head:true, segments:[{t:'text',v:'LGTM 🎉 Ship it.'}], reactions:[{e:'🎉',n:3,mine:true}] },
  ],
  m2:[{ id:'t2-0', uid:1, time:'9:52 AM', head:true, segments:[{t:'text',v:'Optional chaining fixes this cleanly: `graph?.merge(state?.context)` — zero overhead.'}], reactions:[] }],
  m4:[{ id:'t4-0', uid:2, time:'10:16 AM', head:true, segments:[{t:'text',v:'Nice catch on the warning! Confirmed fixed on staging ✅'}], reactions:[] }],
};

/* ─────────────────────────── UTILS ─────────────────────────── */
function hl(src) {
  return src.split('\n').map((line, i) => {
    const t = line.trimStart();
    let ls = {};
    if (t.startsWith('//')) ls = { color:'#3d5166', fontStyle:'italic' };
    else if (/^(async|function|const|let|var|return|await|export|import|type)\b/.test(t)) ls = { color:'#c792ea' };
    return (
      <div key={i} style={ls}>
        {line.split(/([\w$]+(?=\s*\())/g).map((p, j) =>
          /(analyzeCode|buildKnowledgeGraph|detectCognitiveState|merge)/.test(p)
            ? <span key={j} style={{color:'#7fc1ff'}}>{p}</span>
            : p.startsWith('"') || p.startsWith("'") || p.startsWith('`')
              ? <span key={j} style={{color:'#b9e4a3'}}>{p}</span>
              : <span key={j}>{p}</span>
        )}
      </div>
    );
  });
}

/* ─────────────────────────── COMPONENTS ─────────────────────────── */
function Av({ user, size=32, r=8 }) {
  return (
    <div className="av" style={{ width:size, height:size, borderRadius:r, fontSize:size*0.36,
      background:user.bg, color:user.color }}>
      {user.initials}
    </div>
  );
}

function Seg({ s }) {
  if (s.t==='text')    return <span>{s.v}</span>;
  if (s.t==='mention') return <span className="tag-mention">@{s.user.name}</span>;
  if (s.t==='file')    return <span className="tag-file">{s.ref.emoji} {s.ref.name}</span>;
  if (s.t==='err')     return <span className="tag-err">{s.ref.sev==='error'?'🔴':'🟡'} {s.ref.name}</span>;
  if (s.t==='proj')    return <span className="tag-proj">⚡ {s.ref.name}</span>;
  return null;
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return (
    <div className="code-block">
      <div className="code-header">
        <div className="code-dots">
          <div className="code-dot" style={{background:'rgba(248,113,113,0.7)'}}/>
          <div className="code-dot" style={{background:'rgba(251,191,36,0.7)'}}/>
          <div className="code-dot" style={{background:'rgba(74,222,128,0.7)'}}/>
        </div>
        <span className="code-lang">{code.lang}</span>
        <button className="code-copy" onClick={copy}>{copied?'✓ copied':'copy'}</button>
      </div>
      <pre className="code-body">{hl(code.body)}</pre>
    </div>
  );
}

function Reactions({ reactions, onReact }) {
  if (!reactions?.length) return null;
  return (
    <div className="reactions">
      {reactions.map((r,i)=>(
        <button key={i} onClick={()=>onReact(r.e)}
          className={`rxn-btn ${r.mine?'mine':'other'}`}>
          {r.e}<span style={{fontFamily:'var(--mono)',fontSize:10}}>{r.n}</span>
        </button>
      ))}
      <button className="rxn-add">＋</button>
    </div>
  );
}

function ThreadBar({ count, participantIds, onClick }) {
  if (!count) return null;
  const users = participantIds.slice(0,3).map(()=>USERS[Math.floor(Math.random()*USERS.length)]);
  return (
    <button className="thread-bar" onClick={onClick}>
      <div className="thread-avatars">
        {users.map((u,i)=>(
          <div key={i} style={{ width:18, height:18, borderRadius:4, fontSize:7, background:u.bg, color:u.color,
            marginLeft:i?-5:0, border:'1.5px solid var(--bg1)', display:'flex', alignItems:'center',
            justifyContent:'center', fontWeight:700, fontFamily:'var(--mono)', flexShrink:0, zIndex:3-i }}>
            {u.initials}
          </div>
        ))}
      </div>
      <span className="thread-count">{count} {count===1?'reply':'replies'}</span>
      <span className="thread-hint">View thread →</span>
    </button>
  );
}

function MsgRow({ msg, onThread, onReact, isThread=false }) {
  const user = USERS[msg.uid];
  return (
    <div className="msg-row anim-fadeUp">
      <div className="msg-avatar">
        {msg.head ? <Av user={user}/> : <div style={{width:32,height:32}}/>}
      </div>
      <div className="msg-content">
        {msg.head && (
          <div className="msg-header">
            <span className="msg-name" style={{color:user.color}}>{user.name}</span>
            <span className="msg-role-badge" style={{color:user.color, background:`${user.color}12`, borderColor:`${user.color}28`}}>{user.role}</span>
            <span className="msg-time">{msg.time}</span>
          </div>
        )}
        <div className="msg-body">{msg.segments.map((s,i)=><Seg key={i} s={s}/>)}</div>
        {msg.code && <CodeBlock code={msg.code}/>}
        <Reactions reactions={msg.reactions} onReact={e=>onReact(msg.id,e)}/>
        {!isThread && msg.thread?.length>0 && (
          <ThreadBar count={msg.thread.length} participantIds={msg.thread} onClick={()=>onThread(msg)}/>
        )}
      </div>
      <div className="msg-actions">
        {[['😊','React'],['💬','Thread'],['✏️','Edit'],['⋯','More']].map(([ic,label],i)=>(
          <button key={i} title={label} className="action-btn"
            onClick={i===1?()=>onThread(msg):undefined}>{ic}</button>
        ))}
      </div>
    </div>
  );
}

function MentionDD({ query, selected, onSelect }) {
  const list = USERS.filter(u=>u.name.toLowerCase().includes(query.toLowerCase())).slice(0,5);
  if (!list.length) return null;
  return (
    <div className="mention-dd">
      <div className="mention-header">Mention a teammate</div>
      {list.map((u,i)=>(
        <div key={u.id} onClick={()=>onSelect(u)}
          className={`mention-row${i===selected?' sel':''}`}>
          <Av user={u} size={28} r={6}/>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:u.color}}>{u.name}</div>
            <div style={{fontFamily:'var(--mono)',fontSize:9,color:'var(--text3)'}}>{u.role}</div>
          </div>
          {i===selected && <span className="mention-kbd">↵ select</span>}
        </div>
      ))}
    </div>
  );
}

function CtxCard({ item, kind, isAttached, onAttach }) {
  const hoverClass = kind==='file'?'hover-teal':kind==='error'?'hover-rose':'hover-violet';
  const sizeClass = kind==='file'?'ctx-card-f':kind==='error'?'ctx-card-e':'ctx-card-p';
  return (
    <div className={`ctx-card ${sizeClass} ${hoverClass} ${isAttached?'card-attached':''}`}
      onClick={()=>onAttach({kind, ref:item})}>
      {isAttached && <div className="card-attached-badge">✓</div>}
      {kind==='file' && <>
        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:7}}>
          <span style={{fontSize:15}}>{item.emoji}</span>
          <span style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:600,color:'var(--teal)',
            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.name}</span>
        </div>
        <div style={{fontFamily:'var(--mono)',fontSize:9,color:'var(--text3)'}}>{item.lang} · {item.lines} lines</div>
        <div style={{marginTop:6,fontSize:9,color:'var(--text3)'}}>Click to attach ↗</div>
      </>}
      {kind==='error' && <>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}>
          <span>{item.sev==='error'?'🔴':'🟡'}</span>
          <span style={{fontFamily:'var(--mono)',fontSize:8,fontWeight:700,padding:'2px 5px',borderRadius:3,
            textTransform:'uppercase',letterSpacing:'0.07em',
            background:item.sev==='error'?'rgba(248,113,113,0.12)':'rgba(251,191,36,0.12)',
            color:item.sev==='error'?'var(--rose)':'var(--amber)'}}>{item.sev}</span>
        </div>
        <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--text1)',marginBottom:4,lineHeight:1.4}}>{item.name}</div>
        <div style={{fontFamily:'var(--mono)',fontSize:9,color:'var(--text3)'}}>{item.file}</div>
      </>}
      {kind==='proj' && <>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
          <span style={{fontWeight:700,fontSize:11,color:'var(--text1)'}}>{item.name}</span>
          <span style={{fontFamily:'var(--mono)',fontSize:8,padding:'2px 6px',borderRadius:3,
            background:'var(--violet-glow)',color:'var(--violet)',border:'1px solid rgba(167,139,250,0.25)'}}>{item.status}</span>
        </div>
        <div style={{height:3,borderRadius:999,background:'var(--border2)',marginBottom:7}}>
          <div style={{height:3,borderRadius:999,width:`${item.pct}%`,transition:'width 0.6s ease',
            background:'linear-gradient(90deg,var(--cyan),var(--teal))'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontFamily:'var(--mono)',fontSize:9,color:'var(--text3)'}}>
          <span>{item.tasks} tasks</span><span>{item.pct}% done</span>
        </div>
      </>}
    </div>
  );
}

function CtxPanel({ onAttach, attached }) {
  const [tab, setTab] = useState('files');
  const attachedIds = new Set(attached.map(a=>a.ref.id));
  const tabs = [
    {id:'files',   label:'Files',    count:FILES.length,    cls:'t-teal'},
    {id:'errors',  label:'Errors',   count:ERRORS.length,   cls:'t-rose'},
    {id:'projects',label:'Projects', count:PROJECTS.length, cls:'t-violet'},
  ];
  return (
    <div className="ctx-panel">
      <div className="ctx-tabs">
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`ctx-tab ${t.cls}${tab===t.id?' active':''}`}>
            {t.label}
            <span className="ctx-count">{t.count}</span>
          </button>
        ))}
        <div style={{marginLeft:'auto',fontFamily:'var(--mono)',fontSize:9,color:'var(--text3)',alignSelf:'center',paddingBottom:2}}>
          Click a card to attach it to your message
        </div>
      </div>
      <div className="ctx-cards">
        {tab==='files'    && FILES.map(f=><CtxCard key={f.id} item={f} kind="file" isAttached={attachedIds.has(f.id)} onAttach={onAttach}/>)}
        {tab==='errors'   && ERRORS.map(e=><CtxCard key={e.id} item={e} kind="error" isAttached={attachedIds.has(e.id)} onAttach={onAttach}/>)}
        {tab==='projects' && PROJECTS.map(p=><CtxCard key={p.id} item={p} kind="proj" isAttached={attachedIds.has(p.id)} onAttach={onAttach}/>)}
      </div>
    </div>
  );
}

function ThreadPanel({ msg, threads, onClose, onSend, onReact }) {
  const [val, setVal] = useState('');
  const endRef = useRef(null);
  const replies = threads[msg.id] || [];
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); }, [replies.length]);
  const send = () => { if(!val.trim()) return; onSend(msg.id,val.trim()); setVal(''); };
  return (
    <div className="thread-panel">
      <div className="thread-header">
        <div>
          <div className="thread-title">Thread</div>
          <div className="thread-sub">{replies.length+1} messages · #{CHANNELS[0].label}</div>
        </div>
        <button className="thread-close" onClick={onClose}>✕</button>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'8px 0'}}>
        <MsgRow msg={msg} onThread={()=>{}} onReact={onReact} isThread/>
        <div className="thread-divider"/>
        {replies.length===0 && (
          <div style={{padding:'20px 24px',textAlign:'center',color:'var(--text3)',fontFamily:'var(--mono)',fontSize:10}}>
            No replies yet — be the first to reply
          </div>
        )}
        {replies.map(r=><MsgRow key={r.id} msg={r} onThread={()=>{}} onReact={onReact} isThread/>)}
        <div ref={endRef}/>
      </div>
      <div className="thread-input">
        <div className="thread-box">
          <textarea className="thread-ta" rows={2} value={val}
            onChange={e=>setVal(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder="Reply in thread…"/>
          <div className="thread-foot">
            <span style={{fontFamily:'var(--mono)',fontSize:9,color:'var(--text3)'}}>shift+enter for newline</span>
            <button onClick={send} disabled={!val.trim()} className="send-btn" style={{marginLeft:'auto',padding:'6px 14px',fontSize:11}}>
              Reply ↵
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── APP ─────────────────────────── */
export default function App() {
  const [activeCh, setActiveCh] = useState('engine-dev');
  const [msgs, setMsgs] = useState(INIT_MSGS);
  const [threads, setThreads] = useState(INIT_THREADS);
  const [activeThread, setActiveThread] = useState(null);
  const [ctxOpen, setCtxOpen] = useState(true);
  const [sideOpen, setSideOpen] = useState(true);
  const [input, setInput] = useState('');
  const [attached, setAttached] = useState([]);
  const [mention, setMention] = useState(null); // {query, start}
  const [mentionSel, setMentionSel] = useState(0);
  const [typing, setTyping] = useState(false);
  const [showNewBadge, setShowNewBadge] = useState(false);

  const textRef = useRef(null);
  const endRef = useRef(null);
  const msgAreaRef = useRef(null);

  useEffect(()=>{
    const el = msgAreaRef.current;
    if(!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if(atBottom) endRef.current?.scrollIntoView({behavior:'smooth'});
    else setShowNewBadge(true);
  },[msgs.length]);

  // Simulate typing after send
  const triggerTyping = () => {
    setTyping(true);
    setTimeout(()=>setTyping(false), 2200);
  };

  const handleInput = e => {
    const v = e.target.value;
    setInput(v);
    const cur = e.target.selectionStart;
    const before = v.slice(0, cur);
    const at = before.lastIndexOf('@');
    if(at!==-1 && (at===0||/\s/.test(before[at-1]))) {
      const q = before.slice(at+1);
      if(!/\s/.test(q)){ setMention({query:q,start:at}); setMentionSel(0); return; }
    }
    setMention(null);
  };

  const pickMention = user => {
    if(!mention) return;
    const before = input.slice(0,mention.start);
    const after  = input.slice(mention.start+1+mention.query.length);
    setInput(before+'@'+user.name+' '+after);
    setMention(null);
    textRef.current?.focus();
  };

  const handleKeyDown = e => {
    const list = USERS.filter(u=>u.name.toLowerCase().includes((mention?.query||'').toLowerCase()));
    if(mention && list.length) {
      if(e.key==='ArrowDown'){e.preventDefault();setMentionSel(s=>(s+1)%list.length);return;}
      if(e.key==='ArrowUp'){e.preventDefault();setMentionSel(s=>(s-1+list.length)%list.length);return;}
      if(e.key==='Enter'||e.key==='Tab'){e.preventDefault();pickMention(list[mentionSel]);return;}
      if(e.key==='Escape'){setMention(null);return;}
    }
    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();}
  };

  const parseInput = text => {
    const segs=[];let i=0,buf='';
    while(i<text.length){
      if(text[i]==='@'){
        const rest=text.slice(i+1);
        const found=USERS.find(u=>rest.toLowerCase().startsWith(u.name.toLowerCase()));
        if(found){
          if(buf){segs.push({t:'text',v:buf});buf='';}
          segs.push({t:'mention',user:found});
          i+=1+found.name.length;
          if(text[i]===' ')i++;
          continue;
        }
      }
      buf+=text[i++];
    }
    if(buf) segs.push({t:'text',v:buf});
    attached.forEach(a=>{
      segs.push({t:'text',v:' '});
      if(a.kind==='file')  segs.push({t:'file',ref:a.ref});
      if(a.kind==='error') segs.push({t:'err',ref:a.ref});
      if(a.kind==='proj')  segs.push({t:'proj',ref:a.ref});
    });
    return segs;
  };

  const sendMsg = () => {
    if(!input.trim()&&!attached.length) return;
    const m = {
      id:`m${Date.now()}`, uid:0,
      time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
      head:true, segments:parseInput(input), reactions:[], thread:[],
    };
    setMsgs(p=>[...p,m]);
    setInput(''); setAttached([]); setMention(null);
    triggerTyping();
  };

  const sendReply = (msgId, text) => {
    const r = {
      id:`tr${Date.now()}`, uid:0,
      time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
      head:true, segments:[{t:'text',v:text}], reactions:[],
    };
    setThreads(p=>({...p,[msgId]:[...(p[msgId]||[]),r]}));
    setMsgs(p=>p.map(m=>m.id===msgId?{...m,thread:[...m.thread,r.id]}:m));
  };

  const handleReact = (msgId, emoji) => {
    setMsgs(p=>p.map(m=>{
      if(m.id!==msgId) return m;
      const reactions=m.reactions.map(r=>
        r.e!==emoji?r:r.mine?{...r,n:r.n-1,mine:false}:{...r,n:r.n+1,mine:true}
      );
      return {...m,reactions};
    }));
  };

  const handleAttach = ctx => {
    setAttached(p=>p.find(a=>a.ref.id===ctx.ref.id)?p.filter(a=>a.ref.id!==ctx.ref.id):[...p,ctx]);
  };

  const curCh = CHANNELS.find(c=>c.id===activeCh);
  const sections = ['Channels','Direct'];

  return (
    <>
      <style>{G}</style>
      <div className="app">

        {/* ── SIDEBAR ── */}
        <div className={`sidebar${sideOpen?'':' collapsed'}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">⚡</div>
            <span className="logo-text">CKC-OS</span>
            <div className="live-badge">
              <div className="blink" style={{width:5,height:5,borderRadius:'50%',background:'var(--cyan)',flexShrink:0}}/>
              LIVE
            </div>
          </div>

          <div style={{flex:1,overflowY:'auto'}}>
            {sections.map(sec=>(
              <div key={sec} className="sidebar-section">
                <div className="section-label">{sec}</div>
                {CHANNELS.filter(c=>c.section===sec).map(ch=>(
                  <button key={ch.id} onClick={()=>setActiveCh(ch.id)}
                    className={`ch-btn${activeCh===ch.id?' active':''}`}>
                    {ch.user ? <Av user={ch.user} size={16} r={4}/> : <span style={{width:14,textAlign:'center',fontSize:12}}>{ch.icon}</span>}
                    <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ch.label}</span>
                    {ch.badge>0 && <span className={`ch-badge ${ch.id==='errors'?'red':'cyan'}`}>{ch.badge}</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="sidebar-bottom">
            <div className="quick-label">Quick Attach</div>
            {FILES.slice(0,2).map(f=>(
              <button key={f.id} className="quick-btn" onClick={()=>handleAttach({kind:'file',ref:f})}>
                {f.emoji} {f.name}
              </button>
            ))}
            {ERRORS.slice(0,1).map(e=>(
              <button key={e.id} className="quick-btn" onClick={()=>handleAttach({kind:'error',ref:e})}
                style={{color:attached.find(a=>a.ref.id===e.id)?'var(--rose)':'var(--text3)'}}>
                🔴 {e.name.slice(0,28)}…
              </button>
            ))}
          </div>

          <div className="me-row">
            <Av user={ME}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600}}>{ME.name}</div>
              <div style={{display:'flex',alignItems:'center',gap:4,fontFamily:'var(--mono)',fontSize:9,color:'var(--green)',marginTop:1}}>
                <div className="online-dot"/>Online
              </div>
            </div>
            <button className="icon-btn" style={{width:26,height:26,fontSize:13}}>⚙️</button>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="main">

          {/* TOPBAR */}
          <div className="topbar">
            <button className="menu-btn" onClick={()=>setSideOpen(s=>!s)}>☰</button>
            <span style={{fontFamily:'var(--mono)',fontSize:14,color:'var(--cyan)',flexShrink:0}}>#</span>
            <div className="topbar-info">
              <div className="topbar-name">{curCh?.label||'engine-dev'}</div>
              <div className="topbar-members">{USERS.slice(0,4).map(u=>u.name).join(' · ')}</div>
            </div>
            <div className="topbar-pills">
              {FILES.slice(0,2).map(f=>(
                <button key={f.id} className="pill pill-teal" onClick={()=>handleAttach({kind:'file',ref:f})}>
                  {f.emoji} {f.name}
                </button>
              ))}
              <button className="pill pill-rose" onClick={()=>setCtxOpen(o=>!o)}>
                🔴 {ERRORS.length} Errors
              </button>
              <button className="pill pill-violet" onClick={()=>setCtxOpen(o=>!o)}>
                ⚡ {PROJECTS.length} Projects
              </button>
              <button className={`icon-btn${ctxOpen?' active':''}`} onClick={()=>setCtxOpen(o=>!o)} title="Toggle context panel">
                {ctxOpen?'▲':'▼'}
              </button>
            </div>
          </div>

          {/* CONTEXT PANEL */}
          {ctxOpen && <CtxPanel onAttach={handleAttach} attached={attached}/>}

          {/* MESSAGES */}
          <div className="msg-area" ref={msgAreaRef}>
            <div className="day-divider">
              <div className="day-line"/>
              <span className="day-label">TODAY · {new Date().toLocaleDateString([],{weekday:'long',month:'short',day:'numeric'})}</span>
              <div className="day-line"/>
            </div>
            {msgs.map(m=>(
              <MsgRow key={m.id} msg={m} onThread={setActiveThread} onReact={handleReact}/>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="msg-row anim-fadeUp" style={{opacity:0.7}}>
                <Av user={USERS[1]} size={32} r={8}/>
                <div style={{display:'flex',alignItems:'center',gap:3,paddingTop:8}}>
                  <span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/>
                  <span style={{fontFamily:'var(--mono)',fontSize:9,color:'var(--text3)',marginLeft:6}}>Priya is typing…</span>
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* New message badge */}
          {showNewBadge && (
            <button className="new-badge" onClick={()=>{
              endRef.current?.scrollIntoView({behavior:'smooth'});
              setShowNewBadge(false);
            }}>↓ New message</button>
          )}

          {/* INPUT ZONE */}
          <div className="input-zone">
            {attached.length>0 && (
              <div className="attached-row">
                {attached.map((a,i)=>(
                  <div key={i} className="attached-chip" style={{
                    color:a.kind==='file'?'var(--teal)':a.kind==='error'?'var(--rose)':'var(--violet)',
                    background:a.kind==='file'?'var(--teal-glow)':a.kind==='error'?'var(--rose-glow)':'var(--violet-glow)',
                    borderColor:a.kind==='file'?'rgba(45,212,191,0.3)':a.kind==='error'?'rgba(248,113,113,0.3)':'rgba(167,139,250,0.3)',
                  }}>
                    <span style={{fontSize:11}}>{a.kind==='file'?a.ref.emoji:a.kind==='error'?'🔴':'⚡'}</span>
                    <span style={{fontFamily:'var(--mono)',fontSize:10}}>{a.ref.name}</span>
                    <button className="chip-remove" onClick={()=>setAttached(p=>p.filter((_,j)=>j!==i))}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{position:'relative'}}>
              {mention && (
                <MentionDD query={mention.query} selected={mentionSel} onSelect={pickMention}/>
              )}
              <div className="input-box">
                <textarea className="input-ta" ref={textRef} rows={2}
                  value={input} onChange={handleInput} onKeyDown={handleKeyDown}
                  placeholder={`Message #${curCh?.label||'engine-dev'} — type @ to mention someone`}/>
                <div className="input-toolbar">
                  {[
                    {ic:'📎', tip:'Attach file',    fn:()=>handleAttach({kind:'file',ref:FILES[0]})},
                    {ic:'🐛', tip:'Attach error',   fn:()=>handleAttach({kind:'error',ref:ERRORS[0]})},
                    {ic:'⚡', tip:'Attach project', fn:()=>handleAttach({kind:'proj',ref:PROJECTS[0]})},
                  ].map((b,i)=>(
                    <button key={i} className="tb-btn" title={b.tip} onClick={b.fn}>{b.ic}</button>
                  ))}
                  <div className="tb-sep"/>
                  {['B','`','~~'].map((f,i)=><button key={i} className="tb-fmt">{f}</button>)}
                  <span className="send-hint" style={{marginLeft:'auto',marginRight:8}}>shift+enter for newline</span>
                  <button onClick={sendMsg} disabled={!input.trim()&&!attached.length} className="send-btn">
                    Send <span style={{fontFamily:'var(--mono)',fontSize:9,opacity:0.6}}>↵</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STATUS BAR */}
          <div className="statusbar">
            <div className="status-dot" style={{background:'var(--green)'}}/>
            <span>{USERS.length} online</span>
            <span style={{color:'var(--border3)'}}>·</span>
            <span>{msgs.length} messages</span>
            <span style={{color:'var(--border3)'}}>·</span>
            <span>engine-dev · CKC-OS</span>
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6}}>
              {attached.length>0 && <span style={{color:'var(--cyan)'}}>{attached.length} item{attached.length>1?'s':''} attached</span>}
              <span style={{color:'var(--border3)'}}>·</span>
              <span>v2.4.1</span>
            </div>
          </div>
        </div>

        {/* THREAD PANEL */}
        {activeThread && (
          <ThreadPanel
            msg={activeThread} threads={threads}
            onClose={()=>setActiveThread(null)}
            onSend={sendThreadReply} onReact={handleReact}/>
        )}
      </div>
    </>
  );
}