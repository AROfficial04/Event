// Capture clicks on any .book-now button and navigate to booking page with context
(function () {
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.book-now');
    if (!trigger) return;

    const card = trigger.closest('.decor-item, .product-card, .experience-card, .deal-card, .offer-card, .bundle-card');
    if (!card) return;

    const title = (card.querySelector('h3')?.textContent || 'Selected Experience').trim();
    const priceText = (card.querySelector('.price .discounted, .deal-price .new-price, .offer-price .discounted')?.textContent || '').trim();
    const image = card.querySelector('img')?.getAttribute('src') || '';

    // Detect discount percent from badges/tags
    const badgeText = (card.querySelector('.deal-badge, .offer-tag')?.textContent || '').trim();
    const discountPct = (/([0-9]{1,2})%/i.exec(badgeText || '') || [])[1] || '';

    // Detect offer code if present
    const offerCode = (card.querySelector('.offer-code strong')?.textContent || '').trim();

    // Detect bundle items
    const bundleItems = Array.from(card.querySelectorAll('.bundle-item span')).map(s => s.textContent.trim());

    const params = new URLSearchParams();
    params.set('title', title);
    if (priceText) params.set('price', priceText.replace(/[^0-9]/g, ''));
    if (image) params.set('img', image);
    if (discountPct) params.set('discountPct', String(discountPct));
    if (offerCode) params.set('offerCode', offerCode);
    if (bundleItems.length) params.set('bundle', encodeURIComponent(JSON.stringify(bundleItems)));
    // Mark origin to enable auto-offer application
    if (card.classList.contains('deal-card') || card.classList.contains('offer-card') || card.classList.contains('bundle-card')) {
      params.set('origin', 'offers');
    }

    window.location.href = `book.html?${params.toString()}`;
  });
})();


