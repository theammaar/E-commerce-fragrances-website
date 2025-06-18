const supabaseUrl = "https://znzmolgvhhrmamvvuonx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuem1vbGd2aGhybWFtdnZ1b254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDUxOTcsImV4cCI6MjA2MDI4MTE5N30.5rDyZ_d9-wPwnwTNdzPmKKTFb0C2yuBLFH4YCxiOA-c";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let fragrances = [];

document.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error fetching products:", error.message);
    return;
  }
  fragrances = data;
});

function showSuggestions() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const suggestionsBox = document.getElementById("suggestionsBox");

  suggestionsBox.innerHTML = "";
  document.getElementById("productDetail").style.display = "none";

  if (!input) return;

  const filteredProducts = fragrances.filter((product) =>
    product.name.toLowerCase().includes(input)
  );

  if (filteredProducts.length === 0) {
    suggestionsBox.innerHTML = "<p>No results found</p>";
    return;
  }

  filteredProducts.forEach((product) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.textContent = product.name;
    suggestionItem.onclick = () => {
      showProductDetail(product);
      clearSuggestions();
    };
    suggestionsBox.appendChild(suggestionItem);
  });
}

function showProductDetail(product) {
  document.getElementById("productDetail").style.display = "block";
  document.getElementById("productLink").href = "#";
  document.getElementById("productImage").src = product.image;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productDescription").textContent =
    product.description;
  document.getElementById("productPrice").textContent = `$${product.price}`;
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  clearSuggestions();
  document.getElementById("productDetail").style.display = "none";
}

function clearSuggestions() {
  document.getElementById("suggestionsBox").innerHTML = "";
}
