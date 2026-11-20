// 0. SMART SCROLL NAVBAR & MOBILE DRAWER
const navbar = document.getElementById('navbar');
const burgerBtn = document.getElementById('burgerBtn');
const mobileNav = document.getElementById('mobileNav');
let lastScrollY = window.scrollY;

burgerBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileNav.classList.remove('open'));
});

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;
  if (mobileNav.classList.contains('open')) return;

  if (currentY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled', 'retracted');
    lastScrollY = currentY;
    return;
  }

  if (currentY > lastScrollY + 6) {
    navbar.classList.remove('retracted');
  } else if (currentY < lastScrollY - 6) {
    navbar.classList.add('retracted');
  }

  lastScrollY = currentY;
}, { passive: true });

// 0B. LEFT VERTICAL CAROUSEL INDICATOR (Tracks active section on page)
const trackedIds = ['top', 'welcome', 'geosites', 'facts', 'map', 'stay', 'history', 'planner', 'wildlife', 'challenge', 'guardian'];
const railItems = document.querySelectorAll('.rail-item');
const navLinks = document.querySelectorAll('.nav-menu a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      railItems.forEach(item => item.classList.toggle('active', item.dataset.section === id));
      navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', href === id);
      });
    }
  });
}, { rootMargin: '-32% 0px -55% 0px' });

trackedIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// 1. SMOOTH CROSSFADE HERO SLIDER (AUTO-ADVANCE 5.5s)
const heroSlides = [
  {
    bg: 'images/chocolate-hills.jpg',
    title: 'Explore the <span>Bohol Island</span> UNESCO Global Geopark',
    sub: '150 million years of natural formation, living cultural heritage, barrier reefs, and cone-shaped limestone hills across 47 municipalities and 1 city.'
  },
  {
    bg: 'images/coral-reef.jpg',
    title: 'Discover the <span>Danajon</span> Double Barrier Reef',
    sub: 'Experience thriving coral ecosystems, sea turtles, and the 425-hectare Banacon Island mangrove forest along northern Bohol.'
  },
  {
    bg: 'images/tarsier-2.jpg',
    title: 'Meet <span>Mawmaw</span>, Guardian of the Geopark',
    sub: 'Inspired by the endemic Philippine tarsier (Mawmag), protecting Bohol’s limestone forests, caves, and marine sanctuaries.'
  }
];

let currSlide = 0;
let activeBgLayer = 'A';
let heroTimer = null;
const heroBgA = document.getElementById('heroBgA');
const heroBgB = document.getElementById('heroBgB');
const heroCenter = document.getElementById('heroCenter');

function showHeroSlide(idx) {
  currSlide = (idx + heroSlides.length) % heroSlides.length;
  const s = heroSlides[currSlide];

  const nextLayer = activeBgLayer === 'A' ? heroBgB : heroBgA;
  const prevLayer = activeBgLayer === 'A' ? heroBgA : heroBgB;
  nextLayer.style.backgroundImage = `url('${s.bg}')`;
  nextLayer.classList.add('active');
  prevLayer.classList.remove('active');
  activeBgLayer = activeBgLayer === 'A' ? 'B' : 'A';

  heroCenter.classList.add('fading');
  setTimeout(() => {
    document.getElementById('heroHeading').innerHTML = s.title;
    document.getElementById('heroSub').textContent = s.sub;
    heroCenter.classList.remove('fading');
  }, 220);

  document.querySelectorAll('.slide-dot').forEach((d, i) => d.classList.toggle('active', i === currSlide));
}

function resetHeroTimer() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => showHeroSlide(currSlide + 1), 5500);
}

document.getElementById('prevHero').addEventListener('click', () => {
  showHeroSlide(currSlide - 1);
  resetHeroTimer();
});
document.getElementById('nextHero').addEventListener('click', () => {
  showHeroSlide(currSlide + 1);
  resetHeroTimer();
});
document.querySelectorAll('.slide-dot').forEach(d => {
  d.addEventListener('click', () => {
    showHeroSlide(Number(d.dataset.idx));
    resetHeroTimer();
  });
});

const heroSection = document.getElementById('top');
heroSection.addEventListener('mouseenter', () => clearInterval(heroTimer));
heroSection.addEventListener('mouseleave', resetHeroTimer);
resetHeroTimer();
const map = L.map('geopark-map', { scrollWheelZoom: false }).setView([9.84, 124.18], 9);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const places = [
  { name: 'Chocolate Hills', brgy: 'Brgy. Buenos Aires, Carmen', type: 'geosite', lat: 9.8297, lng: 124.1397, desc: 'Cone-shaped karst limestone hills.' },
  { name: 'Alicia Schist', brgy: 'Brgy. Cambaol, Alicia', type: 'geosite', lat: 9.8833, lng: 124.4333, desc: 'Oldest rock foundation in Bohol (150M–66M yrs).' },
  { name: 'Uplifted Marine Terrace', brgy: 'Maribojoc & Loon Coast', type: 'geosite', lat: 9.7400, lng: 123.8420, desc: '1.5m seabed uplift from Oct 2013 earthquake.' },
  { name: 'Danajon Double Barrier Reef', brgy: 'Northern Bohol Coast', type: 'geosite', lat: 10.2500, lng: 124.2000, desc: 'Rare double barrier reef off north coast.' },
  { name: 'Banacon Island Mangrove Forest', brgy: 'Brgy. Banacon, Getafe', type: 'geosite', lat: 10.2008, lng: 124.1786, desc: '425-hectare mangrove forest sanctuary.' },
  { name: 'Solea Reef Resort Anda', brgy: 'Brgy. Talisay, Anda', type: 'hotel', lat: 9.7445, lng: 124.5762, desc: 'Beachfront resort in Anda.' },
  { name: 'Bugnaw Si-E Beach Resort', brgy: 'Brgy. Virgen, Anda', type: 'hotel', lat: 9.7540, lng: 124.5790, desc: 'Coastal resort in Anda.' },
  { name: 'Loboc River Resort', brgy: 'Brgy. Camayaan, Loboc', type: 'hotel', lat: 9.6366, lng: 124.0315, desc: 'Riverside nature resort in Loboc.' },
  { name: 'Ocean Suites', brgy: 'Brgy. Bool, Tagbilaran City', type: 'hotel', lat: 9.6238, lng: 123.8645, desc: 'Boutique hotel in Tagbilaran.' },
  { name: 'Bohol Ecotel', brgy: 'Brgy. Poblacion III, Tagbilaran City', type: 'hotel', lat: 9.6495, lng: 123.8565, desc: 'Eco-friendly stay in Tagbilaran.' },
  { name: 'CMARFE Delicacy and Souvenir Shop', brgy: 'Brgy. Mansasa, Tagbilaran City', type: 'shop', lat: 9.6435, lng: 123.8615, desc: 'Local Boholano delicacies & gifts.' },
  { name: 'Islands Souvenirs', brgy: 'Brgy. Dao, Tagbilaran City', type: 'shop', lat: 9.6552, lng: 123.8698, desc: 'Apparel & island keepsakes.' },
  { name: 'Nel Nel Souvenir Shop', brgy: 'Brgy. Buenos Aires, Carmen', type: 'shop', lat: 9.8285, lng: 124.1390, desc: 'Souvenirs near Chocolate Hills.' },
  { name: 'Nicole’s Souvenir Shop', brgy: 'Brgy. Buenos Aires, Carmen', type: 'shop', lat: 9.8291, lng: 124.1406, desc: 'Local crafts & gifts.' }
];

const markerMap = {};
const markers = [];

places.forEach(p => {
  const icon = p.type === 'geosite' ? '⛰️' : p.type === 'hotel' ? '🏨' : '🛍️';
  const m = L.marker([p.lat, p.lng]).bindPopup(`<strong>${icon} ${p.name}</strong><br><small>${p.brgy}</small><br>${p.desc}`);
  m.placeType = p.type;
  m.addTo(map);
  markers.push(m);
  markerMap[p.name] = m;
});

function flyTo(name) {
  const m = markerMap[name];
  if (!m) return;
  document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
  if (!map.hasLayer(m)) m.addTo(map);
  setTimeout(() => {
    map.flyTo(m.getLatLng(), 14, { duration: 1.1 });
    m.openPopup();
  }, 400);
}

