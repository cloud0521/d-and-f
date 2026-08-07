import { Search, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const formatGuestName = (name) => name
  .trim()
  .toLocaleLowerCase()
  .replace(/(^|[\s'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase());

export default function RSVPDashboard({ rows, weddingName, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredRows = useMemo(
    () => rows.filter((row) => row.full_name.toLowerCase().includes(searchQuery.trim().toLowerCase())),
    [rows, searchQuery],
  );
  const totalGuests = useMemo(() => rows.reduce((total, row) => total + Number(row.guest_count || 0), 0), [rows]);
  const attendingGuests = useMemo(() => rows.filter((row) => row.attendance === 'yes').reduce((total, row) => total + Number(row.guest_count || 0), 0), [rows]);

  return (
    <section role="dialog" aria-modal="true" aria-labelledby="rsvp-dashboard-title" className="fixed inset-0 z-[80] overflow-y-auto bg-[#261016] text-[#F3E5E8]">
      <div className="mx-auto min-h-[100svh] max-w-5xl px-5 py-6 md:px-10 md:py-10">
        <header className="flex items-start justify-between gap-5 border-b border-[#C8A96A]/35 pb-6">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.34em] text-[#C8A96A]">Private invitation dashboard</p>
            <h1 id="rsvp-dashboard-title" className="m-0 mt-2 font-serif text-3xl font-light md:text-5xl">Guest RSVPs</h1>
            <p className="mt-2 font-serif text-sm italic text-[#D4B8BC]">{weddingName}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-[#C8A96A]/45 p-2 text-[#F3E5E8]" aria-label="Close dashboard"><X className="h-5 w-5" /></button>
        </header>

        <main className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <article className="rounded-3xl border border-[#C8A96A]/40 bg-[#451822]/60 p-6">
              <Users className="h-6 w-6 text-[#C8A96A]" />
              <p className="mt-8 font-serif text-5xl font-light">{totalGuests}</p>
              <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.24em] text-[#D4B8BC]">Total responses</p>
            </article>
            <article className="rounded-3xl border border-[#C8A96A]/40 bg-[#451822]/60 p-6">
              <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#C8A96A]">Joyfully attending</p>
              <p className="mt-8 font-serif text-5xl font-light">{attendingGuests}</p>
              <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.24em] text-[#D4B8BC]">Expected guests</p>
            </article>
          </div>

          <article className="rounded-3xl border border-[#C8A96A]/40 bg-[#451822]/60 p-5 md:p-7">
            <label className="flex items-center gap-3 rounded-2xl border border-[#C8A96A]/35 bg-[#2A0D14]/80 px-4 py-3">
              <Search className="h-5 w-5 text-[#C8A96A]" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search guest name" className="min-w-0 flex-1 bg-transparent font-serif text-lg text-[#F3E5E8] outline-none placeholder:text-[#D4B8BC]/45" />
            </label>
            <ul className="mt-5 divide-y divide-[#C8A96A]/20">
              {filteredRows.map((row) => <li key={row.id} className="flex items-center justify-between gap-4 py-4"><span className="font-serif text-xl text-[#F3E5E8]">{formatGuestName(row.full_name)}</span><span className="shrink-0 font-sans text-[9px] uppercase tracking-[0.16em] text-[#C8A96A]">{row.attendance === 'yes' ? `Attending · ${row.guest_count}` : 'Declined'}</span></li>)}
              {!filteredRows.length && <li className="py-8 text-center font-serif italic text-[#D4B8BC]">No guest names found.</li>}
            </ul>
          </article>
        </main>
      </div>
    </section>
  );
}
