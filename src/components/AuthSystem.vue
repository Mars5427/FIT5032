<!-- AuthSystem.vue - 认证系统组件 -->
<template>
  <div>
    <!-- 登录模态框 -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="loginModalLabel">
              <i class="fas fa-sign-in-alt me-2"></i>Login
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="loginEmail" class="form-label">Email Address</label>
                <input
                  type="email"
                  class="form-control"
                  id="loginEmail"
                  v-model="loginForm.email"
                  :class="{ 'is-invalid': loginErrors.email }"
                  @blur="validateLoginEmail"
                  @input="clearLoginError('email')"
                  required
                >
                <div v-if="loginErrors.email" class="invalid-feedback">{{ loginErrors.email }}</div>
              </div>
              <div class="mb-3">
                <label for="loginPassword" class="form-label">Password</label>
                <div class="input-group">
                  <input
                    :type="showLoginPassword ? 'text' : 'password'"
                    class="form-control"
                    id="loginPassword"
                    v-model="loginForm.password"
                    :class="{ 'is-invalid': loginErrors.password }"
                    @blur="validateLoginPassword"
                    @input="clearLoginError('password')"
                    required
                  >
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showLoginPassword = !showLoginPassword"
                  >
                    <i :class="showLoginPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="loginErrors.password" class="invalid-feedback">{{ loginErrors.password }}</div>
              </div>
              <div v-if="loginErrors.general" class="alert alert-danger">{{ loginErrors.general }}</div>
              <button type="submit" class="btn btn-primary w-100" :disabled="!isLoginFormValid">
                <i class="fas fa-sign-in-alt me-2"></i>Login
              </button>
            </form>
            <div class="text-center mt-3">
              <p class="mb-0">Don't have an account? 
                <button type="button" class="btn btn-link p-0" @click="switchToRegister">Register here</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 注册模态框 -->
    <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title" id="registerModalLabel">
              <i class="fas fa-user-plus me-2"></i>Create Account
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="register">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="firstName" class="form-label">First Name *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="firstName"
                    v-model="registerForm.firstName"
                    :class="{ 'is-invalid': registerErrors.firstName }"
                    @blur="validateFirstName"
                    @input="clearRegisterError('firstName')"
                    required
                  >
                  <div v-if="registerErrors.firstName" class="invalid-feedback">{{ registerErrors.firstName }}</div>
                </div>
                <div class="col-md-6">
                  <label for="lastName" class="form-label">Last Name *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="lastName"
                    v-model="registerForm.lastName"
                    :class="{ 'is-invalid': registerErrors.lastName }"
                    @blur="validateLastName"
                    @input="clearRegisterError('lastName')"
                    required
                  >
                  <div v-if="registerErrors.lastName" class="invalid-feedback">{{ registerErrors.lastName }}</div>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="registerEmail" class="form-label">Email Address *</label>
                <input
                  type="email"
                  class="form-control"
                  id="registerEmail"
                  v-model="registerForm.email"
                  :class="{ 'is-invalid': registerErrors.email }"
                  @blur="validateRegisterEmail"
                  @input="clearRegisterError('email')"
                  required
                >
                <div v-if="registerErrors.email" class="invalid-feedback">{{ registerErrors.email }}</div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="registerPassword" class="form-label">Password *</label>
                  <div class="input-group">
                    <input
                      :type="showRegisterPassword ? 'text' : 'password'"
                      class="form-control"
                      id="registerPassword"
                      v-model="registerForm.password"
                      :class="{ 'is-invalid': registerErrors.password }"
                      @blur="validateRegisterPassword"
                      @input="clearRegisterError('password')"
                      required
                    >
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showRegisterPassword = !showRegisterPassword"
                    >
                      <i :class="showRegisterPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <div v-if="registerErrors.password" class="invalid-feedback">{{ registerErrors.password }}</div>
                </div>
                <div class="col-md-6">
                  <label for="confirmPassword" class="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    v-model="registerForm.confirmPassword"
                    :class="{ 'is-invalid': registerErrors.confirmPassword }"
                    @blur="validateConfirmPassword"
                    @input="clearRegisterError('confirmPassword')"
                    required
                  >
                  <div v-if="registerErrors.confirmPassword" class="invalid-feedback">{{ registerErrors.confirmPassword }}</div>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="age" class="form-label">Age Range *</label>
                  <select
                    class="form-select"
                    id="age"
                    v-model="registerForm.age"
                    :class="{ 'is-invalid': registerErrors.age }"
                    @blur="validateAge"
                    required
                  >
                    <option value="">Select age range</option>
                    <option value="13-17">13-17 years</option>
                    <option value="18-24">18-24 years</option>
                    <option value="25-30">25-30 years</option>
                    <option value="31+">31+ years</option>
                  </select>
                  <div v-if="registerErrors.age" class="invalid-feedback">{{ registerErrors.age }}</div>
                </div>
                <div class="col-md-6">
                  <label for="role" class="form-label">Account Type *</label>
                  <select
                    class="form-select"
                    id="role"
                    v-model="registerForm.role"
                    :class="{ 'is-invalid': registerErrors.role }"
                    @blur="validateRole"
                    required
                  >
                    <option value="">Select account type</option>
                    <option value="user">User - Seeking support and resources</option>
                    <option value="counselor">Counselor - Mental health professional</option>
                    <option value="admin">Admin - System administrator</option>
                  </select>
                  <div v-if="registerErrors.role" class="invalid-feedback">{{ registerErrors.role }}</div>
                </div>
              </div>

              <!-- 专业认证信息（仅对counselor显示） -->
              <div v-if="registerForm.role === 'counselor'" class="mb-3">
                <label for="credentials" class="form-label">Professional Credentials *</label>
                <textarea
                  class="form-control"
                  id="credentials"
                  v-model="registerForm.credentials"
                  :class="{ 'is-invalid': registerErrors.credentials }"
                  @blur="validateCredentials"
                  @input="clearRegisterError('credentials')"
                  placeholder="Please provide your professional qualifications, license numbers, and experience"
                  rows="3"
                ></textarea>
                <div v-if="registerErrors.credentials" class="invalid-feedback">{{ registerErrors.credentials }}</div>
                <small class="form-text text-muted">Counselor accounts require verification before activation.</small>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="agreeTerms"
                    v-model="registerForm.agreeTerms"
                    :class="{ 'is-invalid': registerErrors.agreeTerms }"
                    @change="validateAgreeTerms"
                  >
                  <label class="form-check-label" for="agreeTerms">
                    I agree to the <a href="#" class="text-decoration-none">Terms of Service</a> and <a href="#" class="text-decoration-none">Privacy Policy</a> *
                  </label>
                  <div v-if="registerErrors.agreeTerms" class="invalid-feedback">{{ registerErrors.agreeTerms }}</div>
                </div>
              </div>

              <div v-if="registerErrors.general" class="alert alert-danger">{{ registerErrors.general }}</div>
              
              <button type="submit" class="btn btn-success w-100" :disabled="!isRegisterFormValid">
                <i class="fas fa-user-plus me-2"></i>Create Account
              </button>
            </form>
            <div class="text-center mt-3">
              <p class="mb-0">Already have an account? 
                <button type="button" class="btn btn-link p-0" @click="switchToLogin">Login here</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户资料模态框 -->
    <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title" id="profileModalLabel">
              <i class="fas fa-user me-2"></i>User Profile
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="currentUser">
            <div class="row">
              <div class="col-md-4 text-center">
                <div class="profile-avatar mb-3">
                  <i class="fas fa-user-circle display-1 text-primary"></i>
                </div>
                <h5>{{ currentUser.firstName }} {{ currentUser.lastName }}</h5>
                <span class="badge fs-6" :class="getRoleBadgeClass(currentUser.role)">
                  <i :class="getRoleIcon(currentUser.role)" class="me-1"></i>
                  {{ getRoleDisplayName(currentUser.role) }}
                </span>
              </div>
              <div class="col-md-8">
                <div class="card">
                  <div class="card-header">
                    <h6 class="mb-0">Account Information</h6>
                  </div>
                  <div class="card-body">
                    <div class="row mb-2">
                      <div class="col-sm-4"><strong>Email:</strong></div>
                      <div class="col-sm-8">{{ currentUser.email }}</div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-sm-4"><strong>Age Range:</strong></div>
                      <div class="col-sm-8">{{ currentUser.age }}</div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-sm-4"><strong>Member Since:</strong></div>
                      <div class="col-sm-8">{{ formatDate(currentUser.createdAt) }}</div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-sm-4"><strong>Account Status:</strong></div>
                      <div class="col-sm-8">
                        <span class="badge" :class="currentUser.isVerified ? 'bg-success' : 'bg-warning'">
                          {{ currentUser.isVerified ? 'Verified' : 'Pending Verification' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 专业认证信息（仅counselor） -->
                <div v-if="currentUser.role === 'counselor'" class="card mt-3">
                  <div class="card-header">
                    <h6 class="mb-0">Professional Information</h6>
                  </div>
                  <div class="card-body">
                    <p><strong>Credentials:</strong></p>
                    <p class="text-muted">{{ currentUser.credentials }}</p>
                  </div>
                </div>

                <!-- 用户统计 -->
                <div class="card mt-3">
                  <div class="card-header">
                    <h6 class="mb-0">Activity Statistics</h6>
                  </div>
                  <div class="card-body">
                    <div class="row text-center">
                      <div class="col-4">
                        <div class="stat-item">
                          <h4 class="text-primary">{{ getUserStats().resourcesAccessed }}</h4>
                          <small class="text-muted">Resources Accessed</small>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="stat-item">
                          <h4 class="text-success">{{ getUserStats().ratingsGiven }}</h4>
                          <small class="text-muted">Ratings Given</small>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="stat-item">
                          <h4 class="text-info">{{ getUserStats().supportRequests }}</h4>
                          <small class="text-muted">Support Requests</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" @click="logout">
              <i class="fas fa-sign-out-alt me-2"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineExpose } from 'vue'

// Props and Emits
const emit = defineEmits(['user-logged-in', 'user-logged-out', 'auth-state-changed'])

// 登录表单数据
const loginForm = ref({
  email: '',
  password: ''
})

const loginErrors = ref({
  email: null,
  password: null,
  general: null
})

const showLoginPassword = ref(false)

// 注册表单数据
const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  role: '',
  credentials: '',
  agreeTerms: false
})

