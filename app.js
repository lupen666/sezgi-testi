const SUITS = ["♠", "♥", "♣", "♦"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const SUIT_CODE = { "♠": "1", "♥": "2", "♣": "3", "♦": "4" };
const RANK_CODE = {
  A: "01", "2": "02", "3": "03", "4": "04", "5": "05",
  "6": "06", "7": "07", "8": "08", "9": "09", "10": "10",
  J: "11", Q: "12", K: "13"
};
const COURT_LABELS = { A: "AS", J: "VALE", Q: "KIZ", K: "PAPAZ" };

// 2..10 gerçek iskambil pip koordinatları (3 sütun x 7 satır ızgara)
const PIP_LAYOUTS = {
  "2": ["r1-c2", "r7-c2 inv"],
  "3": ["r1-c2", "r4-c2", "r7-c2 inv"],
  "4": ["r1-c1", "r1-c3", "r7-c1 inv", "r7-c3 inv"],
  "5": ["r1-c1", "r1-c3", "r4-c2", "r7-c1 inv", "r7-c3 inv"],
  "6": ["r1-c1", "r1-c3", "r4-c1", "r4-c3", "r7-c1 inv", "r7-c3 inv"],
  "7": ["r1-c1", "r1-c3", "r2-c2", "r4-c1", "r4-c3", "r7-c1 inv", "r7-c3 inv"],
  "8": ["r1-c1", "r1-c3", "r2-c2", "r4-c1", "r4-c3", "r6-c2 inv", "r7-c1 inv", "r7-c3 inv"],
  "9": ["r1-c1", "r1-c3", "r3-c1", "r3-c3", "r4-c2", "r5-c1 inv", "r5-c3 inv", "r7-c1 inv", "r7-c3 inv"],
  "10": ["r1-c1", "r1-c3", "r2-c2", "r3-c1", "r3-c3", "r5-c1 inv", "r5-c3 inv", "r6-c2 inv", "r7-c1 inv", "r7-c3 inv"]
};

// Juan Tamariz Mnemonica 52'lik Deste Sırası (1..52)
const MNEMONICA_STACK = [
  { rank: "4", suit: "♣" }, { rank: "2", suit: "♥" }, { rank: "7", suit: "♦" }, { rank: "3", suit: "♣" },
  { rank: "4", suit: "♥" }, { rank: "6", suit: "♦" }, { rank: "A", suit: "♠" }, { rank: "5", suit: "♥" },
  { rank: "9", suit: "♠" }, { rank: "2", suit: "♠" }, { rank: "Q", suit: "♥" }, { rank: "3", suit: "♦" },
  { rank: "Q", suit: "♣" }, { rank: "8", suit: "♥" }, { rank: "6", suit: "♠" }, { rank: "5", suit: "♠" },
  { rank: "9", suit: "♥" }, { rank: "K", suit: "♣" }, { rank: "2", suit: "♦" }, { rank: "J", suit: "♥" },
  { rank: "3", suit: "♠" }, { rank: "8", suit: "♠" }, { rank: "6", suit: "♥" }, { rank: "10", suit: "♣" },
  { rank: "5", suit: "♦" }, { rank: "K", suit: "♦" }, { rank: "2", suit: "♣" }, { rank: "3", suit: "♥" },
  { rank: "8", suit: "♦" }, { rank: "5", suit: "♣" }, { rank: "K", suit: "♠" }, { rank: "J", suit: "♦" },
  { rank: "8", suit: "♣" }, { rank: "10", suit: "♠" }, { rank: "K", suit: "♥" }, { rank: "J", suit: "♣" },
  { rank: "7", suit: "♠" }, { rank: "10", suit: "♥" }, { rank: "A", suit: "♦" }, { rank: "4", suit: "♠" },
  { rank: "7", suit: "♥" }, { rank: "4", suit: "♦" }, { rank: "A", suit: "♣" }, { rank: "9", suit: "♣" },
  { rank: "J", suit: "♠" }, { rank: "Q", suit: "♦" }, { rank: "7", suit: "♣" }, { rank: "Q", suit: "♠" },
  { rank: "10", suit: "♦" }, { rank: "6", suit: "♣" }, { rank: "A", suit: "♥" }, { rank: "9", suit: "♦" }
];

const state = {
  mode: localStorage.getItem("sb_mode") || "peek", // "peek" | "force" | "thought"
  stackMode: localStorage.getItem("sb_stack") || "random", // "random" | "mnemonica"
  autoDisarm: localStorage.getItem("sb_autodisarm") !== "false",
  sfxEnabled: localStorage.getItem("sb_sfx") !== "false",
  coverTitle: localStorage.getItem("sb_cover_title") || "Sezgi & Algı Testi",
  forceSuit: localStorage.getItem("sb_force_suit") || "♠",
  forceRank: localStorage.getItem("sb_force_rank") || "A",
  thoughtSuit: "♠",
  thoughtRank: "A",
  deck: [],
  convincerOpen: false,
  isShuffling: false,
  isVanishing: false,
  preselectedIndex: null,
  lastPicked: null,
  lastPosition: null,
  cardRevealed: false,
  forceConsumedThisTurn: false
};

// DOM referansları
const brandTitle = document.getElementById("brandTitle");
const brandSubtitle = document.getElementById("brandSubtitle");
const statusDot = document.getElementById("statusDot");
const stageModeTabs = document.getElementById("stageModeTabs");
const tabDeckBtn = document.getElementById("tabDeckBtn");
const tabThoughtBtn = document.getElementById("tabThoughtBtn");
const deckControls = document.getElementById("deckControls");
const convincerBtn = document.getElementById("convincerBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const shuffleStatus = document.getElementById("shuffleStatus");

const deckStage = document.getElementById("deckStage");
const deckViewport = document.getElementById("deckViewport");
const deckTrack = document.getElementById("deckTrack");
const promptText = document.getElementById("promptText");
const preselectBar = document.getElementById("preselectBar");
const preselectPosLabel = document.getElementById("preselectPosLabel");
const cancelPickBtn = document.getElementById("cancelPickBtn");
const confirmPickBtn = document.getElementById("confirmPickBtn");

const thoughtStage = document.getElementById("thoughtStage");
const thoughtSuitGrid = document.getElementById("thoughtSuitGrid");
const thoughtRankGrid = document.getElementById("thoughtRankGrid");
const thoughtPreviewCard = document.getElementById("thoughtPreviewCard");
const sealThoughtBtn = document.getElementById("sealThoughtBtn");

const revealStage = document.getElementById("revealStage");
const revealMetaPill = document.getElementById("revealMetaPill");
const vanishBanner = document.getElementById("vanishBanner");
const card3dScene = document.getElementById("card3dScene");
const revealedCard = document.getElementById("revealedCard");
const revealedCardFront = document.getElementById("revealedCardFront");
const holdPeekBtn = document.getElementById("holdPeekBtn");
const vanishPullBtn = document.getElementById("vanishPullBtn");
const toggleRevealBtn = document.getElementById("toggleRevealBtn");
const hideCardBtn = document.getElementById("hideCardBtn");

const lockedStage = document.getElementById("lockedStage");
const syncHzValue = document.getElementById("syncHzValue");
const focusDepthValue = document.getElementById("focusDepthValue");
const resetGameBtn = document.getElementById("resetGameBtn");
const sessionTag = document.getElementById("sessionTag");

const secretModal = document.getElementById("secretModal");
const closeSecretBtn = document.getElementById("closeSecretBtn");
const saveSecretBtn = document.getElementById("saveSecretBtn");
const modePeekBtn = document.getElementById("modePeekBtn");
const modeForceBtn = document.getElementById("modeForceBtn");
const modeThoughtBtn = document.getElementById("modeThoughtBtn");
const autoDisarmToggle = document.getElementById("autoDisarmToggle");
const sfxToggle = document.getElementById("sfxToggle");
const stackRandomBtn = document.getElementById("stackRandomBtn");
const stackMnemonicaBtn = document.getElementById("stackMnemonicaBtn");
const forcePickerSection = document.getElementById("forcePickerSection");
const forceSuitGrid = document.getElementById("forceSuitGrid");
const forceRankGrid = document.getElementById("forceRankGrid");
const forceTargetSummary = document.getElementById("forceTargetSummary");
const coverTitleSelect = document.getElementById("coverTitleSelect");

// Web Audio API Gerçekçi İskambil Kartı Ses Motoru (White Noise + Bandpass)
let audioCtx = null;
let noiseBuffer = null;

function ensureAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  if (!noiseBuffer) {
    const sampleCount = audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, sampleCount, audioCtx.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      channel[i] = Math.random() * 2 - 1;
    }
    noiseBuffer = buffer;
  }
  return audioCtx;
}

