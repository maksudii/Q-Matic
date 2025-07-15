<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { nanoid } from 'nanoid'
import { jsPDF } from 'jspdf'
import QrcodeVue from 'qrcode.vue'

// Reactive data
const channelNameInput = ref('')
const channelId = ref('')
const customerUrl = ref('')
const adminUrl = ref('')
const qrCodePrintArea = ref(null)

// Router instance
const router = useRouter()

const createChannel = () => {
  if (!channelNameInput.value) {
    alert('Lütfen bir kanal adı girin!')
    return
  }
  channelId.value = nanoid(10)
  customerUrl.value = `${window.location.origin}/customer/${channelId.value}`
  adminUrl.value = `/admin/${channelId.value}`

  console.log('🏪 Kanal oluşturuldu')
  console.log('📍 Channel ID:', channelId.value)
  console.log('👥 Customer URL:', customerUrl.value)
  console.log('🔧 Admin URL:', adminUrl.value)
  console.log('🌐 Current Origin:', window.location.origin)
}

const goToAdmin = () => {
  console.log('🖱️ Admin butonuna tıklandı!')
  console.log('🎯 Hedef URL:', adminUrl.value)
  console.log('📍 Mevcut URL:', window.location.href)

  try {
    console.log('🔄 Router ile navigation deneniyor...')
    router.push(adminUrl.value)
    console.log('✅ Router push başarılı')
  } catch (err) {
    console.error('❌ Router push hatası:', err)
    console.log('🔄 Fallback: Direkt URL değişimi...')
    const fullUrl = window.location.origin + adminUrl.value
    console.log('🌐 Tam URL:', fullUrl)
    window.location.href = fullUrl
  }
}

const downloadAsPdf = () => {
  const qrCanvas = qrCodePrintArea.value.querySelector('canvas')
  if (!qrCanvas) {
    console.error('QR Code canvas could not be found.')
    return
  }

  const qrCodeImage = qrCanvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [280, 400],
  })

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()

  // Add a light border
  pdf.setDrawColor('#e5e5ea')
  pdf.setLineWidth(1)
  pdf.rect(5, 5, pdfWidth - 10, pdfHeight - 10, 'S')

  // Add Title
  pdf.setFont('Helvetica', 'bold')
  pdf.setFontSize(20)
  pdf.setTextColor('#1d1d1f')
  pdf.text(channelNameInput.value, pdfWidth / 2, 60, { align: 'center' })

  // Add Description
  pdf.setFont('Helvetica', 'normal')
  pdf.setFontSize(12)
  pdf.setTextColor('#6e6e73')
  pdf.text('Sıra almak için QR kodu okutun', pdfWidth / 2, 85, { align: 'center' })

  // Add QR Code
  const qrSize = 200
  const qrX = (pdfWidth - qrSize) / 2
  pdf.addImage(qrCodeImage, 'PNG', qrX, 110, qrSize, qrSize)

  // Add Footer
  pdf.setFontSize(9)
  pdf.setTextColor('#8a8a8e')
  pdf.text('Q-Matic ile oluşturuldu', pdfWidth / 2, pdfHeight - 40, { align: 'center' })

  pdf.save(`${channelNameInput.value || 'qmatic-channel'}-qrcode.pdf`)
}

