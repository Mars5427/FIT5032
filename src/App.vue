<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Axu Library</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a
                class="nav-link"
                href="#form-section"
                @click.prevent="scrollToSection('form-section')"
              >
                Form
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="#json-section"
                @click.prevent="scrollToSection('json-section')"
              >
                JSON
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <section id="form-section" class="py-5 bg-light">
      <div class="container">
        <h1 class="text-center mb-4">User Registration</h1>
        <Form />
      </div>
    </section>

    <section id="json-section" class="py-5">
      <div class="container">
        <h1 class="text-center mb-4">Dynamic Data Display</h1>
        <JSON />
      </div>
    </section>

    <footer class="bg-dark text-light py-3 text-center">
      <p class="mb-0">© 2025 Axu Library | Built with Vue 3 & Bootstrap 5</p>
    </footer>
  </div>
</template>

<script setup>
import Form from "./components/Form.vue"
import JSON from "./components/JSON.vue"

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: "smooth" })
  }
}
</script>

<style>
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
section {
  min-height: 100vh;
}
</style>
