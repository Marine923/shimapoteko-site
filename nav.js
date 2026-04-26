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
