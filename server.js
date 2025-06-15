const express = require("express");
const sql = require("mssql");
const path = require("path");
const app = express();
const PORT = 5500;

// EJS ayarları
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
  res.render("index", { headerClass: "hero", activePage: "index" });
});

app.get("/tours", (req, res) => {
  res.render("tours", { headerClass: "hero", activePage: "tours" });
});

app.get("/destination", (req, res) => {
  res.render("destination", { headerClass: "hero" });
});

app.get("/maldives", (req, res) => {
  res.render("maldives", {
    headerClass: "maldives",
    activePage: "",
    showTitle: true,
  });
});

app.get("/salda", (req, res) => {
  res.render("salda", {
    headerClass: "salda",
    activePage: "",
    showTitle: true,
  });
});

app.get("/alps", (req, res) => {
  res.render("alps", {
    headerClass: "alps",
    activePage: "",
    showTitle: true,
    pageTitle: "Alps",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", { headerClass: "hero", activePage: "contact" });
});

app.get("/book", (req, res) => {
  res.render("book", { headerClass: "book" });
});

app.use(express.static(path.join(__dirname, "public")));

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