const registerErrors = ref({
  firstName: null,
  lastName: null,
  email: null,
  password: null,
  confirmPassword: null,
  age: null,
  role: null,
  credentials: null,
  agreeTerms: null,
  general: null
})

const showRegisterPassword = ref(false)

// 当前用户
const currentUser = ref(null)
const isLoggedIn = ref(false)

// 用户数据库（模拟数据库）
const users = ref([])

// 安全功能：XSS防护
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// 密码强度检查
const checkPasswordStrength = (password) => {
  const checks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
  
  const score = Object.values(checks).filter(Boolean).length
  return {
    score,
    checks,
    strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong'
  }
}

// 邮箱验证
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 登录验证方法
const validateLoginEmail = () => {
  if (!loginForm.value.email) {
    loginErrors.value.email = 'Email is required'
  } else if (!validateEmail(loginForm.value.email)) {
    loginErrors.value.email = 'Please enter a valid email address'
  } else {
    loginErrors.value.email = null
  }
}

const validateLoginPassword = () => {
  if (!loginForm.value.password) {
    loginErrors.value.password = 'Password is required'
  } else {
    loginErrors.value.password = null
  }
}

const clearLoginError = (field) => {
  loginErrors.value[field] = null
  loginErrors.value.general = null
}

// 注册验证方法
const validateFirstName = () => {
  const name = sanitizeInput(registerForm.value.firstName)
  if (!name.trim()) {
    registerErrors.value.firstName = 'First name is required'
  } else if (name.trim().length < 2) {
    registerErrors.value.firstName = 'First name must be at least 2 characters'
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    registerErrors.value.firstName = 'First name should only contain letters'
  } else {
    registerErrors.value.firstName = null
  }
}

