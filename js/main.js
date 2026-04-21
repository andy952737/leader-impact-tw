/* ============================================================
   LeaderImpact 台灣首頁 — 互動功能
   1. 導覽列滾動陰影
   2. 漢堡選單開關
   3. 引言輪播（含自動播放）
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* -------- 1. 導覽列滾動效果 -------- */
  var navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  /* -------- 2. 漢堡選單 -------- */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // 點選選單連結後自動關閉
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* -------- 3. 引言輪播 -------- */
  var slides      = document.querySelectorAll('.testimonial-slide');
  var dots        = document.querySelectorAll('.dot');
  var prevBtn     = document.getElementById('carouselPrev');
  var nextBtn     = document.getElementById('carouselNext');
  var currentIdx  = 0;
  var autoTimer   = null;
  var AUTO_DELAY  = 5000; // 5 秒自動切換

  function showSlide(idx) {
    slides.forEach(function (s, i) {
      s.classList.toggle('active', i === idx);
    });
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === idx);
    });
    currentIdx = idx;
  }

  function nextSlide() {
    showSlide((currentIdx + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentIdx - 1 + slides.length) % slides.length);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, AUTO_DELAY);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  if (slides.length > 0) {
    showSlide(0);
    startAuto();

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        startAuto(); // 手動操作後重置計時器
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        startAuto();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(parseInt(this.dataset.index, 10));
        startAuto();
      });
    });

    // 滑鼠懸停時暫停自動播放
    var carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAuto);
      carousel.addEventListener('mouseleave', startAuto);
    }

    // 鍵盤操作支援（焦點在輪播內時）
    if (carousel) {
      carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  { prevSlide(); startAuto(); }
        if (e.key === 'ArrowRight') { nextSlide(); startAuto(); }
      });
    }

    // 觸控滑動支援
    var touchStartX = 0;
    var touchEndX   = 0;

    if (carousel) {
      carousel.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) { nextSlide(); } else { prevSlide(); }
          startAuto();
        }
      }, { passive: true });
    }
  }


  /* -------- 4. 平滑錨點捲動（補強） -------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = navbar ? navbar.offsetHeight + 8 : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

});
