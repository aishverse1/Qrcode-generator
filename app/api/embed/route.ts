import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/embed
 *
 * Serves the UPIDirectPay embeddable JavaScript SDK.
 * Exposes: window.MyPay.open({ slug: 'abc123' })
 *
 * Usage on any external site:
 *   <script src="https://yourproject.vercel.app/api/embed" defer></script>
 *   <script>
 *     document.getElementById('pay-btn').addEventListener('click', function() {
 *       MyPay.open({ slug: 'abc123' });
 *     });
 *   </script>
 *
 * Legacy widget mode (auto-renders floating button):
 *   <script src="/api/embed" data-pa="merchant@upi" data-pn="Name" defer></script>
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

const EMBED_SCRIPT = `
/* UPIDirectPay.com — Embed SDK v3.0 | https://upidirectpay.com */
(function (global) {
  'use strict';

  // ── Helpers ───────────────────────────────────────────────

  function isMobile() {
    return /Android|iPhone|iPod|iPad|Mobile|webOS|BlackBerry|Opera Mini|IEMobile|Kindle/i.test(navigator.userAgent);
  }

  function getBase() {
    // Prefer environment-configured base, then detect from script src
    var configured = '${BASE_URL}';
    if (configured) return configured;
    var scripts = document.querySelectorAll('script[src*="/api/embed"]');
    if (scripts.length > 0) {
      var src = scripts[0].getAttribute('src');
      var idx = src ? src.indexOf('/api/embed') : -1;
      return idx >= 0 ? src.slice(0, idx) : (window.location.origin);
    }
    return window.location.origin;
  }

  var BASE = getBase();

  // ── CSS injection ─────────────────────────────────────────

  function injectStyles() {
    if (document.getElementById('mypay-styles')) return;
    var style = document.createElement('style');
    style.id = 'mypay-styles';
    style.textContent = [
      '#mypay-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);animation:mypay-fadein 0.2s ease}',
      '#mypay-modal{background:white;border-radius:24px;width:100%;max-width:400px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.35);animation:mypay-slidein 0.25s cubic-bezier(0.34,1.56,0.64,1);position:relative;font-family:-apple-system,BlinkMacSystemFont,"Inter",system-ui,sans-serif}',
      '#mypay-modal iframe{width:100%;border:none;display:block;min-height:520px}',
      '#mypay-close{position:absolute;top:12px;right:12px;z-index:10;width:28px;height:28px;background:rgba(255,255,255,0.85);border:none;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#64748b;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:all 0.15s;line-height:1}',
      '#mypay-close:hover{background:white;color:#0f172a;transform:scale(1.1)}',
      '@keyframes mypay-fadein{from{opacity:0}to{opacity:1}}',
      '@keyframes mypay-slidein{from{opacity:0;transform:translateY(24px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}',
      '@media(max-width:480px){#mypay-overlay{align-items:flex-end;padding:0}#mypay-modal{border-bottom-left-radius:0;border-bottom-right-radius:0;max-width:100%;animation:mypay-slideup 0.3s cubic-bezier(0.34,1.56,0.64,1)}#mypay-modal iframe{min-height:480px}}',
      '@keyframes mypay-slideup{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}',
    ].join('');
    document.head.appendChild(style);
  }

  // ── Core: open() ──────────────────────────────────────────

  function open(opts) {
    if (!opts) { console.warn('[MyPay] Missing options'); return; }

    var slug = opts.slug || '';
    var pa   = opts.pa   || '';
    var pn   = opts.pn   || '';
    var am   = opts.am   || '';

    var iframeSrc;
    if (slug) {
      iframeSrc = BASE + '/' + encodeURIComponent(slug) + '?embed=true';
    } else if (pa) {
      iframeSrc = BASE + '/pay?pa=' + encodeURIComponent(pa) + '&pn=' + encodeURIComponent(pn) + (am ? '&am=' + encodeURIComponent(am) : '') + '&embed=true';
    } else {
      console.warn('[MyPay] Provide slug or pa'); return;
    }

    // On mobile, go direct instead of iframe (UPI deep links need native handling)
    if (isMobile() && slug) {
      window.location.href = BASE + '/' + encodeURIComponent(slug);
      return;
    }
    if (isMobile() && pa) {
      window.location.href = 'upi://pay?pa=' + encodeURIComponent(pa) + '&pn=' + encodeURIComponent(pn) + '&cu=INR' + (am ? '&am=' + am : '');
      return;
    }

    injectStyles();
    close(); // Remove any existing modal

    var overlay = document.createElement('div');
    overlay.id = 'mypay-overlay';

    var modalDiv = document.createElement('div');
    modalDiv.id = 'mypay-modal';

    var closeBtn = document.createElement('button');
    closeBtn.id = 'mypay-close';
    closeBtn.setAttribute('aria-label', 'Close payment');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', close);

    var iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.title = 'UPI Payment';
    iframe.setAttribute('allow', 'payment');
    iframe.setAttribute('loading', 'eager');
    iframe.setAttribute('scrolling', 'no');

    modalDiv.appendChild(closeBtn);
    modalDiv.appendChild(iframe);
    overlay.appendChild(modalDiv);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    // ESC key to close
    function onKeydown(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKeydown); }
    }
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    var overlay = document.getElementById('mypay-overlay');
    if (overlay) { overlay.remove(); document.body.style.overflow = ''; }
  }

  // ── Legacy widget mode ────────────────────────────────────
  // Auto-renders a floating button if data-pa or data-token is present on the script tag.

  function initLegacyWidget() {
    var script = document.querySelector('script[src*="/api/embed"]');
    if (!script) return;

    var pa    = script.getAttribute('data-pa');
    var pn    = script.getAttribute('data-pn') || 'Merchant';
    var am    = script.getAttribute('data-am') || '';
    var token = script.getAttribute('data-token') || '';
    var slug  = script.getAttribute('data-slug') || token;

    if (!pa && !slug) return; // No config, pure SDK mode

    injectStyles();

    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:2147483645;font-family:-apple-system,BlinkMacSystemFont,"Inter",system-ui,sans-serif';

    var btn = document.createElement('button');
    btn.textContent = '⚡ Pay with UPI';
    btn.style.cssText = [
      'background:linear-gradient(135deg,#2563EB 0%,#3B82F6 100%)',
      'color:#fff',
      'border:none',
      'border-radius:14px',
      'padding:14px 24px',
      'font-size:15px',
      'font-weight:600',
      'cursor:pointer',
      'box-shadow:0 4px 20px rgba(37,99,235,0.45)',
      'transition:all 0.2s ease',
      'font-family:inherit',
      'letter-spacing:-0.01em',
    ].join(';');

    btn.addEventListener('mouseover', function () {
      btn.style.transform = 'scale(1.04) translateY(-1px)';
      btn.style.boxShadow = '0 8px 30px rgba(37,99,235,0.55)';
    });
    btn.addEventListener('mouseout', function () {
      btn.style.transform = '';
      btn.style.boxShadow = '0 4px 20px rgba(37,99,235,0.45)';
    });
    btn.addEventListener('click', function () {
      if (slug) open({ slug: slug });
      else open({ pa: pa, pn: pn, am: am });
    });

    container.appendChild(btn);
    document.body.appendChild(container);
  }

  // ── Export ────────────────────────────────────────────────

  global.MyPay = { open: open, close: close };

  // Run legacy widget after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLegacyWidget);
  } else {
    initLegacyWidget();
  }

})(typeof window !== 'undefined' ? window : this);
`

export async function GET(req: NextRequest) {
  return new NextResponse(EMBED_SCRIPT, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