document.querySelectorAll('.f-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    markers.forEach(m => {
      if (f === 'all' || m.placeType === f) { if (!map.hasLayer(m)) m.addTo(map); }
      else { if (map.hasLayer(m)) map.removeLayer(m); }
    });
  });
});

document.getElementById('gpsBtn').addEventListener('click', () => {
  const msg = document.getElementById('gpsMsg');
  msg.style.display = 'block';
  msg.textContent = '📡 Finding your location...';
  if (!navigator.geolocation) {
    msg.textContent = 'Geolocation not supported.';
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    let nearest = null, minD = Infinity;
    places.forEach(p => {
      const d = Math.hypot(p.lat - latitude, p.lng - longitude) * 111;
      if (d < minD) { minD = d; nearest = p; }
    });
    L.circleMarker([latitude, longitude], { radius: 8, color: '#27B6A8', fillOpacity: 0.9 }).addTo(map).bindPopup('📍 You are here').openPopup();
    map.flyTo([latitude, longitude], 11);
    msg.innerHTML = `📍 Nearest geopark pin: <strong>${nearest.name}</strong> (${nearest.brgy}) — approx. <strong>${minD.toFixed(1)} km</strong> away.`;
  }, () => {
    msg.textContent = '⚠️ Please enable GPS permissions to find the nearest site.';
  });
});

// =========================================================================
// FULL-SITE EN / BINISAYA (BOHOLANO) TRANSLATOR
// =========================================================================
let currentLang = 'en';

const i18nKeys = {
  en: {
    nav_home: 'Home',
    nav_about: 'About',
    nav_sites: 'Geosites',
    nav_geosites: 'Geosites',
    nav_map: 'Map',
    nav_stay: 'Hotels & Shops',
    nav_history: 'History',
    nav_planner: 'Trip Planner',
    nav_wildlife: 'Wildlife',
    nav_challenge: 'Ranger Challenge',
    cta_more: 'Explore Geopark',
    sec_welcome: 'Welcome to Bohol Island Geopark',
    sub_welcome: 'Geology. Nature. Living Culture.',
    btn_read: 'Read Full History'
  },
  ceb: {
    nav_home: 'Sinugdanan',
    nav_about: 'Mahitungod',
    nav_sites: 'Mga Geosite',
    nav_geosites: 'Mga Geosite',
    nav_map: 'Mapa',
    nav_stay: 'Hotel ug Tindahan',
    nav_history: 'Kasaysayan',
    nav_planner: 'Plano sa Biyahe',
    nav_wildlife: 'Kahalipay sa Kinaiyahan',
    nav_challenge: 'Hagit sa Ranger',
    cta_more: 'Suhira ang Geopark',
    sec_welcome: 'Maayong Pag-abot sa Bohol Island Geopark',
    sub_welcome: 'Kinaiyahan. Kasaysayan. Buhing Kultura.',
    btn_read: 'Basaha ang Kasaysayan'
  }
};

const cebPhraseMap = new Map([
  // Hero & Welcome
  ['Explore the Bohol Island UNESCO Global Geopark', 'Susiha ang Bohol Island UNESCO Global Geopark'],
  ['150 million years of natural formation, living cultural heritage, barrier reefs, and cone-shaped limestone hills across 47 municipalities and 1 city.', '150 ka milyon ka tuig sa natural nga pagkaporma, buhing kultural nga kabilin, mga bahura, ug pormang-kono nga mga bungtod sa 47 ka lungsod ug 1 ka siyudad.'],
  ['Explore Geopark', 'Susiha ang Geopark'],
  ['Welcome to Bohol Island Geopark', 'Maayong Pag-abot sa Bohol Island Geopark'],
  ['Geology. Nature. Living Culture.', 'Heolohiya. Kinaiyahan. Buhing Kultura.'],
  ['Certified in May 2023 as the first and only UNESCO Global Geopark in the Philippines, Bohol occupies an area of 8,808 km² and is home to 1.4 million people.', 'Gisertipikahan niadtong Mayo 2023 isip una ug bugtong UNESCO Global Geopark sa Pilipinas, ang Bohol adunay gidak-on nga 8,808 km² ug pinuy-anan sa 1.4 ka milyon ka tawo.'],
  ['From the ancient 150-million-year-old Alicia Schist to the Chocolate Hills, the Danajon Double Barrier Reef, the 425-hectare Banacon Island mangrove forest, and the endemic Philippine tarsier—experience an extraordinary living landscape.', 'Gikan sa karaang 150-ka-milyon-ka-tuig nga Alicia Schist ngadto sa Chocolate Hills, Danajon Double Barrier Reef, 425-ektaryang katunggan sa Banacon Island, ug ang lumad nga Philippine tarsier—masinati ang talagsaong buhing talan-awon.'],
  ['Read Full History', 'Basaha ang Tibuok Kasaysayan'],

  // Preserving Banner & Geosites
  ['Preserving 150 Million Years of Natural Heritage', 'Pagpreserbar sa 150 Ka Milyon Ka Tuig sa Natural nga Kabilin'],
  ['Undergoing mandatory UNESCO revalidation every four years to uphold world-class geotourism, biodiversity protection, and sustainable community development.', 'Nagpailalom sa mandatory nga revalidation sa UNESCO matag upat ka tuig aron mapadayon ang world-class nga geotourism ug pagpanalipod sa kinaiyahan.'],
  ['Open Interactive Map', 'Ablihi ang Interaktibong Mapa'],
  ['Iconic Geosites & Landmarks', 'Mga Bantogang Geosite ug Talan-awon'],
  ['Tap any geosite card to open its complete geological history, formation timeline, and conservation story.', 'Pindota ang bisan unsang geosite card aron mabasa ang tibuok kasaysayan sa heolohiya ug konserbasyon niini.'],
  ['Myths & Legends of Bohol Geopark', 'Mga Mito ug Sugilanon sa Bohol Geopark'],
  ['Beloved Boholano folktales explaining the Chocolate Hills, mystical caves, rivers, and ancient sacred islands. Tap any card to read the full story.', 'Mga sugilanon sa mga Boholano bahin sa Chocolate Hills, mistikong mga langub, suba, ug karaang sagradong isla. Pindota aron mabasa ang tibuok istorya.'],

  // Quick Facts & Map
  ['Facts About Bohol Island Geopark', 'Mga Kamatuoran Bahin sa Bohol Island Geopark'],
  ['8,808 km² Geopark Area', '8,808 km² nga Gidak-on sa Geopark'],
  ['Encompassing 47 municipalities and 1 city with a population of 1.4 million people.', 'Naglangkob sa 47 ka lungsod ug 1 ka siyudad nga adunay populasyon nga 1.4 ka milyon ka tawo.'],
  ['Certified May 24, 2023', 'Gisertipikahan Mayo 24, 2023'],
  ['First UNESCO Global Geopark in the Philippines, revalidated every four years.', 'Una nga UNESCO Global Geopark sa Pilipinas, ginarevalidate matag upat ka tuig.'],
  ['Rich Biodiversity', 'Dato nga Kinaiyahan'],
  ['Home to the Philippine tarsier and the 425-hectare Banacon Island mangrove forest.', 'Pinuy-anan sa Philippine tarsier ug sa 425-ektaryang katunggan sa Banacon Island.'],
  ['Asin Tibuok & Living Heritage', 'Asin Tibuok ug Buhing Kabilin'],
  ['Interactive & Illustrated Geopark Maps', 'Interaktibo ug Gidibuho nga Mapa sa Geopark'],
  ['Switch between the live GPS pin map and the illustrated “Balik sa Bohol” cultural & adventure map.', 'Pagbalhin tali sa live GPS pin map ug sa gidibuho nga mapa sa kultura ug panaw sa “Balik sa Bohol”.'],

  // Hotels & Shops
  ['Suggestions of Near Hotels', 'Mga Sugyot nga Duol nga Hotel'],
  ['Curated resorts and eco-stays near Bohol’s key geopark sites.', 'Pinili nga mga resort ug eco-stay duol sa mga importanteng lugar sa geopark sa Bohol.'],
  ['Suggestions of Near Souvenirs', 'Mga Sugyot nga Duol nga Tindahan sa Souvenir'],
  ['Local shops for Boholano delicacies, crafts, and pasalubong.', 'Lokal nga mga tindahan alang sa mga pagkaon, buhat sa kamot, ug pasalubong sa Bohol.'],

  // History & Events
  ['History & Important Events', 'Kasaysayan ug Importante nga mga Panghitabo'],
  ['Unfolding across two distinct timelines: millions of years of natural formation, followed by a decade-long institutional push to secure international protection.', 'Nagpakita sa duha ka managlahing linya sa panahon: minilyon ka tuig sa natural nga pagkaporma, gisundan sa paningkamot alang sa internasyonal nga proteksyon.'],
  ['Geological Formation Timeline', 'Kasaysayan sa Pagkaporma sa Yuta'],
  ['Institutional & UNESCO Timeline', 'Kasaysayan sa Institusyon ug UNESCO'],

  // Trip Planner & Ambient Audio
  ['Visitor Companion & Trip Planner', 'Giya sa Bisita ug Plano sa Biyahe'],
  ['Plan your route, listen to field soundscapes, check seasonal conditions, and learn local Boholano phrases.', 'Planoha ang imong ruta, paminaw sa mga tingog sa kinaiyahan, susiha ang panahon, ug pagkat-on og Binisaya.'],
  ['Bohol Island Climate & Reef Visibility', 'Klima sa Isla sa Bohol ug Kahimtang sa Dagat'],
  ['Sounds of the Geopark', 'Mga Tingog sa Geopark'],
  ['Plan Your Geopark Adventure', 'Planoha ang Imong Panaw sa Geopark'],
  ['Not sure where to start across 47 municipalities and 1 city? Open our curated step-by-step route planner.', 'Wala ka kabalo asa magsugod sa 47 ka lungsod ug 1 ka siyudad? Ablihi ang among giya nga plano sa biyahe.'],
  ['Build My Geopark Itinerary', 'Himoa ang Akong Itineraryo'],
  ['Speak Local Binisaya', 'Sulti og Lokal nga Binisaya'],
  ['Greet locals warmly in Boholano. Open our pocket phrasebook with one-tap copy and pronunciation guides.', 'Timbayaa ang mga lokal sa mainitong Binisaya. Ablihi ang among listahan sa mga pulong.'],
  ['Open Boholano Phrasebook', 'Ablihi ang Phrasebook sa Binisaya'],

  // Protected Geopark Biodiversity
  ['Protected Geopark Biodiversity', 'Gipanalipdan nga Kinaiyahan sa Geopark'],
  ['Explore the rare primates, gliding mammals, forest-canopy lizards, and centuries-old mangrove sanctuaries thriving across Bohol.', 'Ilha ang talagsaong mga mananap, lumad nga mga hayop sa kalasangan, ug karaang katunggan nga nabuhi sa Bohol.'],

  // Ranger Challenge & Guardian
  ['Are You a True Bohol Geopark Explorer?', 'Tinuod Ka Ba nga Tigsuhid sa Bohol Geopark?'],
  ['Take the Quiz & Earn Your Pass', 'Tubaga ang Pasulit ug Kuhaa ang Imong Pass'],
  ['Guardian of the Geopark', 'Magbalantay sa Geopark'],
  ['Ask Mawmaw', 'Pangutana kang Mawmaw']
]);