const validateLastName = () => {
  const name = sanitizeInput(registerForm.value.lastName)
  if (!name.trim()) {
    registerErrors.value.lastName = 'Last name is required'
  } else if (name.trim().length < 2) {
    registerErrors.value.lastName = 'Last name must be at least 2 characters'
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    registerErrors.value.lastName = 'Last name should only contain letters'
  } else {
    registerErrors.value.lastName = null
  }
}

const validateRegisterEmail = () => {
  const email = sanitizeInput(registerForm.value.email)
  if (!email) {
    registerErrors.value.email = 'Email is required'
  } else if (!validateEmail(email)) {
    registerErrors.value.email = 'Please enter a valid email address'
  } else if (users.value.some(user => user.email === email)) {
    registerErrors.value.email = 'Email already exists'
  } else {
    registerErrors.value.email = null
  }
}

const validateRegisterPassword = () => {
  const password = registerForm.value.password
  if (!password) {
    registerErrors.value.password = 'Password is required'
  } else {
    const strength = checkPasswordStrength(password)
    if (strength.score < 3) {
      registerErrors.value.password = 'Password is too weak. Include uppercase, lowercase, numbers, and special characters'
    } else {
      registerErrors.value.password = null
    }
  }
}

const validateConfirmPassword = () => {
  if (!registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = 'Please confirm your password'
  } else if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = 'Passwords do not match'
  } else {
    registerErrors.value.confirmPassword = null
  }
}

