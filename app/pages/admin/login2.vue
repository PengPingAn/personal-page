<template>
  <div class="container-wrapper">
    <div class="container">
      <!-- Left Section -->
      <div class="left-section">
        <!-- Content -->
        <div class="content">
          <h1 class="title">LOG IN<span class="title-dot">.</span></h1>

          <!-- Form -->
          <form class="form" @submit.prevent="handleSubmit">
            <!-- Email -->
            <div class="input-group">
              <label class="input-label">Account</label>
              <div class="input-wrapper">
                <input
                  autofocus
                  type="email"
                  class="input-field"
                  v-model="email"
                  @focus="handleFocus($event)"
                  @blur="handleBlur($event)"
                />

                <span class="input-icon"><span class="mdi-light--account"></span></span>
              </div>
            </div>

            <!-- Password -->
            <div class="input-group">
              <label class="input-label">Password</label>
              <div class="input-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="input-field password-field"
                  v-model="password"
                  @focus="handleFocus($event)"
                  @blur="handleBlur($event)"
                />
                <span class="input-icon" @click="togglePassword">
                  {{ showPassword ? "👁‍🗨" : "👁" }}
                </span>
              </div>
            </div>

            <!-- Buttons -->
            <div class="button-group">
              <button type="submit" class="login-button">
                <span>Log In</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <div class="divider-line">
          <svg viewBox="0 0 2 900" preserveAspectRatio="none">
            <path
              d="M 1 0 Q 1 150, 1 300 T 1 600 T 1 900"
              stroke="#d0d0d0"
              stroke-width="2"
              stroke-dasharray="8,8"
              fill="none"
            />
          </svg>
        </div>

        <div class="image-container">
          <img
            src="https://w.wallhaven.cc/full/qr/wallhaven-qr27rq.jpg"
            alt="Mountain Lake"
            class="mountain-image"
          />
        </div>

        <div class="image-logo">
          <div class="logo-shape">
            <div class="logo-dot"></div>
            <div class="logo-bars">
              <div class="logo-bar"></div>
              <div class="logo-bar"></div>
              <div class="logo-bar"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

// Name fields
const nameFields = reactive([
  { label: "First name", value: "Michał" },
  { label: "Last name", value: "Masiak" },
]);

const email = ref("");
const password = ref("");
const showPassword = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function handleSubmit() {
  console.log("Form submitted!");
  console.log({
    firstName: nameFields[0].value,
    lastName: nameFields[1].value,
    email: email.value,
    password: password.value,
  });
  window.toast?.success("登录成功，正在进入系统！");
}

// Focus effects
function handleFocus(e) {
  e.target.parentElement.parentElement.style.transform = "translateY(-2px)";
}
function handleBlur(e) {
  e.target.parentElement.parentElement.style.transform = "translateY(0)";
}
</script>

<style lang="css" scoped>
.container-wrapper {
  /* background: linear-gradient(135deg, #e8eaf6 0%, #f5f5f5 100%); */
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100vw;
}

.container {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  position: relative;
  /* min-height: 700px; */
}

/* Left section */
.left-section {
  padding: 60px 80px;
  position: relative;
  z-index: 2;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}

.logo-circle {
  width: 32px;
  height: 32px;
  background: #4285f4;
  border-radius: 50%;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #000;
}

.nav {
  position: absolute;
  top: 60px;
  right: 80px;
  display: flex;
  gap: 32px;
}

.nav a {
  color: #b0b0b0;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.3s;
}

.nav a:hover {
  color: #4285f4;
}

.content {
  margin-top: 80px;
}

.subtitle {
  font-size: 13px;
  letter-spacing: 2px;
  color: #b0b0b0;
  font-weight: 500;
  margin-bottom: 16px;
}

.title {
  font-size: 48px;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
  line-height: 1.2;
}

.title-dot {
  color: #4285f4;
}

.login-link {
  color: #9e9e9e;
  font-size: 15px;
  margin-bottom: 40px;
  display: block;
}

.login-link a {
  color: #4285f4;
  text-decoration: none;
  font-weight: 500;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.input-group {
  position: relative;
}

.input-label {
  font-size: 12px;
  color: #9e9e9e;
  margin-bottom: 8px;
  display: block;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: 8px 48px 8px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #000;
  background: #fafafa;
  transition: all 0.3s;
  outline: none;
}

.input-field:focus {
  border-color: #4285f4;
  background: white;
}

.input-field.password-field {
  border-color: #00bcd4;
  background: white;
}

.input-icon {
  position: absolute;
  right: 16px;
  color: #b0b0b0;
  cursor: pointer;
  font-size: 18px;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  justify-content: center;
}

.login-button {
  display: inline-block;
  border-radius: 4px;
  background-color: #3d405b;
  border: none;
  color: #ffffff;
  text-align: center;
  font-size: 17px;
  padding: 7px;
  width: 130px;
  transition: all 0.5s;
  cursor: pointer;
  margin: 5px;
}

button span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.login-button span:after {
  content: "»";
  position: absolute;
  opacity: 0;
  top: 0;
  right: -15px;
  transition: 0.5s;
}

.login-button:hover span {
  padding-right: 15px;
}

.login-button:hover span:after {
  opacity: 1;
  right: 0;
}

/* Right section */
.right-section {
  position: relative;
  overflow: visible;
}

.image-container {
  position: absolute;
  top: 0px;
  right: -40px;
  bottom: -40px;
  width: 100%;
  /* clip-path: path("M 150 0 Q 100 150, 150 300 T 150 600 T 150 900 L 800 900 L 800 0 Z"); */
  /* clip-path: path(
    "M 249 0 C 343 163, 80 200, 224 300 S 60 400, 150 600 S 70 800, 160 900 L 1000 900 L 1000 0 Z"
  ); */
  clip-path: path(
    "M296 0 C50 88,338 114,169 185 S327 288,170 344 S131 383,27 481 S190 581,177 638 S205 750,200 800 L400 900 L400 0 Z"
  );
}

.mountain-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.divider-line {
  position: absolute;
  top: 0;
  left: -2px;
  width: 2px;
  height: 100%;
  z-index: 1;
}

.divider-line svg {
  width: 100%;
  height: 100%;
}

.image-logo {
  position: absolute;
  bottom: 60px;
  right: 60px;
  z-index: 3;
}

.logo-shape {
  display: flex;
  gap: 8px;
  align-items: center;
}

.logo-dot {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
}

.logo-bars {
  display: flex;
  gap: 4px;
}

.logo-bar {
  width: 8px;
  height: 32px;
  background: white;
  transform: skewX(-10deg);
}

@media (max-width: 968px) {
  .container {
    grid-template-columns: 1fr;
  }

  .right-section {
    display: none;
  }

  .left-section {
    padding: 40px;
  }

  .nav {
    position: static;
    margin-bottom: 40px;
  }
}
</style>
