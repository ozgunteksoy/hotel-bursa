const express = require("express");
const sql = require("mssql");
const path = require("path");
const app = express();
const PORT = 5500;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MSSQL bağlantı ayarları
const config = {
  user: "sa",
  password: "Password1.",
  server: "localhost",
  database: "TravelDB",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Veritabanı bağlantısı
let pool;

sql
  .connect(config)
  .then((p) => {
    pool = p;
    console.log("✅ Veritabanı bağlantısı başarılı.");
  })
  .catch((err) => {
    console.error("❌ Veritabanı bağlantı hatası:", err);
  });

// ✉️ Mesaj gönderme
app.post("/mesaj", async (req, res) => {
  const { name, surname, email, message } = req.body;

  if (!pool) {
    return res.status(500).send("Veritabanı bağlantısı mevcut değil.");
  }

  try {
    await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("surname", sql.VarChar, surname)
      .input("email", sql.VarChar, email)
      .input("message", sql.Text, message).query(`
        INSERT INTO Mesajlar (name, surname, email, message)
        VALUES (@name, @surname, @email, @message)
      `);

    res.send(`Thank you, ${name}! Your message has been received.`);
  } catch (error) {
    console.error("❌ Mesaj kaydetme hatası:", error);
    res.status(500).send("Mesaj gönderilemedi.");
  }
});

// 🏨 Rezervasyon
app.post("/rezervasyon", async (req, res) => {
  const { name, surname, checkin, checkout, people, room_count } = req.body;

  if (!pool) {
    return res.status(500).send("Veritabanı bağlantısı mevcut değil.");
  }

  try {
    await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("surname", sql.VarChar, surname)
      .input("checkin", sql.Date, checkin)
      .input("checkout", sql.Date, checkout)
      .input("people", sql.Int, people)
      .input("room_count", sql.Int, room_count).query(`
        INSERT INTO Rezervasyonlar (name, surname, checkin, checkout, people, room_count)
        VALUES (@name, @surname, @checkin, @checkout, @people, @room_count)
      `);

    res.send("Rezervasyon başarıyla kaydedildi!");
  } catch (error) {
    console.error("❌ Rezervasyon hatası:", error);
    res.status(500).send("Rezervasyon kaydedilemedi.");
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});
