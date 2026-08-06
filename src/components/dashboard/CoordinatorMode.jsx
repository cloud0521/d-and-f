import { useState } from 'react';
import { CheckCircle2, Clock3, MapPin, Phone, Users, X } from 'lucide-react';

const timeline = [
  { time: '12:30 PM', title: 'Supplier arrival', detail: 'Final styling and sound check', status: 'complete' },
  { time: '2:00 PM', title: 'Guest shuttle', detail: 'Departure from Alta Veranda de Tibig', status: 'current' },
  { time: '3:00 PM', title: 'Ceremony begins', detail: 'San Antonio de Padua Parish', status: 'next' },
  { time: '5:30 PM', title: 'Cocktails and reception', detail: 'Alta Veranda de Tibig', status: 'upcoming' },
];

const contacts = [
  { name: 'Lead Coordinator', role: 'Event lead', phone: '+63 900 000 0000' },
  { name: 'Venue Contact', role: 'Silang venue liaison', phone: '+63 900 000 0000' },
];

export default function CoordinatorMode({ onClose }) {
  const [currentTaskReady, setCurrentTaskReady] = useState(false);

  return (
    <section role="dialog" aria-modal="true" aria-labelledby="coordinator-title" className="fixed inset-0 z-[70] overflow-y-auto bg-[#261016] text-[#F3E5E8]">
      <div className="mx-auto min-h-[100svh] max-w-6xl px-5 py-6 md:px-10 md:py-10">
        <header className="mb-8 flex items-start justify-between gap-5 border-b border-[#C48C78]/25 pb-6">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.34em] text-[#C48C78]">Event-day workspace</p>
            <h1 id="coordinator-title" className="m-0 mt-2 font-serif text-3xl font-light text-[#F3E5E8] md:text-5xl">Coordinator Mode</h1>
            <p className="mt-2 font-serif text-sm italic text-[#D4B8BC]">Stefano &amp; Mhyka · May 22, 2027</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-[#C48C78]/35 bg-[#451822]/70 p-2 text-[#F3E5E8] transition-colors hover:border-[#C48C78]" aria-label="Close Coordinator Mode"><X className="h-5 w-5" /></button>
        </header>

        <main className="space-y-6">
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: 'Expected guests', value: '156', icon: Users },
              { label: 'RSVP accepted', value: '124', icon: CheckCircle2 },
              { label: 'Checked in', value: '0', icon: Users },
              { label: 'Next milestone', value: '3:00', icon: Clock3 },
            ].map(({ label, value, icon: Icon }) => (
              <article key={label} className="rounded-2xl border border-[#C48C78]/25 bg-[#451822]/55 p-4 shadow-lg">
                <Icon className="mb-5 h-5 w-5 text-[#C48C78]" />
                <p className="font-serif text-3xl text-[#F3E5E8]">{value}</p>
                <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.18em] text-[#D4B8BC]">{label}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.45fr_0.8fr]">
            <article className="rounded-3xl border border-[#C48C78]/25 bg-[#451822]/55 p-5 md:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C48C78]">Run of show</p>
                  <h2 className="m-0 mt-1 font-serif text-2xl font-light text-[#F3E5E8]">Today’s moments</h2>
                </div>
                <span className="rounded-full border border-[#C48C78]/30 px-3 py-1 font-sans text-[9px] uppercase tracking-[0.18em] text-[#C48C78]">Live</span>
              </div>
              <ol className="space-y-5 border-l border-[#C48C78]/30 pl-5">
                {timeline.map((item) => (
                  <li key={item.time} className="relative">
                    <span className={`absolute -left-[1.69rem] top-1 h-3 w-3 rounded-full border-4 border-[#451822] ${item.status === 'current' ? 'bg-[#C48C78] shadow-[0_0_16px_rgba(196,140,120,0.9)]' : item.status === 'complete' ? 'bg-[#D4B8BC]' : 'bg-[#36121A]'}`} />
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C48C78]">{item.time}</p>
                    <h3 className="mt-1 font-serif text-xl font-light text-[#F3E5E8]">{item.title}</h3>
                    <p className="mt-1 text-sm text-[#D4B8BC]">{item.detail}</p>
                  </li>
                ))}
              </ol>
            </article>

            <div className="space-y-6">
              <article className="rounded-3xl border border-[#C48C78]/25 bg-[#451822]/55 p-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C48C78]">Current focus</p>
                <h2 className="mt-2 font-serif text-2xl font-light text-[#F3E5E8]">Guest welcome</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#D4B8BC]">Confirm the shuttle manifest, seating guide, and church handoff are ready before guests depart.</p>
                <button type="button" aria-pressed={currentTaskReady} onClick={() => setCurrentTaskReady((ready) => !ready)} className={`mt-5 w-full rounded-full border px-4 py-3 font-sans text-[10px] uppercase tracking-[0.22em] transition-colors ${currentTaskReady ? 'border-[#C48C78] bg-[#C48C78] text-[#36121A]' : 'border-[#C48C78]/50 text-[#F3E5E8] hover:bg-[#C48C78] hover:text-[#36121A]'}`}>{currentTaskReady ? 'Ready for ceremony' : 'Mark ready'}</button>
              </article>
              <article className="rounded-3xl border border-[#C48C78]/25 bg-[#451822]/55 p-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C48C78]">Key contacts</p>
                <ul className="mt-4 space-y-4">
                  {contacts.map((contact) => (
                    <li key={contact.name} className="flex items-center justify-between gap-3">
                      <div><p className="font-serif text-lg text-[#F3E5E8]">{contact.name}</p><p className="text-xs text-[#D4B8BC]">{contact.role}</p></div>
                      <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="rounded-full border border-[#C48C78]/35 p-2 text-[#C48C78]" aria-label={`Call ${contact.name}`}><Phone className="h-4 w-4" /></a>
                    </li>
                  ))}
                </ul>
              </article>
              <a href="https://www.google.com/maps/search/?api=1&query=San%20Antonio%20de%20Padua%20Parish%20Pooc%20Silang%20Cavite" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-3xl border border-[#C48C78]/25 bg-[#451822]/55 p-5 text-[#F3E5E8] transition-colors hover:border-[#C48C78]"><MapPin className="h-5 w-5 text-[#C48C78]" /><span className="font-sans text-[10px] uppercase tracking-[0.18em]">Open ceremony map</span></a>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}
