import { lazy, Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Calendar, MapPin, Clock, Shirt, Gift, CheckCircle2, ChevronLeft, ChevronRight, Send, Loader2, Eye, EyeOff } from 'lucide-react';

import logoWebp from './logo-full.webp';
import bibleWebp from './assets/bible.webp';
import chapterOneBackground from './assets/gallery/gallery-05-720.webp';
import landingBackground from './assets/gallery/gallery-13-1200.webp';
import churchVenueBackground from './assets/church-venue.webp';
import receptionVenueBackground from './assets/reception-venue.webp';
import CoordinatorMode from './components/dashboard/CoordinatorMode';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { useWeddingExperience } from './contexts/WeddingExperienceContext';
import { stefanoMhykaGallery as galleryPhotos } from './data/gallery';

const RSVPDashboard = lazy(() => import('./components/dashboard/RSVPDashboard'));

const chapters = [
  { id: 0, title: 'The Invitation', subtitle: 'Chapter I' },
  { id: 1, title: 'Our Love Story', subtitle: 'Chapter II' },
  { id: 2, title: 'Captured Moments', subtitle: 'Chapter III' },
  { id: 3, title: 'Ceremony & Reception', subtitle: 'Chapter IV' },
  { id: 4, title: 'RSVP', subtitle: 'Chapter V' },
];

const timelineEvents = [
  {
    year: "2019",
    title: "The Accidental Table",
    description: "A crowded birthday dinner left one empty chair beside Mhyka. Stefano took it, and neither noticed how quickly the evening disappeared."
  },
  {
    year: "2020",
    title: "Love, From a Distance",
    description: "Midnight calls, handwritten notes, and Sunday breakfasts over video taught them that closeness was something they could choose."
  },
  {
    year: "2023",
    title: "A Life in the Little Things",
    description: "Road trips, rescued plants, and ordinary Tuesdays became proof that home was never a place—it was each other."
  },
  {
    year: "2026",
    title: "The Yes by the Sea",
    description: "At sunset, on the shore of their first trip together, Stefano asked Mhyka to choose him for every chapter still to come."
  }
];

const criticalExperienceImages = [logoWebp, bibleWebp];

const fadeInUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  }
};

// Special magical entrance for Chapter 1 Hero elements
const magicalHeroVariant = {
  hidden: { opacity: 0, scale: 0.85, y: 40, filter: 'blur(12px)' },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
  }
};

const carouselSlideVariants = {
  enter: (direction) => ({ x: `${direction * 3}%`, opacity: 0, scale: 1.02 }),
  center: { x: '0%', opacity: 1, scale: 1 },
  exit: (direction) => ({ x: `${direction * -3}%`, opacity: 0, scale: 0.98 }),
};

