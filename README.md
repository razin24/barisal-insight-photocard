# বরিশাল ইনসাইড — ফটোকার্ড জেনারেটর

> A professional Bengali news photo card generator for **বরিশাল ইনসাইড** — inspired by Prothom Alo & Kaler Kantho card styles but with a unique identity.

![Preview](preview.png)

##  Features

-  **৩টি থিম** — হোয়াইট, ডার্ক, লাইট
-  **ছবি আপলোড** — যেকোনো JPG/PNG/WEBP
-  **লাইভ প্রিভিউ** — টাইপ করলেই কার্ডে দেখা যায়
-  **স্বয়ংক্রিয় তারিখ** — বাংলায়
-  **PNG ডাউনলোড** — ২x হাই-রেজোলিউশন (2160×2700px)
-  **রেসপন্সিভ** — মোবাইলেও কাজ করে
-  **No dependencies** — শুধু HTML/CSS/JS

##  ব্যবহার

### GitHub Pages-এ চালান

1. এই repo-টি fork করুন
2. **Settings → Pages → Branch: main → Save**
3. কয়েক মিনিট পর `https://yourusername.github.io/barisal-inside-photocard/` এ যান

### লোকালি চালান

```bash
git clone https://github.com/yourusername/barisal-inside-photocard.git
cd barisal-inside-photocard

# যেকোনো static server দিয়ে চালান
npx serve .
# অথবা
python3 -m http.server 8080
```

তারপর `http://localhost:8080` খুলুন।

##  Project Structure

```
barisal-inside-photocard/
├── index.html          # Main app
├── css/
│   └── style.css       # Design system + themes
├── js/
│   └── app.js          # Live preview + download logic
├── images/             # Static assets (logo etc.)
└── README.md
```

##  থিম কাস্টমাইজ

`css/style.css` এ `--red` ভ্যারিয়েবল পরিবর্তন করুন:

```css
:root {
  --red: #D90012;   /* আপনার ব্র্যান্ড কালার */
}
```

##  লাইসেন্স

MIT License — ব্যক্তিগত ও বাণিজ্যিক উভয় ব্যবহারের জন্য উন্মুক্ত।

---

**বরিশাল ইনসাইড** | barishalinsider.com
