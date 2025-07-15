<script setup>
import { useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { useQueue } from '../composables/useQueue.js'

// --- SETUP ---
const route = useRoute()
const channelId = route.params.channelId
const { currentNumber, lastNumber, callNext } = useQueue(channelId)

// --- RENK ÖZELLEŞTİRME ---
const waitingColor = ref('#f0f2f5')
const myTurnColor = ref('#28a745')

// LocalStorage'dan renkleri okumak ve kaydetmek için anahtarlar
const WAITING_COLOR_KEY = `q-matic-${channelId}-waitingColor`
const MY_TURN_COLOR_KEY = `q-matic-${channelId}-myTurnColor`

// Sayfa yüklendiğinde kayıtlı renkleri yükle
onMounted(() => {
  console.log('🔧 AdminView yüklendi')
  console.log('📍 Channel ID:', channelId)
  console.log('📍 Route params:', route.params)
  console.log('📍 Current URL:', window.location.href)

  waitingColor.value = localStorage.getItem(WAITING_COLOR_KEY) || '#f0f2f5'
  myTurnColor.value = localStorage.getItem(MY_TURN_COLOR_KEY) || '#28a745'

  console.log('✅ AdminView kurulumu tamamlandı')
})

// Renk değiştiğinde LocalStorage'a kaydet
function saveColors() {
  localStorage.setItem(WAITING_COLOR_KEY, waitingColor.value)
  localStorage.setItem(MY_TURN_COLOR_KEY, myTurnColor.value)
}

// --- HESAPLANMIŞ DEĞİŞKENLER ---
const totalWaiting = computed(() => {
  return Math.max(0, lastNumber.value - currentNumber.value)
})

const nextNumberToCall = computed(() => {
  return totalWaiting.value > 0 ? currentNumber.value + 1 : '-'
})
</script>

<template>
  <div class="page">
    <div class="panel-container">
      <!-- Panel Başlığı -->
      <header class="header">
        <span class="channel-name">{{ channelId }}</span> Yönetim Paneli
      </header>

      <!-- Ana Çağrı Alanı -->
      <div class="main-content">
        <button @click="callNext" :disabled="totalWaiting === 0" class="call-button">
          <div v-if="totalWaiting > 0">
            <span class="call-text">SIRADAKİ MÜŞTERİ</span>
            <span class="next-number">{{ nextNumberToCall }}</span>
          </div>
          <span v-else class="call-text">
            SIRADA BEKLEYEN YOK
          </span>
        </button>
      </div>

      <!-- Durum İstatistikleri -->
      <div class="status-grid">
        <div class="status-item">
          <div class="status-label">Verilen Son Numara</div>
          <div class="status-value">{{ currentNumber }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">Bekleyen Kişi</div>
          <div class="status-value">{{ totalWaiting }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">Alınan Son Numara</div>
          <div class="status-value">{{ lastNumber }}</div>
        </div>
      </div>

      <!-- Renk Özelleştirme (Sadece Masaüstü) -->
      <div class="customization-section">
        <h3>Müşteri Ekranı Renkleri</h3>
        <div class="color-pickers">
          <div class="picker">
            <label for="waitingColor">Bekleme Arka Plan</label>
            <input type="color" id="waitingColor" v-model="waitingColor" @change="saveColors">
          </div>
          <div class="picker">
            <label for="myTurnColor">"Sıra Sizde" Arka Plan</label>
            <input type="color" id="myTurnColor" v-model="myTurnColor" @change="saveColors">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mobil öncelikli, Apple tasarım diline uygun stil */
.page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #f2f2f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  padding: 1rem;
  box-sizing: border-box;
}

.panel-container {
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  color: #1d1d1f;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header {
  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e5ea;
}

.channel-name {
  font-weight: 700;
  color: #007aff;
}

.main-content {
  margin-bottom: 1.5rem;
}

.call-button {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  font-weight: bold;
  color: white;
  background-color: #34c759; /* Apple yeşili */
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(52, 199, 89, 0.4);
}

.call-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(52, 199, 89, 0.5);
}

.call-button:disabled {
  background-color: #e5e5ea;
  color: #8e8e93;
  cursor: not-allowed;
  box-shadow: none;
}

.call-text {
  font-size: 1.2rem;
  font-weight: 600;
}

.next-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: 0.25rem;
  display: block;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
  margin-bottom: 2rem;
}

.status-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #6e6e73;
  margin-bottom: 0.25rem;
}

.status-value {
  font-size: 2.2rem;
  font-weight: 600;
  color: #1d1d1f;
}

.customization-section {
  background-color: #f7f7f7;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e5ea;
}

.customization-section h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
}

.color-pickers {
  display: flex;
  justify-content: space-around;
}

.picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.picker label {
  font-size: 0.9rem;
  color: #3c3c43;
}

.picker input[type="color"] {
  width: 44px;
  height: 44px;
  border: 1px solid #dcdcdc;
  border-radius: 50%; /* iOS stili dairesel renk seçici */
  background: none;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
/* Webkit tarayıcıları için renk seçici önizlemesini gizle */
.picker input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
.picker input[type="color"]::-webkit-color-swatch { border: none; border-radius: 50%; }


/* Masaüstü için daha geniş yerleşim */
@media (min-width: 768px) {
  .panel-container {
    max-width: 800px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "header header"
      "main status"
      "custom custom";
    gap: 2rem;
    padding: 2.5rem;
  }

  .header { grid-area: header; font-size: 1.5rem; }
  .main-content { grid-area: main; margin: 0; }
  .status-grid { grid-area: status; display: flex; flex-direction: column; margin: 0; }
  .customization-section { grid-area: custom; }

  .call-button { min-height: 250px; }
  .call-text { font-size: 1.5rem; }
  .next-number { font-size: 4rem; }
  .status-value { font-size: 2.8rem; }
}

</style>
