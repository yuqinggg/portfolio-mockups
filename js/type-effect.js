(function(){
  function splitToChars(line){
    var chars = [];
    Array.prototype.slice.call(line.childNodes).forEach(function(node){
      if(node.nodeType === Node.TEXT_NODE){
        var text = node.textContent;
        // Wrap the whole run in one span so it still counts as a single
        // flex item on .hero-line (which uses `gap` to space text vs. img).
        var run = document.createElement('span');
        run.className = 'type-run';
        var tokenRe = /(\s+)|(\S+)/g;
        var match;
        while((match = tokenRe.exec(text))){
          if(match[1]){
            run.appendChild(document.createTextNode(match[1]));
          } else {
            var word = match[2];
            var wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            for(var i = 0; i < word.length; i++){
              var charSpan = document.createElement('span');
              charSpan.className = 'char';
              charSpan.textContent = word[i];
              wordSpan.appendChild(charSpan);
              chars.push(charSpan);
            }
            run.appendChild(wordSpan);
          }
        }
        node.parentNode.replaceChild(run, node);
      }
    });
    return chars;
  }

  window.initHeroTypeEffect = function(onComplete){
    var lines = document.querySelectorAll('.hero-line');
    if(!lines.length || typeof gsap === 'undefined'){
      if(onComplete) onComplete();
      return;
    }

    var chars = [];
    lines.forEach(function(line){
      chars = chars.concat(splitToChars(line));
    });
    if(!chars.length){
      if(onComplete) onComplete();
      return;
    }

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced){
      gsap.set(chars, { opacity: 1 });
      if(onComplete) onComplete();
      return;
    }

    gsap.set(chars, { opacity: 0 });
    gsap.to(chars, {
      opacity: 1,
      duration: 0.01,
      ease: 'none',
      stagger: { each: 0.85 / chars.length },
      onComplete: onComplete
    });
  };
})();
