const assetVersion = "20260719-2";

const photos = [
  { file: "photo-01.jpg", width: 640, height: 540 },
  { file: "photo-02.jpg", width: 640, height: 826 },
  { file: "photo-03.jpg", width: 640, height: 920 },
  { file: "photo-04.jpg", width: 640, height: 724 },
  { file: "photo-05.jpg", width: 640, height: 700 },
  { file: "photo-06.jpg", width: 640, height: 480 },
  { file: "photo-07.jpg", width: 640, height: 852 },
  { file: "photo-08.jpg", width: 640, height: 1016 },
  { file: "photo-09.jpg", width: 640, height: 422 },
  { file: "photo-10.jpg", width: 640, height: 882 },
  { file: "photo-11.jpg", width: 640, height: 854 },
  { file: "photo-12.jpg", width: 640, height: 480 },
  { file: "photo-13.jpg", width: 640, height: 854 },
  { file: "photo-14.jpg", width: 640, height: 962 },
  { file: "photo-15.jpg", width: 640, height: 480 },
  { file: "photo-16.jpg", width: 640, height: 854 },
  { file: "photo-17.jpg", width: 640, height: 854 },
  { file: "photo-18.jpg", width: 640, height: 893 },
  { file: "photo-19.jpg", width: 640, height: 500 },
  { file: "photo-20.jpg", width: 640, height: 480 },
  { file: "photo-21.jpg", width: 640, height: 439 },
  { file: "photo-22.jpg", width: 640, height: 578 },
  { file: "photo-23.jpg", width: 640, height: 479 },
  { file: "photo-24.jpg", width: 640, height: 371 },
  { file: "photo-25.jpg", width: 640, height: 599 },
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
let activeLightboxImage = document.getElementById("lightboxImage");
let incomingLightboxImage = document.getElementById("lightboxImageIncoming");
const lightboxCaption = document.getElementById("lightboxCaption");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

let activeIndex = 0;
const galleryPhotos = shufflePhotos(photos);
const swipeState = {
  startX: 0,
  startY: 0,
  tracking: false,
};
let isAnimatingLightbox = false;

function shufflePhotos(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function renderGallery() {
  const markup = galleryPhotos
    .map((photo, index) => {
      const displayIndex = String(index + 1).padStart(2, "0");
      const imagePath = `assets/images/thumb/${photo.file}?v=${assetVersion}`;
      return `
        <button
          class="gallery-card"
          type="button"
          data-index="${index}"
          aria-label="Open photo ${displayIndex}"
          style="animation-delay: ${index * 45}ms"
        >
          <span class="gallery-card-index">${displayIndex}</span>
          <img
            src="${imagePath}"
            alt="Barcelona travel photo ${displayIndex}"
            decoding="async"
            loading="eager"
            fetchpriority="high"
            width="${photo.width}"
            height="${photo.height}"
          />
        </button>
      `;
    })
    .join("");

  gallery.innerHTML = markup;
}

function setLightboxImage(imageElement, index) {
  const displayIndex = String(index + 1).padStart(2, "0");
  const photo = galleryPhotos[index];
  imageElement.src = `assets/images/full/${photo.file}?v=${assetVersion}`;
  imageElement.alt = `Barcelona travel photo ${displayIndex}`;
}

function setLightboxCaption(index) {
  const displayIndex = String(index + 1).padStart(2, "0");
  lightboxCaption.textContent = `Barcelona 2026 · ${displayIndex} / ${String(
    galleryPhotos.length
  ).padStart(2, "0")}`;
}

function finishLightboxSlide(nextIndex) {
  const previousImage = activeLightboxImage;

  previousImage.className = "lightbox-slide-image is-hidden";
  previousImage.removeAttribute("src");
  previousImage.alt = "";

  incomingLightboxImage.className = "lightbox-slide-image is-active";

  activeLightboxImage = incomingLightboxImage;
  incomingLightboxImage = previousImage;
  activeIndex = nextIndex;
  setLightboxCaption(activeIndex);
  isAnimatingLightbox = false;
}

function animateLightboxTo(index, direction) {
  if (isAnimatingLightbox) {
    return;
  }

  const nextIndex = (index + galleryPhotos.length) % galleryPhotos.length;

  if (!activeLightboxImage.getAttribute("src")) {
    activeIndex = nextIndex;
    setLightboxImage(activeLightboxImage, activeIndex);
    setLightboxCaption(activeIndex);
    return;
  }

  isAnimatingLightbox = true;
  setLightboxImage(incomingLightboxImage, nextIndex);
  incomingLightboxImage.className = `lightbox-slide-image is-preparing from-${direction}`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      activeLightboxImage.className = `lightbox-slide-image is-exiting to-${direction}`;
      incomingLightboxImage.className = "lightbox-slide-image is-active";
    });
  });

  const handleTransitionEnd = (event) => {
    if (event.target !== incomingLightboxImage || event.propertyName !== "transform") {
      return;
    }

    incomingLightboxImage.removeEventListener("transitionend", handleTransitionEnd);
    finishLightboxSlide(nextIndex);
  };

  incomingLightboxImage.addEventListener("transitionend", handleTransitionEnd);
}

