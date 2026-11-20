if (window.cartPaypal) {
  window.cartPaypal.Cart({ id: "pp-view-cart" });
  document.querySelectorAll("paypal-add-to-cart-button").forEach((button) => {
    window.cartPaypal.AddToCart({ id: button.dataset.id });
  });
}

document.querySelectorAll(".store-card img[data-green-src]").forEach((photo) => {
  const productName = photo.alt.replace(/^Green /, "");
  const purchase = photo.closest(".store-card").querySelector("paypal-add-to-cart-button");
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
