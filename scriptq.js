let shareLink = document.getElementById("shareLink")

shareLink.onclick = (function(){
  console.debug("test");
	shareLink.classList.add('copied');

	setTimeout(function(){
			shareLink.classList.remove('copied');
		}, 500);
});

/* =============================================================================
   ✅ Toggle panel button (show/hide #panel)
   ============================================================================= */
(function() {
  const toggleBtn = document.getElementById('main-button');
  const panel = document.getElementById('panel');
  
  if (!toggleBtn || !panel) return;

  let panelVisible = true; // initial: visible
  let panelOriginalLeft = panel.style.left; // on stocke la position left originale

  // Sauvegarde la position left originale si ce n'est pas déjà fait
  if (!panel.dataset.originalLeft) {
    panel.dataset.originalLeft = panel.style.left || '20px';
  }

  function hidePanel() {
    panelVisible = false;
    panel.style.display = 'none';
    toggleBtn.classList.add('panel-hidden');
    toggleBtn.classList.remove('peek');
    toggleBtn.setAttribute('aria-label', 'Afficher le panneau');
    toggleBtn.title = 'Afficher le panneau';
  }

  function showPanel() {
    panelVisible = true;
    panel.style.display = 'block';
    toggleBtn.classList.remove('panel-hidden');
    toggleBtn.classList.add('peek');
    toggleBtn.setAttribute('aria-label', 'Cacher le panneau');
    toggleBtn.title = 'Cacher le panneau';
  }

  toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (panelVisible) {
      hidePanel();
    } else {
      showPanel();
    }
  });

  // Si le panneau change d'état via un autre bouton (ex: Expand), on synchronise le bouton
  function syncButtonWithPanel() {
    const isVisible = window.getComputedStyle(panel).display !== 'none';
    if (isVisible && !panelVisible) {
      panelVisible = true;
      toggleBtn.classList.remove('panel-hidden');
      toggleBtn.classList.add('peek');
    } else if (!isVisible && panelVisible) {
      panelVisible = false;
      toggleBtn.classList.add('panel-hidden');
      toggleBtn.classList.remove('peek');
    }
  }

  // Observe les changements de style du panneau
  const observer = new MutationObserver(syncButtonWithPanel);
  observer.observe(panel, { attributes: true, attributeFilter: ['style'] });

  // Initialisation
  syncButtonWithPanel();

  // S'assure que le bouton reste bien positionné si le panel est déplacé (drag)
  // Aucune action nécessaire car le bouton est fixe par rapport à la fenêtre


  /* =============================================================================
   ✅ Fermer le panneau en cliquant/touchant à l'extérieur (version améliorée)
   ============================================================================= */
  
  let clickStartedOnPanel = false;
  let touchStartedOnPanel = false;

  // Détecte si l'interaction a commencé sur le panneau
  panel.addEventListener('mousedown', () => clickStartedOnPanel = true);
  panel.addEventListener('touchstart', () => touchStartedOnPanel = true);
  
  // Réinitialise après l'interaction
  panel.addEventListener('mouseup', () => setTimeout(() => clickStartedOnPanel = false, 100));
  panel.addEventListener('touchend', () => setTimeout(() => touchStartedOnPanel = false, 100));

  function handleOutsideInteraction(event) {
    // Si le panneau est caché, on ne fait rien
    if (window.getComputedStyle(panel).display === 'none') return;
    
    // Récupère l'élément cliqué
    const target = event.target;
    
    // Vérifie si l'interaction est à l'extérieur
    const isOutside = !panel.contains(target) && 
                     (!toggleBtn || !toggleBtn.contains(target));
    
    // Évite de fermer si l'interaction a commencé sur le panneau (drag, etc.)
    const startedOnPanel = (event.type === 'click' && clickStartedOnPanel) ||
                          (event.type === 'touchstart' && touchStartedOnPanel);
    
    if (isOutside && !startedOnPanel) {
      // Petit délai pour éviter les fermetures trop brusques
      setTimeout(() => {
        // Vérifie à nouveau que le panneau est toujours visible
        if (window.getComputedStyle(panel).display === 'none') return;
        
        panel.style.display = 'none';
        
        if (toggleBtn) {
          toggleBtn.classList.add('panel-hidden');
          toggleBtn.classList.remove('peek');
          toggleBtn.setAttribute('aria-label', 'Afficher le panneau');
          toggleBtn.title = 'Afficher le panneau';
        }
      }, 50);
    }
  }

  // Écoute les clics et touches
  document.addEventListener('click', handleOutsideInteraction);
  document.addEventListener('touchstart', handleOutsideInteraction);
  
  // Réinitialise les flags quand on quitte le panneau
  panel.addEventListener('mouseleave', () => {
    clickStartedOnPanel = false;
  });
  
  panel.addEventListener('touchcancel', () => {
    touchStartedOnPanel = false;
  });


})();