function triggerFilteredNoise(ctx, startAt, duration, freqHz, qVal, peakGain, endFreqHz) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(freqHz, startAt);
  if (endFreqHz) {
    filter.frequency.exponentialRampToValueAtTime(endFreqHz, startAt + duration);
  }
  filter.Q.setValueAtTime(qVal, startAt);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, startAt);
  gain.gain.linearRampToValueAtTime(peakGain, startAt + Math.min(0.004, duration * 0.25));
  gain.gain.exponentialRampToValueAtTime(0.0008, startAt + duration);

  src.connect(filter).connect(gain).connect(ctx.destination);
  src.start(startAt);
  src.stop(startAt + duration + 0.01);
}

function playSfx(kind) {
  if (!state.sfxEnabled) return;
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (kind === "shuffle") {
      // 16 ardışık Riffle kart yaprağı darbesi + Bridge kapanış sürtünmesi
      for (let i = 0; i < 16; i++) {
        const offset = i * 0.024 + (i % 2 === 0 ? 0 : 0.005);
        const pitch = 1750 + (i % 5) * 210;
        triggerFilteredNoise(ctx, now + offset, 0.018, pitch, 2.3, 0.24);
      }
      triggerFilteredNoise(ctx, now + 0.42, 0.16, 1200, 1.5, 0.2, 2700);
    } else if (kind === "tick") {
      triggerFilteredNoise(ctx, now, 0.024, 2100, 2.0, 0.15);
    } else if (kind === "flip") {
      triggerFilteredNoise(ctx, now, 0.075, 1100, 1.2, 0.18, 2500);
    } else if (kind === "vanish") {
      triggerFilteredNoise(ctx, now, 0.22, 650, 1.4, 0.24, 3400);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(1680, now + 0.22);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (kind === "lock") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(98, now + 0.17);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    }
  } catch {
    // Ses izni yoksa sessiz devam et
  }
}

