const assetVersion = "20260718-3";
const placeholderImage =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

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
      const imagePath = `assets/images/thumb/${photo.file}?v=${assetVersion}`;
      const fullPath = `assets/images/full/${photo.file}?v=${assetVersion}`;
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
            src="${placeholderImage}"
            data-src="${imagePath}"
            data-full="${fullPath}"
            alt="Barcelona travel photo ${displayIndex}"
            decoding="async"
            width="${photo.width}"
            height="${photo.height}"
          />
        </button>
      `;
    })
    .join("");

  gallery.innerHTML = markup;
  hydrateGalleryImages();
}

function hydrateGalleryImages() {
  const images = gallery.querySelectorAll("img[data-src]");

  const revealImage = (image) => {
    if (!image.dataset.src) {
      return;
    }

    image.src = image.dataset.src;
    image.removeAttribute("data-src");
  };

  if (!("IntersectionObserver" in window)) {
    images.forEach(revealImage);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        revealImage(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "240px 0px",
    }
  );

  images.forEach((image) => observer.observe(image));
}

function updateLightbox(index) {
  activeIndex = (index + photos.length) % photos.length;
  const displayIndex = String(activeIndex + 1).padStart(2, "0");
  const photo = photos[activeIndex];
  lightboxImage.src = `assets/images/full/${photo.file}?v=${assetVersion}`;
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
