  // =========================
  // SUPABASE CONFIG
  // =========================

  const SUPABASE_URL = 'https://pvbwweoegkcxgsxkqqvs.supabase.co';

  const SUPABASE_KEY = 'sb_publishable_ZulliytFbH5g_D_zyR_Sag_tFdzwkMJ';

  const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


  // =========================
  // LOAD COMMENTS
  // =========================

  async function loadComments() {

    const container = document.getElementById('wishesList');

    if (!container) return;

    container.innerHTML = `
      <p class="loading-wishes">Memuat ucapan...</p>
    `;

    const { data, error } = await supabaseClient
      .from('comments')
      .select('id, name, description, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Gagal mengambil ucapan:', error);

      container.innerHTML = `
        <p class="loading-wishes">
          Ucapan belum dapat dimuat.
        </p>
      `;

      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = `
        <p class="loading-wishes">
          Belum ada ucapan. Jadilah yang pertama memberikan ucapan ♡
        </p>
      `;

      return;
    }

    container.innerHTML = data.map(comment => {

        const nama = escapeHTML(comment.name);
        const deskripsi = escapeHTML(comment.description);

        const date = new Date(comment.created_at);

        const tanggal = date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const initial = nama
            ? nama.charAt(0).toUpperCase()
            : '?';

        return `
            <article class="wish-card">

                <div
                    class="wish-card__header"
                    data-initial="${initial}"
                >
                    <div>
                        <h4>${nama}</h4>
                        <span>${tanggal}</span>
                    </div>
                </div>

                <p>${deskripsi}</p>

            </article>
        `;

    }).join('');
  }


  // =========================
  // SUBMIT COMMENT
  // =========================

  const rsvpForm = document.getElementById('rsvpForm');

  if (rsvpForm) {

    rsvpForm.addEventListener('submit', async function (event) {

      event.preventDefault();

      const form = event.target;

      const nameInput = form.elements['name'];
      const messageInput = form.elements['message'];

      const name = nameInput.value.trim();
      const description = messageInput.value.trim();

      const button = document.getElementById('submitWish');
      const formNote = document.getElementById('formNote');

      // Validasi
      if (!name || !description) {
        formNote.textContent = 'name dan ucapan wajib diisi.';
        return;
      }

      // Loading
      button.disabled = true;
      button.textContent = 'Mengirim...';
      formNote.textContent = 'Sedang mengirim ucapan...';

      try {

        const { error } = await supabaseClient
          .from('comments')
          .insert([
            {
              name: name,
              description: description
            }
          ]);

        if (error) {
          console.error('Gagal menyimpan ucapan:', error);

          formNote.textContent =
            'Maaf, ucapan gagal dikirim. Silakan coba lagi.';

          return;
        }

        // Berhasil
        form.reset();

        formNote.textContent =
          'Ucapan berhasil dikirim. Terima kasih ♡';

        // Reload ucapan
        await loadComments();

      } catch (error) {

        console.error(error);

        formNote.textContent =
          'Terjadi kesalahan. Silakan coba lagi.';

      } finally {

        button.disabled = false;
        button.textContent = 'Kirim Ucapan ♡';

      }

    });
  }


  // =========================
  // SECURITY
  // =========================

  function escapeHTML(text) {

    const div = document.createElement('div');

    div.textContent = text ?? '';

    return div.innerHTML;
  }


  // =========================
  // INITIAL LOAD
  // =========================

  loadComments();



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
// COPY REKENING
var copyButtons = document.querySelectorAll(".copy-btn");

for (var i = 0; i < copyButtons.length; i++) {
    copyButtons[i].onclick = function () {

        var nomor = this.getAttribute("data-rekening");

        navigator.clipboard.writeText(nomor).then(function () {
            alert("Nomor rekening berhasil disalin");
        }).catch(function () {
            alert("Gagal menyalin nomor rekening");
        });

    };
}
function initBackTop() { const btn = $("#backTop"); window.addEventListener("scroll", () => btn.classList.toggle("is-visible", window.scrollY > 600), { passive: true }); btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" })); }
function toast(message) { const el = $("#toast"); el.textContent = message; el.classList.add("show"); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove("show"), 2500); }

hydrateWeddingData();
initOpening();
initCountdown();
initNavigation();
initReveal();
initParallax();
initMusic();
initRsvp();
initBackTop();
loadWishes();
