const photos = [
  "photo-01.jpg",
  "photo-02.jpg",
  "photo-03.jpg",
  "photo-04.jpg",
  "photo-05.jpg",
  "photo-06.jpg",
  "photo-07.jpg",
  "photo-08.jpg",
  "photo-09.jpg",
  "photo-10.jpg",
  "photo-11.jpg",
  "photo-12.jpg",
  "photo-13.jpg",
  "photo-14.jpg",
  "photo-15.jpg",
  "photo-16.jpg",
  "photo-17.jpg",
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

let activeIndex = 0;

function renderGallery() {
  const markup = photos
    .map((photo, index) => {
      const displayIndex = String(index + 1).padStart(2, "0");
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
            src="assets/images/thumb/${photo}"
            data-full="assets/images/full/${photo}"
            alt="Barcelona travel photo ${displayIndex}"
            loading="lazy"
            decoding="async"
          />
        </button>
      `;
    })
    .join("");

  gallery.innerHTML = markup;
}

function updateLightbox(index) {
  activeIndex = (index + photos.length) % photos.length;
  const displayIndex = String(activeIndex + 1).padStart(2, "0");
  const photo = photos[activeIndex];
  lightboxImage.src = `assets/images/full/${photo}`;
  lightboxImage.alt = `Barcelona travel photo ${displayIndex}`;
  lightboxCaption.textContent = `Barcelona 2026 · ${displayIndex} / ${String(
    photos.length
  ).padStart(2, "0")}`;
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
  updateLightbox(activeIndex - 1);
});

nextButton.addEventListener("click", () => {
  updateLightbox(activeIndex + 1);
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.open) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    updateLightbox(activeIndex - 1);
  }

  if (event.key === "ArrowRight") {
    updateLightbox(activeIndex + 1);
  }
});

renderGallery();