const originalTextStore = new WeakMap();

function applyFullSiteTranslation(targetLang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18nKeys[targetLang] && i18nKeys[targetLang][key]) {
      el.textContent = i18nKeys[targetLang][key];
    }
  });

  const candidates = document.querySelectorAll('h1, h2, h3, h4, p, button, .btn-amber, .hero-cta, cite');
  candidates.forEach(el => {
    if (el.id === 'langBtn' || el.querySelector('input, canvas, select')) return;

    if (!originalTextStore.has(el)) {
      originalTextStore.set(el, el.innerHTML);
    }

    const origHTML = originalTextStore.get(el);
    const cleanText = el.textContent.replace(/\s+/g, ' ').trim();

    if (targetLang === 'ceb') {
      if (cebPhraseMap.has(cleanText)) {
        el.textContent = cebPhraseMap.get(cleanText);
      }
    } else {
      el.innerHTML = origHTML;
    }
  });
}

const langBtn = document.getElementById('langBtn');
if (langBtn) {
  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ceb' : 'en';
    langBtn.textContent = currentLang === 'en' ? ' EN / Binisaya' : ' Binisaya / EN';
    applyFullSiteTranslation(currentLang);
  });
}

const itineraries = {
  day1: [
    { time: '07:30 AM · Carmen', desc: 'Sunrise viewpoint at the Chocolate Hills & local handicraft stop at Nel Nel Souvenir Shop.' },
    { time: '10:30 AM · Corella / Bilar', desc: 'Silent guided walk inside the Philippine Tarsier (Mawmag) Sanctuary.' },
    { time: '12:30 PM · Loboc', desc: 'Eco-cultural river cruise along the emerald Loboc River.' },
    { time: '03:30 PM · Alburquerque', desc: 'Witness traditional Asin Tibuok clay-pot salt making before returning to Tagbilaran.' }
  ],
  day3: [
    { time: 'Day 1 · Central Karst & River', desc: 'Chocolate Hills in Carmen, Tarsier Sanctuary, and Loboc River eco-stay.' },
    { time: 'Day 2 · Northern Reef & Mangroves', desc: 'Boat excursion to Danajon Double Barrier Reef and Banacon Island’s 425-ha mangrove forest.' },
    { time: 'Day 3 · Ancient Rock & Uplifted Coast', desc: 'Hike the 150M-year-old Alicia Schist in Cambaol and walk the 2013 uplifted marine terrace in Maribojoc & Loon.' }
  ]
};

function renderItinerary(key) {
  const container = document.getElementById('itinContent');
  container.innerHTML = itineraries[key].map(item => `
    <div class="itin-step">
      <strong>${item.time}</strong>
      <span>${item.desc}</span>
    </div>
  `).join('');
}
renderItinerary('day1');

document.querySelectorAll('.itab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.itab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderItinerary(btn.dataset.plan);
  });
});

const ecoChecks = document.querySelectorAll('#ecoList input');
const ecoBadge = document.getElementById('ecoBadge');
const ecoCount = document.getElementById('ecoCount');
const ecoBarFill = document.getElementById('ecoBarFill');

ecoChecks.forEach(cb => {
  cb.addEventListener('change', () => {
    const checkedCount = Array.from(ecoChecks).filter(c => c.checked).length;
    ecoCount.textContent = `${checkedCount} / ${ecoChecks.length} Pledged`;
    ecoBarFill.style.width = `${(checkedCount / ecoChecks.length) * 100}%`;
    ecoBadge.style.display = checkedCount === ecoChecks.length ? 'block' : 'none';
  });
});

let audioCtx = null;
let activeNode = null;
let activeSound = null;
let chirpTimer = null;

function stopAmbient() {
  if (chirpTimer) {
    clearInterval(chirpTimer);
    chirpTimer = null;
  }
  if (activeNode) {
    try { activeNode.stop(); } catch (e) {}
    activeNode.disconnect();
    activeNode = null;
  }
  activeSound = null;
  document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('playing'));
  document.getElementById('audioStatus').textContent = 'Tap to play';
}

function triggerTarsierChirp() {
  if (!audioCtx || activeSound !== 'tarsier') return;
  const now = audioCtx.currentTime;
  [0, 0.16].forEach((offset, idx) => {
    const osc = audioCtx.createOscillator();
    const chirpGain = audioCtx.createGain();
    osc.type = 'sine';
    const baseFreq = idx === 0 ? 4600 : 5200;
    osc.frequency.setValueAtTime(baseFreq, now + offset);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.28, now + offset + 0.06);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, now + offset + 0.13);

    chirpGain.gain.setValueAtTime(0.0001, now + offset);
    chirpGain.gain.exponentialRampToValueAtTime(0.07, now + offset + 0.02);
    chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.13);

    osc.connect(chirpGain);
    chirpGain.connect(audioCtx.destination);
    osc.start(now + offset);
    osc.stop(now + offset + 0.14);
  });
}

