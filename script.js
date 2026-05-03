const shopData = window.SHOP_DATA;
const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const productImagesByListing = {
  "1354620726": [
    "./black-backpack-main.png",
    "./black-backpack-10.png",
    "./black-backpack-02.png",
    "./black-backpack-03.png",
    "./black-backpack-07.png",
    "./black-backpack-08.png",
    "./black-backpack-09.png"
  ],
  "1368607153": [
    "./gray-backpack-02.webp",
    "./gray-backpack-01.webp",
    "./gray-backpack-03.webp",
    "./gray-backpack-04.webp",
    "./gray-backpack-05.webp",
    "./gray-backpack-06.webp",
    "./gray-backpack-07.webp"
  ],
  "1368557889": [
    "./green-backpack-02.jpg",
    "./green-backpack-05.jpg",
    "./green-backpack-01.jpg",
    "./green-backpack-03.jpg",
    "./green-backpack-04.jpg",
    "./green-backpack-06.jpg",
    "./green-backpack-07.jpg"
  ],
  "1354651448": [
    "./green-blanket-01.jpg",
    "./green-blanket-05.jpg",
    "./green-blanket-02.jpg",
    "./green-blanket-03.jpg",
    "./green-blanket-04.jpg",
    "./green-blanket-06.jpg",
    "./green-blanket-07.jpg",
    "./green-blanket-08.jpg",
    "./green-blanket-09.jpg"
  ],
  "1368623007": [
    "./gray-blanket-01.jpg",
    "./gray-blanket-04.jpg",
    "./gray-blanket-02.jpg",
    "./gray-blanket-03.jpg",
    "./gray-blanket-05.jpg",
    "./gray-blanket-06.jpg",
    "./gray-blanket-07.jpg"
  ],
  "1374369071": [
    "./pillow-06.jpg",
    "./pillow-08.jpg",
    "./pillow-02.jpg",
    "./pillow-07.jpg",
    "./pillow-04.jpg",
    "./pillow-05.jpg",
    "./pillow-01.jpg",
    "./pillow-03.jpg"
  ]
};

const conciseTitle = (title) =>
  title
    .replace(/^UNIKA\s+/i, "")
    .replace(/\.\s*$/, "")
    .split(",")[0];

const listingIdFromUrl = (url) => {
  const match = url.match(/listing\/(\d+)/);
  return match ? match[1] : "";
};

const productTone = (title) => {
  if (/backpack/i.test(title)) return "pack";
  if (/blanket/i.test(title)) return "blanket";
  if (/pillow/i.test(title)) return "pillow";
  return "gear";
};

