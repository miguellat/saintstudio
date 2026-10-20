const root = document.documentElement;
const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobilePanel = document.querySelector("[data-mobile-panel]");

if (menuToggle && mobilePanel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobilePanel.classList.toggle("is-open");
    body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const barberProfiles = [
  {
    slug: "jolo-lat",
    first: "Jolo",
    last: "Lat",
    name: "Jolo Lat",
    role: "Co-owner",
    portrait: "assets/images/Jolo-Lat.jpg",
    instagram: "",
    bookingUrl: "https://getsquire.com/booking/book/saint-studio-toronto/barber/jolo-lat/services",
    description: "The other half of SAINT Studio, co-owning the brand alongside his brother. With 8+ years behind the chair, he's a master of both fades and scissor work -- the kind of barber you can always count on to leave you feeling fresh.",
    aboutHeading: "Co-owner of SAINT Studio, master barber, and 8+ years deep in the craft.",
    about: [
      "Fades, scissors, and everything in between. Jolo's work is built on experience and precision, delivering clean, tailored cuts shaped by nearly a decade behind the chair.",
      "Expect a sharp finish, steady hands, and a chair you can trust every time. Book Jolo when you want to walk out feeling fresh, every visit.",
    ],
    gallery: [
      { type: "image", src: "assets/images/clippers.png", alt: "Textured fade haircut detail", caption: "Mid fade, textured top" },
      { type: "video", src: "assets/images/migi-cut.mp4", alt: "Clipper work during a haircut", caption: "Modern mullet, scissor finish" },
      { type: "image", src: "assets/images/gallery-cut.webp", alt: "Finished cut in the barbershop", caption: "Classic shape, clean taper" },
    ],
  },
  {
    slug: "miguel-lat",
    first: "Miguel",
    last: "Lat",
    name: "Miguel Lat",
    role: "Co-owner",
    portrait: "assets/images/Miguel-Lat.jpg",
    instagram: "",
    bookingUrl: "https://getsquire.com/booking/book/saint-studio-toronto/barber/migi-lat/services",
    description: "One of the two owners of SAINT Studio, building the brand alongside his brother. A young creative with skill to match his vision, he's mastered both the craft of cutting hair and the art of creating content -- bringing a rare blend of precision and creativity to everything he touches.",
    aboutHeading: "Co-owner of SAINT Studio, barber, and creative -- building the brand from the chair up alongside his brother.",
    about: [
      "Skill meets vision. Miguel's cuts are sharp, intentional, and detail-driven, shaped by the same creative eye he brings to his work behind the camera.",
      "Expect a clean chair, a sharp finish, and the perspective of a barber who sees every cut as part of something bigger. Book Miguel when you want craft and creativity in the same seat.",
    ],
    gallery: [
      { type: "video", src: "assets/images/migi-cut.mp4", alt: "Haircut in progress with clippers", caption: "Low taper, clean blend" },
      { type: "image", src: "assets/images/clippers.png", alt: "Fade haircut close-up", caption: "Skin fade, soft texture" },
      { type: "image", src: "assets/images/barber-tools.webp", alt: "Barber tools on a workstation", caption: "Detail work, lined finish" },
    ],
  },
  {
    slug: "luis-nunag",
    first: "Luis",
    last: "Nunag",
    name: "Luis Nunag",
    role: "Member",
    portrait: "assets/images/Luis-Nunag.jpg",
    instagram: "",
    bookingUrl: "https://getsquire.com/booking/book/saint-studio-toronto/barber/luis-nunag/services",
    description: "A true veteran of the craft and the core of SAINT Studio. Always locked in, always consistent -- Luis is a master at fades, scissors, and the kind of conversations that make the chair feel like home.",
    aboutHeading: "Veteran barber, steady presence, and the core of SAINT Studio.",
    about: [
      "Years of experience, sharpened every day. Luis is a master of fades and scissor work, delivering cuts built on consistency, precision, and a deep understanding of the craft.",
      "Expect a locked-in chair, clean work every visit, and conversations that make the time fly. Book Luis when you want a barber who's seen it all and still brings his best to every cut.",
    ],
    gallery: [
      { type: "video", src: "assets/images/nunag-cut.mp4", alt: "Finished haircut shown in profile", caption: "Scissor shape, natural flow" },
      { type: "image", src: "assets/images/gallery-cut.webp", alt: "Modern barbershop haircut detail", caption: "Balanced taper, soft finish" },
      { type: "image", src: "assets/images/barbershop.jpg", alt: "Barbershop chair and mirror", caption: "Chair-ready detail" },
    ],
  },
  {
    slug: "ash-nadeem",
    first: "Ash",
    last: "Nadeem",
    name: "Ash Nadeem",
    role: "Member",
    portrait: "assets/images/Ash-Nadeem.jpg",
    instagram: "",
    bookingUrl: "https://getsquire.com/booking/book/saint-studio-toronto/barber/ash-nadeem/services",
    description: "A curated look at Ash's craft -- sharp scissor work, seamless fades, and the small details that set every cut apart.",
    aboutHeading: "Precision barber, scissor specialist, and one of the sharpest hands at SAINT Studio.",
    about: [
      "Trained on detail. Ash blends classic scissor work with clean, seamless fades -- every cut tailored, every line intentional.",
      "Expect a calm chair, honest input, and a finish that holds its shape long after you leave. Book Ash when the details matter.",
    ],
    gallery: [
      { type: "image", src: "assets/images/clippers.png", alt: "Detailed fade haircut", caption: "Sharp fade, beard balance" },
      { type: "image", src: "assets/images/barber-tools.webp", alt: "Barber tools arranged neatly", caption: "Line work and finish" },
      { type: "image", src: "assets/images/clippers.png", alt: "Clipper tools on a surface", caption: "Precision setup" },
    ],
  },
  {
    slug: "jp-dela-cruz",
    first: "JP",
    last: "Dela Cruz",
    name: "JP Dela Cruz",
    role: "Member",
    portrait: "assets/images/JP-Dela.webp",
    instagram: "",
    bookingUrl: "https://getsquire.com/booking/book/saint-studio-toronto/barber/jp-dela-cruz-1/services",
    description: "A creative barber with over 10 years behind the chair. Known for his eye for style and his easygoing energy, JP brings both craft and character to every cut -- making the experience as memorable as the finish.",
    aboutHeading: "Creative barber, 10+ years in the game, and one of the most welcoming chairs at SAINT Studio.",
    about: [
      "A decade of experience sharpens instinct. JP blends creativity with technique, shaping every cut around the person in the chair -- no two the same, all built to fit.",
      "Expect good conversation, great energy, and a finish that feels made for you. Book JP when you want a cut with personality behind it.",
    ],
    gallery: [
      { type: "image", src: "assets/images/gallery-cut.webp", alt: "Finished barbershop cut", caption: "Editorial shape, clean finish" },
      { type: "image", src: "assets/images/product-photography.jpg", alt: "Studio product photography setup", caption: "Visual direction" },
      { type: "image", src: "assets/images/barbershop.jpg", alt: "Minimal barbershop interior", caption: "Studio polish" },
    ],
  },
  {
    slug: "justin-estrella",
    first: "Justin",
    last: "Estrella",
    name: "Justin Estrella",
    role: "Member",
    portrait: "assets/images/Justin-Estrella.jpg",
    instagram: "",
    bookingUrl: "https://getsquire.com/booking/book/saint-studio-toronto/barber/justin-estrella-1/services",
    description: "A young, ambitious barber with serious talent and speed to match. Quick hands, sharp eye, and a drive to keep leveling up -- every cut reflects the hunger behind it.",
    aboutHeading: "Young, talented, and one of the fastest-rising barbers at SAINT Studio.",
    about: [
      "Speed meets precision. Justin moves quick without cutting corners, delivering sharp, clean work shaped by ambition and a constant push to get better.",
      "Expect an efficient chair, a fresh finish, and the energy of a barber who's just getting started. Book Justin when you want quality without the wait.",
    ],
    gallery: [
      { type: "image", src: "assets/images/clippers.png", alt: "Clean fade haircut detail", caption: "Wearable fade, soft top" },
      { type: "video", src: "assets/images/nunag-cut.mp4", alt: "Haircut detail shown in profile", caption: "Textured finish" },
      { type: "image", src: "assets/images/gallery-cut.webp", alt: "Finished haircut in the studio", caption: "Balanced everyday shape" },
    ],
  },
  {
    slug: "gabriel-lat",
    first: "Gabriel",
    last: "Lat",
    name: "Gabriel Lat",
    role: "Member",
    portrait: "assets/images/Gabriel-Lat.webp",
    instagram: "",
    bookingUrl: "https://getsquire.com/booking/book/saint-studio-toronto/barber/gabe-lat/services",
    description: "\"The Process\" -- is the youngest of the Lat brothers and the up-and-coming force at SAINT Studio. Already delivering fresh fades and razor-sharp line ups, Gabriel brings a rare mix of vision and craft to every cut, proving talent runs in the family.",
    aboutHeading: "The youngest of the brothers, known around the studio as \"The Process\" -- the next chapter of SAINT Studio in the making.",
    about: [
      "Fresh fades, sharp line ups, and a growing signature of his own. Gabriel blends vision with technique, bringing a young, hungry energy to every cut he takes on.",
      "Expect clean work, good energy, and the kind of chair that reminds you why the next generation matters. Book Gabriel when you want a fresh cut from a rising name.",
    ],
    gallery: [
      { type: "image", src: "assets/images/barber-tools.webp", alt: "Tools prepared for a barber service", caption: "Beard detail, clean line" },
      { type: "image", src: "assets/images/clippers.png", alt: "Fade haircut close-up", caption: "Polished transition" },
      { type: "image", src: "assets/images/gallery-cut.webp", alt: "Finished haircut detail", caption: "Complete finish" },
    ],
  },
  {
    slug: "kevin-e",
    first: "Kevin",
    last: "Etoc",
    name: "Kevin Etoc",
    role: "Member",
    portrait: "assets/images/Kevin-E.jpg",
    instagram: "https://www.instagram.com/fadezbykev/",
    bookingUrl: "https://getsquire.com/discover/barbershop/saint-studio-toronto/barber/kev-e",
    description: "The newest addition to SAINT Studio. Kevin pairs clean fades with a creative eye, bringing fresh energy and serious attention to detail to every cut.",
    aboutHeading: "Fresh energy, clean fades, and the newest chair at SAINT Studio.",
    about: [
      "Detail-driven and always dialed in. Kevin delivers sharp fades and crisp line work, with a style that keeps every cut feeling current and tailored to the person in the chair.",
      "Expect a clean finish, good conversation, and a chair that feels like home from the first visit. Book Kevin when you want a fresh cut from the newest face at SAINT Studio.",
    ],
    gallery: [
      { type: "image", src: "assets/images/clippers.png", alt: "Fade haircut close-up", caption: "Clean fade" },
      { type: "image", src: "assets/images/gallery-cut.webp", alt: "Finished haircut detail", caption: "Complete finish" },
      { type: "image", src: "assets/images/barber-tools.webp", alt: "Tools prepared for a barber service", caption: "Precision setup" },
    ],
  },
];

function renderBarberProfile() {
  const profilePage = document.querySelector("[data-barber-profile]");
  if (!profilePage) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("barber") || barberProfiles[0].slug;
  const profileIndex = Math.max(0, barberProfiles.findIndex((item) => item.slug === slug));
  const profile = barberProfiles[profileIndex];
  const previous = barberProfiles[(profileIndex - 1 + barberProfiles.length) % barberProfiles.length];
  const next = barberProfiles[(profileIndex + 1) % barberProfiles.length];

  document.title = `${profile.name} | SAINTstudio`;
  const profileName = profilePage.querySelector("[data-profile-name]");
  profileName.textContent = "";
  profileName.classList.toggle("profile-name--long", profile.name.trim().split(/\s+/).length > 2);
  [profile.first, profile.last].forEach((namePart) => {
    const line = document.createElement("span");
    line.textContent = namePart;
    profileName.append(line);
  });
  profilePage.querySelector("[data-profile-role]").textContent = profile.role;
  profilePage.querySelector("[data-profile-description]").textContent = profile.description;
  profilePage.querySelector("[data-profile-about-heading]").textContent = profile.aboutHeading;

  const portrait = profilePage.querySelector("[data-profile-portrait]");
  portrait.src = profile.portrait;
  portrait.alt = `Portrait of ${profile.name}`;

  const bookButton = profilePage.querySelector("[data-profile-book]");
  bookButton.textContent = `Book ${profile.first}`;
  bookButton.href = profile.bookingUrl;

  const instagramButton = profilePage.querySelector("[data-profile-instagram]");
  instagramButton.hidden = !profile.instagram;
  if (profile.instagram) instagramButton.href = profile.instagram;

  const about = profilePage.querySelector("[data-profile-about]");
  about.textContent = "";
  profile.about.forEach((copy) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = copy;
    about.append(paragraph);
  });

  const gallery = profilePage.querySelector("[data-barber-gallery]");
  gallery.textContent = "";
  profile.gallery.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "barber-feature reveal";

    const number = document.createElement("div");
    number.className = "barber-feature-meta";
    const numberText = document.createElement("span");
    numberText.textContent = String(index + 1).padStart(2, "0");
    number.append(numberText);

    const figure = document.createElement("figure");

    if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.src;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", item.alt);
      figure.append(video);
    } else {
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.alt;
      image.loading = "lazy";
      figure.append(image);
    }

    article.append(number, figure);
    gallery.append(article);
  });

  const previousLink = profilePage.querySelector("[data-profile-prev]");
  const nextLink = profilePage.querySelector("[data-profile-next]");
  previousLink.href = `barber-profile.html?barber=${previous.slug}`;
  nextLink.href = `barber-profile.html?barber=${next.slug}`;
  profilePage.querySelector("[data-profile-prev-name]").textContent = previous.name;
  profilePage.querySelector("[data-profile-next-name]").textContent = next.name;
}