function playAmbient(type, btn) {
  if (activeSound === type) {
    stopAmbient();
    return;
  }
  stopAmbient();

  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const bufferSize = audioCtx.sampleRate * 3;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = type === 'hearth' ? (Math.random() > 0.996 ? white * 0.9 : white * 0.08) : white * 0.25;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  if (type === 'river') {
    filter.type = 'bandpass';
    filter.frequency.value = 420;
    filter.Q.value = 1.4;
    gain.gain.value = 0.22;
  } else if (type === 'forest' || type === 'tarsier') {
    filter.type = 'lowpass';
    filter.frequency.value = 280;
    gain.gain.value = type === 'tarsier' ? 0.16 : 0.28;
  } else {
    filter.type = 'highpass';
    filter.frequency.value = 700;
    gain.gain.value = 0.18;
  }

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();

  activeNode = noise;
  activeSound = type;
  btn.classList.add('playing');
  document.getElementById('audioStatus').textContent = '🔊 Playing ambient audio...';

  if (type === 'tarsier') {
    triggerTarsierChirp();
    chirpTimer = setInterval(() => {
      if (Math.random() > 0.25) triggerTarsierChirp();
    }, 2400);
  }
}

document.querySelectorAll('.sound-btn').forEach(btn => {
  btn.addEventListener('click', () => playAmbient(btn.dataset.sound, btn));
});


const eras = [
  {
    year: '150M – 66M Years Ago',
    title: 'Ancient Ocean Floor & Alicia Schist',
    desc: 'Intense tectonic pressure deep beneath the ancient sea floor metamorphosed marine sediments into the Alicia Schist—the oldest rock foundation on Bohol Island.',
    pins: [
      { x: 0.52, y: 0.36, title: 'Ancient Proto-Sea', text: 'Deep marine basin covering Bohol before tectonic uplift.' },
      { x: 0.34, y: 0.68, title: 'Alicia Schist Crust', text: 'High-pressure metamorphic rock—Bohol’s 150M-year-old foundation.' }
    ]
  },
  {
    year: 'Early Cretaceous',
    title: 'Bohol Ophiolite & Volcanic Uplift',
    desc: 'Subterranean magma and colliding tectonic plates thrust dense oceanic crust upward above the waves.',
    pins: [
      { x: 0.50, y: 0.36, title: 'Emerging Ophiolite Ridge', text: 'Dense oceanic crust forced upward by plate collision.' },
      { x: 0.66, y: 0.70, title: 'Magma & Tectonic Heat', text: 'Subterranean mantle pressure driving island emergence.' }
    ]
  },
  {
    year: 'Eocene to Pliocene Epochs',
    title: 'Shallow Seas & Coral Limestone Beds',
    desc: 'Warm tropical seas allowed vast coral reefs and marine shells to accumulate into thick, porous limestone strata.',
    pins: [
      { x: 0.48, y: 0.38, title: 'Thriving Coral Atolls', text: 'Living coral reefs thriving in warm sunlit shallow seas.' },
      { x: 0.35, y: 0.64, title: 'Maribojoc Limestone Bed', text: 'Compressed marine shells forming thick carbonate rock layers.' }
    ]
  },
  {
    year: '2M to 5M Years Ago',
    title: 'Carving of the Chocolate Hills',
    desc: 'Rainwater dissolution and weathering sculpted the uplifted coral limestone into over 1,200 symmetrical cone-shaped Chocolate Hills.',
    pins: [
      { x: 0.48, y: 0.32, title: '1,268+ Karst Cones', text: 'Sculpted by rainwater dissolving fractured limestone over millennia.' },
      { x: 0.72, y: 0.52, title: 'Subterranean Caves', text: 'Underground rainwater drainage carving caverns beneath Carmen.' }
    ]
  },
  {
    year: 'October 15, 2013',
    title: '7.2 Earthquake & Uplifted Marine Terrace',
    desc: 'A powerful earthquake instantly lifted the coastal seabed in Maribojoc and Loon by 1.5 meters, exposing a dramatic new rocky terrace.',
    pins: [
      { x: 0.36, y: 0.38, title: '+1.5m Uplifted Terrace', text: 'Former coral reef floor thrust abruptly above high tide in Loon & Maribojoc.' },
      { x: 0.58, y: 0.64, title: 'North Bohol Fault Scarp', text: 'Tectonic slip plane that triggered the October 2013 rupture.' }
    ]
  }
];

let targetSliderVal = 0;
let smoothVal = 0;
let lastNearestEra = 0;
let mouseTiltX = 0;
let mouseTiltY = 0;
let shakeTimer = 0;
let activePinObjs = [];

const geoCanvas = document.getElementById('geoCanvas');
const gCtx = geoCanvas.getContext('2d');
const pinTooltip = document.getElementById('pinTooltip');
const eraSlider = document.getElementById('eraSlider');

const particles = Array.from({ length: 28 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: 1.5 + Math.random() * 2.5,
  spd: 0.002 + Math.random() * 0.004
}));

function clamp01(v) { return Math.max(0, Math.min(1, v)); }
function bell(val, center, width = 1) { return clamp01(1 - Math.abs(val - center) / width); }

function updateEraMetadata(nearestIdx) {
  if (nearestIdx === lastNearestEra) return;
  lastNearestEra = nearestIdx;
  const e = eras[nearestIdx];
  const badgeEl = document.getElementById('eraYearBadge');
  if (badgeEl) badgeEl.textContent = e.year;

  document.querySelectorAll('.era-tick-btn').forEach((b, i) => b.classList.toggle('active', i === nearestIdx));
  document.querySelectorAll('.tl-era-item').forEach((li, i) => li.classList.toggle('active', i === nearestIdx));
  pinTooltip.style.display = 'none';
  if (nearestIdx === 4) shakeTimer = 22;
}

document.querySelectorAll('.tl-era-item').forEach(li => {
  li.addEventListener('click', () => {
    const idx = Number(li.dataset.era);
    eraSlider.value = idx;
    targetSliderVal = idx;
    updateEraMetadata(idx);
  });
});

function handlePointerTilt(clientX, clientY) {
  const rect = geoCanvas.getBoundingClientRect();
  const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
  const ny = ((clientY - rect.top) / rect.height - 0.5) * 2;
  mouseTiltX = nx * 15;
  mouseTiltY = ny * 9;
}

