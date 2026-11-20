const setupNavigation = () => {
  const toggle = document.querySelector(".mobile-nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  nav.dataset.collapsible = "";
  toggle.hidden = false;

  const setOpen = (isOpen) => {
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") === "false");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
};

const populateReviews = () => {
  const reviewGrid = document.querySelector("#review-grid");
  if (!reviewGrid || !window.SHOP_DATA) return;

  window.SHOP_DATA.shop_reviews.forEach((review) => {
    const card = document.createElement("article");
    card.className = "review-card";

    const top = document.createElement("div");
    top.className = "review-top";

    const reviewer = document.createElement("span");
    reviewer.className = "reviewer";
    reviewer.textContent = review.reviewer;

    const rating = document.createElement("span");
    rating.className = "review-rating";
    rating.setAttribute("role", "img");
    rating.setAttribute("aria-label", `${review.rating} out of 5 stars`);
    rating.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

    const quote = document.createElement("p");
    quote.textContent = review.text;

    const item = document.createElement("span");
    item.className = "review-item";
    item.textContent = review.item.replace(/^UNIKA\s+/i, "").split(",")[0];

    top.append(reviewer, rating);
    card.append(top, quote, item);
    reviewGrid.append(card);
  });
};

setupNavigation();
populateReviews();