function updateLightbox(index, options = {}) {
  const nextIndex = (index + galleryPhotos.length) % galleryPhotos.length;

  if (options.animate) {
    animateLightboxTo(nextIndex, options.direction);
    return;
  }

  activeIndex = nextIndex;
  setLightboxImage(activeLightboxImage, activeIndex);
  activeLightboxImage.className = "lightbox-slide-image is-active";
  incomingLightboxImage.className = "lightbox-slide-image is-hidden";
  incomingLightboxImage.removeAttribute("src");
  incomingLightboxImage.alt = "";
  setLightboxCaption(activeIndex);
}

function openLightbox(index) {
  updateLightbox(index);
  if (!lightbox.open) {
    lightbox.showModal();
  }
}

function closeLightbox() {
  lightbox.close();
}

function handleSwipe(deltaX) {
  if (Math.abs(deltaX) < 48) {
    return;
  }

  if (deltaX < 0) {
    updateLightbox(activeIndex + 1, { animate: true, direction: "left" });
    return;
  }

  updateLightbox(activeIndex - 1, { animate: true, direction: "right" });
}

gallery.addEventListener("click", (event) => {
  const button = event.target.closest(".gallery-card");
  if (!button) {
    return;
  }

  openLightbox(Number(button.dataset.index));
});

gallery.addEventListener("keydown", (event) => {
  const button = event.target.closest(".gallery-card");
  if (!button || (event.key !== "Enter" && event.key !== " ")) {
    return;
  }

  event.preventDefault();
  openLightbox(Number(button.dataset.index));
});

prevButton.addEventListener("click", () => {
  updateLightbox(activeIndex - 1, { animate: true, direction: "right" });
});

nextButton.addEventListener("click", () => {
  updateLightbox(activeIndex + 1, { animate: true, direction: "left" });
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightbox.addEventListener(
  "touchstart",
  (event) => {
    if (!lightbox.open || event.touches.length !== 1) {
      swipeState.tracking = false;
      return;
    }

    const touch = event.touches[0];
    swipeState.startX = touch.clientX;
    swipeState.startY = touch.clientY;
    swipeState.tracking = true;
  },
  { passive: true }
);

lightbox.addEventListener(
  "touchend",
  (event) => {
    if (!swipeState.tracking || event.changedTouches.length !== 1) {
      swipeState.tracking = false;
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - swipeState.startX;
    const deltaY = touch.clientY - swipeState.startY;
    swipeState.tracking = false;

    if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaY) > 72) {
      return;
    }

    handleSwipe(deltaX);
  },
  { passive: true }
);

document.addEventListener("keydown", (event) => {
  if (!lightbox.open) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    updateLightbox(activeIndex - 1, { animate: true, direction: "right" });
  }

  if (event.key === "ArrowRight") {
    updateLightbox(activeIndex + 1, { animate: true, direction: "left" });
  }
});

renderGallery();