export default function App() {
  const experience = useWeddingExperience();
  const { identity, opening, schedule, gifts, rsvp, faqs, branding } = experience;
  const [firstName, secondName] = identity.coupleNames.split(/\s*&\s*/);
  const [phase, setPhase] = useState('welcome'); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [showCoordinatorMode, setShowCoordinatorMode] = useState(() => new URLSearchParams(window.location.search).get('mode') === 'coordinator');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [galleryDirection, setGalleryDirection] = useState(1);
  const [isGalleryPaused, setIsGalleryPaused] = useState(false);
  const [isAdminPasswordOpen, setIsAdminPasswordOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminPasswordVisible, setIsAdminPasswordVisible] = useState(false);
  const [adminPasswordError, setAdminPasswordError] = useState('');
  const [isValidatingAdmin, setIsValidatingAdmin] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [dashboardRows, setDashboardRows] = useState([]);
  const [loadedImageCount, setLoadedImageCount] = useState(0);
  const [loadedImageSources, setLoadedImageSources] = useState(() => new Set());
  const [isLogoExpanded, setIsLogoExpanded] = useState(false);
  
  // RSVP Form States
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', guests: '1', attendance: 'yes', message: '' });
  const [timeRemaining, setTimeRemaining] = useState(() => Math.max(0, new Date(identity.weddingDate).getTime() - Date.now()));

  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const openingStartedRef = useRef(false);
  const logoPreviewTimerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isMessengerInAppBrowser = useMemo(() => (
    typeof navigator !== 'undefined' && /FBAN|FBAV|Messenger/i.test(navigator.userAgent)
  ), []);
  const canSwipeGallery = !shouldReduceMotion && !isMessengerInAppBrowser;
  const bibleParticles = useMemo(() => Array.from({ length: 12 }, () => ({
    size: Math.random() * 3 + 2,
    left: `${40 + Math.random() * 20}%`,
    rise: -320 - Math.random() * 150,
    driftStart: (Math.random() - 0.5) * 100,
    driftEnd: (Math.random() - 0.5) * 200,
    duration: Math.random() * 2.5 + 2,
    delay: Math.random() * 1.5,
  })), []);
  const ambientGlitters = useMemo(() => Array.from({ length: 14 }, () => ({
    size: Math.random() * 2 + 1,
    left: `${8 + Math.random() * 84}%`,
    top: `${8 + Math.random() * 80}%`,
    rise: -80 - Math.random() * 80,
    drift: (Math.random() - 0.5) * 36,
    duration: Math.random() * 4 + 4,
    delay: Math.random() * 2,
  })), []);

  useEffect(() => {
    const updateCountdown = () => setTimeRemaining(Math.max(0, new Date(identity.weddingDate).getTime() - Date.now()));
    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [identity.weddingDate]);

  useEffect(() => () => {
    if (logoPreviewTimerRef.current) window.clearTimeout(logoPreviewTimerRef.current);
  }, []);

  const countdown = useMemo(() => {
    const totalSeconds = Math.floor(timeRemaining / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  }, [timeRemaining]);

  useEffect(() => {
    [activeGalleryIndex, (activeGalleryIndex - 1 + galleryPhotos.length) % galleryPhotos.length, (activeGalleryIndex + 1) % galleryPhotos.length].forEach((index) => {
      const image = new Image();
      image.src = galleryPhotos[index].preloadSrc;
    });
  }, [activeGalleryIndex]);

  useEffect(() => {
    if (activeSection !== 2 || shouldReduceMotion || isGalleryPaused) return undefined;

    const timeoutId = window.setTimeout(() => {
      setGalleryDirection(1);
      setActiveGalleryIndex((currentIndex) => (currentIndex + 1) % galleryPhotos.length);
    }, 4500);

    return () => window.clearTimeout(timeoutId);
  }, [activeGalleryIndex, activeSection, isGalleryPaused, shouldReduceMotion]);

  useEffect(() => {
    if (activeSection < 1) return;
    const image = new Image();
    image.src = galleryPhotos[0].preloadSrc;
  }, [activeSection]);

  useEffect(() => {
    if (phase !== 'bible') return undefined;

    let isCancelled = false;
    let transitionTimeoutId;
    const imageTimeoutIds = new Set();
    const startedAt = Date.now();
    setLoadedImageCount(0);

    const preloadImage = (source) => new Promise((resolve) => {
      const image = new Image();
      let isSettled = false;
      const finish = (didLoad = false) => {
        if (isSettled) return;
        isSettled = true;
        window.clearTimeout(timeoutId);
        imageTimeoutIds.delete(timeoutId);
        if (!isCancelled) setLoadedImageCount((count) => count + 1);
        if (didLoad && !isCancelled) {
          setLoadedImageSources((sources) => {
            if (sources.has(source)) return sources;
            const nextSources = new Set(sources);
            nextSources.add(source);
            return nextSources;
          });
        }
        resolve();
      };

      // Mobile browsers can leave Image.decode() pending indefinitely. A loaded
      // image is sufficient here, and this timeout guarantees the opening never traps a guest.
      const timeoutId = window.setTimeout(finish, 8000);
      imageTimeoutIds.add(timeoutId);
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.decoding = 'async';
      image.src = source;
      if (image.complete) finish(image.naturalWidth > 0);
    });

    Promise.all(criticalExperienceImages.map(preloadImage)).then(() => {
      if (isCancelled) return;
      const remainingVerseTime = Math.max(0, 5000 - (Date.now() - startedAt));
      transitionTimeoutId = window.setTimeout(() => {
        if (!isCancelled) setPhase('curtains');
      }, remainingVerseTime);
    });

    return () => {
      isCancelled = true;
      window.clearTimeout(transitionTimeoutId);
      imageTimeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [phase]);

  const handleOpenInvitation = () => {
    if (openingStartedRef.current) return;
    openingStartedRef.current = true;

    if (audioRef.current) {
      audioRef.current.currentTime = 2;
      audioRef.current.volume = 0.4;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Audio playback error:", err);
      });
    }

    setPhase('bible');

  };

  const handleScroll = (e) => {
    const container = e.currentTarget;
    const viewportCenter = container.scrollTop + container.clientHeight / 2;
    const sections = Array.from(container.children);
    const index = sections.findIndex((section) => (
      viewportCenter >= section.offsetTop
      && viewportCenter < section.offsetTop + section.offsetHeight
    ));

    if (index !== -1 && index !== activeSection) {
      setActiveSection(index);
    }
  };

  const scrollToSection = (index) => {
    if (containerRef.current) {
      const targetChild = containerRef.current.children[index];
      if (targetChild) {
        targetChild.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const showLogoPreview = () => {
    if (logoPreviewTimerRef.current) window.clearTimeout(logoPreviewTimerRef.current);
    setIsLogoExpanded(true);
    logoPreviewTimerRef.current = window.setTimeout(() => {
      setIsLogoExpanded(false);
      logoPreviewTimerRef.current = null;
    }, 3000);
  };

  const bringRsvpFieldIntoView = (event) => {
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    const field = event.currentTarget;
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    // Give the mobile keyboard time to open, then place the active field
    // near the upper third of the visible invitation.
    window.setTimeout(() => {
      const containerTop = scrollContainer.getBoundingClientRect().top;
      const fieldTop = field.getBoundingClientRect().top;

      scrollContainer.scrollTo({
        top: scrollContainer.scrollTop + fieldTop - containerTop - 88,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    }, 280);
  };

  const moveGallery = (direction) => {
    setGalleryDirection(direction);
    setActiveGalleryIndex((currentIndex) => (currentIndex + direction + galleryPhotos.length) % galleryPhotos.length);
  };
  const activeGalleryPhoto = galleryPhotos[activeGalleryIndex];
  const isActiveGalleryPhotoLoaded = loadedImageSources.has(activeGalleryPhoto.preloadSrc);

  const isChapterFourActive = activeSection === 3;

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (formData.name.trim().toLowerCase() === 'wed-invi-admin') {
      setAdminPasswordError('');
      setIsAdminPasswordOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!supabase) throw new Error('Supabase is not configured.');
      const { error } = await supabase.from('rsvp_submissions').insert({
        full_name: formData.name.trim(),
        attendance: formData.attendance,
        guest_count: Number(formData.guests),
        message: formData.message.trim() || null,
      });
      if (error) throw error;
      setRsvpSubmitted(true);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert(isSupabaseConfigured
        ? 'There was an error saving your RSVP. Please try again after the Supabase migration is installed.'
        : 'RSVP is not configured for this deployment yet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnotherRsvp = () => {
    setFormData({ name: '', guests: '1', attendance: 'yes', message: '' });
    setRsvpSubmitted(false);
  };

  const handleAdminPasswordSubmit = async (event) => {
    event.preventDefault();
    setIsValidatingAdmin(true);
    setAdminPasswordError('');

    try {
      if (!supabase) throw new Error('Supabase is not configured.');
      const { data, error } = await supabase.rpc('get_rsvp_dashboard', {
        p_username: 'wed-invi-admin',
        p_password: adminPassword,
      });

      if (error) {
        const isMissingDashboardFunction = error.code === 'PGRST202' || error.message?.includes('get_rsvp_dashboard');
        const isMissingCryptoExtension = error.message?.includes('function crypt');
        setAdminPasswordError(
          isMissingCryptoExtension
            ? 'Dashboard security needs its one-time Supabase function update.'
            : isMissingDashboardFunction
            ? 'Dashboard setup is incomplete. Run the supplied Supabase migration once, then try again.'
            : 'Incorrect password. Please try again.',
        );
        return;
      }

      setDashboardRows(data ?? []);
      setAdminPassword('');
      setIsAdminPasswordVisible(false);
      setIsAdminPasswordOpen(false);
      setIsAdminDashboardOpen(true);
    } catch (error) {
      console.error('Error opening RSVP dashboard:', error);
      setAdminPasswordError(isSupabaseConfigured
        ? 'Dashboard connection failed. Check your connection and try again.'
        : 'This deployment is missing its Supabase configuration.');
    } finally {
      setIsValidatingAdmin(false);
    }
  };

  return (
    <div className="bg-[#36121A] text-[#F3E5E8] font-serif selection:bg-[#C48C78]/30 selection:text-[#36121A] h-[100svh] w-screen overflow-hidden relative antialiased flex flex-col">
      {showCoordinatorMode && <CoordinatorMode onClose={() => setShowCoordinatorMode(false)} />}
      {isAdminDashboardOpen && <Suspense fallback={null}><RSVPDashboard rows={dashboardRows} onClose={() => setIsAdminDashboardOpen(false)} /></Suspense>}
      <AnimatePresence>
        {isAdminPasswordOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[75] flex items-center justify-center bg-[#16070B]/80 p-6 backdrop-blur-sm">
            <motion.form role="dialog" aria-modal="true" aria-labelledby="admin-access-title" initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} onSubmit={handleAdminPasswordSubmit} className="w-full max-w-sm rounded-3xl border border-[#C8A96A]/45 bg-[#451822] p-7 shadow-2xl">
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C8A96A]">Recognizing invitation...</p>
              <h2 id="admin-access-title" className="mt-3 font-serif text-3xl font-light text-[#F3E5E8]">Admin access</h2>
              <label htmlFor="admin-password" className="mt-6 block font-sans text-[10px] uppercase tracking-[0.2em] text-[#D4B8BC]">Password</label>
              <div className="relative mt-2">
                <input
                  id="admin-password"
                  autoFocus
                  required
                  autoComplete="current-password"
                  type={isAdminPasswordVisible ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  className="w-full rounded-xl border border-[#C8A96A]/35 bg-[#2A0D14] py-3 pl-4 pr-12 font-serif text-lg text-[#F3E5E8] outline-none focus:border-[#C8A96A]"
                />
                <button
                  type="button"
                  onClick={() => setIsAdminPasswordVisible((isVisible) => !isVisible)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-[#D4B8BC] transition-colors hover:text-[#C8A96A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#C8A96A]"
                  aria-label={isAdminPasswordVisible ? 'Hide administrator password' : 'Show administrator password'}
                  aria-pressed={isAdminPasswordVisible}
                >
                  {isAdminPasswordVisible ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
              {adminPasswordError && <p className="mt-3 text-sm text-[#F3B5AD]">{adminPasswordError}</p>}
              <div className="mt-6 flex gap-3"><button type="button" onClick={() => { setIsAdminPasswordVisible(false); setIsAdminPasswordOpen(false); }} className="flex-1 rounded-full border border-[#C8A96A]/35 px-4 py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-[#F3E5E8]">Cancel</button><button type="submit" disabled={isValidatingAdmin} className="flex-1 rounded-full bg-[#C8A96A] px-4 py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-[#2A0D14] disabled:opacity-60">{isValidatingAdmin ? 'Checking...' : 'Continue'}</button></div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      
      <audio ref={audioRef} loop src="/bg-music.mp3" preload="auto" />

      <AnimatePresence>
        {isLogoExpanded && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#16070B]/72 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.45 }}
            aria-live="polite"
          >
            <motion.img
              src={logoWebp}
              width="2000"
              height="2000"
              alt={identity.monogramAlt}
              className="h-auto w-[min(82vw,34rem)] object-contain drop-shadow-[0_0_35px_rgba(196,140,120,0.5)]"
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.28 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.28 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.035] bg-[radial-gradient(#C48C78_1px,transparent_1px)] [background-size:24px_24px]" />
      <motion.div 
        animate={{ opacity: [0.08, 0.15, 0.08], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_50%_30%,rgba(196,140,120,0.18),transparent_70%)]" 
      />

      {/* WELCOME / LANDING SPLASH SCREEN */}
      <AnimatePresence>
        {phase === 'welcome' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#36121A] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
          >
            <img src={landingBackground} alt="" aria-hidden="true" fetchPriority="high" className="pointer-events-none absolute inset-0 h-full w-full scale-[1.03] object-cover object-center opacity-70 brightness-[1] saturate-[0.78]" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(42,13,20,0.72),rgba(54,18,26,0.48)_48%,rgba(42,13,20,0.82))]" />
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-[#C48C78]"
                  style={{
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -120],
                    x: [0, (Math.random() - 0.5) * 30],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: Math.random() * 4 + 4,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center max-w-lg z-10"
            >
              <motion.button
                type="button"
                onClick={showLogoPreview}
                aria-label="Enlarge wedding logo for three seconds"
                animate={{ y: [0, -4, 0] }}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-36 h-36 md:w-44 md:h-44 mb-6 relative flex items-center justify-center cursor-zoom-in rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C48C78]"
              >
                <img src={logoWebp} width="2000" height="2000" alt={identity.monogramAlt} fetchPriority="high" className="h-full w-full object-contain filter drop-shadow-[0_0_20px_rgba(196,140,120,0.6)]" />
              </motion.button>

              <p className="font-sans text-[10px] tracking-[0.4em] text-[#C48C78] uppercase mb-1">You Are Cordially Invited</p>
              <h1 className="font-serif text-3xl md:text-4xl text-[#F3E5E8] font-light mb-8">{identity.coupleNames}</h1>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenInvitation}
                className="group relative flex flex-col items-center justify-center w-24 h-9 md:w-28 md:h-10 rounded-lg bg-gradient-to-br from-[#6b101e] via-[#480a13] to-[#250307] border-[2px] border-[#b08d57] shadow-[0_3px_15px_rgba(0,0,0,0.6),inset_0_2px_3px_rgba(255,255,255,0.15)] hover:shadow-[0_3px_20px_rgba(176,141,87,0.4)] transition-all cursor-pointer p-0.5 text-center"
              >
                <div className="absolute inset-0.5 rounded-md border border-dashed border-[#b08d57]/50 pointer-events-none" />
                <span className="font-serif italic text-[8px] md:text-[9px] tracking-wider text-[#e6d5bc] font-semibold leading-tight px-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  Open Invitation
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BIBLE VERSE PHASE */}
      <AnimatePresence>
        {phase === 'bible' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 bg-[#2A0D14] flex flex-col items-center justify-between py-12 px-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_75%,rgba(196,140,120,0.25),transparent_60%)] pointer-events-none" />

            <div className="absolute inset-0 pointer-events-none">
              {bibleParticles.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-[#e6d5bc]"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    left: particle.left,
                    bottom: '25%',
                  }}
                  animate={{
                    y: [0, particle.rise],
                    x: [particle.driftStart, particle.driftEnd],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.2, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            <div className="h-6" />

            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.7, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: -30, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -100, filter: 'blur(12px)' }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl text-center z-20 px-4 my-auto"
            >
              <span className="font-sans text-[10px] md:text-xs tracking-[0.4em] text-[#C48C78] uppercase font-semibold block mb-6">
                Holy Matrimony
              </span>
              <blockquote className="font-serif italic text-xl md:text-3xl text-[#F3E5E8] leading-relaxed mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                “{opening.verse}”
              </blockquote>
              <div className="w-16 h-[1px] bg-[#C48C78]/60 mx-auto mb-3" />
              <p className="font-sans text-xs tracking-[0.3em] text-[#D4B8BC] uppercase font-medium">
                {opening.citation}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-48 md:w-64 h-36 md:h-48 relative flex items-center justify-center z-10"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#C48C78]/30 rounded-full blur-2xl -z-10"
              />
              <img src={bibleWebp} width="598" height="372" alt="Holy Bible" fetchPriority="high" className="h-full w-full object-contain filter drop-shadow-[0_0_25px_rgba(196,140,120,0.6)]" />
            </motion.div>
            <div className="absolute bottom-6 left-1/2 w-48 -translate-x-1/2 text-center" role="status" aria-live="polite">
              <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-[#D4B8BC]">Preparing your experience</p>
              <div className="mt-2 h-px overflow-hidden bg-[#C48C78]/25">
                <motion.div
                  className="h-full bg-[#C48C78]"
                  animate={{ width: `${(loadedImageCount / criticalExperienceImages.length) * 100}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CURTAINS OPENING PHASE */}
      <AnimatePresence>
        {phase === 'curtains' && (
          <div className="fixed inset-0 flex z-50 pointer-events-none">
            <motion.div
              initial={{ x: '0%' }}
              animate={{ x: '-100%' }}
              onAnimationComplete={() => setPhase('ready')}
              transition={{ duration: 2.2, ease: [0.77, 0, 0.175, 1] }}
              className="w-1/2 h-full bg-[#2A0D14] border-r border-[#C48C78]/20 relative shadow-2xl"
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(196,140,120,0.08))]" />
            </motion.div>
            <motion.div
              initial={{ x: '0%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2.2, ease: [0.77, 0, 0.175, 1] }}
              className="w-1/2 h-full bg-[#2A0D14] border-l border-[#C48C78]/20 relative shadow-2xl"
            >
              <div className="absolute inset-0 bg-[linear-gradient(-90deg,transparent,rgba(196,140,120,0.08))]" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {phase === 'ready' && <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {ambientGlitters.map((glitter, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-[#F7E8B4] shadow-[0_0_8px_rgba(247,232,180,0.75)]"
            style={{ width: glitter.size, height: glitter.size, left: glitter.left, top: glitter.top }}
            animate={shouldReduceMotion
              ? { opacity: 0.28 }
              : { y: [0, glitter.rise], x: [0, glitter.drift], opacity: [0, 0.6, 0] }}
            transition={shouldReduceMotion
              ? { duration: 0 }
              : { duration: glitter.duration, delay: glitter.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
      {/* TOP HEADER WITH MAGICAL TEXT ANIMATIONS */}
      <header className="absolute top-0 left-0 right-0 px-6 py-6 flex justify-between items-center z-30 max-w-7xl mx-auto pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center gap-3 pointer-events-auto"
        >
          {/* Magical Subtitle / Roman Numeral Animation */}
          <div className="overflow-hidden flex items-center py-1">
            <AnimatePresence mode="wait">
              <motion.span 
                key={`subtitle-${activeSection}`}
                initial={{ opacity: 0, y: -12, filter: 'blur(6px)', scale: 0.9 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, y: 12, filter: 'blur(6px)', scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-sans text-[10px] tracking-[0.3em] text-[#C48C78] uppercase font-semibold inline-block"
              >
                {chapters[activeSection].subtitle}
              </motion.span>
            </AnimatePresence>
          </div>

          <span className="text-[#C48C78]/40">/</span>

          {/* Magical Page Title Animation */}
          <div className="overflow-hidden flex items-center py-1">
            <AnimatePresence mode="wait">
              <motion.span 
                key={`title-${activeSection}`}
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)', scale: 0.9 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, y: -12, filter: 'blur(6px)', scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                className="font-serif text-sm text-[#F3E5E8] tracking-wider inline-block"
              >
                {chapters[activeSection].title}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </header>

      {/* PERFECTLY CENTERED BOTTOM PAGINATION DOTS */}
      <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pointer-events-auto flex items-center gap-2.5 bg-[#2A0D14]/80 px-4 py-2 rounded-full border border-[#C48C78]/30 backdrop-blur-md shadow-lg"
        >
          {chapters.map((ch, idx) => (
            <motion.button
              key={ch.id}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection(idx)}
              className={`h-2 transition-all duration-500 rounded-full cursor-pointer ${
                activeSection === idx 
                  ? 'w-7 bg-[#C48C78] shadow-[0_0_8px_rgba(196,140,120,0.8)]' 
                  : 'w-2 bg-[#C48C78]/30 hover:bg-[#C48C78]/60'
              }`}
              aria-label={`Go to ${ch.title}`}
            />
          ))}
        </motion.div>
      </div>

      {/* VERTICAL SCROLL-SNAP CONTAINER */}
      <main 
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-10 flex-1 h-[100svh] w-full touch-pan-y overscroll-x-none overflow-y-scroll scroll-smooth no-scrollbar md:snap-y md:snap-mandatory"
      >
        
        {/* SECTION 0: HERO (CHAPTER 1) WITH MAGICAL CURTAIN-REVEAL ANIMATIONS */}
        <section className="h-[100svh] w-full snap-start snap-always flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
          <img
            src={chapterOneBackground}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="pointer-events-none absolute inset-0 h-full w-full scale-[1.03] object-cover object-[58%_center] opacity-45 brightness-[1.5] saturate-[0.72] md:object-center"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(36,48,38,0.82)_0%,rgba(89,74,62,0.44)_46%,rgba(54,38,42,0.86)_100%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(217,198,165,0.18),transparent_48%)]" />
          
          {/* Glowing Magical Aura Burst on Reveal */}
          <motion.div 
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.6, 1.4, 1], opacity: [0, 0.5, 0.25] }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="hidden md:block absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#C27C91]/20 via-[#D9C6A5]/20 to-[#93A387]/10 blur-3xl pointer-events-none"
          />

          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="hidden md:block absolute w-64 h-64 rounded-full bg-[#D9C6A5]/15 blur-3xl pointer-events-none"
          />

          {/* Floating magical sparkles behind Chapter 1 content */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#D9C6A5]"
                style={{
                  width: Math.random() * 3 + 1.5,
                  height: Math.random() * 3 + 1.5,
                  left: `${20 + Math.random() * 60}%`,
                  top: `${30 + Math.random() * 40}%`,
                }}
                animate={{
                  y: [0, -80 - Math.random() * 60],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 1.5,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <motion.div 
            initial="hidden"
            animate={activeSection === 0 ? 'visible' : 'hidden'}
            variants={magicalHeroVariant}
            className="max-w-4xl mx-auto pt-8 relative z-10 flex flex-col items-center"
          >
            <motion.button
              type="button"
              onClick={showLogoPreview}
              aria-label="Enlarge wedding logo for three seconds"
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-32 h-32 md:w-40 md:h-40 mb-3 relative flex items-center justify-center cursor-zoom-in rounded-full filter drop-shadow-[0_0_25px_rgba(217,198,165,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9C6A5]"
            >
              <img src={logoWebp} width="2000" height="2000" alt={identity.monogramAlt} className="h-full w-full object-contain" />
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="inline-block mb-4 px-6 py-1.5 border-y border-[#D9C6A5]/45 bg-[#243026]/45 backdrop-blur-sm rounded-lg"
            >
              <p className="font-sans text-[11px] tracking-[0.45em] text-[#D9C6A5] uppercase font-medium">
                Together with their families
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
            >
              <h1 className="m-0 font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-[#F3E5E8] font-light drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                {firstName}
              </h1>
              <motion.div 
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="font-serif italic text-3xl md:text-5xl text-[#D9C6A5] font-light"
              >
                &amp;
              </motion.div>
              <h1 className="m-0 font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-[#F3E5E8] font-light drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                {secondName}
              </h1>
            </motion.div>

            <motion.div 
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
              className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D9C6A5] to-transparent mx-auto my-5" 
            />

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              className="font-sans text-xs md:text-sm tracking-[0.35em] uppercase text-[#D9C6A5] font-semibold"
            >
              {new Intl.DateTimeFormat('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila' }).format(new Date(identity.weddingDate))}
            </motion.p>
            <div className="mt-4 flex items-center justify-center gap-4 font-sans text-[#F3E5E8]" aria-label={`${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes and ${countdown.seconds} seconds until the wedding`}>
              {Object.entries(countdown).map(([label, value]) => <div key={label} className="min-w-10 text-center"><span className="block text-base font-medium tabular-nums">{String(value).padStart(2, '0')}</span><span className="text-[8px] uppercase tracking-[0.2em] text-[#D9C6A5]">{label}</span></div>)}
            </div>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
              className="font-serif italic text-sm text-[#D4B8BC] mt-2 font-medium"
            >
              Silang &bull; Cavite
            </motion.p>
          </motion.div>
        </section>

        {/* SECTION 1: OUR LOVE STORY */}
        <section className="min-h-[100svh] w-full snap-start snap-always flex flex-col items-center justify-start px-6 py-12 md:h-[100svh] md:justify-center md:overflow-y-auto md:px-20 md:py-16 max-w-4xl mx-auto no-scrollbar">
          <div className="w-full text-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.65 }}
              variants={fadeInUp}
              className="mb-10"
            >
              <span className="text-xs uppercase tracking-[0.4em] text-[#C48C78] font-semibold block mb-2">Memories &amp; Milestones</span>
              <h2 className="text-3xl md:text-4xl font-light font-serif text-[#F3E5E8]">Our Love Story</h2>
              <div className="w-12 h-[1px] bg-[#C48C78] mx-auto mt-3" />
            </motion.div>

            <div className="relative border-l border-[#C48C78]/40 ml-4 md:ml-24 text-left space-y-10">
              {timelineEvents.map((item) => (
                <motion.div 
                  key={item.year}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.55 }}
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                    }
                  }}
                  className="relative pl-8 md:pl-10 group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.5 }}
                    className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#C48C78] ring-4 ring-[#36121A] transition-transform duration-300 shadow-[0_0_10px_rgba(196,140,120,0.8)]" 
                  />
                  <span className="text-xs font-semibold tracking-widest text-[#C48C78] uppercase">{item.year}</span>
                  <h3 className="text-xl md:text-2xl font-serif font-light text-[#F3E5E8] mt-1 mb-1 group-hover:text-[#C48C78] transition-colors duration-300">{item.title}</h3>
                  <p className="text-sm text-[#D4B8BC] leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: CAPTURED MOMENTS */}
        <section className="w-full snap-start snap-always flex flex-col items-center justify-start px-6 pb-6 pt-12 md:h-[100svh] md:justify-center md:overflow-y-auto md:px-20 md:py-16 max-w-5xl mx-auto no-scrollbar">
          <div className="w-full text-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="mb-10"
            >
              <span className="text-xs uppercase tracking-[0.4em] text-[#C48C78] font-semibold block mb-2">Captured Moments</span>
              <h2 className="text-3xl md:text-4xl font-light font-serif text-[#F3E5E8]">The Gallery</h2>
              <div className="w-12 h-[1px] bg-[#C48C78] mx-auto mt-3" />
            </motion.div>

            <div
              className="mx-auto w-full max-w-4xl"
              role="region"
              aria-roledescription="carousel"
              aria-label="Stefano and Mhyka's wedding album"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') moveGallery(-1);
                if (event.key === 'ArrowRight') moveGallery(1);
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-[#C48C78]/30 bg-[#2A0D14] shadow-[0_24px_70px_rgba(0,0,0,0.35)] md:aspect-[16/10]">
                <AnimatePresence initial={false} custom={shouldReduceMotion ? 0 : galleryDirection}>
                  <motion.figure
                    key={activeGalleryPhoto.id}
                    custom={shouldReduceMotion ? 0 : galleryDirection}
                    variants={carouselSlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: shouldReduceMotion ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                    drag={canSwipeGallery ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.06}
                    onDragEnd={(_, info) => {
                      if (Math.abs(info.offset.x) > 45) moveGallery(info.offset.x > 0 ? -1 : 1);
                    }}
                    className="absolute inset-0 m-0 touch-pan-y overflow-hidden"
                    aria-roledescription="slide"
                    aria-label={`${activeGalleryIndex + 1} of ${galleryPhotos.length}`}
                  >
                    {!isActiveGalleryPhotoLoaded && <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#2A0D14,#5A2430,#2A0D14)]"><span className="font-sans text-[9px] uppercase tracking-[0.24em] text-[#D4B8BC]">Preparing photograph</span></div>}
                    <picture className="block h-full w-full"><source srcSet={activeGalleryPhoto.webpSrcSet} sizes="(min-width: 768px) 1200px, 100vw" type="image/webp" /><img src={activeGalleryPhoto.img} width="1200" height="600" alt={activeGalleryPhoto.alt} decoding="async" onLoad={() => setLoadedImageSources((sources) => sources.has(activeGalleryPhoto.preloadSrc) ? sources : new Set(sources).add(activeGalleryPhoto.preloadSrc))} className={`h-full w-full object-cover transition-opacity duration-500 ${isActiveGalleryPhotoLoaded ? 'opacity-100' : 'opacity-0'}`} /></picture>
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#16070B]/90 via-[#16070B]/35 to-transparent px-6 pb-6 pt-20 text-left font-serif text-xl text-[#F3E5E8] md:px-8 md:pb-8 md:text-2xl">{activeGalleryPhoto.caption}</figcaption>
                  </motion.figure>
                </AnimatePresence>
                <button type="button" onClick={() => moveGallery(-1)} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#F3E5E8]/35 bg-[#16070B]/65 p-2.5 text-[#F3E5E8] backdrop-blur-md transition-colors hover:bg-[#C48C78] hover:text-[#36121A] md:left-5" aria-label="Previous photo"><ChevronLeft className="h-5 w-5" /></button>
                <button type="button" onClick={() => moveGallery(1)} className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#F3E5E8]/35 bg-[#16070B]/65 p-2.5 text-[#F3E5E8] backdrop-blur-md transition-colors hover:bg-[#C48C78] hover:text-[#36121A] md:right-5" aria-label="Next photo"><ChevronRight className="h-5 w-5" /></button>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex shrink-0 items-center gap-3"><p className="font-sans text-[10px] tabular-nums tracking-[0.22em] text-[#D4B8BC]">{String(activeGalleryIndex + 1).padStart(2, '0')} / {String(galleryPhotos.length).padStart(2, '0')}</p>{!shouldReduceMotion && <button type="button" onClick={() => setIsGalleryPaused((paused) => !paused)} aria-pressed={isGalleryPaused} className="font-sans text-[9px] uppercase tracking-[0.16em] text-[#C48C78] transition-colors hover:text-[#F3E5E8]">{isGalleryPaused ? 'Play' : 'Pause'}</button>}</div>
                <div className="flex flex-wrap justify-end gap-1.5" aria-label="Choose a photograph">
                  {galleryPhotos.map((photo, index) => <button key={photo.id} type="button" onClick={() => { setGalleryDirection(index > activeGalleryIndex ? 1 : -1); setActiveGalleryIndex(index); }} aria-label={`View photo ${index + 1}: ${photo.caption}`} aria-current={index === activeGalleryIndex ? 'true' : undefined} className={`h-1.5 rounded-full transition-all ${index === activeGalleryIndex ? 'w-6 bg-[#C48C78]' : 'w-1.5 bg-[#C48C78]/35 hover:bg-[#C48C78]/70'}`} />)}
                </div>
              </div>
              {activeGalleryIndex === galleryPhotos.length - 1 && <p className="mt-6 font-serif italic text-lg text-[#D4B8BC]">Thank you for being part of the story we are still writing.</p>}
            </div>
          </div>
        </section>

        {/* SECTION 3: CEREMONY & RECEPTION */}
        <section className="min-h-[100svh] w-full snap-start snap-always flex flex-col items-center justify-start px-6 pb-4 pt-4 md:h-[100svh] md:max-w-5xl md:justify-center md:px-20 md:py-16 mx-auto">
          <div className="w-full">
            <motion.div 
              initial="hidden"
              animate={isChapterFourActive ? 'visible' : 'hidden'}
              variants={fadeInUp}
              className="text-center mb-8"
            >
              <span className="text-xs uppercase tracking-[0.4em] text-[#C48C78] font-semibold block mb-1">Join Our Celebration</span>
              <h2 className="text-3xl md:text-4xl font-light font-serif text-[#F3E5E8]">Ceremony &amp; Reception</h2>
              <div className="w-12 h-[1px] bg-[#C48C78] mx-auto mt-3" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <motion.div 
                initial="hidden"
                animate={isChapterFourActive ? 'visible' : 'hidden'}
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-2xl border border-[#C8A96A]/60 bg-[#451822]/70 p-6 text-center shadow-xl backdrop-blur-sm transition-all duration-300"
              >
                <img src={churchVenueBackground} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-15 brightness-[1] saturate-[0.78]" />
                <div className="absolute inset-0 bg-[#16070B]/68" />
                <div className="relative z-10 flex h-full flex-col items-center drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)]">
                <motion.div 
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-10 h-10 rounded-full bg-[#C48C78]/15 flex items-center justify-center mb-3 text-[#C48C78]"
                >
                  <Calendar className="w-5 h-5" />
                </motion.div>
                <h3 className="text-xl font-serif font-light text-[#F3E5E8] mb-1">{schedule.ceremony.title}</h3>
                <p className="text-xs font-semibold text-[#C48C78] mb-0.5">{new Intl.DateTimeFormat('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila' }).format(new Date(schedule.ceremony.dateTime))}</p>
                <p className="text-xs text-[#D4B8BC] mb-3">{schedule.ceremony.timeLabel}</p>
                <p className="text-[11px] font-semibold text-[#F3E5E8] tracking-widest uppercase mb-1">{schedule.ceremony.venue}</p>
                <p className="text-[10px] text-[#D4B8BC] mb-4">{schedule.ceremony.address}</p>
                <a 
                  href={schedule.ceremony.mapUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#C48C78] hover:text-[#F3E5E8] font-semibold border-b border-[#C48C78] pb-0.5 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#C48C78]" />
                  <span>View Exact Map Location</span>
                </a>
                </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                animate={isChapterFourActive ? 'visible' : 'hidden'}
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-2xl border border-[#C8A96A]/60 bg-[#451822]/70 p-6 text-center shadow-xl backdrop-blur-sm transition-all duration-300"
              >
                <img src={receptionVenueBackground} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-20 brightness-[1] saturate-[0.82]" />
                <div className="absolute inset-0 bg-[#16070B]/68" />
                <div className="relative z-10 flex h-full flex-col items-center drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)]">
                <motion.div 
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-10 h-10 rounded-full bg-[#C48C78]/15 flex items-center justify-center mb-3 text-[#C48C78]"
                >
                  <Clock className="w-5 h-5" />
                </motion.div>
                <h3 className="text-xl font-serif font-light text-[#F3E5E8] mb-1">{schedule.reception.title}</h3>
                <p className="text-xs font-semibold text-[#C48C78] mb-0.5">Immediately Following Ceremony</p>
                <p className="text-xs text-[#D4B8BC] mb-3">{schedule.reception.timeLabel}</p>
                <p className="text-[11px] font-semibold text-[#F3E5E8] tracking-widest uppercase mb-1">{schedule.reception.venue}</p>
                <p className="text-[10px] text-[#D4B8BC] mb-4">{schedule.reception.address}</p>
                <a 
                  href={schedule.reception.mapUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#C48C78] hover:text-[#F3E5E8] font-semibold border-b border-[#C48C78] pb-0.5 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#C48C78]" />
                  <span>View Exact Map Location</span>
                </a>
                </div>
              </motion.div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <motion.div 
                initial="hidden"
                animate={isChapterFourActive ? 'visible' : 'hidden'}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-[#C8A96A]/60 bg-[#451822]/50 p-5 text-center shadow-lg transition-all"
              >
                <Shirt className="w-6 h-6 text-[#C48C78] mx-auto mb-2" />
                <h3 className="text-lg font-serif font-light text-[#F3E5E8] mb-1">Dress Code</h3>
                <p className="text-xs text-[#C48C78] font-medium mb-2">{schedule.dressCode.name}</p>
                <div className="flex justify-center gap-2 my-3" aria-label={`${schedule.dressCode.name} dress-code palette`}>
                  {schedule.dressCode.colors.map((color) => (
                    <span key={color} className="h-5 w-5 rounded-full border border-[#F3E5E8]/30 shadow-md" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <p className="text-[11px] text-[#D4B8BC] italic mt-1">{schedule.dressCode.description}</p>
              </motion.div>

              <motion.div 
                initial="hidden"
                animate={isChapterFourActive ? 'visible' : 'hidden'}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col justify-center rounded-2xl border border-[#C8A96A]/60 bg-[#451822]/50 p-5 text-center shadow-lg transition-all"
              >
                <Gift className="w-6 h-6 text-[#C48C78] mx-auto mb-2" />
                <h3 className="text-lg font-serif font-light text-[#F3E5E8] mb-1">{gifts[0]?.title ?? 'Gift Registry'}</h3>
                <p className="text-xs text-[#D4B8BC] mb-2">{gifts[0]?.description}</p>
                <p className="text-[11px] font-semibold text-[#C48C78] tracking-wider">{gifts[0]?.details}</p>
              </motion.div>

            </div>
          </div>
        </section>

        {/* SECTION 4: RSVP */}
        <section className="min-h-[100svh] w-full snap-start snap-always flex flex-col items-center justify-start px-6 pb-8 pt-4 md:h-auto md:min-h-[100svh] md:justify-start md:overflow-visible md:px-20 md:pb-24 md:pt-24 max-w-xl mx-auto no-scrollbar">
          <div className="w-full">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, scale: 0.92, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.35, ease: 'easeOut' } }}
              className="bg-[#451822]/90 border border-[#C48C78]/40 p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-md w-full relative overflow-hidden"
            >
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-[#F7E8B4]/10 to-transparent"
                animate={shouldReduceMotion ? { opacity: 0 } : { x: ['0%', '450%'] }}
                transition={{ duration: 1.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-[0.4em] text-[#C48C78] font-semibold block mb-2">Be Our Guest</span>
                <h3 className="text-3xl font-serif font-light text-[#F3E5E8]">RSVP</h3>
                <p className="text-xs text-[#D4B8BC] mt-1">Kindly respond on or before {new Intl.DateTimeFormat('en-PH', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila' }).format(new Date(rsvp.deadline))}</p>
              </div>

              <AnimatePresence mode="wait">
                {!rsvpSubmitted ? (
                  <motion.form 
                    key="rsvp-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleRsvpSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="rsvp-name" className="block text-xs uppercase tracking-widest text-[#C48C78] mb-1 font-semibold">Full Name</label>
                      <input 
                        id="rsvp-name"
                        autoComplete="name"
                        type="text" 
                        required
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        onFocus={bringRsvpFieldIntoView}
                        className="w-full bg-[#2A0D14] border border-[#C48C78]/50 rounded-xl px-4 py-2.5 text-sm text-[#F3E5E8] placeholder-[#D4B8BC]/40 focus:outline-none focus:border-[#C48C78] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="rsvp-attendance" className="block text-xs uppercase tracking-widest text-[#C48C78] mb-1 font-semibold">Attendance</label>
                        <select 
                          id="rsvp-attendance"
                          value={formData.attendance}
                          onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                          className="w-full bg-[#2A0D14] border border-[#C48C78]/50 rounded-xl px-4 py-2.5 text-sm text-[#F3E5E8] focus:outline-none focus:border-[#C48C78] transition-colors"
                        >
                          <option value="yes" className="bg-[#2A0D14]">Joyfully Accept</option>
                          <option value="no" className="bg-[#2A0D14]">Regretfully Decline</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="rsvp-guests" className="block text-xs uppercase tracking-widest text-[#C48C78] mb-1 font-semibold">Number of Guests</label>
                        <select 
                          id="rsvp-guests"
                          value={formData.guests}
                          onChange={(e) => setFormData({...formData, guests: e.target.value})}
                          className="w-full bg-[#2A0D14] border border-[#C48C78]/50 rounded-xl px-4 py-2.5 text-sm text-[#F3E5E8] focus:outline-none focus:border-[#C48C78] transition-colors"
                        >
                          <option value="1" className="bg-[#2A0D14]">1 Person</option>
                          <option value="2" className="bg-[#2A0D14]">2 Persons</option>
                          <option value="3" className="bg-[#2A0D14]">3 Persons</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="rsvp-message" className="block text-xs uppercase tracking-widest text-[#C48C78] mb-1 font-semibold">Wishes for the Couple</label>
                      <textarea 
                        id="rsvp-message"
                        rows="2"
                        placeholder="Leave a sweet message..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        onFocus={bringRsvpFieldIntoView}
                        className="w-full bg-[#2A0D14] border border-[#C48C78]/50 rounded-xl px-4 py-2.5 text-sm text-[#F3E5E8] placeholder-[#D4B8BC]/40 focus:outline-none focus:border-[#C48C78] transition-colors"
                      />
                    </div>

                    <div className="text-center pt-1">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#C48C78] hover:bg-[#b07864] text-[#36121A] py-3 rounded-full text-xs uppercase tracking-[0.3em] font-bold shadow-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 text-[#36121A] animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-[#36121A]" />
                            <span>Submit RSVP</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8 space-y-4"
                  >
                    <CheckCircle2 className="w-14 h-14 text-[#C48C78] mx-auto" />
                    <h4 className="text-2xl font-serif text-[#F3E5E8]">Thank You, {formData.name}!</h4>
                    <p className="text-sm text-[#D4B8BC] max-w-md mx-auto">
                      {formData.attendance === 'yes' 
                        ? "We have successfully recorded your response. We can't wait to celebrate our special day with you!"
                        : "We are sorry you won't be able to make it, but thank you for letting us know."}
                    </p>
                    <button
                      type="button"
                      onClick={handleSubmitAnotherRsvp}
                      className="mt-5 rounded-full border border-[#C48C78]/55 px-6 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F3E5E8] transition-colors hover:border-[#C48C78] hover:bg-[#C48C78]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C48C78]"
                    >
                      Submit another RSVP
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12, delayChildren: 0.08 } },
              }}
              className="mt-8 space-y-3 text-left"
            >
              <motion.h3
                variants={{
                  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
                }}
                className="text-center font-serif text-2xl font-light text-[#F3E5E8]"
              >
                A Few Helpful Notes
              </motion.h3>
              {faqs.map((faq) => (
                <motion.details
                  key={faq.id}
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18, scale: shouldReduceMotion ? 1 : 0.98 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  whileHover={shouldReduceMotion ? undefined : { y: -2, borderColor: 'rgba(196, 140, 120, 0.62)' }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
                  className="rsvp-note rounded-2xl border border-[#C48C78]/30 bg-[#451822]/55 px-5 py-4 shadow-lg transition-colors"
                >
                  <summary className="cursor-pointer font-serif text-lg text-[#F3E5E8]">{faq.question}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-[#D4B8BC]">{faq.answer}</p>
                </motion.details>
              ))}
            </motion.div>
            <footer className="pb-8 pt-10 text-center">
              <p className="font-serif italic text-lg text-[#F3E5E8]">Thank you for being part of our story.</p>
              <p className="mt-3 font-sans text-[9px] uppercase tracking-[0.2em] text-[#C48C78]">{branding.signature}</p>
            </footer>
          </div>
        </section>

      </main>

      {/* COMPACT DISC MUSIC PLAYER */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (isPlaying) {
              audioRef.current.pause();
              setIsPlaying(false);
            } else {
              audioRef.current.play().catch(() => {});
              setIsPlaying(true);
            }
          }}
          className="w-12 h-12 rounded-full bg-[#2A0D14]/95 backdrop-blur-md p-1 border border-[#C48C78]/40 shadow-2xl flex items-center justify-center cursor-pointer hover:border-[#C48C78] transition-all duration-300"
          aria-label="Toggle Background Music"
        >
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-full h-full rounded-full bg-gradient-to-tr from-[#C48C78] to-[#800020] border border-[#F3E5E8]/30 flex items-center justify-center shadow-[0_0_10px_rgba(196,140,120,0.6)]"
          >
            <div className="w-3 h-3 rounded-full bg-[#2A0D14] border border-[#C48C78] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#F3E5E8]" />
            </div>
          </motion.div>
        </motion.button>
      </div>

      </>}

    </div>
  );
}
