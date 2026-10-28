(() => {
  "use strict";

  const config = window.WEDDING_CONFIG;
  if (!config) {
    console.error("Wedding configuration could not be loaded.");
    return;
  }

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const getInitials = () => `${config.bride?.trim()?.[0] || "H"}${config.groom?.trim()?.[0] || "S"}`;
  const normaliseUrl = (value) => {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  };

  document.body.classList.add("no-scroll");

  function fillText(selector, value) {
    $$(selector).forEach((element) => { element.textContent = value; });
  }

  function setContent() {
    fillText(".js-bride", config.bride);
    fillText(".js-groom", config.groom);
    fillText(".js-eyebrow", config.invitation.eyebrow);
    fillText(".js-opening", config.invitation.opening);
    fillText(".js-message", config.invitation.message);
    fillText(".js-dua", config.invitation.dua);
    fillText(".js-display-date", config.displayDate);
    fillText(".js-display-time", config.displayTime);
    fillText(".js-venue", config.venue);
    fillText(".js-event-type", config.eventType || "Wedding Reception");

    const eventType = config.eventType || "Wedding Reception";
    document.title = `${config.bride} & ${config.groom} | ${eventType}`;
    const description = `An invitation to the ${eventType.toLowerCase()} of ${config.bride} and ${config.groom} on ${config.displayDate}.`;
    $("meta[name='description']")?.setAttribute("content", description);
    $("meta[property='og:title']")?.setAttribute("content", document.title);
    $("meta[property='og:description']")?.setAttribute("content", config.shareText);
    $("meta[name='twitter:title']")?.setAttribute("content", document.title);
    $("meta[name='twitter:description']")?.setAttribute("content", config.shareText);

    const eventDate = new Date(config.eventDate);
    if (!Number.isNaN(eventDate.valueOf())) {
      const dateOptions = { month: "long", day: "numeric", year: "numeric" };
      const weekday = new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(eventDate);
      $(".revealed-weekday").textContent = weekday;
      $(".revealed-date strong").textContent = String(eventDate.getDate());
      $(".revealed-date span:last-child").textContent = new Intl.DateTimeFormat(undefined, dateOptions)
        .format(eventDate)
        .replace(`${eventDate.getDate()}, `, "")
        .replace(" ", " · ");
    }
  }

  function configureVenue() {
    const mapLink = $("#map-link");
    const mapNote = $("#map-note");
    const mapUrl = normaliseUrl(config.mapUrl);
    if (mapUrl) {
      mapLink.href = mapUrl;
      mapLink.setAttribute("aria-disabled", "false");
      mapNote.textContent = "Use the map button for directions.";
    } else {
      mapLink.addEventListener("click", (event) => event.preventDefault());
    }

    const shareUrl = normaliseUrl(config.pageUrl) || window.location.href;
    const shareText = `${config.shareText} ${shareUrl}`.trim();
    $("#whatsapp-share").href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  }

  function buildGallery() {
    const gallery = $("#gallery-grid");
    const entries = Array.isArray(config.gallery) ? config.gallery : [];
    gallery.replaceChildren(...entries.map((photo) => {
      const figure = document.createElement("figure");
      figure.className = "photo-card";

      if (photo.src) {
        const image = document.createElement("img");
        image.src = photo.src;
        image.alt = photo.alt || "Wedding photograph";
        image.loading = "lazy";
        image.addEventListener("error", () => {
          image.remove();
          figure.classList.remove("photo-card--has-image");
          insertPhotoPlaceholder(figure, photo.label);
        }, { once: true });
        figure.classList.add("photo-card--has-image");
        figure.append(image);
      } else {
        insertPhotoPlaceholder(figure, photo.label);
      }

      const caption = document.createElement("figcaption");
      caption.textContent = photo.label || "A cherished moment";
      figure.append(caption);
      return figure;
    }));
  }

  function insertPhotoPlaceholder(figure, label) {
    const placeholder = document.createElement("div");
    placeholder.className = "photo-card__placeholder";
    const initials = document.createElement("span");
    initials.textContent = getInitials();
    const caption = document.createElement("span");
    caption.textContent = label || "Photo placeholder";
    placeholder.append(initials, caption);
    figure.append(placeholder);
  }

  function startCountdown() {
    const eventTime = new Date(config.eventDate).getTime();
    const fields = { days: $("#days"), hours: $("#hours"), minutes: $("#minutes"), seconds: $("#seconds") };
    if (Number.isNaN(eventTime)) {
      $("#countdown").textContent = "The reception date will be announced soon.";
      return;
    }

    const pad = (value, length = 2) => String(value).padStart(length, "0");
    const update = () => {
      let seconds = Math.max(0, Math.floor((eventTime - Date.now()) / 1000));
      const days = Math.floor(seconds / 86400);
      seconds %= 86400;
      const hours = Math.floor(seconds / 3600);
      seconds %= 3600;
      const minutes = Math.floor(seconds / 60);
      const remainder = seconds % 60;
      fields.days.textContent = pad(days, 3);
      fields.hours.textContent = pad(hours);
      fields.minutes.textContent = pad(minutes);
      fields.seconds.textContent = pad(remainder);
    };
    update();
    window.setInterval(update, 1000);
  }

  function createScratchCard() {
    const card = $("#scratch-card");
    const canvas = $("#scratch-canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const revealButton = $("#reveal-date");
    const status = $("#scratch-status");
    let drawing = false;
    let previousPoint = null;
    let revealed = false;

    const drawCover = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const bounds = canvas.getBoundingClientRect();
      canvas.width = Math.round(bounds.width * dpr);
      canvas.height = Math.round(bounds.height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.globalCompositeOperation = "source-over";
      const gradient = context.createLinearGradient(0, 0, bounds.width, bounds.height);
      gradient.addColorStop(0, "#efda94");
      gradient.addColorStop(.5, "#b89039");
      gradient.addColorStop(1, "#825b16");
      context.fillStyle = gradient;
      context.fillRect(0, 0, bounds.width, bounds.height);
      context.strokeStyle = "rgba(251, 247, 237, .30)";
      context.lineWidth = 1;
      for (let x = -bounds.height; x < bounds.width; x += 28) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x + bounds.height, bounds.height);
        context.stroke();
      }
      context.fillStyle = "rgba(3, 45, 39, .72)";
      context.textAlign = "center";
      context.font = "700 12px system-ui, sans-serif";
      context.letterSpacing = "2px";
      context.fillText("SCRATCH TO REVEAL", bounds.width / 2, bounds.height / 2 + 4);
    };

    const pointFor = (event) => {
      const bounds = canvas.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };

    const erase = (point) => {
      context.save();
      context.globalCompositeOperation = "destination-out";
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = 36;
      context.beginPath();
      context.moveTo(previousPoint?.x ?? point.x, previousPoint?.y ?? point.y);
      context.lineTo(point.x, point.y);
      context.stroke();
      context.restore();
      previousPoint = point;
    };

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      card.classList.add("is-revealed");
      canvas.setAttribute("aria-hidden", "true");
      status.textContent = `Date revealed: ${config.displayDate} at ${config.displayTime}.`;
    };

    const amountScratched = () => {
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      const sampleStep = 16;
      for (let index = 3; index < pixels.length; index += sampleStep) {
        if (pixels[index] < 80) transparent += 1;
      }
      return transparent / (pixels.length / sampleStep);
    };

    canvas.addEventListener("pointerdown", (event) => {
      if (revealed) return;
      drawing = true;
      previousPoint = pointFor(event);
      canvas.setPointerCapture(event.pointerId);
      erase(previousPoint);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (drawing && !revealed) erase(pointFor(event));
    });
    const stopDrawing = () => {
      if (!drawing) return;
      drawing = false;
      previousPoint = null;
      if (amountScratched() > .35) reveal();
    };
    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);
    revealButton.addEventListener("click", reveal);
    window.addEventListener("resize", () => { if (!revealed) drawCover(); });
    drawCover();
  }

  function setupMusic() {
    const audio = $("#background-music");
    const button = $("#music-toggle");
    const label = $("#music-label");
    const source = config.music && config.music.src;
    if (!source) return;

    audio.src = source;
    button.disabled = false;
    label.textContent = config.music.label || "Play ambience";
    button.addEventListener("click", async () => {
      if (audio.paused) {
        try {
          await audio.play();
          button.setAttribute("aria-pressed", "true");
          label.textContent = "Pause ambience";
        } catch {
          label.textContent = "Audio could not play";
        }
      } else {
        audio.pause();
        button.setAttribute("aria-pressed", "false");
        label.textContent = config.music.label || "Play ambience";
      }
    });
  }

  function addPetals() {
    const stage = $(".petal-stage");
    for (let index = 0; index < 22; index += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.setProperty("--drift", `${(Math.random() - .5) * 18}vw`);
      petal.style.animationDelay = `${Math.random() * .45}s`;
      petal.style.animationDuration = `${1.3 + Math.random() * 1.3}s`;
      stage.append(petal);
    }
  }

  function setupOpening() {
    const overlay = $("#envelope-screen");
    $("#open-invitation").addEventListener("click", () => {
      overlay.classList.add("is-opening");
      addPetals();
      window.setTimeout(() => {
        overlay.classList.add("is-open");
        document.body.classList.remove("no-scroll");
        $("#invitation").focus({ preventScroll: true });
      }, 800);
    }, { once: true });
  }

  function setupScrollReveals() {
    const elements = $$(".reveal-on-scroll");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .18 });
    elements.forEach((element) => observer.observe(element));
  }

  fillText(".js-bride", config.bride);
  fillText(".js-groom", config.groom);
  setContent();
  configureVenue();
  buildGallery();
  startCountdown();
  createScratchCard();
  setupMusic();
  setupOpening();
  setupScrollReveals();
  $("#back-to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();