const setupNavigation = () => {
  const page = document.body.dataset.page;
  const toggle = document.querySelector(".mobile-nav-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = [...document.querySelectorAll("[data-nav]")];

  navLinks.forEach((link) => {
    if (link.dataset.nav === page) {
      link.classList.add("is-active");
    }
  });

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
};

const populateGlobalBrandLinks = () => {
  const instagram = document.querySelector("#instagram-link");
  const youtube = document.querySelector("#youtube-link");
  const website = document.querySelector("#website-link");
  const email = document.querySelector("#email-link");

  if (instagram) instagram.href = shopData.about.external_links.instagram;
  if (youtube) youtube.href = shopData.about.external_links.youtube;
  if (website) website.href = shopData.about.external_links.website;
  if (email) {
    email.href = `mailto:${shopData.privacy_policy.contact_email}`;
    email.title = shopData.privacy_policy.contact_email;
    email.setAttribute("aria-label", `Email ${shopData.privacy_policy.contact_email}`);
  }
};

const populateHeroStats = () => {
  const statList = document.querySelector("#hero-stats");
  if (!statList) return;

  const statItems = [
    { label: "Sales", value: `${shopData.shop.sales}+` },
    { label: "Average rating", value: `${shopData.shop.rating}/5` },
    { label: "Reviews", value: `${shopData.shop.review_count}` },
    { label: "Since", value: `${shopData.shop.etsy_since}` }
  ];

  statItems.forEach((item) => {
    const li = document.createElement("li");
    li.setAttribute("data-reveal", "");
    li.innerHTML = `<strong>${item.value}</strong><span>${item.label}</span>`;
    statList.append(li);
  });
};

const buildProductCard = (item, productIndex) => {
  const card = document.createElement("article");
  card.setAttribute("data-reveal", "");

  const listingId = listingIdFromUrl(item.listing_url);
  const galleryImages = productImagesByListing[listingId] || [];
  const shortTitle = conciseTitle(item.title);
  const highlights = item.description_points?.slice(0, 2).join(" / ") || "Outdoor-ready essential built for portability and weather.";
  const tone = productTone(item.title);

  if (galleryImages.length) {
    card.className = `product-card product-card-featured product-card-${tone}`;
    card.innerHTML = `
      <div class="product-gallery">
        <div class="product-gallery-main">
          <img class="product-gallery-image" src="${galleryImages[0]}" alt="${shortTitle}" width="900" height="900" loading="${productIndex === 0 ? "eager" : "lazy"}" fetchpriority="${productIndex === 0 ? "high" : "auto"}">
          <span class="product-tag product-tag-solid">${item.free_shipping ? "Free shipping" : "Shop now"}</span>
          <button class="carousel-button carousel-button-prev" type="button" aria-label="Previous ${shortTitle} image">&#8249;</button>
          <button class="carousel-button carousel-button-next" type="button" aria-label="Next ${shortTitle} image">&#8250;</button>
        </div>
        <div class="product-carousel-status">1 / ${galleryImages.length}</div>
        <div class="product-thumbs-shell">
          <button class="thumb-scroll-button thumb-scroll-button-prev" type="button" aria-label="Scroll thumbnails left">&#8249;</button>
          <div class="product-thumbs" role="tablist" aria-label="${shortTitle} images">
            ${galleryImages
              .map(
                (imageSrc, imageIndex) => `
                  <button class="product-thumb${imageIndex === 0 ? " is-active" : ""}" type="button" aria-label="Show image ${imageIndex + 1}" aria-pressed="${imageIndex === 0 ? "true" : "false"}">
                    <img src="${imageSrc}" alt="" width="160" height="160" loading="lazy">
                  </button>
                `
              )
              .join("")}
          </div>
          <button class="thumb-scroll-button thumb-scroll-button-next" type="button" aria-label="Scroll thumbnails right">&#8250;</button>
        </div>
      </div>
      <div class="product-copy product-copy-featured">
        <div>
          <p class="eyebrow">UNIKA ${tone}</p>
          <h3>${shortTitle}</h3>
          <p>${highlights}</p>
        </div>
        <div class="product-meta">
          ${item.ships_from ? `<span class="location-chip">Ships from ${item.ships_from}</span>` : ""}
          ${item.favorites ? `<span class="location-chip">${item.favorites} favorites</span>` : ""}
          <span class="location-chip">${galleryImages.length} photos uploaded</span>
        </div>
        <ul class="feature-list">
          ${(item.description_points || [])
            .slice(0, 4)
            .map((point) => `<li>${point}</li>`)
            .join("")}
        </ul>
        <div class="price-row">
          <span class="price">${moneyFormatter.format(item.price)}</span>
          <a class="button button-secondary" href="${item.listing_url}" target="_blank" rel="noreferrer">View on Etsy</a>
        </div>
      </div>
    `;

    const mainImage = card.querySelector(".product-gallery-image");
    const status = card.querySelector(".product-carousel-status");
    const thumbButtons = [...card.querySelectorAll(".product-thumb")];
    const thumbRail = card.querySelector(".product-thumbs");
    const thumbPrevButton = card.querySelector(".thumb-scroll-button-prev");
    const thumbNextButton = card.querySelector(".thumb-scroll-button-next");
    const prevButton = card.querySelector(".carousel-button-prev");
    const nextButton = card.querySelector(".carousel-button-next");
    let activeIndex = 0;
    let imageTimer;

    const renderCarousel = (imageIndex) => {
      activeIndex = imageIndex;
      mainImage.classList.add("is-changing");
      window.clearTimeout(imageTimer);
      imageTimer = window.setTimeout(() => {
        mainImage.src = galleryImages[imageIndex];
        mainImage.classList.remove("is-changing");
      }, 110);
      status.textContent = `${imageIndex + 1} / ${galleryImages.length}`;
      thumbButtons.forEach((thumb, thumbIndex) => {
        thumb.classList.toggle("is-active", thumbIndex === imageIndex);
        thumb.setAttribute("aria-pressed", thumbIndex === imageIndex ? "true" : "false");
      });
    };

    thumbButtons.forEach((button, imageIndex) => {
      button.addEventListener("click", () => renderCarousel(imageIndex));
    });

    const scrollThumbnails = (direction) => {
      const thumbWidth = thumbButtons[0]?.getBoundingClientRect().width || 72;
      thumbRail.scrollBy({
        left: direction * (thumbWidth + 8) * 3,
        behavior: "smooth"
      });
    };

    thumbPrevButton.addEventListener("click", () => scrollThumbnails(-1));
    thumbNextButton.addEventListener("click", () => scrollThumbnails(1));

    prevButton.addEventListener("click", () => {
      const nextIndex = activeIndex === 0 ? galleryImages.length - 1 : activeIndex - 1;
      renderCarousel(nextIndex);
    });

    nextButton.addEventListener("click", () => {
      const nextIndex = activeIndex === galleryImages.length - 1 ? 0 : activeIndex + 1;
      renderCarousel(nextIndex);
    });

    return card;
  }

  card.className = `product-card product-card-simple product-card-${tone}`;
  card.innerHTML = `
    <div class="product-simple-body">
      <div>
        <p class="eyebrow">Catalog Item</p>
        <h3>${shortTitle}</h3>
        <p>${highlights}</p>
      </div>
      <div class="product-meta">
        ${item.free_shipping ? `<span class="location-chip">Free shipping</span>` : ""}
      </div>
      <div class="price-row">
        <span class="price">${moneyFormatter.format(item.price)}</span>
        <a class="button button-secondary" href="${item.listing_url}" target="_blank" rel="noreferrer">View on Etsy</a>
      </div>
    </div>
  `;

  return card;
};

const populateProducts = () => {
  const productGrid = document.querySelector("#product-grid");
  if (!productGrid) return;

  shopData.active_listings.forEach((item, productIndex) => {
    productGrid.append(buildProductCard(item, productIndex));
  });
};

const populateStory = () => {
  const aboutSummary = document.querySelector("#about-summary");
  const missionSummary = document.querySelector("#mission-summary");
  const treeLocations = document.querySelector("#tree-locations");

  if (aboutSummary) {
    aboutSummary.textContent = `${shopData.about.summary} ${shopData.shop.tagline}`;
  }

  if (missionSummary) {
    missionSummary.textContent = `${shopData.about.video_summary} Customers can request a planting region with their order note, reinforcing the brand's connection to real outdoor stewardship.`;
  }

  if (treeLocations) {
    shopData.about.tree_planting_program.locations_mentioned.forEach((location) => {
      const li = document.createElement("li");
      li.textContent = location;
      treeLocations.append(li);
    });
  }
};

const populateReviews = () => {
  const reviewGrid = document.querySelector("#review-grid");
  if (!reviewGrid) return;

  shopData.shop_reviews.forEach((review) => {
    const card = document.createElement("article");
    card.className = "review-card";
    card.setAttribute("data-reveal", "");
    card.innerHTML = `
      <div class="review-top">
        <span class="reviewer">${review.reviewer}</span>
        <span class="review-rating">${"&#9733;".repeat(review.rating)}${"&#9734;".repeat(5 - review.rating)}</span>
      </div>
      <p>${review.text}</p>
      <span class="review-item">${conciseTitle(review.item)}</span>
    `;
    reviewGrid.append(card);
  });
};

const setupReveal = () => {
  document
    .querySelectorAll(".hero-copy, .hero-gallery-panel, .trust-item, .featured-home-card, .section-heading, .banner-card, .catalog-meta-card, .mission-card")
    .forEach((element) => element.setAttribute("data-reveal", ""));

  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 45, 320)}ms`;
    observer.observe(element);
  });
};

setupNavigation();
populateGlobalBrandLinks();
populateHeroStats();
populateProducts();
populateStory();
populateReviews();
setupReveal();