renderBarberProfile();

function isExternalLink(link) {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#")) return false;

  return /^(https?:|mailto:|tel:)/i.test(href);
}

function openExternalLinksInNewTabs() {
  document.querySelectorAll("a[href]").forEach((link) => {
    if (!isExternalLink(link)) return;

    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

openExternalLinksInNewTabs();

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const link = event.target.closest("a[href]");
  if (!link || !isExternalLink(link)) return;

  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  const rect = element.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9) {
    element.classList.add("is-visible");
  }
  revealObserver.observe(element);
});

requestAnimationFrame(() => {
  root.classList.add("motion-ready");
});

function setupCarousel(rootElement) {
  const track = rootElement.querySelector("[data-carousel-track]");
  const slides = [...rootElement.querySelectorAll("[data-slide]")];
  const prev = rootElement.querySelector("[data-prev]");
  const next = rootElement.querySelector("[data-next]");

  if (!track || slides.length === 0 || !prev || !next) return;

  let index = 0;

  function visibleCount() {
    if (window.innerWidth <= 680) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function update() {
    const count = visibleCount();
    const maxIndex = Math.max(0, slides.length - count);
    index = Math.min(index, maxIndex);
    const gap = 18;
    const width = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${index * (width + gap)}px)`;
    prev.disabled = index === 0;
    next.disabled = index >= maxIndex;
  }

  prev.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    update();
  });

  next.addEventListener("click", () => {
    index += 1;
    update();
  });

  window.addEventListener("resize", update);
  update();
}

document.querySelectorAll("[data-carousel]").forEach(setupCarousel);

function setupHorizontalScroll(scroller) {
  const speed = 1.1;
  const prev = scroller.parentElement.querySelector("[data-scroll-prev]");
  const next = scroller.parentElement.querySelector("[data-scroll-next]");
  const edgeTolerance = 1;

  const scrollByPage = (direction) => {
    const firstItem = scroller.firstElementChild;
    const itemWidth = firstItem ? firstItem.getBoundingClientRect().width : scroller.clientWidth * 0.8;
    scroller.scrollBy({
      left: direction * Math.max(260, itemWidth + 32),
      behavior: "smooth",
    });
  };

  if (prev) prev.addEventListener("click", () => scrollByPage(-1));
  if (next) next.addEventListener("click", () => scrollByPage(1));

  scroller.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const max = scroller.scrollWidth - scroller.clientWidth;
      if (max <= 0) return;
      const current = scroller.scrollLeft;
      const atStart = current <= edgeTolerance && event.deltaY < 0;
      const atEnd = current >= max - edgeTolerance && event.deltaY > 0;
      if (atStart || atEnd) return;

      event.preventDefault();

      const nextLeft = Math.max(0, Math.min(max, current + event.deltaY * speed));
      scroller.scrollLeft = nextLeft;
    },
    { passive: false }
  );
}

document.querySelectorAll(".barber-feature-scroll, [data-horizontal-scroll]").forEach(setupHorizontalScroll);

// Set this to a form service URL (Formspree, Web3Forms, etc.) to send inquiries
// straight to your inbox. Until then, forms open the visitor's email app.
const FORM_ENDPOINT = "";
const FORM_EMAIL = "saintstudiotoronto@gmail.com";

document.querySelectorAll("[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const note = form.querySelector("[data-form-note]");
    const data = new FormData(form);
    const say = (text) => {
      if (note) note.textContent = text;
    };

    if (FORM_ENDPOINT) {
      try {
        const response = await fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("Request failed");
        say(form.dataset.success || "Thanks — your message has been sent.");
        form.reset();
      } catch (error) {
        say(`Something went wrong. Please email us at ${FORM_EMAIL}.`);
      }
      return;
    }

    const lines = [...data.entries()].map(([key, value]) => `${key}: ${value}`);
    const subject = encodeURIComponent(`SAINTstudio inquiry from ${data.get("name") || "website"}`);
    window.location.href = `mailto:${FORM_EMAIL}?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
    say("Opening your email app. If nothing opens, email us at " + FORM_EMAIL + ".");
  });
});

