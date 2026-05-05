/**
 * বরিশাল ইনসাইড — ফটোকার্ড জেনারেটর
 * app.js — Live preview & PNG download
 */

(function () {
  'use strict';

  // ── DOM refs ──────────────────────────────────────────────
  const card          = document.getElementById('photocard');
  const cardPhoto     = document.getElementById('card-photo');
  const previewCat    = document.getElementById('preview-category');
  const previewDate   = document.getElementById('preview-date');
  const previewHl     = document.getElementById('preview-headline');
  const previewSub    = document.getElementById('preview-sub');
  const previewCap    = document.getElementById('preview-caption');
  const inputDate     = document.getElementById('date-input');
  const inputHl       = document.getElementById('headline');
  const inputSub      = document.getElementById('subheadline');
  const inputCap      = document.getElementById('caption');
  const inputCat      = document.getElementById('category');
  const photoUpload   = document.getElementById('photo-upload');
  const uploadText    = document.getElementById('upload-text');
  const downloadBtn   = document.getElementById('download-btn');
  const themeBtns     = document.querySelectorAll('.theme-btn');

  // ── State ─────────────────────────────────────────────────
  let currentTheme = 'white';
  let uploadedImageDataURL = null;

  // ── Helpers ───────────────────────────────────────────────
  function setTheme(theme) {
    card.className = `card theme-${theme}`;
    currentTheme = theme;
    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }

  function updateField(element, value, fallback) {
    element.textContent = value.trim() || fallback;
  }

  function renderPhoto(dataURL) {
    // html2canvas এর object-fit ইস্যু এড়াতে img ট্যাগের বদলে background-image ব্যবহার
    cardPhoto.innerHTML = '';
    cardPhoto.style.backgroundImage = `url(${dataURL})`;
    cardPhoto.style.backgroundSize = 'cover';
    cardPhoto.style.backgroundPosition = 'center';
    cardPhoto.style.backgroundRepeat = 'no-repeat';
  }

  function todayBangla() {
    const months = [
      'জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন',
      'জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'
    ];
    const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];

    const tobn = n => String(n).split('').map(c => bnDigits[+c]).join('');
    const d = new Date();
    return `${tobn(d.getDate())} ${months[d.getMonth()]} ${tobn(d.getFullYear())}`;
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    // Set default date to today in Bangla
    inputDate.value = todayBangla();
    previewDate.textContent = todayBangla();
  }

  // ── Event Listeners ───────────────────────────────────────

  // Theme switch
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });

  // Category
  inputCat.addEventListener('change', () => {
    previewCat.textContent = inputCat.value;
  });

  // Date
  inputDate.addEventListener('input', () => {
    updateField(previewDate, inputDate.value, todayBangla());
  });

  // Headline
  inputHl.addEventListener('input', () => {
    updateField(previewHl, inputHl.value, 'এখানে মূল হেডলাইন লিখুন');
  });

  // Subheadline
  inputSub.addEventListener('input', () => {
    updateField(previewSub, inputSub.value, 'এখানে সাব-হেডলাইন বা সংক্ষিপ্ত বিবরণ লিখুন');
  });

  // Caption
  inputCap.addEventListener('input', () => {
    updateField(previewCap, inputCap.value, 'ছবি: সংগৃহীত');
  });

  // Photo upload
  photoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      uploadedImageDataURL = evt.target.result;
      renderPhoto(uploadedImageDataURL);
      uploadText.textContent = file.name;
    };
    reader.readAsDataURL(file);
  });

  // Download
  downloadBtn.addEventListener('click', async () => {
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'প্রসেস হচ্ছে...';

    try {
      const scaler = document.querySelector('.card-scaler');
      
      // বর্তমান স্টাইলগুলো সেভ করে রাখা
      const originalCardStyle = card.style.cssText;
      const originalScalerStyle = scaler.style.cssText;

      // প্যারেন্ট এলিমেন্টের স্কেলিং বন্ধ করা যেন html2canvas কনফিউজড না হয়
      scaler.style.transform = 'none';
      scaler.style.width = '1080px';
      scaler.style.height = '1080px';

      // কার্ডের লেআউট ফিক্স করা
      card.style.transform = 'none';
      card.style.position = 'relative';
      card.style.width = '1080px';
      card.style.height = '1080px';
      card.style.margin = '0';

      // ব্রাউজারকে নতুন স্টাইল রেন্ডার করার জন্য সামান্য সময় দেওয়া
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(card, {
        width: 1080,
        height: 1080,
        scale: 2,           // 2x = high-res (2160×2700)
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
      });

      // সবকিছু আগের অবস্থায় ফিরিয়ে আনা
      card.style.cssText = originalCardStyle;
      scaler.style.cssText = originalScalerStyle;

      // Download
      const link = document.createElement('a');
      link.download = `barishal-insight-photocard-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (err) {
      console.error('Download error:', err);
      alert('ডাউনলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        ফটোকার্ড ডাউনলোড করুন`;
    }
  });

  // ── Run ───────────────────────────────────────────────────
  init();

})();