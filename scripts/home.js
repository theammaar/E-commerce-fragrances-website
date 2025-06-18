const SUPABASE_URL = "https://znzmolgvhhrmamvvuonx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuem1vbGd2aGhybWFtdnZ1b254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDUxOTcsImV4cCI6MjA2MDI4MTE5N30.5rDyZ_d9-wPwnwTNdzPmKKTFb0C2yuBLFH4YCxiOA-c";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const products = [];

let currentSlide = 1;
const productsPerSlide = 4;
let totalSlides = 1;

async function loadProductsFromSupabase() {
  const { data, error } = await client.from("products").select("*");

  if (error) {
    console.error("Failed to load products:", error);
    return;
  }

  products.push(...data);
  totalSlides = Math.ceil(products.length / productsPerSlide);
  renderProducts();
}

function updateQuantity(change) {
  const quantityBox = document.getElementById("quantityBox");
  let currentValue = parseInt(quantityBox.value) || 1;
  let newValue = currentValue + change;
  if (newValue < 1) newValue = 1;
  quantityBox.value = newValue;
}

async function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    alert("Product not found!");
    return;
  }

  const quantity = parseInt(document.getElementById("quantityBox").value) || 1;

  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError || !user) {
    alert("You must be logged in to add to cart.");
    return;
  }

  const { error: upsertError } = await client.from("cart_items").insert(
    {
      user_id: user.id,
      product_id: product.id,
      quantity: quantity,
    },
    {
      onConflict: "user_id,product_id",
    }
  );

  if (upsertError) {
    console.error("Error adding to cart:", upsertError);
    alert("Could not add to cart. Try again.");
  } else {
    alert(`${quantity} ${product.name} added to cart!`);
  }
}

function renderProducts() {
  const startIdx = (currentSlide - 1) * productsPerSlide;
  const endIdx = startIdx + productsPerSlide;
  const slideProducts = products.slice(startIdx, endIdx);

  document
    .querySelectorAll('[id^="mustProduct"]')
    .forEach((ul) => (ul.innerHTML = ""));

  slideProducts.forEach((product, index) => {
    const productHTML = `
      <li class="product-item">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </li>
    `;
    const ul = document.getElementById(`mustProduct${index + 1}`);
    if (ul) ul.innerHTML = productHTML;
  });

  document.getElementById("currentSlide").textContent = currentSlide;
  document.getElementById("totalSlide").textContent = totalSlides;
}

function prevSlide() {
  if (currentSlide > 1) {
    currentSlide--;
    renderProducts();
  }
}

function nextSlide() {
  if (currentSlide < totalSlides) {
    currentSlide++;
    renderProducts();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadProductsFromSupabase();
});