const validateAge = () => {
  if (!registerForm.value.age) {
    registerErrors.value.age = 'Please select your age range'
  } else {
    registerErrors.value.age = null
  }
}

const validateRole = () => {
  if (!registerForm.value.role) {
    registerErrors.value.role = 'Please select account type'
  } else {
    registerErrors.value.role = null
  }
}

const validateCredentials = () => {
  if (registerForm.value.role === 'counselor') {
    const credentials = sanitizeInput(registerForm.value.credentials)
    if (!credentials.trim()) {
      registerErrors.value.credentials = 'Professional credentials are required for counselor accounts'
    } else if (credentials.trim().length < 20) {
      registerErrors.value.credentials = 'Please provide detailed credentials (minimum 20 characters)'
    } else {
      registerErrors.value.credentials = null
    }
  } else {
    registerErrors.value.credentials = null
  }
}

const validateAgreeTerms = () => {
  if (!registerForm.value.agreeTerms) {
    registerErrors.value.agreeTerms = 'You must agree to the terms and conditions'
  } else {
    registerErrors.value.agreeTerms = null
  }
}

const clearRegisterError = (field) => {
  registerErrors.value[field] = null
  registerErrors.value.general = null
}

// 计算属性
const isLoginFormValid = computed(() => {
  return loginForm.value.email && 
         loginForm.value.password && 
         !loginErrors.value.email && 
         !loginErrors.value.password
})

const isRegisterFormValid = computed(() => {
  const baseValid = registerForm.value.firstName &&
                   registerForm.value.lastName &&
                   registerForm.value.email &&
                   registerForm.value.password &&
                   registerForm.value.confirmPassword &&
                   registerForm.value.age &&
                   registerForm.value.role &&
                   registerForm.value.agreeTerms
  
  const credentialsValid = registerForm.value.role !== 'counselor' || registerForm.value.credentials
  
  const noErrors = !Object.values(registerErrors.value).some(error => error !== null)
  
  return baseValid && credentialsValid && noErrors
})