geoCanvas.addEventListener('mousemove', e => handlePointerTilt(e.clientX, e.clientY));
geoCanvas.addEventListener('touchmove', e => {
  if (e.touches.length) handlePointerTilt(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });
geoCanvas.addEventListener('mouseleave', () => { mouseTiltX = 0; mouseTiltY = 0; });
geoCanvas.addEventListener('touchend', () => { mouseTiltX = 0; mouseTiltY = 0; });

geoCanvas.addEventListener('click', e => {
  const rect = geoCanvas.getBoundingClientRect();
  const cx = (e.clientX - rect.left) * (geoCanvas.width / rect.width);
  const cy = (e.clientY - rect.top) * (geoCanvas.height / rect.height);

  let hit = null;
  activePinObjs.forEach(p => {
    if (Math.hypot(cx - p.px, cy - p.py) < 22) hit = p;
  });

  if (hit) {
    pinTooltip.innerHTML = `<strong>📍 ${hit.title}</strong>${hit.text}`;
    pinTooltip.style.display = 'block';
  } else {
    pinTooltip.style.display = 'none';
  }
});

function drawIsoBlock(ctx, cx, cy, rx, ry, depth, topColor, leftColor, rightColor) {
  if (depth <= 0.5) return;
  ctx.fillStyle = leftColor;
  ctx.beginPath();
  ctx.moveTo(cx - rx, cy);
  ctx.lineTo(cx, cy + ry);
  ctx.lineTo(cx, cy + ry + depth);
  ctx.lineTo(cx - rx, cy + depth);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = rightColor;
  ctx.beginPath();
  ctx.moveTo(cx + rx, cy);
  ctx.lineTo(cx, cy + ry);
  ctx.lineTo(cx, cy + ry + depth);
  ctx.lineTo(cx + rx, cy + depth);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = topColor;
  ctx.beginPath();
  ctx.moveTo(cx, cy - ry);
  ctx.lineTo(cx + rx, cy);
  ctx.lineTo(cx, cy + ry);
  ctx.lineTo(cx - rx, cy);
  ctx.closePath();
  ctx.fill();
}

function animateDiorama(ts) {
  const t = ts * 0.001;
  smoothVal += (targetSliderVal - smoothVal) * 0.1;

  const w = geoCanvas.width;
  const h = geoCanvas.height;
  gCtx.clearRect(0, 0, w, h);

  const bgGrad = gCtx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#091922');
  bgGrad.addColorStop(1, '#123842');
  gCtx.fillStyle = bgGrad;
  gCtx.fillRect(0, 0, w, h);

  gCtx.strokeStyle = 'rgba(39, 182, 168, 0.08)';
  gCtx.lineWidth = 1;
  for (let gx = 0; gx < w; gx += 32) {
    gCtx.beginPath(); gCtx.moveTo(gx, 0); gCtx.lineTo(gx, h); gCtx.stroke();
  }

  let sx = 0, sy = 0;
  if (shakeTimer > 0) {
    sx = (Math.random() - 0.5) * 9;
    sy = (Math.random() - 0.5) * 9;
    shakeTimer--;
  }

  const cx = w * 0.5 + mouseTiltX + sx;
  const cy = h * 0.46 + Math.sin(t * 1.8) * 3 + mouseTiltY + sy;
  const rx = 175;
  const ry = 66;


  const wOcean   = bell(smoothVal, 0, 1);
  const wUplift  = bell(smoothVal, 1, 1);
  const wReef    = bell(smoothVal, 2, 1);
  const wHills   = bell(smoothVal, 3, 1);
  const wTerrace = bell(smoothVal, 4, 1);

  gCtx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  gCtx.beginPath();
  gCtx.ellipse(cx, cy + 112, rx * 0.88, ry * 0.72, 0, 0, Math.PI * 2);
  gCtx.fill();

  const schistLift = wUplift * 14;
  drawIsoBlock(gCtx, cx, cy + 42 - schistLift, rx, ry, 44 + schistLift, '#334155', '#1E293B', '#0F172A');

  if (wUplift > 0.02) {
    drawIsoBlock(gCtx, cx, cy + 28 - wUplift * 16, rx * 0.96, ry * 0.96, 26 * wUplift, '#EA580C', '#C2410C', '#9A3412');
    drawIsoBlock(gCtx, cx, cy + 14 - wUplift * 24, rx * 0.88, ry * 0.88, 30 * wUplift, '#64748B', '#475569', '#334155');
  }


  const limeWeight = clamp01(wReef + wHills);
  if (limeWeight > 0.02) {
    const limeDepth = 28 * limeWeight;
    drawIsoBlock(gCtx, cx, cy + 42 - limeDepth, rx, ry, limeDepth, '#E2E8F0', '#CBD5E1', '#94A3B8');
  }

 
  const waterWeight = clamp01(wOcean + wReef * 0.85);
  if (waterWeight > 0.02) {
    const wave = Math.sin(t * 2.4) * 2.5;
    const waterDepth = (wOcean * 42 + wReef * 22);
    const waterTopY = cy + 42 - (wReef * 28) - waterDepth + wave;
    drawIsoBlock(
      gCtx, cx, waterTopY, rx, ry, waterDepth,
      `rgba(14, 165, 233, ${0.72 * waterWeight})`,
      `rgba(2, 132, 199, ${0.78 * waterWeight})`,
      `rgba(3, 105, 161, ${0.85 * waterWeight})`
    );
  }


  if (wReef > 0.05) {
    [[-55, -6], [0, -16], [52, 4], [-18, 16], [30, -14]].forEach(([ox, oy], i) => {
      gCtx.fillStyle = i % 2 === 0 ? '#F59E0B' : '#FB7185';
      gCtx.beginPath();
      gCtx.arc(cx + ox, cy + 14 + oy, 9 * wReef, Math.PI, 0);
      gCtx.fill();
    });
  }

  if (wHills > 0.02) {
    drawIsoBlock(gCtx, cx, cy + 8, rx, ry, 8 * wHills, '#22C55E', '#16A34A', '#15803D');
    const cones = [
      { ox: -68, oy: -2, r: 30, h: 36 },
      { ox: 0, oy: -22, r: 36, h: 46 },
      { ox: 68, oy: -2, r: 30, h: 36 },
      { ox: -34, oy: 18, r: 32, h: 40 },
      { ox: 36, oy: 18, r: 32, h: 40 }
    ];
    cones.forEach(c => {
      const ch = c.h * wHills;
      const cr = c.r * (0.4 + 0.6 * wHills);
      const cGrad = gCtx.createLinearGradient(cx + c.ox - cr, cy + c.oy, cx + c.ox + cr, cy + c.oy);
      cGrad.addColorStop(0, '#92400E');
      cGrad.addColorStop(0.55, '#78350F');
      cGrad.addColorStop(1, '#451A03');
      gCtx.fillStyle = cGrad;
      gCtx.beginPath();
      gCtx.moveTo(cx + c.ox - cr, cy + c.oy + 6);
      gCtx.quadraticCurveTo(cx + c.ox, cy + c.oy + 6 - ch * 1.45, cx + c.ox + cr, cy + c.oy + 6);
      gCtx.closePath();
      gCtx.fill();
    });
  }


  if (wTerrace > 0.02) {
    const liftOffset = wTerrace * 22;
    drawIsoBlock(gCtx, cx - 32, cy + 12 - liftOffset, rx * 0.65, ry * 0.65, 44 * wTerrace, '#E2E8F0', '#CBD5E1', '#94A3B8');
    drawIsoBlock(
      gCtx, cx + 48, cy + 18 + Math.sin(t * 2.5) * 2, rx * 0.58, ry * 0.58, 28 * wTerrace,
      `rgba(14, 165, 233, ${0.78 * wTerrace})`,
      `rgba(2, 132, 199, ${0.85 * wTerrace})`,
      `rgba(3, 105, 161, ${0.9 * wTerrace})`
    );
  }

 
  particles.forEach(p => {
    p.y += wHills > 0.5 ? p.spd * 2.2 : -p.spd;
    if (p.y < 0.08) p.y = 0.85;
    if (p.y > 0.85) p.y = 0.08;

    const px = cx - rx * 0.75 + p.x * rx * 1.5;
    const py = cy - 45 + p.y * 110;
    gCtx.fillStyle =
      wUplift > 0.5 ? 'rgba(251, 146, 60, 0.75)' :
      wHills > 0.5 ? 'rgba(186, 230, 253, 0.55)' :
      'rgba(255, 255, 255, 0.45)';
    gCtx.beginPath();
    gCtx.arc(px, py, wHills > 0.5 ? 1.3 : p.r, 0, Math.PI * 2);
    gCtx.fill();
  });


  const activeEra = eras[lastNearestEra];
  activePinObjs = activeEra.pins.map(pin => {
    const px = pin.x * w + mouseTiltX * 0.7;
    const py = pin.y * h + mouseTiltY * 0.7 + Math.sin(t * 3.5) * 3;
    const pulse = 11 + Math.sin(t * 5) * 3;

    gCtx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
    gCtx.lineWidth = 2;
    gCtx.beginPath();
    gCtx.arc(px, py, pulse, 0, Math.PI * 2);
    gCtx.stroke();

    gCtx.fillStyle = '#F59E0B';
    gCtx.beginPath();
    gCtx.arc(px, py, 9, 0, Math.PI * 2);
    gCtx.fill();

    gCtx.fillStyle = '#0F292E';
    gCtx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
    gCtx.textAlign = 'center';
    gCtx.fillText('!', px, py + 4);
    gCtx.textAlign = 'left';

    return { ...pin, px, py };
  });

  requestAnimationFrame(animateDiorama);
}
requestAnimationFrame(animateDiorama);

const quizData = [
  {
    q: '1. When was Bohol officially designated as the first UNESCO Global Geopark in the Philippines?',
    opts: ['May 24, 2023', 'October 15, 2013', 'December 2025'],
    ans: 0
  },
  {
    q: '2. Which ancient metamorphic formation is the oldest rock foundation on Bohol Island?',
    opts: ['Chocolate Hills Karst', 'Alicia Schist', 'Banacon Reef'],
    ans: 1
  },
  {
    q: '3. What local Visayan word for the Philippine tarsier inspired the Geopark guardian Mawmaw?',
    opts: ['Cagwang', 'Mawmag', 'Sandugo'],
    ans: 1
  },
  {
    q: '4. What traditional Boholano artisanal salt is boiled inside clay pots over coconut husks?',
    opts: ['Asin Tibuok', 'Kalamay', 'Tablea'],
    ans: 0
  }
];

let qIdx = 0;
function loadQuiz() {
  const item = quizData[qIdx];
  document.getElementById('quizProgress').textContent = `Question ${qIdx + 1} of ${quizData.length}`;
  document.getElementById('quizQuestion').textContent = item.q;
  document.getElementById('quizFeedback').textContent = '';
  const optsEl = document.getElementById('quizOptions');
  optsEl.innerHTML = '';

  item.opts.forEach((optText, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'q-opt';
    btn.textContent = optText;
    btn.addEventListener('click', () => {
      if (i === item.ans) {
        btn.classList.add('correct');
        document.getElementById('quizFeedback').textContent = '✓ Correct!';
        setTimeout(() => {
          qIdx++;
          if (qIdx < quizData.length) {
            loadQuiz();
          } else {
            document.getElementById('quizBox').style.display = 'none';
            document.getElementById('quizProgress').textContent = 'Completed!';
            document.getElementById('passBox').style.display = 'block';
            renderRangerBadge('Bohol Explorer');
          }
        }, 650);
      } else {
        btn.classList.add('wrong');
        document.getElementById('quizFeedback').textContent = 'Try again!';
      }
    });
    optsEl.appendChild(btn);
  });
}

function renderRangerBadge(nameText) {
  const c = document.getElementById('badgeCanvas');
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0F292E');
  grad.addColorStop(1, '#1A8F83');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 4;
  ctx.strokeRect(12, 12, w - 24, h - 24);

  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
  ctx.fillText('BOHOL ISLAND UNESCO GLOBAL GEOPARK', 30, 44);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.fillText('Honorary Geopark Ranger', 30, 82);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '13px Plus Jakarta Sans, sans-serif';
  ctx.fillText('Awarded to:', 30, 118);

  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
  ctx.fillText(nameText || 'Bohol Explorer', 30, 148);

  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '11px Plus Jakarta Sans, sans-serif';
  ctx.fillText('47 Municipalities & 1 City · Guardian Mawmaw Certified', 30, 186);
}

document.getElementById('rangerName').addEventListener('input', e => {
  renderRangerBadge(e.target.value.trim() || 'Bohol Explorer');
});

document.getElementById('downloadPassBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'Bohol-Geopark-Ranger-Pass.png';
  link.href = document.getElementById('badgeCanvas').toDataURL('image/png');
  link.click();
});

