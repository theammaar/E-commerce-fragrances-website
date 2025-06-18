// Initialize Supabase
const client = supabase.createClient(
  "https://znzmolgvhhrmamvvuonx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuem1vbGd2aGhybWFtdnZ1b254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDUxOTcsImV4cCI6MjA2MDI4MTE5N30.5rDyZ_d9-wPwnwTNdzPmKKTFb0C2yuBLFH4YCxiOA-c"
);

let currentUser = null;

// On page load
document.addEventListener("DOMContentLoaded", async () => {
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  if (userError || !user) {
    alert("You must be logged in to access your cart.");
    window.location.href = "../pages/login.html"; // Redirect to login page if not logged in
    return;
  }

  currentUser = user;
  await loadUserCart();
});

// Load user's cart items from Supabase
async function loadUserCart() {
  const cartList = document.getElementById("cart_items");
  const errorMessage = document.getElementById("errorMessage");

  const { data: cartItems, error } = await client
    .from("cart_items")
    .select("id, quantity, product:product_id(name, price)")
    .eq("user_id", currentUser.id);

  if (error || !cartItems || cartItems.length === 0) {
    errorMessage.style.display = "flex";
    cartList.style.display = "none";
    return;
  }

  errorMessage.style.display = "none";
  cartList.style.display = "block";

  cartList.innerHTML = cartItems
    .map(
      (item) => `
      <li>
        <span>${item.quantity} x ${item.product.name} - $${item.product.price}</span>
        <button onclick="removeFromCart('${item.id}')">Remove</button>
      </li>
    `
    )
    .join("");
}

// Add item to cart
async function addToCart(productId, quantity = 1) {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    alert("Product not found!");
    return;
  }

  if (!currentUser) {
    alert("You must be logged in.");
    return;
  }

  const { error } = await client.from("cart_items").upsert(
    [
      {
        user_id: currentUser.id,
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
      },
    ],
    { onConflict: "user_id,product_id" }
  );

  if (error) {
    console.error("Error adding to cart:", error.message);
    alert("Failed to add to cart.");
  } else {
    alert(`${quantity} ${product.name} added to cart!`);
    await loadUserCart(); // Optional: refresh the cart after adding
  }
}

// Remove cart item from Supabase
async function removeFromCart(cartItemId) {
  const { error } = await client
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", currentUser.id); // Ensure it's this user's item

  if (error) {
    console.error("Error removing from cart:", error.message);
    alert("Failed to remove item.");
    return;
  }

  await loadUserCart(); // Refresh cart
}
