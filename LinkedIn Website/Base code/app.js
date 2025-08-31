// Init lucide icons (CDN script is included before this file)
if (window.lucide && typeof lucide.createIcons === 'function') {
  lucide.createIcons();
}

// Set current year in footer
document.addEventListener('DOMContentLoaded', function () {
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
});