function vibrate(pattern) {
  if (state.sfxEnabled && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

function applyCoverTitle() {
  brandTitle.textContent = state.coverTitle.toUpperCase();
  if (state.coverTitle === "Siberbaz Sahne") {
    brandSubtitle.textContent = "Close-Up & Mentalizm";
  } else if (state.coverTitle === "52 Kart Simülasyonu") {
    brandSubtitle.textContent = "Olasılık ve Rastgelelik Testi";
  } else {
    brandSubtitle.textContent = "52 Kart Sezgisel Seçim";
  }
}

function buildDeck() {
  if (state.stackMode === "mnemonica") {
    state.deck = MNEMONICA_STACK.map((c) => ({ suit: c.suit, rank: c.rank }));
    return;
  }

  const cards = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({ suit, rank });
    }
  }
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  state.deck = cards;
}

function formatPosition(idx) {
  return String(idx + 1).padStart(2, "0");
}

function renderDeck(withDealingWave = false) {
  deckTrack.innerHTML = "";
  deckTrack.classList.toggle("convincer-open", state.convincerOpen);
  deckTrack.classList.toggle("is-dealing", withDealingWave);

  state.deck.forEach((card, index) => {
    const el = document.createElement("div");
    el.className = "deck-card";
    el.classList.add(index % 2 === 0 ? "riffle-left" : "riffle-right");
    if (state.preselectedIndex === index) el.classList.add("is-preselected");

    if (state.convincerOpen) {
      const isRed = card.suit === "♥" || card.suit === "♦";
      if (isRed) el.classList.add("is-red");
      el.innerHTML = `
        <div class="convincer-face">
          <div class="convincer-corner">
            <span>${card.rank}</span>
            <span>${card.suit}</span>
          </div>
          <div class="convincer-center">${card.suit}</div>
          <div class="convincer-corner bottom">
            <span>${card.rank}</span>
            <span>${card.suit}</span>
          </div>
        </div>
      `;
    } else {
      el.innerHTML = `
        <div class="deck-card-inner">
          <span class="deck-pos-badge">#${formatPosition(index)}</span>
          <div class="deck-card-medallion">
            <span class="deck-card-emblem">♠</span>
          </div>
        </div>
      `;
    }

    el.addEventListener("click", () => handleDeckCardTap(index));
    deckTrack.appendChild(el);
  });

  if (withDealingWave) {
    setTimeout(() => {
      deckTrack.classList.remove("is-dealing");
    }, 450);
  }
}

