# Kitty Party Lounge

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kitty Party — spill, swipe, judge</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#F7F5EF;
    --panel:#FFFFFF;
    --panel-hi:#F0ECE1;
    --hairline:#DED6C4;
    --text-hi:#1B1F2E;
    --text-lo:#6B6F80;
    --red:#B0102A;
    --red-dim:rgba(176,16,42,0.08);
    --green:#146C43;
    --green-dim:rgba(20,108,67,0.08);
    --gold:#A9791F;
    --purple:#6B46A8;
  }
  *{box-sizing:border-box; -webkit-tap-highlight-color:transparent;}
  html,body{margin:0;padding:0;}
  body{
    background:radial-gradient(ellipse at top, #FFFFFF 0%, var(--ink) 60%);
    color:var(--text-hi);
    font-family:'Inter',sans-serif;
    min-height:100vh;
    padding-bottom:78px;
    overflow-x:hidden;
  }
  .wrap{max-width:520px;margin:0 auto;padding:16px 16px 0;}
  h1,h2,h3{font-family:'Cormorant Garamond',sans-serif;margin:0;}

  /* header */
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
  .brand{display:flex;align-items:baseline;gap:6px;}
  .brand h1{font-size:1.35rem;font-weight:700;letter-spacing:-0.01em;}
  .brand .dot{color:var(--gold);}
  .profile-chip{
    display:flex;align-items:center;gap:8px;
    background:var(--panel);border:1px solid var(--hairline);
    border-radius:20px;padding:6px 12px 6px 6px;cursor:pointer;
  }
  .profile-chip .avatar{
    width:26px;height:26px;border-radius:50%;
    background:linear-gradient(135deg,var(--purple),var(--red));
    display:flex;align-items:center;justify-content:center;font-size:0.85rem;
  }
  .profile-chip .lvl{font-size:0.78rem;font-weight:600;color:var(--gold);}
  .profile-chip .streak{font-size:0.75rem;color:var(--text-lo);}

  .tagline{color:var(--text-lo);font-size:0.9rem;margin:0 0 16px;}
  .section-note{color:var(--text-lo);font-size:0.82rem;margin:0 0 16px;line-height:1.5;}

  .view{display:none;}
  .view.active{display:block;}

  /* ---- SWIPE compose toggle ---- */
  .compose-toggle{
    display:flex;align-items:center;justify-content:center;gap:6px;
    background:var(--panel);border:1px dashed var(--hairline);border-radius:12px;
    padding:12px;margin-bottom:14px;cursor:pointer;color:var(--text-lo);
    font-size:0.88rem;font-weight:600;
  }
  .compose-toggle:hover{border-color:var(--gold);color:var(--gold);}

  /* ---- shared compose box ---- */
  .compose{background:var(--panel);border:1px solid var(--hairline);border-radius:14px;padding:16px;margin-bottom:14px;}
  .compose textarea{
    width:100%;background:transparent;border:none;resize:none;color:var(--text-hi);
    font-family:'Inter',sans-serif;font-size:1rem;line-height:1.5;min-height:64px;outline:none;
  }
  .compose textarea::placeholder{color:var(--text-lo);}
  .compose-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;padding-top:10px;border-top:1px solid var(--hairline);flex-wrap:wrap;}
  select{background:var(--panel-hi);color:var(--text-hi);border:1px solid var(--hairline);border-radius:7px;padding:7px 10px;font-family:'Inter',sans-serif;font-size:0.85rem;}
  .charcount{color:var(--text-lo);font-size:0.8rem;}
  .post-btn{background:var(--gold);color:var(--ink);border:none;border-radius:7px;padding:9px 18px;font-weight:700;font-size:0.9rem;cursor:pointer;}
  .post-btn:disabled{opacity:0.35;cursor:default;}
  .disclaimer{color:var(--text-lo);font-size:0.76rem;margin:0 2px 18px;line-height:1.5;}

  /* ---- SWIPE deck ---- */
  .deck-wrap{
    position:relative;height:420px;margin-bottom:18px;
    display:flex;align-items:center;justify-content:center;
  }
  .swipe-card{
    position:absolute;width:100%;max-width:420px;height:400px;
    background:var(--panel);border:1px solid var(--hairline);
    border-radius:18px;padding:22px;
    display:flex;flex-direction:column;
    cursor:grab;user-select:none;touch-action:none;
    box-shadow:0 16px 32px rgba(27,31,46,0.12);
  }
  .swipe-card:active{cursor:grabbing;}
  .swipe-card .chip{
    align-self:flex-start;font-size:0.72rem;color:var(--gold);
    border:1px solid rgba(212,175,55,0.35);background:rgba(212,175,55,0.08);
    padding:3px 10px;border-radius:20px;margin-bottom:16px;
  }
  .swipe-card .text{
    font-size:1.3rem;line-height:1.5;flex:1;
    display:flex;align-items:center;font-weight:500;
  }
  .swipe-card .hint{
    display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-lo);
    padding-top:14px;border-top:1px solid var(--hairline);
  }
  .stamp{
    position:absolute;top:26px;font-family:'Cormorant Garamond',sans-serif;font-weight:900;
    font-size:1.6rem;padding:6px 14px;border-radius:8px;border:3px solid;
    opacity:0;transform:rotate(-18deg);pointer-events:none;letter-spacing:0.02em;
  }
  .stamp.red{left:22px;color:var(--red);border-color:var(--red);}
  .stamp.green{right:22px;color:var(--green);border-color:var(--green);transform:rotate(18deg);}

  .swipe-controls{display:flex;justify-content:center;gap:22px;margin-bottom:6px;}
  .round-btn{
    width:58px;height:58px;border-radius:50%;border:none;
    display:flex;align-items:center;justify-content:center;font-size:1.5rem;
    background:var(--panel-hi);border:1px solid var(--hairline);cursor:pointer;
    transition:transform 0.12s ease;
  }
  .round-btn:active{transform:scale(0.9);}
  .round-btn.red{color:var(--red);}
  .round-btn.green{color:var(--green);}
  .deck-count{text-align:center;color:var(--text-lo);font-size:0.8rem;margin-bottom:8px;}

  .empty-deck{
    text-align:center;padding:60px 20px;color:var(--text-lo);font-size:0.92rem;line-height:1.6;
  }
  .empty-deck .em-word{font-family:'Cormorant Garamond',sans-serif;color:var(--text-hi);font-size:1.15rem;display:block;margin-bottom:8px;}
  .cta-btn{
    margin-top:14px;background:var(--gold);color:var(--ink);border:none;
    padding:10px 20px;border-radius:8px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;
  }

  /* ---- SPILL feed (tea) ---- */
  .feed{display:flex;flex-direction:column;gap:10px;}
  .tea-card{background:var(--panel);border:1px solid var(--hairline);border-radius:12px;padding:14px 15px;}
  .tea-top{display:flex;justify-content:space-between;gap:10px;margin-bottom:10px;}
  .tea-text{font-size:0.95rem;line-height:1.5;margin:0;flex:1;}
  .tea-chip{
    flex-shrink:0;font-size:0.7rem;color:var(--purple);
    border:1px solid rgba(155,111,214,0.35);background:rgba(155,111,214,0.08);
    padding:3px 9px;border-radius:20px;white-space:nowrap;
  }
  .reaction-row{display:flex;gap:6px;flex-wrap:wrap;}
  .reaction-btn{
    background:var(--panel-hi);border:1px solid var(--hairline);border-radius:20px;
    padding:5px 10px;font-size:0.8rem;color:var(--text-hi);cursor:pointer;
    display:flex;align-items:center;gap:5px;transition:transform 0.12s ease, border-color 0.15s ease;
  }
  .reaction-btn:not(:disabled):hover{border-color:var(--gold);}
  .reaction-btn:not(:disabled):active{transform:scale(0.94);}
  .reaction-btn.chosen{border-color:var(--gold);background:rgba(212,175,55,0.1);color:var(--gold);}
  .reaction-btn:disabled{cursor:default;}
  .tea-meta{font-size:0.72rem;color:var(--text-lo);margin-top:8px;}

  /* ---- BATTLES ---- */
  .battle-title{text-align:center;font-size:1rem;color:var(--text-lo);margin-bottom:16px;}
  .battle-stage{display:flex;flex-direction:column;gap:12px;}
  .battle-card{
    background:var(--panel);border:2px solid var(--hairline);border-radius:14px;padding:18px;
    cursor:pointer;transition:border-color 0.15s ease, transform 0.12s ease;
  }
  .battle-card:active{transform:scale(0.98);}
  .battle-card:hover{border-color:var(--red);}
  .battle-card .text{font-size:1.05rem;line-height:1.5;margin-bottom:10px;}
  .battle-vs{text-align:center;font-family:'Cormorant Garamond',sans-serif;color:var(--gold);font-size:0.85rem;margin:0;}

  /* ---- LEADERBOARD ---- */
  .lb-row{display:flex;align-items:center;gap:12px;background:var(--panel);border:1px solid var(--hairline);border-radius:12px;padding:12px 14px;margin-bottom:8px;}
  .lb-rank{font-family:'Cormorant Garamond',sans-serif;font-size:1.1rem;color:var(--gold);width:26px;flex-shrink:0;}
  .lb-body{flex:1;min-width:0;}
  .lb-text{font-size:0.88rem;line-height:1.4;margin:0 0 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .lb-meta{font-size:0.73rem;color:var(--text-lo);}
  .lb-share{background:none;border:1px solid var(--hairline);color:var(--text-lo);border-radius:7px;padding:6px 9px;cursor:pointer;font-size:0.9rem;flex-shrink:0;}

  /* ---- PROFILE ---- */
  .profile-card{background:linear-gradient(135deg, var(--panel-hi), var(--panel));border:1px solid var(--hairline);border-radius:16px;padding:22px;text-align:center;margin-bottom:16px;}
  .big-avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--red));display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin:0 auto 10px;}
  .level-title{color:var(--gold);font-size:0.85rem;margin-bottom:14px;}
  .xp-bar{height:8px;border-radius:5px;background:var(--hairline);overflow:hidden;margin-bottom:6px;}
  .xp-fill{height:100%;background:linear-gradient(90deg,var(--purple),var(--gold));transition:width 0.4s ease;}
  .xp-label{font-size:0.72rem;color:var(--text-lo);}
  .stat-row{display:flex;justify-content:center;gap:22px;margin-top:16px;flex-wrap:wrap;}
  .stat{text-align:center;}
  .stat .num{font-family:'Cormorant Garamond',sans-serif;font-size:1.2rem;}
  .stat .lbl{font-size:0.68rem;color:var(--text-lo);}

  .badges-title{font-size:0.85rem;color:var(--text-lo);margin:20px 0 10px;}
  .badge-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px;}
  .badge{background:var(--panel);border:1px solid var(--hairline);border-radius:12px;padding:12px 6px;text-align:center;opacity:0.3;}
  .badge.unlocked{opacity:1;border-color:var(--gold);}
  .badge .emoji{font-size:1.4rem;display:block;margin-bottom:4px;}
  .badge .name{font-size:0.62rem;color:var(--text-lo);line-height:1.2;}

  .share-btn{width:100%;background:var(--gold);color:var(--ink);border:none;padding:12px;border-radius:10px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;font-size:0.9rem;}

  /* ---- bottom nav ---- */
  .bottom-nav{
    position:fixed;bottom:0;left:0;right:0;
    background:rgba(255,255,255,0.85);backdrop-filter:blur(10px);
    border-top:1px solid var(--hairline);
    display:flex;justify-content:space-around;padding:8px 4px calc(8px + env(safe-area-inset-bottom));
    z-index:20;
  }
  .nav-btn{
    background:none;border:none;color:var(--text-lo);display:flex;flex-direction:column;
    align-items:center;gap:2px;font-size:0.65rem;cursor:pointer;padding:4px 8px;border-radius:8px;
  }
  .nav-btn .ic{font-size:1.2rem;}
  .nav-btn.active{color:var(--gold);}

  .toast{
    position:fixed;bottom:88px;left:50%;transform:translateX(-50%) translateY(20px);
    background:var(--panel-hi);border:1px solid var(--gold);color:var(--text-hi);
    padding:10px 18px;border-radius:10px;font-size:0.85rem;opacity:0;pointer-events:none;
    transition:opacity 0.25s ease, transform 0.25s ease;z-index:30;max-width:88%;text-align:center;
  }
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

  @media (prefers-reduced-motion: reduce){*{animation:none !important;transition:none !important;}}

  /* ---- onboarding ---- */
  .onboarding{
    position:fixed;inset:0;background:rgba(4,5,10,0.92);backdrop-filter:blur(6px);
    display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;
  }
  .onboarding.hidden{display:none;}
  .onboarding-card{
    background:linear-gradient(135deg,var(--panel-hi),var(--panel));
    border:1px solid var(--hairline);border-radius:18px;padding:28px 24px;
    max-width:360px;width:100%;text-align:center;
  }
  .onboarding-card h2{font-size:1.3rem;margin:10px 0 8px;}
  .onb-desc{color:var(--text-lo);font-size:0.85rem;line-height:1.5;margin:0 0 20px;}
  .onb-field{text-align:left;background:var(--panel);border:1px solid var(--hairline);border-radius:10px;padding:10px 14px;margin-bottom:10px;}
  .onb-label{display:block;font-size:0.7rem;color:var(--text-lo);margin-bottom:4px;}
  .onb-username-row{display:flex;align-items:center;justify-content:space-between;}
  .onb-username-row span{font-family:'Cormorant Garamond',sans-serif;font-size:0.95rem;}
  .onb-shuffle{background:none;border:1px solid var(--hairline);border-radius:7px;color:var(--text-hi);padding:5px 8px;cursor:pointer;font-size:0.9rem;}
  .onb-id{font-family:'Cormorant Garamond',sans-serif;font-size:0.95rem;color:var(--gold);}

  /* ---- editable username in profile ---- */
  .handle-row{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:4px;}
  .handle{font-family:'Cormorant Garamond',sans-serif;font-size:1.05rem;}
  .edit-username{background:none;border:1px solid var(--hairline);border-radius:6px;color:var(--text-lo);padding:3px 7px;cursor:pointer;font-size:0.8rem;}
  .username-edit-row{display:flex;gap:6px;justify-content:center;margin-bottom:6px;}
  .username-input{
    background:var(--panel);border:1px solid var(--gold);border-radius:7px;color:var(--text-hi);
    padding:6px 10px;font-family:'Cormorant Garamond',sans-serif;font-size:0.9rem;width:170px;text-align:center;
  }
  .username-save{background:var(--gold);color:var(--ink);border:none;border-radius:7px;padding:6px 12px;font-weight:700;cursor:pointer;font-size:0.8rem;}
  .pf-id{font-size:0.75rem;color:var(--text-lo);margin-bottom:14px;}







    

