(function(){
  var hero = document.querySelector('.hero');
  var heroImgs = document.querySelectorAll('.hero-img');
  var tiles = document.querySelectorAll('.tile');
  var footerEl = document.querySelector('footer');
  if(!hero) return;

  function revealTiles(){
    tiles.forEach(function(t){ t.classList.add('in'); });
    if(footerEl) footerEl.classList.add('in');
  }

  // Ease each hero image in (width, margin, opacity and scale together, so
  // the surrounding text eases apart in step with the photo fading in
  // rather than jumping first and fading second). Calls onComplete once
  // every image has finished, so the next step in the sequence (the tiles)
  // can pick up right where this leaves off.
  function revealHeroImages(onComplete){
    if(!heroImgs.length){ if(onComplete) onComplete(); return; }

    heroImgs.forEach(function(img){ img.style.display = 'inline-block'; });

    if(typeof gsap === 'undefined'){
      heroImgs.forEach(function(img){
        img.style.width = '';
        img.style.marginLeft = '';
        img.style.marginRight = '';
        img.style.opacity = 1;
        img.style.transform = 'scale(1)';
      });
      if(onComplete) onComplete();
      return;
    }

    // Measure each image's natural (CSS-defined) width in px before
    // collapsing it, so the grow-in animates to the right target at any
    // viewport size without hardcoding the em values here.
    var targetWidths = Array.prototype.map.call(heroImgs, function(img){
      return img.getBoundingClientRect().width;
    });

    var remaining = heroImgs.length;
    heroImgs.forEach(function(img, i){
      gsap.fromTo(img,
        { width: 0, marginLeft: 0, marginRight: 0, opacity: 0, scale: .88 },
        {
          width: targetWidths[i],
          marginLeft: '0.16em',
          marginRight: '0.16em',
          opacity: 1,
          scale: 1,
          duration: .9,
          ease: 'power3.out',
          delay: i * .1,
          onComplete: function(){
            remaining--;
            if(remaining === 0 && onComplete) onComplete();
          }
        }
      );
    });
  }

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){
    hero.classList.add('in','rise');
    heroImgs.forEach(function(img){ img.style.display = 'inline-block'; });
    revealTiles();
    if(window.initHeroTypeEffect) window.initHeroTypeEffect();
    return;
  }

  hero.style.setProperty('--hero-shift', '40px');

  function run(){
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        hero.classList.add('in');
        if(window.initHeroTypeEffect){
          window.initHeroTypeEffect(afterTyping);
        } else {
          afterTyping();
        }
      });
    });
  }

  function afterTyping(){
    hero.classList.add('rise');
    revealHeroImages(function(){
      // A short beat between the images settling and the tiles rising in
      // keeps the sequence feeling like one continuous motion rather than
      // two unrelated animations back to back.
      setTimeout(revealTiles, 200);
    });
  }

  if(document.readyState === 'complete'){
    run();
  } else {
    window.addEventListener('load', run, { once:true });
  }
})();