const mawmawAnswers = {
  hills: '🍫 The Chocolate Hills turn rich cocoa-brown during the dry season (roughly <strong>December to May</strong>) when the grass covering the limestone mounds dries under the tropical sun!',
  transit: '🚌 From <strong>Tagbilaran City</strong> (Dao Integrated Bus Terminal), take a bus or van bound for <strong>Carmen</strong> (about 1 to 1.5 hours) to reach the Chocolate Hills Complex in Brgy. Buenos Aires.',
  salt: '🏺 Traditional <strong>Asin Tibuok</strong> artisans are concentrated in <strong>Alburquerque</strong> (just east of Tagbilaran along the coastal highway), where seawater is filtered through coconut husk ash and boiled in clay pots.',
  tarsier: '🐒 When visiting the <strong>Philippine Tarsier (Mawmag)</strong>: stay quiet, never touch them, and turn off camera flash—loud noises and bright lights cause severe stress to these tiny nocturnal primates.'
};

const drawer = document.getElementById('mawmawDrawer');
document.getElementById('openMawmaw').addEventListener('click', () => drawer.classList.toggle('open'));
document.getElementById('closeMawmaw').addEventListener('click', () => drawer.classList.remove('open'));
document.querySelectorAll('.md-qs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('mawmawReply').innerHTML = mawmawAnswers[btn.dataset.q];
  });
});
// 11. FULL GEOLOGICAL HISTORY & MYTHS POP-UP MODAL ENGINE
const fullStories = {
  alicia: {
    title: 'Alicia Schist — Bohol’s 150-Million-Year Foundation',
    badge: '📍 Brgy. Cambaol, Alicia',
    era: '⏳ 150M – 66M Years Ago (Jurassic–Cretaceous)',
    img: 'images/alicia-schist.jpg',
    pin: 'Alicia Schist',
    paragraphs: [
      '<strong>Deep Oceanic Origins:</strong> Long before Bohol rose above the waves as a tropical island, its oldest rocks were muds, clays, and volcanic sediments resting at the bottom of an ancient proto-ocean during the Late Jurassic to Early Cretaceous periods.',
      '<strong>Metamorphic Transformation:</strong> As immense tectonic plates collided beneath the Philippine archipelago, intense heat and directional pressure recrystallized those deep-sea sediments into foliated, shimmering metamorphic rock known today as the <em>Alicia Schist</em>.',
      '<strong>Why It Matters Today:</strong> Exposed along riverbeds and hillsides in Barangay Cambaol, Alicia, these banded outcrops serve as the geological basement upon which younger ophiolites and coral limestones were later deposited—making it the essential starting chapter of Bohol’s UNESCO Global Geopark story.'
    ]
  },
  danajon: {
    title: 'Danajon Double Barrier Reef & Banacon Mangroves',
    badge: '📍 Northern Bohol Coast & Getafe',
    era: '⏳ 2M – 5M Years Ago to Present',
    img: 'images/danajon-reef.jpg',
    pin: 'Danajon Double Barrier Reef',
    paragraphs: [
      '<strong>One of Only Six in the World:</strong> Stretching nearly 130 kilometers off northern Bohol, the Danajon Bank is the only double barrier reef in the Philippines and one of only a handful documented on Earth.',
      '<strong>How a Double Barrier Forms:</strong> Two distinct parallel coral ridges developed over thousands of years through a rare combination of favorable tidal currents, fluctuating Pleistocene sea levels, and steady tectonic subsidence—creating an outer reef wall and an inner lagoon reef.',
      '<strong>Living Marine Nursery:</strong> Sheltered behind the reef lies the 425-hectare Banacon Island Mangrove Forest, one of Asia’s largest community-planted mangrove sanctuaries, sustaining juvenile reef fish, sea turtles, and coastal fisherfolk.'
    ]
  },
  terrace: {
    title: 'Uplifted Marine Terrace of Maribojoc & Loon',
    badge: '📍 Maribojoc & Loon Western Coast',
    era: '⏳ October 15, 2013 (08:12 AM)',
    img: 'images/marine-terrace.jpg',
    pin: 'Uplifted Marine Terrace',
    paragraphs: [
      '<strong>Geology in Real Time:</strong> Most geological formations take millions of years to emerge, but on October 15, 2013, a magnitude 7.2 earthquake along the previously unmapped North Bohol Fault thrust the western coastline abruptly upward by up to 1.5 meters in seconds.',
      '<strong>From Seabed to Dry Land:</strong> Overnight, what had been a submerged tidal coral flat in Punta Cruz (Maribojoc) and Loon became a wide, bleached limestone shelf littered with fossilized brain corals, giant clams, and tidal pools.',
      '<strong>A Living Outdoor Laboratory:</strong> Today, visitors can walk safely across this newly born rocky terrace to observe tectonic uplift firsthand and see how coastal ecosystems gradually recolonize newly emerged land.'
    ]
  },
  arogo: {
    title: 'The Lovelorn Giant: Arogo and Aloya',
    badge: '📖 Boholano Folklore · Chocolate Hills',
    era: '💕 Legend of Eternal Devotion',
    img: 'images/legend-arogo.jpg',
    pin: 'Chocolate Hills',
    paragraphs: [
      'Long ago, when giants still walked the lush valleys of central Bohol, there lived a young and gentle giant named <strong>Arogo</strong>. Despite his towering stature, Arogo was known across the island for his kind heart.',
      'One day, while wandering near a forest stream, Arogo met <strong>Aloya</strong>, a mortal maiden whose grace and warmth captured his heart completely. Though they came from different worlds, the two fell deeply in love and spent peaceful days together beneath the canopy of Bohol’s ancient trees.',
      'Because Aloya was mortal, illness eventually claimed her life. Heartbroken beyond measure, Arogo knelt over the plains of Carmen and wept for days and nights without end. Each massive teardrop that struck the earth dried under the tropical sun and hardened into a symmetrical mound—forming the more than 1,200 Chocolate Hills as an enduring monument to a giant’s love.'
    ]
  },
  giants: {
    title: 'The Great Battle of the Two Giants',
    badge: '📖 Boholano Folklore · Chocolate Hills',
    era: '⚔️ Legend of Reconciliation',
    img: 'images/legend-giants.jpg',
    pin: 'Chocolate Hills',
    paragraphs: [
      'According to elders in central Bohol, two colossal giants once claimed the same stretch of fertile plateau as their territory. Neither giant was willing to yield a single step, and their heated argument soon shook the mountains.',
      'In their fury, the two giants scooped up massive boulders, river stones, and mounds of earth, hurling them across the valley at one another for days. The sky darkened with flying rocks, and every impact piled up towering heaps of soil and limestone across the plain.',
      'Exhausted and bruised after days of battle, both giants realized neither could defeat the other. Laughing at their own stubbornness, they clasped hands, made peace, and left the island together—forgetting to clean up the hundreds of symmetrical mounds scattered behind them.'
    ]
  },
  carabao: {
    title: 'The Giant Crop-Eating Carabao',
    badge: '📖 Boholano Folklore · Chocolate Hills',
    era: '🐃 Humorous Village Folktale',
    img: 'images/legend-carabao.jpg',
    pin: 'Chocolate Hills',
    paragraphs: [
      'In a lighthearted version passed down by Boholano farmers, a gargantuan carabao once roamed the central plains, devouring entire harvests of rice, sweet potatoes, and corn in a single night.',
      'Desperate to save their livelihoods, the clever villagers gathered all the spoiled, fermented food they could find and piled it in the center of the valley as bait. The greedy giant carabao ate every last bite.',
      'Soon after, the beast suffered an enormous stomachache and left behind towering, symmetrical mounds of waste across the fields before fleeing the island. Over the centuries, sun and rain covered the mounds in lush green grass that turns cocoa-brown every summer.'
    ]
  },
  hinagdanan: {
    title: 'The Legend of Hinagdanan Cave',
    badge: '📍 Bingag, Dauis · Panglao Island',
    era: '🪜 Legend of Discovery',
    img: 'images/chocolate-hills.jpg',
    pin: 'Ocean Suites',
    paragraphs: [
      'Centuries ago on Panglao Island, a local farmer was clearing thick brush on his rocky land in Barangay Bingag when he noticed a narrow opening hidden beneath tangled vines.',
      'Curious about how deep the hole went, he dropped a stone inside and waited—hearing a clear, echoing splash from far below. Determined to explore the cavern, he wove a sturdy wooden ladder (called a <em>hagdan</em> in Binisaya) and descended into the cool darkness.',
      'Shafts of sunlight piercing through natural skylights illuminated shimmering stalactites and a crystal-clear underground freshwater lagoon. Villagers named the sanctuary <strong>Hinagdanan</strong> (“laddered”) in honor of the farmer’s handmade ladder.'
    ]
  },
  loboc: {
    title: 'The Sacred Golden Bell of Loboc River',
    badge: '📍 Loboc Municipality',
    era: '🔔 River Folklore',
    img: 'images/danajon-reef.jpg',
    pin: 'Loboc River Resort',
    paragraphs: [
      'Along the emerald waters of the Loboc River, elders tell the tale of a magnificent golden church bell whose clear chime could once be heard across the surrounding hills and valleys.',
      'When news arrived that coastal raiders were sailing upriver to plunder the town’s treasures, the townspeople worked through the night to lower the heavy golden bell into the deepest bend of the Loboc River so it would never fall into enemy hands.',
      'Legend says that on quiet, moonlit nights, boatmen paddling softly along the river can still hear a faint, resonant hum rising from beneath the calm green current.'
    ]
  },
  lamanok: {
    title: 'The Mystical Spirits of Lamanok Island',
    badge: '📍 Anda Peninsula · Eastern Bohol',
    era: '🕯️ Ancient Shamanic Lore',
    img: 'images/alicia-schist.jpg',
    pin: 'Solea Reef Resort Anda',
    paragraphs: [
      'Rising dramatically from turquoise waters off Anda, Lamanok Island is revered in Boholano oral tradition as the sacred dwelling place of ancient spirits and the cradle of Bohol’s early <em>babaylan</em> (indigenous healers and shamans).',
      'Local lore holds that ancestral shamans paddled wooden dugout boats into Lamanok’s sea-carved limestone caves at dawn to offer prayers for bountiful harvests, safe voyages, and healing—leaving behind red hematite handprints on the cavern walls and ancient wooden boat-coffins.',
      'Even today, local boatmen gently ask permission (<em>“Tabi po”</em>) before stepping onto the island’s boardwalk, honoring centuries of living spiritual heritage.'
    ]
  }
};

