// Shared JavaScript for form validation and Supabase auth
document.addEventListener("DOMContentLoaded", function () {
  const signinForm = document.getElementById("signin-form");
  const createAccountForm = document.getElementById("create-account-form");

  // Initialize Supabase client
  const supabase = window.supabase.createClient(
    "https://znzmolgvhhrmamvvuonx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuem1vbGd2aGhybWFtdnZ1b254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDUxOTcsImV4cCI6MjA2MDI4MTE5N30.5rDyZ_d9-wPwnwTNdzPmKKTFb0C2yuBLFH4YCxiOA-c"
  );

  // Sign In Logic
  if (signinForm) {
    signinForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("pass").value;

      if (!email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Login failed: " + error.message);
        return;
      }

      alert("Login successful!");
      window.location.href = "../pages/home.html";
    });
  }

  // Create Account Logic
  if (createAccountForm) {
    createAccountForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const firstName = document.querySelector('input[name="fn"]').value;
      const lastName = document.querySelector('input[name="ln"]').value;
      const email = document.querySelector('input[name="email"]').value;
      const password = document.querySelector('input[name="pass"]').value;

      if (!firstName || !lastName || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        alert("Account creation failed: " + error.message);
        return;
      }

      alert("Account created! Please check your email to confirm.");
      window.location.href = "../pages/signin.html";
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
