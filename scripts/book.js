// Populate booking summary from query params and compute totals
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const title = params.get('title') || 'Selected Experience';
  const priceParam = parseInt(params.get('price') || '0', 10) || 0;
  const img = params.get('img') || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=70';
  const origin = params.get('origin') || '';
  const discountPctParam = parseInt(params.get('discountPct') || '0', 10) || 0;
  const offerCodeParam = params.get('offerCode') || '';
  const bundleRaw = params.get('bundle');
  let bundleItems = [];
  try { if (bundleRaw) bundleItems = JSON.parse(decodeURIComponent(bundleRaw)); } catch(e) {}

  document.querySelector('.summary-title').textContent = title;
  document.querySelector('.summary-image').src = img;
  document.getElementById('itemMeta').textContent = origin === 'offers' ? 'Source: Offer/Deal' : '';

  // State
  let base = 0; // fetched
  let discount = 0;
  let appliedOfferLabel = '';
  if (discountPctParam > 0) {
    discount = Math.round((base * discountPctParam) / 100);
    appliedOfferLabel = `${discountPctParam}% OFF`;
  }
  if (offerCodeParam) {
    // If both present, prefer higher discount
    const alt = Math.round(base * 0.1); // assume 10% generic for demo
    if (alt > discount) {
      discount = alt;
      appliedOfferLabel = `Code: ${offerCodeParam}`;
    }
  }
  if (origin === 'offers' && appliedOfferLabel) {
    const badge = document.getElementById('appliedOffer');
    if (badge) {
      badge.style.display = 'inline-flex';
      badge.textContent = `Applied Offer: ${appliedOfferLabel}`;
    }
  }

  // Fetch base price from backend (mock API)
  const itemId = params.get('id') || title.replace(/\s+/g,'-').toLowerCase();
  fetchBasePrice(itemId, priceParam).then(value => {
    base = value;
    updateSummary();
  });

  let addons = 0;

  // Wire add-ons
  document.querySelectorAll('.addon input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const price = parseInt(cb.getAttribute('data-addon-price') || '0', 10) || 0;
      addons = recalcAddons();
      updateSummary();
    });
  });

  // Coupon apply
  document.getElementById('applyCouponBtn')?.addEventListener('click', () => {
    const input = document.getElementById('couponInput');
    const code = (input?.value || '').trim().toUpperCase();
    const badge = document.getElementById('appliedOffer');
    const msg = document.getElementById('couponMsg');
    if (msg) { msg.style.display='none'; msg.textContent=''; }
    let extra = 0;
    if (code === 'ROMANCE20') extra = Math.round(base * 0.2);
    else if (code === 'BDAY15') extra = Math.round(base * 0.15);
    else if (code === 'GIFT10') extra = Math.round(base * 0.10);
    else {
      if (msg) { msg.style.display='block'; msg.textContent='Invalid coupon code'; }
      return;
    }
    const newDisc = Math.max(discount, extra);
    if (newDisc !== discount) {
      discount = newDisc;
      if (badge) {
        badge.style.display = 'inline-flex';
        badge.textContent = `Applied Offer: ${code}`;
      }
    }
    resolveOfferConflicts('coupon');
    updateSummary();
  });

  const form = document.getElementById('bookingForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Booking confirmed! We have sent details to your email.');
    window.location.href = 'orders.html';
  });

  // Checkout buttons
  document.getElementById('summaryCheckoutBtn')?.addEventListener('click', () => form?.requestSubmit());
  document.getElementById('mobileCheckoutBtn')?.addEventListener('click', () => form?.requestSubmit());

  // Mobile billbar toggle
  const billbar = document.getElementById('mobileBillbar');
  if (billbar) {
    const mq = window.matchMedia('(max-width: 768px)');
    const updateBar = () => { billbar.style.display = mq.matches ? 'flex' : 'none'; };
    mq.addEventListener ? mq.addEventListener('change', updateBar) : mq.addListener(updateBar);
    updateBar();
  }

  function recalcAddons() {
    let sum = 0;
    document.querySelectorAll('.addon input[type="checkbox"]').forEach(cb => {
      if (cb.checked) sum += parseInt(cb.getAttribute('data-addon-price') || '0', 10) || 0;
    });
    return sum;
  }

  function updateSummary() {
    const savingsEl = document.getElementById('savingsText');
    const qty = parseInt(document.getElementById('quantity')?.value || '1', 10) || 1;
    const taxBase = Math.max(base * qty - discount, 0) + addons;
    const taxes = Math.round(taxBase * 0.18);
    const total = taxBase + taxes;
    setMoney('.summary-base', base * qty);
    setMoney('.summary-addons', addons);
    setMoney('.summary-discount', discount, true);
    setMoney('.summary-tax', taxes);
    setMoney('.summary-total-amt', total);
    if (savingsEl) {
      const saved = discount;
      if (saved > 0) { savingsEl.style.display = 'block'; savingsEl.textContent = `You save: ₹${saved.toLocaleString('en-IN')}`; }
      else savingsEl.style.display = 'none';
    }
  }

  // Quantity change
  document.getElementById('quantity')?.addEventListener('change', updateSummary);

  function resolveOfferConflicts(preferred) {
    const offerChoice = document.getElementById('offerChoice');
    if (!offerChoice) return;
    const hasDeal = !!appliedOfferLabel;
    const hasCoupon = !!document.getElementById('couponInput')?.value;
    if (hasDeal && hasCoupon) {
      offerChoice.style.display = 'block';
      offerChoice.querySelectorAll('input[name="offerpick"]').forEach(r => {
        r.onchange = () => {
          if (r.value === 'deal') {
            // leave discount as current best from deal/calc
          } else if (r.value === 'coupon') {
            // already updated when coupon applied; no action needed here
          }
          updateSummary();
        };
      });
    }
  }
});

// Mock backend price fetcher. Replace with real API call.
function fetchBasePrice(itemId, fallback) {
  // Example real world:
  // return fetch(`/api/price?id=${encodeURIComponent(itemId)}`).then(r=>r.json()).then(d=>d.price);
  return new Promise(resolve => {
    setTimeout(() => resolve(fallback || 3999), 200);
  });
}

function setMoney(sel, amount, isNegative = false) {
  const el = document.querySelector(sel);
  if (!el) return;
  const sign = isNegative && amount > 0 ? '-' : '';
  el.textContent = `${sign}₹${amount.toLocaleString('en-IN')}`;
}


