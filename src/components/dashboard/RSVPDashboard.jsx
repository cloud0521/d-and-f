import { CheckCircle2, Search, Users, X, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const formatGuestName = (name) => name
  .trim()
  .toLocaleLowerCase()
  .replace(/(^|[\s'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase());

export default function RSVPDashboard({ rows, weddingName, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [responseFilter, setResponseFilter] = useState('all');
  const filteredRows = useMemo(
    () => rows.filter((row) => {
      const matchesSearch = row.full_name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesResponse = responseFilter === 'all'
        || (responseFilter === 'accepted' && row.attendance === 'yes')
        || (responseFilter === 'declined' && row.attendance === 'no');
      return matchesSearch && matchesResponse;
    }),
    [rows, searchQuery, responseFilter],
  );
  const acceptedResponses = useMemo(() => rows.filter((row) => row.attendance === 'yes').length, [rows]);
  const declinedResponses = useMemo(() => rows.filter((row) => row.attendance === 'no').length, [rows]);
  const responseCards = [
    { id: 'all', label: 'All responses', value: rows.length, icon: Users },
    { id: 'accepted', label: 'Accepted', value: acceptedResponses, icon: CheckCircle2 },
    { id: 'declined', label: 'Declined', value: declinedResponses, icon: XCircle },
  ];

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

        <main className="mt-8 space-y-6">
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {responseCards.map(({ id, label, value, icon: Icon }) => {
              const isActive = responseFilter === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setResponseFilter(id)}
                  aria-pressed={isActive}
                  className={`min-w-0 rounded-xl border p-2.5 text-left transition-all md:rounded-2xl md:p-4 ${isActive ? 'border-[#E2C889] bg-[#5A202D] shadow-[0_10px_28px_rgba(10,2,5,0.25)] ring-1 ring-[#C8A96A]/30' : 'border-[#C8A96A]/30 bg-[#451822]/55 hover:border-[#C8A96A]/60 hover:bg-[#4D1B26]/70'}`}
                >
                  <Icon className={`h-3.5 w-3.5 md:h-5 md:w-5 ${isActive ? 'text-[#F7E8B4]' : 'text-[#C8A96A]'}`} aria-hidden="true" />
                  <p className="mt-2.5 font-serif text-2xl font-light md:mt-4 md:text-4xl">{value}</p>
                  <p className="mt-0.5 truncate font-sans text-[7px] uppercase tracking-[0.1em] text-[#D4B8BC] md:mt-1 md:text-[9px] md:tracking-[0.18em]">{label}</p>
                </button>
              );
            })}
          </div>

          <article className="rounded-3xl border border-[#C8A96A]/40 bg-[#451822]/60 p-5 md:p-7">
            <label className="flex items-center gap-3 rounded-2xl border border-[#C8A96A]/35 bg-[#2A0D14]/80 px-4 py-3">
              <Search className="h-5 w-5 text-[#C8A96A]" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search guest name" className="min-w-0 flex-1 bg-transparent font-serif text-lg text-[#F3E5E8] outline-none placeholder:text-[#D4B8BC]/45" />
            </label>
            <ul className="mt-5 divide-y divide-[#C8A96A]/20">
              {filteredRows.map((row) => <li key={row.id} className="flex items-center justify-between gap-4 py-4"><span className="font-serif text-xl text-[#F3E5E8]">{formatGuestName(row.full_name)}</span><span className="shrink-0 font-sans text-[9px] uppercase tracking-[0.16em] text-[#C8A96A]">{row.attendance === 'yes' ? `Attending · ${row.guest_count}` : 'Declined'}</span></li>)}
              {!filteredRows.length && <li className="py-8 text-center font-serif italic text-[#D4B8BC]">No {responseFilter === 'all' ? '' : `${responseFilter} `}responses found.</li>}
            </ul>
          </article>
        </main>
      </div>
    </section>
  );
}