// 认证方法
const login = async () => {
  validateLoginEmail()
  validateLoginPassword()
  
  if (!isLoginFormValid.value) return
  
  // 模拟登录验证
  const email = sanitizeInput(loginForm.value.email)
  const password = loginForm.value.password
  
  const user = users.value.find(u => u.email === email && u.password === password)
  
  if (user) {
    currentUser.value = { ...user }
    isLoggedIn.value = true
    
    // 更新最后登录时间
    user.lastLoginAt = new Date().toISOString()
    saveUsers()
    
    // 清除表单
    loginForm.value = { email: '', password: '' }
    Object.keys(loginErrors.value).forEach(key => loginErrors.value[key] = null)
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'))
    modal?.hide()
    
    emit('user-logged-in', currentUser.value)
    emit('auth-state-changed', { isLoggedIn: true, user: currentUser.value })
  } else {
    loginErrors.value.general = 'Invalid email or password'
  }
}

const register = async () => {
  // 验证所有字段
  validateFirstName()
  validateLastName()
  validateRegisterEmail()
  validateRegisterPassword()
  validateConfirmPassword()
  validateAge()
  validateRole()
  validateCredentials()
  validateAgreeTerms()
  
  if (!isRegisterFormValid.value) return
  
  // 创建新用户
  const newUser = {
    id: Date.now(),
    firstName: sanitizeInput(registerForm.value.firstName),
    lastName: sanitizeInput(registerForm.value.lastName),
    email: sanitizeInput(registerForm.value.email),
    password: registerForm.value.password, // 在实际应用中应该加密
    age: registerForm.value.age,
    role: registerForm.value.role,
    credentials: registerForm.value.role === 'counselor' ? sanitizeInput(registerForm.value.credentials) : null,
    isVerified: registerForm.value.role !== 'counselor', // counselor需要验证
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    stats: {
      resourcesAccessed: 0,
      ratingsGiven: 0,
      supportRequests: 0
    }
  }
  
  users.value.push(newUser)
  saveUsers()
  
  // 清除表单
  clearRegisterForm()
  
  // 关闭注册模态框，打开登录模态框
  const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'))
  registerModal?.hide()
  
  setTimeout(() => {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'))
    loginModal.show()
    
    // 预填邮箱
    loginForm.value.email = newUser.email
  }, 500)
  
  alert('Account created successfully! Please log in.')
}

const logout = () => {
  currentUser.value = null
  isLoggedIn.value = false
  
  // 关闭资料模态框
  const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'))
  modal?.hide()
  
  emit('user-logged-out')
  emit('auth-state-changed', { isLoggedIn: false, user: null })
}

// 辅助方法
const clearRegisterForm = () => {
  registerForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    role: '',
    credentials: '',
    agreeTerms: false
  }
  
  Object.keys(registerErrors.value).forEach(key => {
    registerErrors.value[key] = null
  })
}

const switchToRegister = () => {
  const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'))
  loginModal?.hide()
  
  setTimeout(() => {
    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'))
    registerModal.show()
  }, 500)
}

const switchToLogin = () => {
  const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'))
  registerModal?.hide()
  
  setTimeout(() => {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'))
    loginModal.show()
  }, 500)
}

const getRoleBadgeClass = (role) => {
  const classes = {
    'user': 'bg-primary',
    'counselor': 'bg-success',
    'admin': 'bg-danger'
  }
  return classes[role] || 'bg-secondary'
}

const getRoleIcon = (role) => {
  const icons = {
    'user': 'fas fa-user',
    'counselor': 'fas fa-user-md',
    'admin': 'fas fa-user-shield'
  }
  return icons[role] || 'fas fa-user'
}

const getRoleDisplayName = (role) => {
  const names = {
    'user': 'User',
    'counselor': 'Mental Health Counselor',
    'admin': 'Administrator'
  }
  return names[role] || 'User'
}

const getUserStats = () => {
  return currentUser.value?.stats || {
    resourcesAccessed: 0,
    ratingsGiven: 0,
    supportRequests: 0
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// 数据持久化
const saveUsers = () => {
  localStorage.setItem('mental_health_users', JSON.stringify(users.value))
}

