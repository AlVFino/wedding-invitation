const weddingData = {
  groom: "Ariyanto",
  bride: "Putri",
  date: "23 September 2026",
  countdownDate: "2026-09-23T08:00:00+07:00",
  location: "Tempat Pernikahan",
  mapsUrl: "https://goo.gl/maps/gaFsrSEYKVdghTXD6?g_st=ac"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const guestFromUrl = () => new URLSearchParams(window.location.search).get("to")?.trim() || "Tamu Undangan";
function hydrateWeddingData() {
  document.title = `${weddingData.groom} & ${weddingData.bride} — Undangan Pernikahan`;
  $$('[data-groom]').forEach(el => el.textContent = weddingData.groom);
  $$('[data-bride]').forEach(el => el.textContent = weddingData.bride);
  $("#openingGroom").textContent = weddingData.groom;
  $("#openingBride").textContent = weddingData.bride;
  $("#guestName").textContent = guestFromUrl();
  $$('[data-maps]').forEach(link => link.href = weddingData.mapsUrl);
}

function initOpening() {
  const opening = $("#opening"), site = $("#site"), button = $("#openInvitation"), preloader = $("#preloader");
  document.body.classList.add("locked");
  window.addEventListener("load", () => setTimeout(() => preloader.classList.add("is-hidden"), 250));
  button.addEventListener("click", () => {
    opening.classList.add("is-closed");
    site.classList.add("is-open");
    site.setAttribute("aria-hidden", "false");
    document.body.classList.remove("locked");
    window.scrollTo({ top: 0, behavior: "instant" });
    const audio = $("#weddingAudio");
    audio.play().then(() => setMusicState(true)).catch(() => setMusicState(false));
  });
}

function initCountdown() {
  const done = $("#countdownDone");
  const boxes = {
    days: $("[data-unit='days']"), hours: $("[data-unit='hours']"), minutes: $("[data-unit='minutes']"), seconds: $("[data-unit='seconds']")
  };
  const target = new Date(weddingData.countdownDate).getTime();
  const tick = () => {
    let diff = target - Date.now();
    if (diff <= 0) {
      $("#countdownTimer").hidden = true; done.hidden = false; return;
    }
    const days = Math.floor(diff / 86400000); diff %= 86400000;
    const hours = Math.floor(diff / 3600000); diff %= 3600000;
    const minutes = Math.floor(diff / 60000); diff %= 60000;
    const seconds = Math.floor(diff / 1000);
    boxes.days.textContent = String(days).padStart(2, "0");
    boxes.hours.textContent = String(hours).padStart(2, "0");
    boxes.minutes.textContent = String(minutes).padStart(2, "0");
    boxes.seconds.textContent = String(seconds).padStart(2, "0");
  };
  tick(); setInterval(tick, 1000);
}

function initNavigation() {
  const toggle = $("#menuToggle"), links = $("#navLinks");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open"); toggle.setAttribute("aria-expanded", String(open)); toggle.textContent = open ? "×" : "☰";
  });
  $$(".nav-link").forEach(link => link.addEventListener("click", () => { links.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.textContent = "☰"; }));
  const sections = $$("main section[id]");
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    $$(".nav-link").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  }), { rootMargin: "-45% 0px -45%" });
  sections.forEach(section => observer.observe(section));
}

function initReveal() {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  $$(".reveal").forEach(el => observer.observe(el));
}

function initParallax() {
  const media = $(".hero__media");
  const update = () => media.style.transform = `translateY(${Math.min(window.scrollY * .12, 55)}px) scale(1.04)`;
  window.addEventListener("scroll", update, { passive: true });
}

function initMusic() {
  $("#musicToggle").addEventListener("click", () => {
    const audio = $("#weddingAudio");
    if (audio.paused) audio.play().then(() => setMusicState(true)).catch(() => toast("File musik belum tersedia."));
    else { audio.pause(); setMusicState(false); }
  });
}
function setMusicState(isPlaying) { const btn = $("#musicToggle"); btn.classList.toggle("is-playing", isPlaying); btn.setAttribute("aria-pressed", String(isPlaying)); btn.setAttribute("aria-label", isPlaying ? "Jeda musik" : "Putar musik"); }

function loadWishes() {
  const list = $("#wishesList");
  const wishes = JSON.parse(localStorage.getItem("weddingWishes") || "[]");
  if (!wishes.length) { list.innerHTML = `<p class="empty-wishes">Belum ada ucapan. Jadilah yang pertama mengirim doa terbaik. ♡</p>`; return; }
  list.innerHTML = wishes.slice().reverse().map(w => `<article class="wish-card"><strong>${escapeHtml(w.name)}</strong><span>${escapeHtml(w.attendance)} · ${w.guests} tamu</span><p>${escapeHtml(w.message || "Semoga bahagia selalu! ❤️")}</p></article>`).join("");
}
function initRsvp() {
  $("#rsvpForm").addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const wishes = JSON.parse(localStorage.getItem("weddingWishes") || "[]");
    wishes.push({ name: data.name, attendance: data.attendance, guests: Number(data.guests), message: data.message, createdAt: new Date().toISOString() });
    localStorage.setItem("weddingWishes", JSON.stringify(wishes));
    e.currentTarget.reset(); $("[name='guests']").value = "1"; loadWishes(); toast("Konfirmasi kehadiran & ucapan berhasil disimpan ❤️");
  });
}

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"}[char])); }
function initCopy() {
  $("#copyRekening").addEventListener("click", async () => {
    const value = $("#rekeningNumber").textContent.trim();
    try { await navigator.clipboard.writeText(value); }
    catch { const area = document.createElement("textarea"); area.value = value; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); }
    $("#copyStatus").textContent = "Nomor rekening berhasil disalin ❤️"; toast("Nomor rekening berhasil disalin ❤️");
  });
}

function initBackTop() { const btn = $("#backTop"); window.addEventListener("scroll", () => btn.classList.toggle("is-visible", window.scrollY > 600), { passive: true }); btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" })); }
function toast(message) { const el = $("#toast"); el.textContent = message; el.classList.add("show"); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove("show"), 2500); }

hydrateWeddingData();
initOpening();
initCountdown();
initNavigation();
initReveal();
initParallax();
initAmbientAnimation();
initMusic();
initRsvp();
initCopy();
initBackTop();
loadWishes();