const storyModal = document.getElementById('storyModal');
const closeStoryModalBtn = document.getElementById('closeStoryModal');
const modalDoneBtn = document.getElementById('modalDoneBtn');
const modalMapBtn = document.getElementById('modalMapBtn');
let currentModalPin = null;

function openStoryModal(key) {
  if (!storyModal || typeof fullStories === 'undefined') return;
  const s = fullStories[key];
  if (!s) return;

  const imgEl = document.getElementById('modalImg');
  const badgeEl = document.getElementById('modalBadge');
  const eraEl = document.getElementById('modalEra');
  const titleEl = document.getElementById('modalTitle');
  const contentEl = document.getElementById('modalContent');
  const modalBody = storyModal.querySelector('.modal-body');

  if (imgEl) {
    imgEl.src = s.img;
    imgEl.alt = s.title;
  }
  if (badgeEl) badgeEl.textContent = s.badge;
  if (eraEl) eraEl.textContent = s.era;
  if (titleEl) titleEl.textContent = s.title;
  if (contentEl) contentEl.innerHTML = s.paragraphs.map(p => `<p>${p}</p>`).join('');
  if (modalBody) modalBody.scrollTop = 0;

  currentModalPin = s.pin;
  storyModal.classList.add('open');
  storyModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeStoryModal() {
  if (!storyModal) return;
  storyModal.classList.remove('open');
  storyModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.clickable-card').forEach(card => {
  card.addEventListener('click', () => openStoryModal(card.dataset.story));
});

if (closeStoryModalBtn) closeStoryModalBtn.addEventListener('click', closeStoryModal);
if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeStoryModal);
if (storyModal) {
  storyModal.addEventListener('click', e => {
    if (e.target === storyModal) closeStoryModal();
  });
}

if (modalMapBtn) {
  modalMapBtn.addEventListener('click', () => {
    closeStoryModal();
    if (currentModalPin) {
      const liveMap = document.getElementById('liveMapView');
      const illusMap = document.getElementById('illustratedMapView');
      const illusBtn = document.getElementById('toggleIllustratedBtn');
      if (liveMap) liveMap.style.display = 'block';
      if (illusMap) illusMap.style.display = 'none';
      if (illusBtn) illusBtn.classList.remove('active');
      if (typeof flyTo === 'function') flyTo(currentModalPin);
    }
  });
}

// 12. ILLUSTRATED "BALIK SA BOHOL" MAP TOGGLE & FULL-SCREEN LIGHTBOX
const toggleIllustratedBtn = document.getElementById('toggleIllustratedBtn');
const liveMapView = document.getElementById('liveMapView');
const illustratedMapView = document.getElementById('illustratedMapView');
const mapLightbox = document.getElementById('mapLightbox');

toggleIllustratedBtn.addEventListener('click', () => {
  const showingIllustrated = illustratedMapView.style.display === 'block';
  if (showingIllustrated) {
    illustratedMapView.style.display = 'none';
    liveMapView.style.display = 'block';
    toggleIllustratedBtn.classList.remove('active');
    setTimeout(() => map.invalidateSize(), 150);
  } else {
    liveMapView.style.display = 'none';
    illustratedMapView.style.display = 'block';
    toggleIllustratedBtn.classList.add('active');
  }
});

// When clicking any normal map filter button, switch back to live map automatically
document.querySelectorAll('.f-btn[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    illustratedMapView.style.display = 'none';
    liveMapView.style.display = 'block';
    toggleIllustratedBtn.classList.remove('active');
    setTimeout(() => map.invalidateSize(), 150);
  });
});

