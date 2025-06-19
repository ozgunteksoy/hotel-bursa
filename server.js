const express = require("express");
const sql = require("mssql");
const path = require("path");
const app = express();
const PORT = 5500;
const nodemailer = require("nodemailer");
const { name } = require("ejs");

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

app.get("/beach/beach", (req, res) => {
  res.render("beach/beach", {
    headerClass: "alps",
    activePage: "beach",
    showTitle: true,
  });
});

app.get("/beach/gemlik", (req, res) => {
  res.render("beach/gemlik", {
    headerClass: "alps",
    activePage: "gemlik",
    showTitle: true,
  });
});

app.get("/beach/iznik", (req, res) => {
  res.render("beach/iznik", {
    headerClass: "alps",
    activePage: "iznik",
    showTitle: true,
  });
});

app.get("/beach/karacabey", (req, res) => {
  res.render("beach/karacabey", {
    headerClass: "alps",
    activePage: "karacabey",
    showTitle: true,
  });
});

app.get("/beach/mudanya", (req, res) => {
  res.render("beach/mudanya", {
    headerClass: "alps",
    activePage: "Mudanya",
    showTitle: true,
  });
});

app.get("/city/city", (req, res) => {
  res.render("city/city", {
    headerClass: "alps",
    activePage: "city",
    showTitle: true,
  });
});

app.get("/city/avm", (req, res) => {
  res.render("city/avm", {
    headerClass: "alps",
    activePage: "avm",
    showTitle: true,
  });
});

app.get("/city/doga", (req, res) => {
  res.render("city/doga", {
    headerClass: "alps",
    activePage: "Doga",
    showTitle: true,
  });
});

app.get("/city/muze", (req, res) => {
  res.render("city/muze", {
    headerClass: "alps",
    activePage: "Muze",
    showTitle: true,
  });
});

app.get("/city/parklar", (req, res) => {
  res.render("city/parklar", {
    headerClass: "alps",
    activePage: "Parklar",
    showTitle: true,
  });
});

app.get("/city/selaleler", (req, res) => {
  res.render("city/selaleler", {
    headerClass: "alps",
    activePage: "Selaleler",
    showTitle: true,
  });
});

app.get("/city/tarih", (req, res) => {
  res.render("city/tarih", {
    headerClass: "alps",
    activePage: "Tarih",
    showTitle: true,
  });
});

app.get("/city/mimari", (req, res) => {
  res.render("city/mimari", {
    headerClass: "alps",
    activePage: "Mimari",
    showTitle: true,
  });
});

app.get("/city/din", (req, res) => {
  res.render("city/din", {
    headerClass: "alps",
    activePage: "Din",
    showTitle: true,
  });
});

app.get("/mountain/mountain", (req, res) => {
  res.render("mountain/mountain", {
    headerClass: "alps",
    activePage: "mountain",
    showTitle: true,
  });
});

app.get("/book", (req, res) => {
  res.render("book", { headerClass: "hero", activePage: "tours" });
});

app.get("/destination", (req, res) => {
  res.render("destination", {
    headerClass: "hero",
    activePage: "destinations",
    showTitle: true,
    pageTitle: "Discover Your Next Destination",
  });
});

app.get("/destinations/maldives", (req, res) => {
  res.render("destinations/maldives", {
    headerClass: "hero maldives",
    activePage: "destinations",
    showTitle: true,
  });
});

app.get("/destinations/salda", (req, res) => {
  res.render("destinations/salda", {
    headerClass: "salda",
    activePage: "destinations",
    showTitle: true,
  });
});

app.get("/destinations/alps", (req, res) => {
  res.render("destinations/alps", {
    headerClass: "alps",
    activePage: "destinations",
    showTitle: true,
    pageTitle: "Alps",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", { headerClass: "hero", activePage: "contact" });
});

//  Mesaj gönderme
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

//  Rezervasyon
const nodemailer = require("nodemailer");

app.post("/book", async (req, res) => {
  const { name, surname, mail, checkin, checkout, people, room_count } =
    req.body;

  if (!pool) {
    return res.status(500).send("Veritabanı bağlantısı mevcut değil.");
  }

  try {
    // 1. VERİTABANINA KAYIT
    await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("surname", sql.VarChar, surname)
      .input("mail", sql.VarChar, mail)
      .input("checkin", sql.Date, checkin)
      .input("checkout", sql.Date, checkout)
      .input("people", sql.Int, people)
      .input("room_count", sql.Int, room_count).query(`
        INSERT INTO Rezervasyonlar (name, surname, mail, checkin, checkout, people, room_count)
        VALUES (@name, @surname, @mail, @checkin, @checkout, @people, @room_count)
      `);

    // 2. MAİL GÖNDERİCİ AYARLARI
    const transporter = nodemailer.createTransport({
      service: "gmail", // Outlook kullanıyorsan değiştir
      auth: {
        user: "oteladresiniz@gmail.com", // HOTELSİNİZİN GMAIL ADRESİ
        pass: "uygulama-şifresi", // 2 Adımlı doğrulamada oluşturulan uygulama şifresi
      },
    });

    // 3. MAİL İÇERİĞİ
    const mailOptions = {
      from: '"Hotel Bursa" <oteladresiniz@gmail.com>',
      to: mail,
      subject: "Rezervasyon Onayınız – Hotel Bursa",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #006633;">Sayın ${name} ${surname},</h2>
      <p>Rezervasyonunuz başarıyla alınmıştır. Aşağıda rezervasyon detaylarınızı bulabilirsiniz:</p>
      <table style="border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold;">Giriş Tarihi:</td>
          <td style="padding: 8px;">${checkin}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Çıkış Tarihi:</td>
          <td style="padding: 8px;">${checkout}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Kişi Sayısı:</td>
          <td style="padding: 8px;">${people}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Oda Sayısı:</td>
          <td style="padding: 8px;">${room_count}</td>
        </tr>
      </table>
      <p style="margin-top: 20px;">
        Sizi <strong>yeşilin ve tarihin buluştuğu Bursa’da</strong> ağırlamaktan büyük mutluluk duyacağız.
      </p>
      <p style="color: #888; font-size: 14px;">Hotel Bursa Rezervasyon Ekibi</p>
    </div>
  `,
    };

    // 4. GÖNDER
    await transporter.sendMail(mailOptions);

    // 5. YANIT
    res.send(
      `<script>alert("Rezervasyon başarıyla kaydedildi! E-posta gönderildi."); window.location.href = "/";</script>`
    );
  } catch (error) {
    console.error("❌ Rezervasyon/mail hatası:", error);
    res
      .status(500)
      .send("Rezervasyon kaydedilemedi veya e-posta gönderilemedi.");
  }
});

app.use(express.static(path.join(__dirname, "public")));

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});