const lightbox = document.querySelector("[data-lightbox]");
if (lightbox) {
  const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
  const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
  document.querySelectorAll("[data-lightbox-trigger]").forEach((button) => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.image;
      lightboxImage.alt = button.dataset.alt;
      lightboxCaption.textContent = button.dataset.caption;
      lightbox.showModal();
    });
  });
  lightbox.querySelector("[data-close-dialog]").addEventListener("click", () => lightbox.close());
}

const visitSection = document.querySelector(".visit-section");

if (visitSection) {
  const visitHours = [
    { day: "Sun", open: null, close: null },
    { day: "Mon", open: null, close: null },
    { day: "Tue", open: "11:00", close: "19:00" },
    { day: "Wed", open: "11:00", close: "19:00" },
    { day: "Thu", open: "11:00", close: "19:00" },
    { day: "Fri", open: "11:00", close: "19:00" },
    { day: "Sat", open: "11:00", close: "19:00" },
  ];

  const parseHour = (value) => {
    if (!value) return null;
    const [hour, minute] = value.split(":").map(Number);
    return hour * 60 + minute;
  };

  const formatHour = (minutes) => {
    if (minutes === null) return "Closed";
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = ((hour + 11) % 12) + 1;
    return minute === 0 ? `${hour12}${period.toLowerCase()}` : `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
  };

  const entries = [...visitSection.querySelectorAll("[data-visit-entry]")];
  const panels = [...visitSection.querySelectorAll("[data-visit-panel]")];
  const currentEntry = visitSection.querySelector("[data-current-visit-entry]");
  const visitPane = visitSection.querySelector(".visit-section__pane");
  const visitPaneParent = visitPane ? visitPane.parentElement : null;
  const visitPaneNextSibling = visitPane ? visitPane.nextElementSibling : null;
  const mobileVisitQuery = window.matchMedia("(max-width: 680px)");

  function placeVisitPane() {
    if (!visitPane || !visitPaneParent) return;

    let activeEntry = entries.find((item) => item.classList.contains("is-active"));

    if (!mobileVisitQuery.matches && !activeEntry) {
      activeEntry = entries[0];
      activeEntry.classList.add("is-active");
      activeEntry.setAttribute("aria-selected", "true");
      activeEntry.tabIndex = 0;
      panels.forEach((panel) => {
        const isActive = panel.dataset.visitPanel === activeEntry.dataset.visitEntry;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
      if (currentEntry) currentEntry.textContent = activeEntry.dataset.visitEntry;
    }

    const isOpen = Boolean(activeEntry);
    visitPane.hidden = mobileVisitQuery.matches && !isOpen;
    visitPane.classList.toggle("is-address-active", isOpen && activeEntry.dataset.visitEntry === "01");

    if (mobileVisitQuery.matches) {
      if (!activeEntry) return;
      activeEntry.after(visitPane);
      return;
    }

    visitPaneParent.insertBefore(visitPane, visitPaneNextSibling);
  }

  function collapseVisitEntries(entry) {
    entries.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
      item.tabIndex = item === entry ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.classList.remove("is-active");
      panel.hidden = true;
    });

    if (currentEntry) currentEntry.textContent = "--";
    placeVisitPane();
  }

  function selectVisitEntry(entry) {
    if (mobileVisitQuery.matches && entry.classList.contains("is-active")) {
      collapseVisitEntries(entry);
      return;
    }

    const id = entry.dataset.visitEntry;

    entries.forEach((item) => {
      const isActive = item === entry;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.visitPanel === id;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });

    if (currentEntry) currentEntry.textContent = id;
    placeVisitPane();
  }

  entries.forEach((entry, index) => {
    entry.tabIndex = entry.classList.contains("is-active") ? 0 : -1;

    entry.addEventListener("click", () => selectVisitEntry(entry));

    entry.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % entries.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + entries.length) % entries.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = entries.length - 1;

      entries[nextIndex].focus();
      selectVisitEntry(entries[nextIndex]);
    });
  });

  placeVisitPane();

  if (typeof mobileVisitQuery.addEventListener === "function") {
    mobileVisitQuery.addEventListener("change", placeVisitPane);
  } else {
    mobileVisitQuery.addListener(placeVisitPane);
  }

  const hoursGrid = visitSection.querySelector("[data-visit-hours-grid]");

  if (hoursGrid) {
    const today = new Date().getDay();

    visitHours.forEach((item, index) => {
      const cell = document.createElement("div");
      cell.className = "visit-hours__cell";
      if (index === today) cell.classList.add("is-today");
      if (!item.open) cell.classList.add("is-closed");

      const day = document.createElement("div");
      day.className = "visit-hours__day";
      day.textContent = item.day;

      const time = document.createElement("div");
      time.className = "visit-hours__time";

      if (item.open && item.close) {
        time.innerHTML = `${formatHour(parseHour(item.open))}<br>${formatHour(parseHour(item.close))}`;
      } else {
        time.textContent = "Closed";
        const stamp = document.createElement("div");
        stamp.className = "visit-hours__closed";
        stamp.textContent = "Closed";
        cell.append(day, time, stamp);
        hoursGrid.append(cell);
        return;
      }

      cell.append(day, time);
      hoursGrid.append(cell);
    });
  }

  const dotGroup = visitSection.querySelector("[data-visit-dotgrid]");

  if (dotGroup) {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const width = 680;
    const height = 400;
    const columns = 28;
    const rows = 20;
    const pinX = width * 0.56;
    const pinY = height * 0.52;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = column * (width / columns) + width / columns / 2;
        const y = row * (height / rows) + height / rows / 2;
        const distance = Math.hypot(x - pinX, y - pinY);
        const radius = Math.max(0.6, 1.6 - distance / 300);
        const opacity = Math.max(0.12, 1 - distance / 280);
        const dot = document.createElementNS(svgNamespace, "circle");

        dot.setAttribute("cx", x.toFixed(2));
        dot.setAttribute("cy", y.toFixed(2));
        dot.setAttribute("r", radius.toFixed(2));
        dot.setAttribute("fill", "currentColor");
        dot.setAttribute("opacity", (opacity * 0.22).toFixed(2));
        dotGroup.append(dot);
      }
    }
  }

  visitSection.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.dataset.copy;
      const label = button.querySelector("span");
      const original = label ? label.textContent : "";

      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
        } else {
          const field = document.createElement("textarea");
          field.value = text;
          field.setAttribute("readonly", "");
          field.style.position = "fixed";
          field.style.opacity = "0";
          document.body.append(field);
          field.select();
          document.execCommand("copy");
          field.remove();
        }

        if (label) {
          label.textContent = "Copied";
          window.setTimeout(() => {
            label.textContent = original;
          }, 1600);
        }
      } catch {
        if (label) label.textContent = original;
      }
    });
  });
}
