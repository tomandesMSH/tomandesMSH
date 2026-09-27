const links = [...document.querySelectorAll('.menu-item')];
let selected = 0;
function selectMenu(index) {
  selected = (index + links.length) % links.length;
  links.forEach((link, i) => link.classList.toggle('active', i === selected));
}
links.forEach((link, i) => {
  link.addEventListener('mouseenter', () => selectMenu(i));
  link.addEventListener('focus', () => selectMenu(i));
});
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
  if (window.scrollY < window.innerHeight * .5 && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    selectMenu(selected + (event.key === 'ArrowDown' ? 1 : -1));
    links[selected].focus({preventScroll:true});
  }
  if (event.key === 'Escape') {
    document.querySelector('.screen').scrollIntoView();
    links[selected].focus({preventScroll:true});
  }
});
selectMenu(0);
let ytPlayer, playerReady = false, isPlaying = false, loadTimer;
const musicBtn = document.getElementById('musicToggle');
function showToast(label, track) {
  const toast = document.getElementById('p3-toast');
  document.getElementById('toastLabel').textContent = label;
  toast.querySelector('.toast-track').textContent = track;
  toast.classList.add('show');
  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}
window.onYouTubeIframeAPIReady = () => {
  ytPlayer = new YT.Player('yt-player', {
    height:'1', width:'1', videoId:'X2Yn7GOIV7E', playerVars:{autoplay:0,controls:0},
    events:{
      onReady:() => { playerReady = true; clearTimeout(loadTimer); musicBtn.disabled = false; showToast('Sound ready', 'Press music to play'); },
      onStateChange:event => {
        isPlaying = event.data === YT.PlayerState.PLAYING;
        musicBtn.classList.toggle('playing', isPlaying);
        musicBtn.setAttribute('aria-pressed', String(isPlaying));
        musicBtn.textContent = isPlaying ? 'Ⅱ MUSIC / ON' : '♪ MUSIC / OFF';
        if (isPlaying) showToast('Now playing', "It's Going Down Now");
      },
      onError:() => { musicBtn.disabled = false; showToast('Playback unavailable', 'Please try again later'); }
    }
  });
};
musicBtn.addEventListener('click', () => {
  if (playerReady) { isPlaying ? ytPlayer.pauseVideo() : ytPlayer.playVideo(); return; }
  if (!document.getElementById('youtube-api')) {
    const script = document.createElement('script');
    script.id = 'youtube-api'; script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => { clearTimeout(loadTimer); musicBtn.disabled = false; script.remove(); showToast('Connection unavailable', 'Music could not load'); };
    document.body.appendChild(script);
  }
  musicBtn.disabled = true;
  showToast('Loading soundtrack', 'Connecting to YouTube…');
  loadTimer = setTimeout(() => { musicBtn.disabled = false; showToast('Connection unavailable', 'Please try again later'); }, 12000);
});