function triggerShuffleAnimation() {
  if (state.isShuffling || state.convincerOpen) return;

  state.isShuffling = true;
  state.preselectedIndex = null;
  preselectBar.classList.add("hidden");
  shuffleStatus.classList.remove("hidden");

  playSfx("shuffle");
  vibrate([15, 25, 15, 25, 15, 40, 20]);

  deckTrack.classList.add("is-shuffling");

  setTimeout(() => {
    deckTrack.classList.remove("is-shuffling");
    if (state.stackMode !== "mnemonica") {
      buildDeck();
    }
    renderDeck(true);
    deckViewport.scrollTo({ left: 0, behavior: "smooth" });
    shuffleStatus.classList.add("hidden");
    state.isShuffling = false;
  }, 380);
}

function handleDeckCardTap(index) {
  if (state.isShuffling) return;
  if (state.convincerOpen) {
    toggleFaceUpConvincer(false);
    return;
  }

  playSfx("tick");
  vibrate(12);
  state.preselectedIndex = index;
  preselectPosLabel.textContent = `#${formatPosition(index)}`;
  preselectBar.classList.remove("hidden");

  const cards = deckTrack.querySelectorAll(".deck-card");
  cards.forEach((node, i) => node.classList.toggle("is-preselected", i === index));
}

function toggleFaceUpConvincer(forceValue) {
  state.convincerOpen = typeof forceValue === "boolean" ? forceValue : !state.convincerOpen;
  convincerBtn.textContent = state.convincerOpen ? "Kapat & Hazırla" : "Desteyi Aç";
  convincerBtn.classList.toggle("is-active", state.convincerOpen);

  if (state.convincerOpen) {
    promptText.textContent = "52 kartın tamamı birbirinden farklıdır. İnceledikten sonra 'Kapat & Hazırla'ya dokun.";
    state.preselectedIndex = null;
    preselectBar.classList.add("hidden");
  } else {
    promptText.textContent = "Desteyi parmağınla kaydır, tüm kartları incele ve içinden geçen karta dokun.";
  }

  playSfx("flip");
  renderDeck(false);
}

function buildCrownSvg(inverted = false) {
  const cls = inverted ? "court-crown inv" : "court-crown";
  return `<svg class="${cls}" viewBox="0 0 64 40" aria-hidden="true"><path d="M6 34L2 10l16 11L32 4l14 17 16-11-4 24H6zm2 4h48v-3H8v3z"/></svg>`;
}

function buildCardArtworkHTML(card) {
  if (card.rank === "A") {
    return `
      <div class="ace-medallion">
        <span class="ace-big-suit">${card.suit}</span>
        <span class="ace-brand-mark">SİBERBAZ</span>
      </div>
    `;
  }

  if (COURT_LABELS[card.rank]) {
    return `
      <div class="court-frame">
        ${buildCrownSvg(false)}
        <div class="court-center-emblem">
          <span class="court-suit">${card.suit}</span>
          <span class="court-title">${COURT_LABELS[card.rank]}</span>
        </div>
        ${buildCrownSvg(true)}
      </div>
    `;
  }

  const cells = PIP_LAYOUTS[card.rank] || ["r4-c2"];
  const pipsHtml = cells
    .map((posClass) => `<span class="pip ${posClass}">${card.suit}</span>`)
    .join("");
  return `<div class="pip-grid">${pipsHtml}</div>`;
}

function buildCardFrontHTML(card) {
  return `
    <div class="card-corner top">
      <span>${card.rank}</span>
      <span class="card-corner-suit">${card.suit}</span>
    </div>
    <div class="card-artwork-area">
      ${buildCardArtworkHTML(card)}
    </div>
    <div class="card-corner bottom">
      <span>${card.rank}</span>
      <span class="card-corner-suit">${card.suit}</span>
    </div>
  `;
}

