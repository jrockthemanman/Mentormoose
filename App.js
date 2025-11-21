/* Demo data */
const demoMentors = [
  { id: 'm1', name: "Sarah Johnson", role: "Business Mentor", img: "https://picsum.photos/640/480?random=1" },
  { id: 'm2', name: "Kevin Lee", role: "Software Mentor", img: "https://picsum.photos/640/480?random=2" },
  { id: 'm3', name: "Rita Gomez", role: "Design Mentor", img: "https://picsum.photos/640/480?random=3" }
];

const demoMentees = [
  { id: 'e1', name: "Alex Rivera", role: "Business Student", img: "https://picsum.photos/640/480?random=4" },
  { id: 'e2', name: "Amanda Chen", role: "Web Dev Student", img: "https://picsum.photos/640/480?random=5" },
  { id: 'e3', name: "Jordan Smith", role: "UX Student", img: "https://picsum.photos/640/480?random=6" }
];

/* elements */
const roleWrap = document.getElementById('roleWrap');
const asMentorBtn = document.getElementById('asMentor');
const asMenteeBtn = document.getElementById('asMentee');
const demoArea = document.getElementById('demoArea');
const cardContainer = document.getElementById('cardContainer');
const nopeBtn = document.getElementById('nopeBtn');
const likeBtn = document.getElementById('likeBtn');
const emptyState = document.getElementById('emptyState');
const backBtn = document.getElementById('backBtn');

let stack = []; // active profiles in stack order (0 = top)

/* start UI */
asMentorBtn.addEventListener('click', () => start('mentor'));
asMenteeBtn.addEventListener('click', () => start('mentee'));
backBtn.addEventListener('click', () => {
  emptyState.classList.add('hidden');
  roleWrap.classList.remove('hidden');
});

nopeBtn.addEventListener('click', () => programmaticSwipe(-1));
likeBtn.addEventListener('click', () => programmaticSwipe(1));

function start(which){
  roleWrap.classList.add('hidden');
  demoArea.classList.remove('hidden');
  if (which === 'mentor') stack = [...demoMentees];
  else stack = [...demoMentors];
  renderStack();
}

/* render current stack (top card first) */
function renderStack(){
  cardContainer.innerHTML = '';
  if (!stack.length){
    emptyState.classList.remove('hidden');
    return;
  } else {
    emptyState.classList.add('hidden');
  }

  // Render from bottom to top so top card is last in DOM
  for (let i = stack.length - 1; i >= 0; i--){
    const p = stack[i];
    const card = createCard(p, i);
    // Slight scale/offset for deeper cards
    const depth = stack.length - 1 - i;
    card.style.transform = `translateY(${depth * 8}px) scale(${1 - depth * 0.02})`;
    cardContainer.appendChild(card);
  }
}

/* create single card element with pointer handlers */
function createCard(person, index){
  const el = document.createElement('div');
  el.className = 'card';
  el.dataset.id = person.id;
  el.innerHTML = `
    <img src="${person.img}" alt="${escapeHtml(person.name)}">
    <div class="info">
      <div class="name">${escapeHtml(person.name)}</div>
      <div class="role">${escapeHtml(person.role)}</div>
    </div>
  `;

  // pointer drag state (per card)
  let startX = 0, startY = 0;
  let currentX = 0, currentY = 0;
  let dragging = false;

  function onPointerDown(e){
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    el.style.transition = 'none';
  }

  function onPointerMove(e){
    if (!dragging) return;
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    const rot = currentX / 12;
    el.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rot}deg)`;
  }

  function onPointerUp(e){
    if (!dragging) return;
    dragging = false;
    el.releasePointerCapture(e.pointerId);
    const threshold = 110;
    if (Math.abs(currentX) > threshold){
      // swipe away
      const dir = currentX > 0 ? 1 : -1;
      flyAwayAndRemove(el, dir);
    } else {
      // return to stack position
      el.style.transition = 'transform 220ms ease';
      el.style.transform = ''; // CSS initial transform (renderStack adds depth transforms; remove then re-render)
      // small timeout to let transition finish then re-render stack so depths are correct
      setTimeout(renderStack, 230);
    }
  }

  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerup', onPointerUp);
  el.addEventListener('pointercancel', onPointerUp);
  el.addEventListener('lostpointercapture', onPointerUp);

  return el;
}

/* animate card off-screen and remove from stack */
function flyAwayAndRemove(el, dir){
  // dir: 1 = right (like), -1 = left (nope)
  el.style.transition = 'transform 350ms ease-out, opacity 350ms';
  el.style.transform = `translate(${dir * 900}px, -120px) rotate(${dir * 30}deg)`;
  el.style.opacity = '0';
  // Remove underlying data after animation
  setTimeout(() => {
    const id = el.dataset.id;
    stack = stack.filter(s => s.id !== id);
    renderStack();
    // (demo) show simple match-ish toast or console log when liked
    if (dir === 1) console.log('Liked', id);
    else console.log('Nope', id);
  }, 360);
}

/* programmatic swipe (from buttons) */
function programmaticSwipe(dir){
  const topCard = cardContainer.querySelector('.card:last-child'); // last added is top
  if (!topCard) return;
  flyAwayAndRemove(topCard, dir);
}

/* small helper to escape HTML in injected strings */
function escapeHtml(str){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}
