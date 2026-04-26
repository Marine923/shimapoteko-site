/* ナビ「商品」ドロップダウン：タッチ端末でのタップ開閉＆外側タップで閉じる。
   デスクトップ（hoverあり）では CSS の :hover に任せ、ここでは触らない。 */
(function () {
  var isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;

  var items = document.querySelectorAll('.nav-item.has-dropdown');
  items.forEach(function (item) {
    var trigger = item.querySelector(':scope > a');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      if (!isTouch) return; // デスクトップは普通に products.html に遷移
      e.preventDefault();
      // 他の開いているメニューを閉じる
      items.forEach(function (other) {
        if (other !== item) other.classList.remove('is-open');
      });
      item.classList.toggle('is-open');
    });
  });

  // 外側タップで閉じる
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item.has-dropdown')) {
      items.forEach(function (item) { item.classList.remove('is-open'); });
    }
  });
})();

/* スクロールリビール：
   <main> 配下の主要セクションヘッドやカードに .reveal-on-scroll を自動付与し、
   ビューポートに入ったら .is-visible を付ける。
   - 既存の HTML を書き換えなくても自動で効くようにする
   - prefers-reduced-motion はCSS側で打ち消す */
(function () {
  if (!('IntersectionObserver' in window)) return;

  // 自動付与の対象セレクタ
  var autoTargets = [
    '.hero-eyebrow', '.hero h1', '.hero p.lead', '.hero-actions',
    '.section-head',
    '.concept-card',
    '.story-item',
    '.product-card',
    '.recipe-card',
    '.news-item',
    '.b2b-banner > .container > *',
    '.info-table',
    '.series-banner .section-head'
  ];

  var nodes = [];
  autoTargets.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      // すでに reveal が付いていなければ追加
      if (!el.classList.contains('reveal-on-scroll')) {
        el.classList.add('reveal-on-scroll');
      }
      nodes.push(el);
    });
  });

  // ヒーロー要素はページ表示直後に少し遅延を持たせて連続的に出す
  var heroEls = document.querySelectorAll(
    '.hero-eyebrow, .hero h1, .hero p.lead, .hero-actions'
  );
  heroEls.forEach(function (el, i) {
    el.style.transitionDelay = (0.08 + i * 0.12) + 's';
  });

  // 兄弟同士のカードは入ってきた順に少しずつ遅らせる（同時並びの硬さを和らげる）
  function staggerSiblings(selector) {
    document.querySelectorAll(selector).forEach(function (group) {
      var cards = group.children;
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].classList.contains('reveal-on-scroll')) {
          cards[i].style.transitionDelay = (i * 0.09) + 's';
        }
      }
    });
  }
  staggerSiblings('.concept-grid');
  staggerSiblings('.story-grid');
  staggerSiblings('.products-grid');
  staggerSiblings('.recipe-grid');
  staggerSiblings('.news-list');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target); // 一度だけ
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  // ヒーロー要素は読み込み直後に即可視化（スクロール検知を待たない）
  heroEls.forEach(function (el) {
    el.classList.add('is-visible');
    io.unobserve(el);
  });

  nodes.forEach(function (el) {
    if (!el.classList.contains('is-visible')) io.observe(el);
  });
})();