function confirmRevealCard() {
  if (state.preselectedIndex === null) return;

  const index = state.preselectedIndex;
  const position = index + 1;
  const shouldForce = state.mode === "force" && !state.forceConsumedThisTurn;
  const picked = shouldForce
    ? { suit: state.forceSuit, rank: state.forceRank }
    : state.deck[index];

  if (shouldForce) {
    state.forceConsumedThisTurn = true;
  }

  state.lastPicked = picked;
  state.lastPosition = position;

  prepareRevealStage(picked, position);
  notifyPeekServer(picked, shouldForce ? "force" : "peek", position);
}

function prepareRevealStage(card, position) {
  const isRed = card.suit === "♥" || card.suit === "♦";
  revealedCard.classList.remove("is-vanishing");
  revealedCard.classList.toggle("is-red", isRed);
  vanishBanner.classList.add("hidden");
  state.isVanishing = false;
  setCardFlipped(false);

  revealedCardFront.innerHTML = buildCardFrontHTML(card);
  revealMetaPill.textContent = position ? `Deste Sırası: #${String(position).padStart(2, "0")}` : "Zihin Seçimi";

  deckStage.classList.add("hidden");
  thoughtStage.classList.add("hidden");
  deckControls.classList.add("hidden");
  stageModeTabs.classList.add("hidden");
  revealStage.classList.remove("hidden");
}

function setCardFlipped(showFront) {
  state.cardRevealed = showFront;
  revealedCard.classList.toggle("is-flipped", showFront);
  toggleRevealBtn.textContent = showFront ? "Kartı Gizle" : "Açık Göster";
}

function triggerPhysicalVanish() {
  if (state.isVanishing || !state.lastPicked) return;
  state.isVanishing = true;

  playSfx("vanish");
  vibrate([25, 40, 60]);
  revealedCard.classList.add("is-vanishing");
  vanishBanner.classList.remove("hidden");

  setTimeout(() => {
    state.isVanishing = false;
    lockSelection(true);
  }, 480);
}

function updatePeekIndicators(card) {
  const suitNum = SUIT_CODE[card.suit];
  const rankNum = RANK_CODE[card.rank];

  syncHzValue.textContent = `${suitNum}.${rankNum} Hz`;
  focusDepthValue.textContent = `%${89 + (Number(rankNum) % 9)}`;

  document.querySelectorAll(".corner-beacon").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.suit === card.suit);
  });

  const noise = Math.floor(10 + Math.random() * 89);
  sessionTag.textContent = `OTURUM #${suitNum}${rankNum}-${noise}`;
}

function lockSelection(skipSound = false) {
  if (!state.lastPicked) return;

  if (!skipSound) {
    playSfx("lock");
    vibrate([20, 30, 20]);
  }
  updatePeekIndicators(state.lastPicked);

  if (state.mode === "force" && state.autoDisarm && state.forceConsumedThisTurn) {
    state.mode = "peek";
    localStorage.setItem("sb_mode", "peek");
  }

  revealStage.classList.add("hidden");
  thoughtStage.classList.add("hidden");
  deckStage.classList.add("hidden");
  deckControls.classList.add("hidden");
  stageModeTabs.classList.add("hidden");
  lockedStage.classList.remove("hidden");
}

function sealThoughtSelection() {
  const picked = { suit: state.thoughtSuit, rank: state.thoughtRank };
  state.lastPicked = picked;
  state.lastPosition = null;
  notifyPeekServer(picked, "thought", null);
  lockSelection(false);
}

function switchInputTab(tabName) {
  const isThought = tabName === "thought";
  tabDeckBtn.classList.toggle("active", !isThought);
  tabThoughtBtn.classList.toggle("active", isThought);
  deckStage.classList.toggle("hidden", isThought);
  thoughtStage.classList.toggle("hidden", !isThought);
  deckControls.classList.toggle("hidden", isThought);
}

