import { ref, onMounted, onUnmounted } from 'vue'

// Bu fonksiyonu herhangi bir bileşenden çağırabileceğiz.
// 'channelId' parametresi, hangi sıra kanalında olduğumuzu belirtir (örn: 'noter-5-vezne').
export function useQueue(channelId) {

  // --- REAKTİF DEĞİŞKENLER ---
  // Bu değişkenler değiştiğinde, ekrandaki her şey otomatik olarak güncellenecek.
  const myNumber = ref(null)          // Benim (kullanıcının) sıra numarası
  const currentNumber = ref(0)        // Şu an hizmet verilen numara
  const lastNumber = ref(0)           // En son dağıtılan numara
  const waitingCount = ref(0)         // Sırada bekleyen kişi sayısı

  // --- LOCALSTORAGE ANAHTARLARI ---
  // Her kanalın verisini localStorage'da ayrı ayrı saklamak için.
  const CURRENT_NUMBER_KEY = `q-matic-${channelId}-current`
  const LAST_NUMBER_KEY = `q-matic-${channelId}-last`


  // --- BROADCAST CHANNEL ---
  // Farklı sekmeler/pencereler arasındaki anlık iletişim için sihirli kanalımız.
  const channel = new BroadcastChannel(`q-matic-${channelId}`)


  // --- FONKSİYONLAR ---

  // Depolamadan (localStorage) son verileri okuyup reaktif değişkenleri günceller.
  const syncStateFromStorage = () => {
    currentNumber.value = parseInt(localStorage.getItem(CURRENT_NUMBER_KEY) || '0')
    lastNumber.value = parseInt(localStorage.getItem(LAST_NUMBER_KEY) || '0')
    // Bekleyen kişi sayısı = son verilen numara - şu anki numara
    waitingCount.value = Math.max(0, lastNumber.value - currentNumber.value)
  }

  // Sıra alma fonksiyonu (Müşteri için)
  const takeNumber = () => {
    console.log('🎫 useQueue: Sıra numarası alınıyor...', 'Channel:', channelId)
    // Web Locks API ile aynı anda iki kişinin aynı numarayı almasını engellemeye çalışacağız (şimdilik basit haliyle)
    // Önce son numarayı 1 artır.
    const newNumber = lastNumber.value + 1
    console.log('🔢 useQueue: Yeni numara:', newNumber)
    // Yeni numarayı depolamaya kaydet.
    localStorage.setItem(LAST_NUMBER_KEY, newNumber)
    // Benim numaramı bu yeni numara olarak ayarla.
    myNumber.value = newNumber
    // Durumu tüm cihazlarla senkronize et.
    syncStateFromStorage()
    console.log('✅ useQueue: Sıra numarası verildi:', myNumber.value)
  }

  // Sıradakini çağırma fonksiyonu (Personel için)
  const callNext = () => {
    // Eğer çağrılacak kimse kalmadıysa bir şey yapma.
    if (currentNumber.value >= lastNumber.value) {
      console.log("Sırada bekleyen kimse yok.")
      return
    }
    const nextNumber = currentNumber.value + 1
    localStorage.setItem(CURRENT_NUMBER_KEY, nextNumber)
    // Durumu senkronize et.
    syncStateFromStorage()

    // Diğer tüm sekmelere "bir numara çağrıldı" diye haber ver.
    channel.postMessage({ type: 'CALL', number: nextNumber })
  }

  // Broadcast Channel'dan gelen mesajları dinleyen fonksiyon.
  const handleChannelMessage = (event) => {
    console.log("Mesaj alındı:", event.data)
    // Başka bir sekmeden bir çağrı yapıldığında, bu sekmedeki durumu da güncelle.
    // Bu, hem müşteri ekranının hem de diğer personel ekranlarının güncel kalmasını sağlar.
    syncStateFromStorage()
  }


  // --- YAŞAM DÖNGÜSÜ (LIFECYCLE HOOKS) ---

  // Bu composable kullanıldığı bileşen yüklendiğinde çalışır.
  onMounted(() => {
    // Başlangıçta durumu depolamadan yükle.
    syncStateFromStorage()
    // Gelen mesajları dinlemeye başla.
    channel.addEventListener('message', handleChannelMessage)
  })

  // Bileşen ekrandan kaldırıldığında çalışır (sayfa kapatıldığında vs.)
  onUnmounted(() => {
    // Bellek sızıntılarını önlemek için dinleyiciyi kaldır.
    channel.removeEventListener('message', handleChannelMessage)
    // Kanalı kapat.
    channel.close()
  })


  // --- DIŞARIYA AÇILANLAR ---
  // Bu composable'ı kullanan bileşenin erişebileceği değişken ve fonksiyonlar.
  return {
    myNumber,
    currentNumber,
    lastNumber,
    waitingCount,
    takeNumber,
    callNext
  }
}
