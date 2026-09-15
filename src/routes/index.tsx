import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Crown,
  Flame,
  Gavel,
  MessageCircleMore,
  Pencil,
  Plus,
  Send,
  Share2,
  Shield,
  Swords,
  Trophy,
  UserRound,
  X,
} from "lucide-react";

import salonAvatar from "@/assets/salon-avatar.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kitty Party — Deliver Your Verdict" },
      { name: "description", content: "Spill anonymous tea, judge red and green flags, and rise through the party ranks." },
      { property: "og:title", content: "Kitty Party — Deliver Your Verdict" },
      { property: "og:description", content: "Spill anonymous tea, judge red and green flags, and rise through the party ranks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type View = "swipe" | "battles" | "spill" | "ranks" | "me";

const traits = [
  { text: "I let my ex live in my studio — rent-free, ‘until she gets back on her feet.’ Two years now.", category: "Dating" },
  { text: "I read the group chat from notifications so nobody knows I have seen it.", category: "Friendship" },
  { text: "I schedule emails for 6:03 a.m. so everyone thinks I wake up early.", category: "Work" },
];

const navItems: Array<{ id: View; label: string; icon: typeof Flame }> = [
  { id: "swipe", label: "Swipe", icon: Flame },
  { id: "battles", label: "Battles", icon: Swords },
  { id: "spill", label: "Spill", icon: MessageCircleMore },
  { id: "ranks", label: "Ranks", icon: Trophy },
  { id: "me", label: "Me", icon: UserRound },
];

function Index() {
  const [view, setView] = useState<View>("swipe");
  const [traitIndex, setTraitIndex] = useState(0);
  const [verdict, setVerdict] = useState<"Red flag" | "Green flag" | null>(null);
  const [toast, setToast] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [post, setPost] = useState("");
  const [handle, setHandle] = useState("M. Halloway");
  const [editing, setEditing] = useState(false);

  const trait = traits[traitIndex % traits.length];
  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };
  const judge = (choice: "Red flag" | "Green flag") => {
    setVerdict(choice);
    window.setTimeout(() => {
      setTraitIndex((value) => value + 1);
      setVerdict(null);
    }, 450);
  };

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto w-full max-w-[460px] px-5 pt-7">
        <Header handle={handle} onProfile={() => setView("me")} />
        {view === "swipe" && (
          <SwipeView
            trait={trait}
            traitIndex={traitIndex}
            verdict={verdict}
            composeOpen={composeOpen}
            post={post}
            onCompose={() => setComposeOpen((value) => !value)}
            onPostChange={setPost}
            onSubmit={() => { setPost(""); setComposeOpen(false); showToast("Your confession entered the room."); }}
            onJudge={judge}
          />
        )}
        {view === "spill" && <SpillView showToast={showToast} />}
        {view === "battles" && <BattlesView showToast={showToast} />}
        {view === "ranks" && <RanksView showToast={showToast} />}
        {view === "me" && (
          <ProfileView
            handle={handle}
            editing={editing}
            setEditing={setEditing}
            setHandle={setHandle}
            showToast={showToast}
          />
        )}
      </div>
      <BottomNav view={view} setView={setView} />
      <div aria-live="polite" className={`fixed bottom-24 left-1/2 z-50 max-w-[88%] -translate-x-1/2 rounded-md border border-gold bg-foreground px-4 py-2 text-center text-xs text-background shadow-card transition-all ${toast ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
        {toast}
      </div>
    </main>
  );
}

function Header({ handle, onProfile }: { handle: string; onProfile: () => void }) {
  return (
    <header className="animate-rise flex items-center justify-between border-b border-line pb-4">
      <div>
        <h1 className="text-[29px] font-bold leading-none">Kitty Party<span className="text-gold">.</span></h1>
        <p className="mt-1.5 text-[10px] font-semibold uppercase text-muted-foreground">Private salon · invite only</p>
      </div>
      <Button variant="salon" className="h-auto rounded-full py-1.5 pl-1.5 pr-3" onClick={onProfile}>
        <img src={salonAvatar} alt="Your profile" width={32} height={32} className="size-8 rounded-full object-cover grayscale" />
        <span className="text-left leading-tight">
          <span className="block max-w-20 truncate text-[11px] font-semibold">{handle}</span>
          <span className="block text-[9px] uppercase text-gold">Tier III · 620 XP</span>
        </span>
      </Button>
    </header>
  );
}

function StatusStrip({ label = "The room is watching" }: { label?: string }) {
  return (
    <div className="mt-5 flex items-center gap-3 rounded-md border border-line bg-surface/65 px-4 py-2.5 shadow-card">
      <span className="size-1.5 rounded-full bg-wine" />
      <p className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</p>
      <span className="ml-auto text-[10px] text-muted-foreground">142 online</span>
    </div>
  );
}

function SwipeView({ trait, traitIndex, verdict, composeOpen, post, onCompose, onPostChange, onSubmit, onJudge }: {
  trait: (typeof traits)[number]; traitIndex: number; verdict: "Red flag" | "Green flag" | null; composeOpen: boolean; post: string;
  onCompose: () => void; onPostChange: (value: string) => void; onSubmit: () => void; onJudge: (choice: "Red flag" | "Green flag") => void;
}) {
  return (
    <section>
      <StatusStrip />
      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase text-gold">Case no. {String(traitIndex + 31).padStart(4, "0")}</p>
          <h2 className="mt-1 text-2xl font-semibold">Deliver your verdict.</h2>
        </div>
        <Button variant="ghost" size="icon" aria-label="Share a trait" title="Share a trait" onClick={onCompose}><Plus /></Button>
      </div>
      {composeOpen && (
        <div className="animate-rise mt-4 rounded-md border border-line bg-surface p-4 shadow-card">
          <textarea value={post} onChange={(event) => onPostChange(event.target.value.slice(0, 200))} className="min-h-20 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Enter your confession for judgment…" />
          <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
            <span className="text-[10px] text-muted-foreground">{200 - post.length} remaining</span>
            <Button variant="gold" size="sm" disabled={!post.trim()} onClick={onSubmit}><Send />Submit</Button>
          </div>
        </div>
      )}
      <article key={traitIndex} className="animate-rise relative mt-5">
        <div className="absolute -inset-2 rounded-2xl border border-line bg-surface/50" />
        <div className="relative flex aspect-[5/6] flex-col rounded-xl border border-gold/25 bg-surface/90 px-6 pb-5 pt-6 shadow-card">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase text-gold">Under review</span>
            <span className="text-[10px] uppercase text-muted-foreground">Confidential</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="font-display text-[29px] font-semibold italic leading-tight">“{trait.text}”</p>
            <p className="mt-5 text-[10px] font-semibold uppercase text-gold">Exhibit — {trait.category}</p>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-4 text-[9px] font-semibold uppercase text-muted-foreground">
            <span>Anonymous guest</span><span>142 in the room</span>
          </div>
          <div className="animate-seal pointer-events-none absolute right-4 top-16 rotate-[-8deg] rounded-md border-[3px] border-wine px-3 py-1 font-display text-xl font-bold uppercase text-wine">
            {verdict ?? "To be judged"}
          </div>
        </div>
      </article>
      <div className="mt-7 flex items-center justify-center gap-14">
        <Button variant="verdictRed" size="verdict" onClick={() => onJudge("Red flag")} aria-label="Mark as red flag" title="Red flag"><X /></Button>
        <Button variant="verdictGreen" size="verdict" onClick={() => onJudge("Green flag")} aria-label="Mark as green flag" title="Green flag"><Check /></Button>
      </div>
      <p className="mt-3 text-center text-[10px] font-semibold uppercase text-muted-foreground">Swipe the deck · {142 - traitIndex} remaining</p>
    </section>
  );
}

const spills = [
  { category: "Relationship", text: "He ‘forgot’ our anniversary twice. The second time, he framed it as self-care.", votes: 28 },
  { category: "Work", text: "I still answer my boss’s texts at 1 a.m. I do not even like him.", votes: 41 },
  { category: "Friend group", text: "She called it a quiet dinner, then invited everyone except her flatmate.", votes: 67 },
];

function SpillView({ showToast }: { showToast: (message: string) => void }) {
  const [draft, setDraft] = useState("");
  const [reacted, setReacted] = useState<number | null>(null);
  return (
    <section className="animate-rise">
      <StatusStrip label="Nothing stays secret for long" />
      <h2 className="mt-6 text-3xl font-semibold">The whispers.</h2>
      <p className="mt-1 text-sm text-muted-foreground">Read the room. React once. Leave no fingerprints.</p>
      <div className="mt-5 rounded-md border border-line bg-surface p-4 shadow-card">
        <textarea value={draft} onChange={(e) => setDraft(e.target.value.slice(0, 320))} className="min-h-20 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Spill what the room needs to know…" />
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="text-[10px] text-muted-foreground">{320 - draft.length} remaining</span>
          <Button variant="gold" size="sm" disabled={!draft.trim()} onClick={() => { setDraft(""); showToast("The tea has been served."); }}><Send />Spill it</Button>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {spills.map((spill, index) => (
          <article key={spill.text} className="rounded-md border border-line bg-surface/80 p-4 shadow-card">
            <div className="flex items-start gap-3">
              <p className="flex-1 text-sm leading-relaxed">{spill.text}</p>
              <span className="shrink-0 text-[9px] font-semibold uppercase text-gold">{spill.category}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
              <span className="text-[10px] text-muted-foreground">{spill.votes + (reacted === index ? 1 : 0)} witnesses</span>
              <Button variant={reacted === index ? "gold" : "ghost"} size="sm" onClick={() => setReacted(index)}><Flame />Brutal</Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BattlesView({ showToast }: { showToast: (message: string) => void }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const options = ["Still shares a streaming account with their ex.", "Checks your location before replying to your text."];
  return (
    <section className="animate-rise">
      <StatusStrip label="One survives the room" />
      <div className="mt-7 text-center"><p className="text-[10px] font-semibold uppercase text-wine">Sudden death</p><h2 className="mt-1 text-3xl font-semibold">Which is worse?</h2></div>
      <div className="mt-7 space-y-4">
        {options.map((option, index) => (
          <button key={option} onClick={() => { setChosen(index); showToast("Your ruling has been counted."); }} className={`relative flex min-h-44 w-full items-center justify-center rounded-md border-2 bg-surface px-7 text-center font-display text-2xl font-semibold italic shadow-card transition-all active:scale-[0.98] ${chosen === index ? "border-wine text-wine" : "border-line hover:border-gold"}`}>
            <span className="absolute left-4 top-4 text-[10px] font-body font-semibold uppercase text-muted-foreground">Exhibit {index === 0 ? "A" : "B"}</span>
            “{option}”
          </button>
        ))}
        <div className="flex items-center gap-3"><span className="h-px flex-1 bg-line"/><span className="font-display font-bold text-gold">VERSUS</span><span className="h-px flex-1 bg-line"/></div>
      </div>
    </section>
  );
}

function RanksView({ showToast }: { showToast: (message: string) => void }) {
  const rows = useMemo(() => [
    ["I", "Kept a text I should have deleted", "98.2"], ["II", "Bought the ring before the proposal", "91.7"],
    ["III", "Has a ranking of every friend’s partner", "88.4"], ["IV", "Pretends not to recognize people in public", "82.9"],
  ], []);
  return (
    <section className="animate-rise">
      <StatusStrip label="The room remembers everything" />
      <p className="mt-7 text-[10px] font-semibold uppercase text-gold">This week’s ledger</p>
      <h2 className="mt-1 text-3xl font-semibold">The most judged.</h2>
      <div className="mt-6 space-y-2">
        {rows.map(([rank, text, score]) => (
          <article key={rank} className="flex items-center gap-4 rounded-md border border-line bg-surface/80 px-4 py-4 shadow-card">
            <span className="w-7 font-display text-xl font-bold text-gold">{rank}</span>
            <p className="min-w-0 flex-1 truncate text-sm">{text}</p>
            <span className="text-xs font-semibold text-muted-foreground">{score}</span>
            <Button variant="ghost" size="icon" aria-label={`Share rank ${rank}`} title="Share" onClick={() => showToast("Ranking copied to your Kitty Card.")}><Share2 /></Button>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfileView({ handle, editing, setEditing, setHandle, showToast }: { handle: string; editing: boolean; setEditing: (v: boolean) => void; setHandle: (v: string) => void; showToast: (m: string) => void }) {
  return (
    <section className="animate-rise">
      <div className="mt-7 text-center">
        <img src={salonAvatar} alt="Your monochrome profile portrait" width={96} height={96} className="mx-auto size-24 rounded-full border-4 border-surface object-cover grayscale shadow-card" />
        <p className="mt-4 text-[10px] font-semibold uppercase text-gold">Tier III · The Arbiter</p>
        {editing ? (
          <div className="mx-auto mt-2 flex max-w-72 gap-2"><input value={handle} onChange={(e) => setHandle(e.target.value.slice(0, 22))} aria-label="Username" className="min-w-0 flex-1 rounded-md border border-gold bg-surface px-3 py-2 text-sm outline-none"/><Button variant="gold" size="sm" onClick={() => setEditing(false)}>Save</Button></div>
        ) : (
          <div className="mt-1 flex items-center justify-center gap-2"><h2 className="text-3xl font-semibold">{handle}</h2><Button variant="ghost" size="icon" aria-label="Edit username" title="Edit username" onClick={() => setEditing(true)}><Pencil /></Button></div>
        )}
        <p className="mt-1 text-xs text-muted-foreground">ID #447102 · permanent</p>
      </div>
      <div className="mt-7 rounded-md border border-line bg-surface p-5 shadow-card">
        <div className="flex justify-between text-[10px] font-semibold uppercase"><span>620 XP</span><span className="text-muted-foreground">Tier IV at 800</span></div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-[72%] bg-gold" /></div>
        <div className="mt-6 grid grid-cols-4 gap-2 text-center">
          {[['12','streak'],['86','verdicts'],['7','traits'],['4','spills']].map(([n,l]) => <div key={l}><p className="font-display text-xl font-bold">{n}</p><p className="text-[9px] uppercase text-muted-foreground">{l}</p></div>)}
        </div>
      </div>
      <h3 className="mt-7 text-xl font-semibold">Distinctions</h3>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[{icon:Crown,name:'First ruling'},{icon:Gavel,name:'Hard judge'},{icon:Shield,name:'Trusted guest'}].map(({icon:Icon,name}) => <div key={name} className="rounded-md border border-gold/35 bg-surface p-4 text-center shadow-card"><Icon className="mx-auto size-5 text-gold"/><p className="mt-2 text-[9px] font-semibold uppercase text-muted-foreground">{name}</p></div>)}
      </div>
      <Button variant="gold" className="mt-6 w-full" onClick={() => showToast("Your Kitty Card is ready to share.")}><Share2 />Share my Kitty Card<ChevronRight className="ml-auto" /></Button>
    </section>
  );
}

function BottomNav({ view, setView }: { view: View; setView: (view: View) => void }) {
  return (
    <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[460px] px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <Button key={id} variant="ghost" onClick={() => setView(id)} className={`relative h-14 flex-1 flex-col gap-1 rounded-none px-1 py-2 text-[9px] uppercase ${view === id ? "text-gold" : "text-muted-foreground"}`}>
            <Icon className="size-[18px]" />{label}
            {view === id && <span className="absolute bottom-0 h-0.5 w-6 bg-gold" />}
          </Button>
        ))}
      </div>
    </nav>
  );
}