function resetStage() {
  if (state.mode === "force" && state.autoDisarm && state.forceConsumedThisTurn) {
    state.mode = "peek";
    localStorage.setItem("sb_mode", "peek");
  }
  state.forceConsumedThisTurn = false;
  state.preselectedIndex = null;
  state.convincerOpen = false;
  state.isShuffling = false;
  state.isVanishing = false;

  convincerBtn.textContent = "Desteyi Aç";
  convincerBtn.classList.remove("is-active");
  preselectBar.classList.add("hidden");
  shuffleStatus.classList.add("hidden");

  lockedStage.classList.add("hidden");
  revealStage.classList.add("hidden");
  stageModeTabs.classList.remove("hidden");

  const startTab = state.mode === "thought" ? "thought" : "deck";
  switchInputTab(startTab);

  promptText.textContent = "Desteyi parmağınla kaydır, tüm kartları incele ve içinden geçen karta dokun.";
  sessionTag.textContent = `OTURUM #SB-${Math.floor(100 + Math.random() * 899)}`;

  buildDeck();
  renderDeck(false);
}

function notifyPeekServer(card, effectiveMode, position) {
  if (window.location.protocol === "file:") return;

  const payload = {
    suit: card.suit,
    rank: card.rank,
    mode: effectiveMode,
    timestamp: new Date().toISOString()
  };
  if (position !== null && position !== undefined) {
    payload.position = position;
  }

  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 1200) : null;

  fetch("/api/peek", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: controller ? controller.signal : undefined
  })
    .catch(() => {
      // Çevrimdışı veya sunucusuz modda sessizce devam et
    })
    .finally(() => {
      if (timer) clearTimeout(timer);
    });
}

function renderRankGrid(container, activeRank, onSelect) {
  container.innerHTML = "";
  RANKS.forEach((rank) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rank-pick-btn";
    if (rank === activeRank) btn.classList.add("active");
    btn.textContent = rank;
    btn.addEventListener("click", () => {
      playSfx("tick");
      onSelect(rank);
    });
    container.appendChild(btn);
  });
}

function syncThoughtUI() {
  thoughtSuitGrid.querySelectorAll(".suit-pick-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.suit === state.thoughtSuit);
  });
  renderRankGrid(thoughtRankGrid, state.thoughtRank, (r) => {
    state.thoughtRank = r;
    syncThoughtUI();
  });
  thoughtPreviewCard.textContent = `${state.thoughtSuit} ${state.thoughtRank}`;
}

function syncForcePickerUI() {
  forceSuitGrid.querySelectorAll(".suit-pick-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.suit === state.forceSuit);
  });
  renderRankGrid(forceRankGrid, state.forceRank, (r) => {
    state.forceRank = r;
    syncForcePickerUI();
  });
  forceTargetSummary.textContent = `${state.forceSuit} ${state.forceRank}`;
}

// Gizli Panel Tetikleyicileri
let tagTapCount = 0;
let tagTapTimer = null;
let dotHoldTimer = null;

function openSecretModal() {
  vibrate(30);
  modePeekBtn.classList.toggle("active", state.mode === "peek");
  modeForceBtn.classList.toggle("active", state.mode === "force");
  modeThoughtBtn.classList.toggle("active", state.mode === "thought");

  stackRandomBtn.classList.toggle("active", state.stackMode === "random");
  stackMnemonicaBtn.classList.toggle("active", state.stackMode === "mnemonica");

  autoDisarmToggle.checked = state.autoDisarm;
  sfxToggle.checked = state.sfxEnabled;
  coverTitleSelect.value = state.coverTitle;
  forcePickerSection.classList.toggle("hidden", state.mode !== "force");

  syncForcePickerUI();
  secretModal.classList.remove("hidden");
}

sessionTag.addEventListener("click", () => {
  tagTapCount += 1;
  clearTimeout(tagTapTimer);
  if (tagTapCount >= 4) {
    tagTapCount = 0;
    openSecretModal();
    return;
  }
  tagTapTimer = setTimeout(() => {
    tagTapCount = 0;
  }, 850);
});

statusDot.addEventListener("pointerdown", () => {
  dotHoldTimer = setTimeout(openSecretModal, 1200);
});
statusDot.addEventListener("pointerup", () => clearTimeout(dotHoldTimer));
statusDot.addEventListener("pointercancel", () => clearTimeout(dotHoldTimer));
statusDot.addEventListener("pointerleave", () => clearTimeout(dotHoldTimer));

// Yukarı Kaydırarak Ekrandan Çekme (Swipe-Up Vanish)
let swipeStartY = null;

card3dScene.addEventListener("pointerdown", (e) => {
  swipeStartY = e.clientY;
});