const printQrCode = () => {
  const qrCanvas = qrCodePrintArea.value.querySelector('canvas')
  if (!qrCanvas) {
    console.error('QR Code canvas could not be found.')
    return
  }
  const qrCodeImage = qrCanvas.toDataURL('image/png')
  const channelName = channelNameInput.value

  const printHtml = `
    <div style="text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 30px; color: #1d1d1f;">
      <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 10px;">${channelName}</h1>
      <p style="font-size: 16px; color: #6e6e73; margin-top: 0; margin-bottom: 30px;">Sıra almak için QR kodu okutun</p>
      <img src="${qrCodeImage}" style="width: 300px; height: 300px;">
    </div>
  `

  const printWin = window.open('', '', 'width=600,height=600')
  printWin.document.open()
  printWin.document.write(`
    <html>
      <head><title>Yazdır | ${channelName}</title></head>
      <body onload="window.print(); setTimeout(function() { window.close() }, 100);">${printHtml}</body>
    </html>
  `)
  printWin.document.close()
}
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="header">
        <img src="/pwa-192x192.png" alt="Q-Matic Logo" class="logo" />
        <h1>Q-Matic'e Hoş Geldiniz</h1>
        <p>Kendi akıllı sıramatiğinizi saniyeler içinde oluşturun.</p>
      </header>

      <div class="form-container">
        <input
          v-model="channelNameInput"
          @keyup.enter="createChannel"
          type="text"
          placeholder="Örn: Noter 5. Vezne"
          class="channel-input"
        />
        <button @click="createChannel" class="create-button">Oluştur</button>
      </div>

      <div v-if="customerUrl" class="result-container">
        <!-- Bu bölüm PDF'e veya yazıcıya gönderilecek -->
        <div ref="qrCodePrintArea" class="qr-code-print-area">
          <h2>{{ channelNameInput }}</h2>
          <p class="qr-description">Sıra almak için QR kodu okutun</p>
          <div class="qr-code-wrapper">
            <QrcodeVue :value="customerUrl" :size="220" level="H" />
          </div>
        </div>

        <div class="actions">
          <button @click="downloadAsPdf" class="action-button pdf">PDF İndir</button>
          <button @click="printQrCode" class="action-button print">Yazdır</button>
        </div>

        <div class="admin-section">
          <p>Sırayı yönetmek için aşağıdaki linki kullanın:</p>
          <button @click="goToAdmin" class="admin-link">Yönetim Paneline Git</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Apple Human Interface Guidelines'dan ilham alan mobil öncelikli tasarım */
.page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
  min-height: 100vh;
  background-color: #f9f9f9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
}
.container {
  width: 100%;
  max-width: 500px;
  text-align: center;
  margin: 0 auto;
  box-sizing: border-box;
}
.header {
  margin-bottom: 2rem;
}
.logo {
  width: 70px;
  height: 70px;
  margin-bottom: 1rem;
  border-radius: 16px;
}
h1 {
  font-size: 2.2rem;
  font-weight: 600;
  color: #1d1d1f;
}
p {
  font-size: 1.1rem;
  color: #6e6e73;
}
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
}
.channel-input {
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 12px;
  border: 1px solid #dcdcdc;
  text-align: center;
  background-color: #fff;
  transition: box-shadow 0.2s;
}
.channel-input:focus {
  outline: none;
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.3);
}
.create-button {
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background-color: #007aff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.create-button:hover {
  background-color: #005ecb;
}
.result-container {
  background-color: #fff;
  padding: 0;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.qr-code-print-area {
  padding: 2rem 1.5rem;
}
.qr-code-print-area h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 0.5rem 0;
}
.qr-description {
  color: #6e6e73;
  margin-bottom: 1.5rem;
}
.qr-code-wrapper {
  margin: 1.5rem 0;
  padding: 1rem;
  background: white;
  display: inline-block;
  border-radius: 8px;
}
.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 1.5rem;
}
.action-button {
  flex-grow: 1;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition:
    transform 0.2s,
    background-color 0.2s;
  background-color: #f0f0f0;
  color: #007aff;
}
.action-button:hover {
  transform: scale(1.03);
  background-color: #e5e5e5;
}
.admin-section {
  padding: 0 1.5rem 1.5rem;
}
.admin-section p {
  font-size: 0.9rem;
  color: #6e6e73;
  margin: 0 0 0.75rem 0;
}
.admin-link {
  display: inline-block;
  width: 100%;
  padding: 0.9rem 1.5rem;
  background-color: #34c759;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.admin-link:hover {
  background-color: #2ca348;
}
</style>