document.getElementById('zoomMapBtn').addEventListener('click', () => mapLightbox.classList.add('open'));
document.getElementById('illustratedMapImg').addEventListener('click', () => mapLightbox.classList.add('open'));
document.getElementById('closeLightbox').addEventListener('click', () => mapLightbox.classList.remove('open'));
mapLightbox.addEventListener('click', e => {
  if (e.target === mapLightbox) mapLightbox.classList.remove('open');
});
// 13. CLICK-TO-REVEAL LAUNCHERS FOR COMPANION TOOLS & RANGER QUIZ
document.querySelectorAll('.reveal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const introEl = document.getElementById(btn.dataset.intro);
    const targetEl = document.getElementById(btn.dataset.target);
    if (introEl) introEl.style.display = 'none';
    if (targetEl) targetEl.style.display = 'block';
  });
});

const startQuizBtn = document.getElementById('startQuizBtn');
if (startQuizBtn) {
  startQuizBtn.addEventListener('click', () => {
    document.getElementById('quizIntro').style.display = 'none';
    document.getElementById('quizBox').style.display = 'block';
    loadQuiz();
  });
}

const wildlifeSlides = [
  {
    tag: 'Endemic Nocturnal Primate',
    title: 'Philippine Tarsier (Mawmag)',
    desc1: 'Known locally in Bohol as the <strong>Mawmag</strong> (<em>Carlito syrichta</em>), this fist-sized nocturnal primate is one of the smallest primates in the world, measuring just 85 to 160 millimeters in body length.',
    desc2: 'Equipped with enormous eyes fixed in its skull for acute night vision, a neck that rotates nearly 180 degrees, and elongated tarsus bones capable of leaping up to 5 meters between branches, the Mawmag thrives in Bohol’s dense secondary forests and bamboo thickets.',
    photos: ['images/tarsier-1.jpg', 'images/tarsier-2.jpg']
  },
  {
    tag: 'Endemic Arboreal Mammal',
    title: 'Philippine Colugo (Cagwang)',
    desc1: 'Known locally as the <strong>Cagwang</strong>, the Philippine colugo is a nocturnal gliding mammal inhabiting Bohol’s secondary limestone forests and lush wooded valleys.',
    desc2: 'Equipped with a wide, fur-covered gliding membrane (<em>patagium</em>) stretching from its neck to the tip of its tail, it can soar silently over 100 meters between forest canopies without descending to the ground.',
    photos: ['images/colugo-1.jpg', 'images/colugo-2.jpg', 'images/colugo-3.jpg']
  },
  {
    tag: 'Canopy Gliding Reptile',
    title: 'Bohol Flying Lizard (Draco sp.)',
    desc1: 'Inhabiting the sunlit trunks of Bohol’s woodland reserves, the <strong>Flying Lizard</strong> uses elongated, movable ribs supporting colorful wing-like membranes to glide effortlessly from tree to tree.',
    desc2: 'Males display a vibrant yellow throat fan (<em>dewlap</em>) along tree bark to communicate territory and attract mates while blending seamlessly into mossy bark.',
    photos: ['images/draco-1.jpg', 'images/draco-2.jpg']
  },
  {
    tag: 'Coastal Marine Sanctuary',
    title: 'Banacon Island Mangrove Ecosystem',
    desc1: 'Located off the northern coast of Getafe, the <strong>Banacon Island Mangrove Forest</strong> spans over 425 hectares—one of Asia’s largest community-planted mangrove sanctuaries.',
    desc2: 'Its intricate labyrinth of stilt roots and tidal channels shelters juvenile reef fish, migratory shorebirds, and coastal communities alongside the Danajon Double Barrier Reef.',
    photos: ['images/banacon-1.jpg', 'images/banacon-2.jpg', 'images/banacon-3.jpg']
  }
];

let wlIdx = 0;
let wlPhotoOffset = 0;
const wlCollage = document.getElementById('wildlifeCollage');
const wlImgMain = document.getElementById('wlImgMain');
const wlImgSub = document.getElementById('wlImgSub');

function renderWildlife(idx) {
  wlIdx = (idx + wildlifeSlides.length) % wildlifeSlides.length;
  wlPhotoOffset = 0;
  const item = wildlifeSlides[wlIdx];

  wlCollage.classList.add('fading');
  setTimeout(() => {
    document.getElementById('wlTag').textContent = item.tag;
    document.getElementById('wlTitle').textContent = item.title;
    document.getElementById('wlDesc1').innerHTML = item.desc1;
    document.getElementById('wlDesc2').innerHTML = item.desc2;

    wlImgMain.src = item.photos[0];
    wlImgSub.src = item.photos[1 % item.photos.length];
    wlCollage.classList.remove('fading');
  }, 180);

  document.querySelectorAll('.wl-dot').forEach((d, i) => d.classList.toggle('active', i === wlIdx));
}

function cycleWildlifePhotos() {
  const photos = wildlifeSlides[wlIdx].photos;
  wlPhotoOffset = (wlPhotoOffset + 1) % photos.length;
  wlCollage.classList.add('fading');
  setTimeout(() => {
    wlImgMain.src = photos[wlPhotoOffset];
    wlImgSub.src = photos[(wlPhotoOffset + 1) % photos.length];
    wlCollage.classList.remove('fading');
  }, 160);
}

let wildlifeSlideTimer = null;
let wildlifePhotoTimer = null;

function resetWildlifeTimers() {
  if (wildlifeSlideTimer) clearInterval(wildlifeSlideTimer);
  if (wildlifePhotoTimer) clearInterval(wildlifePhotoTimer);

  // Swap the secondary/main photo every 2.75s within the active species
  wildlifePhotoTimer = setInterval(() => cycleWildlifePhotos(), 2750);
  // Advance to the next wildlife species every 5.5s
  wildlifeSlideTimer = setInterval(() => renderWildlife(wlIdx + 1), 5500);
}

document.getElementById('prevWildlife').addEventListener('click', () => {
  renderWildlife(wlIdx - 1);
  resetWildlifeTimers();
});
document.getElementById('nextWildlife').addEventListener('click', () => {
  renderWildlife(wlIdx + 1);
  resetWildlifeTimers();
});
document.querySelectorAll('.wl-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    renderWildlife(Number(dot.dataset.widx));
    resetWildlifeTimers();
  });
});
wlImgSub.addEventListener('click', () => {
  cycleWildlifePhotos();
  resetWildlifeTimers();
});

// Pause auto-advance while hovering over the wildlife section
const wildlifeSection = document.getElementById('wildlife');
wildlifeSection.addEventListener('mouseenter', () => {
  clearInterval(wildlifeSlideTimer);
  clearInterval(wildlifePhotoTimer);
});
wildlifeSection.addEventListener('mouseleave', resetWildlifeTimers);
resetWildlifeTimers();

// VISITOR SUGGESTION BOX MODAL
const suggestionModal = document.getElementById('suggestionModal');
const openSuggestionBtn = document.getElementById('openSuggestionModal');
const closeSuggestionBtn = document.getElementById('closeSuggestionModal');

function closeSuggestionModal() {
  if (!suggestionModal) return;
  suggestionModal.classList.remove('open');
  suggestionModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (openSuggestionBtn && suggestionModal) {
  openSuggestionBtn.addEventListener('click', () => {
    suggestionModal.classList.add('open');
    suggestionModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
}

if (closeSuggestionBtn) {
  closeSuggestionBtn.addEventListener('click', closeSuggestionModal);
}

if (suggestionModal) {
  suggestionModal.addEventListener('click', e => {
    if (e.target === suggestionModal) closeSuggestionModal();
  });
}
window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('storyModal');
  if (!modal) return;

  document.querySelectorAll('.clickable-card').forEach(card => {
    card.onclick = () => {
      if (typeof openStoryModal === 'function') {
        openStoryModal(card.dataset.story);
      }
    };
  });

  const closeBtn = document.getElementById('closeStoryModal') || document.getElementById('closeModalBtn');
  const doneBtn = document.getElementById('modalDoneBtn');
  if (closeBtn) closeBtn.onclick = () => { if (typeof closeStoryModal === 'function') closeStoryModal(); };
  if (doneBtn) doneBtn.onclick = () => { if (typeof closeStoryModal === 'function') closeStoryModal(); };
});