card3dScene.addEventListener("pointerup", (e) => {
  if (swipeStartY === null) return;
  const deltaY = e.clientY - swipeStartY;
  swipeStartY = null;
  if (deltaY < -55) {
    triggerPhysicalVanish();
  }
});

card3dScene.addEventListener("pointercancel", () => {
  swipeStartY = null;
});

// Hold-to-Peek kontrolleri
holdPeekBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  playSfx("flip");
  vibrate(15);
  setCardFlipped(true);
});

const endHoldPeek = () => {
  if (state.cardRevealed) {
    setCardFlipped(false);
  }
};
holdPeekBtn.addEventListener("pointerup", endHoldPeek);
holdPeekBtn.addEventListener("pointercancel", endHoldPeek);
holdPeekBtn.addEventListener("pointerleave", endHoldPeek);

vanishPullBtn.addEventListener("click", triggerPhysicalVanish);

toggleRevealBtn.addEventListener("click", () => {
  playSfx("flip");
  setCardFlipped(!state.cardRevealed);
});

thoughtSuitGrid.querySelectorAll(".suit-pick-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    playSfx("tick");
    state.thoughtSuit = btn.dataset.suit;
    syncThoughtUI();
  });
});
sealThoughtBtn.addEventListener("click", sealThoughtSelection);

[modePeekBtn, modeForceBtn, modeThoughtBtn].forEach((btn) => {
  btn.addEventListener("click", () => {
    state.mode = btn.dataset.mode;
    modePeekBtn.classList.toggle("active", state.mode === "peek");
    modeForceBtn.classList.toggle("active", state.mode === "force");
    modeThoughtBtn.classList.toggle("active", state.mode === "thought");
    forcePickerSection.classList.toggle("hidden", state.mode !== "force");
  });
});

[stackRandomBtn, stackMnemonicaBtn].forEach((btn) => {
  btn.addEventListener("click", () => {
    state.stackMode = btn.dataset.stack;
    stackRandomBtn.classList.toggle("active", state.stackMode === "random");
    stackMnemonicaBtn.classList.toggle("active", state.stackMode === "mnemonica");
  });
});

forceSuitGrid.querySelectorAll(".suit-pick-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    playSfx("tick");
    state.forceSuit = btn.dataset.suit;
    syncForcePickerUI();
  });
});

document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    playSfx("tick");
    state.forceSuit = btn.dataset.suit;
    state.forceRank = btn.dataset.rank;
    syncForcePickerUI();
  });
});

saveSecretBtn.addEventListener("click", () => {
  state.autoDisarm = autoDisarmToggle.checked;
  state.sfxEnabled = sfxToggle.checked;
  state.coverTitle = coverTitleSelect.value;

  localStorage.setItem("sb_mode", state.mode);
  localStorage.setItem("sb_stack", state.stackMode);
  localStorage.setItem("sb_autodisarm", String(state.autoDisarm));
  localStorage.setItem("sb_sfx", String(state.sfxEnabled));
  localStorage.setItem("sb_cover_title", state.coverTitle);
  localStorage.setItem("sb_force_suit", state.forceSuit);
  localStorage.setItem("sb_force_rank", state.forceRank);

  applyCoverTitle();
  secretModal.classList.add("hidden");
  resetStage();
});

closeSecretBtn.addEventListener("click", () => {
  secretModal.classList.add("hidden");
});

tabDeckBtn.addEventListener("click", () => switchInputTab("deck"));
tabThoughtBtn.addEventListener("click", () => switchInputTab("thought"));
convincerBtn.addEventListener("click", () => toggleFaceUpConvincer());
shuffleBtn.addEventListener("click", triggerShuffleAnimation);

cancelPickBtn.addEventListener("click", () => {
  state.preselectedIndex = null;
  preselectBar.classList.add("hidden");
  deckTrack.querySelectorAll(".deck-card").forEach((node) => node.classList.remove("is-preselected"));
});
confirmPickBtn.addEventListener("click", confirmRevealCard);
hideCardBtn.addEventListener("click", () => lockSelection(false));
resetGameBtn.addEventListener("click", resetStage);

if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

applyCoverTitle();
syncThoughtUI();
syncForcePickerUI();
resetStage();
