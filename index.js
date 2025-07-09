const { default: makeWASocket, useSingleFileAuthState } = require('@adiwajshing/baileys')
const fs = require('fs')
const catalog = require('./data/catalog.json')
const { state, saveState } = useSingleFileAuthState('./auth_info.json')

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message || m.key.fromMe) return

    const text = m.message.conversation?.toLowerCase()
    const sender = m.key.remoteJid

    if (!text) return

    if (text.includes('halo') || text.includes('sewa')) {
      await sock.sendMessage(sender, {
        text: `Halo! 👋 Selamat datang di *Sewa Camping Bot*

Ketik salah satu angka:
1. Harga Sewa
2. Daftar Peralatan
3. Cara Sewa
4. Sewa Sekarang`
      })
    } else if (text === '1') {
      await sock.sendMessage(sender, {
        text: `💰 *Harga Sewa Peralatan Camping*:

- Tenda 2-3 orang: ${catalog.tenda["2-3 orang"]}
- Tenda 4-5 orang: ${catalog.tenda["4-5 orang"]}
- Matras: ${catalog.matras}
- Sleeping Bag: ${catalog.sleeping_bag}
- Kompor Portable: ${catalog.kompor}
- Nesting Set: ${catalog.nesting}`
      })
    } else if (text === '2') {
      await sock.sendMessage(sender, {
        text: `📦 *Peralatan Tersedia*:
1. Tenda
2. Matras
3. Sleeping Bag
4. Kompor Gas
5. Nesting Set

Ketik angka untuk lihat detail (Contoh: 1)`
      })
    } else if (text === '3') {
      await sock.sendMessage(sender, {
        text: `📋 *Cara Sewa Peralatan:*
1. Isi form sewa
2. Transfer DP 50%
3. Ambil sendiri / dikirim
4. Deposit (jika ada) dikembalikan setelah alat dikembalikan

Ketik *sewa sekarang* untuk isi form`
      })
    } else if (text.includes('sewa sekarang')) {
      await sock.sendMessage(sender, {
        text: `📝 Silakan isi data berikut:

*Nama:*
*Tanggal Sewa:*
*Durasi (berapa hari):*
*Barang yang disewa:*
*Lokasi Pengambilan / Kirim:*`
      })
    } else if (text.includes('nama:')) {
      await sock.sendMessage(sender, {
        text: `✅ Terima kasih! Data sewa kamu sudah tercatat.

Admin akan segera menghubungi kamu untuk konfirmasi. 🌄`
      })
    } else {
      await sock.sendMessage(sender, {
        text: `Maaf, bot tidak mengerti pesan kamu. Ketik *halo* untuk memulai.`
      })
    }
  })

  sock.ev.on('creds.update', saveState)
}

startBot()
