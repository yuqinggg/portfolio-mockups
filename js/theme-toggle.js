(function(){
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  var STORAGE_KEY = 'theme-preference';

  function systemPrefersDark(){
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(theme){
    if(theme === 'light' || theme === 'dark'){
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
    var isDark = theme === 'dark' || (theme !== 'light' && systemPrefersDark());
    btn.setAttribute('aria-checked', isDark ? 'true' : 'false');
  }

  function getStored(){
    try { return localStorage.getItem(STORAGE_KEY); } catch(e){ return null; }
  }
  function setStored(v){
    try { localStorage.setItem(STORAGE_KEY, v); } catch(e){}
  }

  var stored = getStored();
  applyTheme(stored);

  btn.addEventListener('click', function(){
    var current = root.getAttribute('data-theme') || (systemPrefersDark() ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStored(next);
  });
})();