🐱


    

Welcome to Kitty Party


    

Get an anonymous identity to spill tea and judge others. Your ID is permanent. Your username you can change anytime.


    


      Your username
      


        —
        🔀
      


    


    


      Your permanent ID
      #000000
    


    Enter the party







  


    

Kitty Party.


    


      

🐱


      


        

Lv.1


        

🔥0


      


    

Spill, swipe, judge. Your group chat's favorite guilty pleasure.



  


    

Share a trait about yourself and let the party decide: red flag or green flag?



    

+ Share a trait to get judged


    


      
      


        
          Dating
          Friendship
          Work
          Family
          Roommate
          General
        
        200 left
        Submit
      


    



    


    


      🚩
      ✅
    


    





  


    

Spill the tea. Read what everyone else is spilling. React, don't judge.



    


      
      


        
          Drama
          Work
          Friend group
          Family
          Relationship
          Random
        
        320 left
        Spill it
      


    


    

Tea and reactions here are visible to everyone at the party — nothing here is private.


    



  


    

Which one's the bigger red flag?


    



  


    

The most-judged traits at the party.


    



  


    


      

🐱


      


        

—


        ✏️
      


      


        
        Save
      


      

ID #000000


      

—


      


      

0 / 100 XP


      


        

0

day streak


        

0

verdicts given


        

0

traits shared


        

0

tea spilled


      


    


    

Badges


    


    Download my Kitty Card









🔥Swipe⚔️Battles✍️Spill🏆Ranks👤Me







this is the code of my frontend , help me make it cool and intimidating , basically modernize it a little

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2685680c-5cb9-4d04-9403-9d65db6a1e5a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
