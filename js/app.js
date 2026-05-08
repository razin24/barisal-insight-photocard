/**
 * বরিশাল ইনসাইড — ফটোকার্ড জেনারেটর
 * app.js — Live preview & PNG download (1080x1080)
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

  // Download Action - Fixed for GitHub and White Borders
  downloadBtn.addEventListener('click', async () => {
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'প্রসেস হচ্ছে...';

    try {
      // ফন্ট লোডিং গ্যারান্টি (গিটহাবে বাংলা ফন্ট ভাঙা রোধ করবে)
      await document.fonts.ready;

      // স্ক্রোল বাগ ফিক্স: পেজের টপে চলে যাওয়া
      const prevScrollY = window.scrollY;
      window.scrollTo(0, 0);

      // বর্তমান পজিশন এবং স্টাইল সেভ করে রাখা
      const parent = card.parentNode;
      const nextSibling = card.nextSibling;
      const originalCssText = card.style.cssText;

      // সাদা বর্ডার দূর করার জন্য কার্ডটিকে একটি আলাদা র‍্যাপারে নিয়ে আসা
      const captureWrapper = document.createElement('div');
      captureWrapper.style.position = 'fixed';
      captureWrapper.style.top = '0';
      captureWrapper.style.left = '0';
      captureWrapper.style.width = '1080px';
      captureWrapper.style.height = '1080px';
      captureWrapper.style.overflow = 'hidden';
      captureWrapper.style.zIndex = '-9999';
      captureWrapper.style.background = '#ffffff';
      
      document.body.appendChild(captureWrapper);

      // কার্ডটিকে র‍্যাপারে যুক্ত করা এবং সাইজ ফিক্স করা
      card.style.cssText = `
        width: 1080px !important;
        height: 1080px !important;
        min-height: 1080px !important;
        max-height: 1080px !important;
        margin: 0 !important;
        padding: 0 !important;
        position: relative !important;
        transform: none !important;
        box-sizing: border-box !important;
      `;
      captureWrapper.appendChild(card);

      // ডম (DOM) রিফ্রেশ হওয়ার জন্য সামান্য সময় দেওয়া
      await new Promise(resolve => setTimeout(resolve, 150));

      const canvas = await html2canvas(card, {
        width: 1080,
        height: 1080,
        scale: 2,           // 2x = high-res (2160×2160)
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff', // Null এর বদলে সাদা ব্যাকগ্রাউন্ড
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1080,
        windowHeight: 1080
      });

      // সবকিছু আগের অবস্থায় ফিরিয়ে আনা
      card.style.cssText = originalCssText;
      if (nextSibling) {
        parent.insertBefore(card, nextSibling);
      } else {
        parent.appendChild(card);
      }
      document.body.removeChild(captureWrapper);
      window.scrollTo(0, prevScrollY);

      // Download Trigger
      const link = document.createElement('a');
      link.download = `barishal-insight-photocard-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

    } catch (err) {
      console.error('Download error:', err);
      alert('ডাউনলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      // বাটন আগের অবস্থায় ফিরিয়ে আনা
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
