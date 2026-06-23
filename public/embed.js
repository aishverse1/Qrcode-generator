// UPIDirectPay.com Embed Script v1.0
// Usage: <script src="https://upidirectpay.com/embed.js" data-token="YOUR_TOKEN"></script>

(function () {
  var script = document.currentScript
  var token = script && script.getAttribute('data-token')
  if (!token) return

  var baseUrl = 'https://upidirectpay.com'
  var isModal = script && script.getAttribute('data-modal') === 'true'

  function isMobile() {
    return /Android|iPhone|iPod|iPad|Mobile/i.test(navigator.userAgent)
  }

  // Create container
  var container = document.createElement('div')
  container.id = 'upidirectpay-embed-container'
  container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;font-family:Inter,system-ui,sans-serif'

  // Create button
  var button = document.createElement('button')
  button.id = 'upidirectpay-embed-btn'
  button.textContent = 'Pay with UPI'
  button.style.cssText = 'background:#2563EB;color:#fff;border:none;border-radius:12px;padding:14px 24px;font-size:15px;font-weight:600;cursor:pointer;box-shadow:0 4px 20px rgba(37,99,235,0.35);transition:all 0.2s'
  button.onmouseover = function () { button.style.transform = 'scale(1.02)' }
  button.onmouseout = function () { button.style.transform = 'scale(1)' }

  var iframe = null

  button.onclick = function () {
    var paymentUrl = baseUrl + '/pay/' + token

    if (isMobile()) {
      window.location.href = paymentUrl
    } else {
      if (!iframe) {
        iframe = document.createElement('iframe')
        iframe.src = paymentUrl + '?modal=1'
        iframe.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:none;z-index:1000000;background:white;border-radius:16px;max-width:480px;max-height:700px;margin:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3)'
        container.appendChild(iframe)
      }
    }
  }

  container.appendChild(button)
  document.body.appendChild(container)

  window.addEventListener('message', function (e) {
    if (e.data === 'payment-success' && iframe) {
      iframe.remove()
      iframe = null
    }
  })
})()
