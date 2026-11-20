if (window.cartPaypal) {
  window.cartPaypal.Cart({ id: "pp-view-cart" });
  document.querySelectorAll("paypal-add-to-cart-button").forEach((button) => {
    window.cartPaypal.AddToCart({ id: button.dataset.id });
  });
}

document.querySelectorAll("paypal-cart-button").forEach((cart) => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let previousCount = null;
  let bounce;

  const updateCartIcon = () => {
    const button = cart.querySelector("button[aria-label]");
    const countLabel = button?.getAttribute("aria-label")?.match(/\b(\d+)\s+items?\b/i);
    if (!countLabel) return;

    const count = Number(countLabel[1]);
    const icon = button.querySelector("svg");
    if (previousCount !== null && count > previousCount && icon && !reducedMotion.matches) {
      bounce?.cancel();
      bounce = icon.animate(
        [
          { transform: "translateY(0) scale(1)" },
          { transform: "translateY(-5px) scale(1.15)", offset: 0.42 },
          { transform: "translateY(0) scale(1)" }
        ],
        { duration: 360, easing: "ease-out" }
      );
    }
    previousCount = count;
  };

  const observer = new MutationObserver(updateCartIcon);
  observer.observe(cart, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-label"] });
  updateCartIcon();
});

document.querySelectorAll("img[data-green-src]").forEach((photo) => {
  const productName = photo.alt.replace(/^Green /, "");
  const purchase = photo.closest(".store-card, .product-lead")?.querySelector("paypal-add-to-cart-button");
  if (!purchase) return;

  purchase.addEventListener("change", (event) => {
    const control = event.target;
    if (!(control instanceof HTMLSelectElement)) return;

    const color = control.value || "Green";
    const source = photo.dataset[`${color.toLowerCase()}Src`];
    if (!source) return;

    photo.src = source;
    photo.alt = `${color} ${productName}`;
  });
});
