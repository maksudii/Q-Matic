<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, computed, watch } from 'vue'
import { useQueue } from '../composables/useQueue.js'

// --- SETUP ---
const route = useRoute()
const channelId = route.params.channelId
const { myNumber, currentNumber, takeNumber } = useQueue(channelId)

const hasTakenNumber = ref(false)

// --- RENK YÖNETİMİ ---
const loadCustomColors = () => {
  const waitingColor = localStorage.getItem(`q-matic-${channelId}-waitingColor`)
  const myTurnColor = localStorage.getItem(`q-matic-${channelId}-myTurnColor`)

  // CSS değişkenlerini ayarla, eğer kayıtlı renk yoksa varsayılanı kullan
  document.documentElement.style.setProperty('--waiting-bg-color', waitingColor || '#f0f2f5')
  document.documentElement.style.setProperty('--my-turn-bg-color', myTurnColor || '#28a745')
}

// --- YAŞAM DÖNGÜSÜ ---
onMounted(() => {
  console.log('🟢 CustomerView yüklendi')
  console.log('📍 Channel ID:', channelId)
  console.log('📍 Route params:', route.params)
  console.log('📍 Current URL:', window.location.href)

  loadCustomColors() // Sayfa ilk yüklendiğinde renkleri yükle

  if (!myNumber.value) {
    console.log('🎫 Sıra numarası alınıyor...')
    takeNumber()
  }
  hasTakenNumber.value = true

  console.log('✅ CustomerView kurulumu tamamlandı')
})

// Başka bir sekmede renkler değiştirilirse bu değişikliği yakala
window.addEventListener('storage', (event) => {
  if (event.key.startsWith(`q-matic-${channelId}`)) {
    loadCustomColors()
  }
})

// --- HESAPLANMIŞ DEĞİŞKENLER ---
const isMyTurn = computed(() => {
  return myNumber.value && myNumber.value <= currentNumber.value
})

const peopleAhead = computed(() => {
  if (!myNumber.value) return 0
  return Math.max(0, myNumber.value - currentNumber.value - 1)
})
</script>

<template>
  <!-- Sıra sizde ekranı -->
  <div v-if="isMyTurn" class="page my-turn">
    <div class="content-wrapper">
      <div class="turn-title">SIRA SİZDE</div>
      <div class="my-number-large">{{ myNumber }}</div>
      <div class="go-to-desk">Lütfen ilgili bankoya ilerleyiniz.</div>
    </div>
  </div>

  <!-- Bekleme ekranı -->
  <div v-else class="page waiting">
    <div class="content-wrapper">
      <header class="header">
        <div class="ticket-label">SIRA NUMARANIZ</div>
        <div class="my-number">{{ myNumber || '...' }}</div>
      </header>

      <div class="status-grid">
        <div class="status-item">
          <div class="status-label">İLGİLİ BANKO</div>
          <div class="status-value">{{ currentNumber }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">ÖNÜNÜZDEKİ KİŞİ</div>
          <div class="status-value">{{ peopleAhead }}</div>
        </div>
      </div>
    </div>
    <footer class="footer">Sıranız geldiğinde bu ekran otomatik olarak güncellenecektir.</footer>
  </div>
</template>

<style scoped>
/* Apple tasarım prensiplerine uygun, mobil öncelikli arayüz */
:root {
  --waiting-bg-color-default: #ffffff;
  --my-turn-bg-color-default: #34c759;
}

.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  text-align: center;
  transition: background-color 0.5s ease;
  box-sizing: border-box;
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

/* Bekleme Ekranı Stilleri */
.waiting {
  background-color: var(--waiting-bg-color, var(--waiting-bg-color-default));
  color: #1d1d1f;
}

.header {
  margin-bottom: 3rem;
}

.ticket-label {
  font-size: 1rem;
  font-weight: 500;
  color: #8a8a8e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.my-number {
  font-size: 6rem;
  font-weight: 700;
  color: #007aff;
  line-height: 1;
  margin-top: 0.5rem;
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.status-item {
  background: rgba(0, 0, 0, 0.05);
  padding: 1.5rem 1rem;
  border-radius: 12px;
}

.status-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6e6e73;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.status-value {
  font-size: 2.5rem;
  font-weight: 600;
  color: #1d1d1f;
}

.footer {
  width: 100%;
  padding-top: 2rem;
  font-size: 0.9rem;
  color: #8a8a8e;
  max-width: 350px;
  margin: 0 auto;
}

/* "Sıra Sizde" Ekranı Stilleri */
.my-turn {
  background-color: var(--my-turn-bg-color, var(--my-turn-bg-color-default));
  color: white;
  animation: pulse 1.8s infinite ease-in-out;
}

.turn-title {
  font-size: 2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.my-number-large {
  font-size: 11rem;
  font-weight: 700;
  line-height: 1;
  margin: 2rem 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.go-to-desk {
  font-size: 1.2rem;
  font-weight: 500;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
  }
  70% {
    transform: scale(1.01);
    box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

/* Daha küçük ekranlar için ayarlamalar */
@media (max-width: 360px) {
  .my-number {
    font-size: 5rem;
  }
  .status-value {
    font-size: 2rem;
  }
  .my-number-large {
    font-size: 9rem;
  }
}
</style>
