if (window.cartPaypal) {
  window.cartPaypal.Cart({ id: "pp-view-cart" });
  document.querySelectorAll("paypal-add-to-cart-button").forEach((button) => {
    window.cartPaypal.AddToCart({ id: button.dataset.id });
  });
}
