const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const state = {
  time: '10 minutes', environment: 'a city park', pace: 'curious', group: 'just me',
  mission: null, currentTask: 0, seconds: 600, timer: null, voice: false, photos: 0
};

const missionSets = [
  { title: 'The small things<br /><em>are showing off.</em>', lead: 'A tiny noticing walk for the edges of things. Bring your eyes, your ears, and nothing you need to buy.', tasks: [['NOTICE','Find a color you did not expect.','Look low, then look high. Let your eyes land on something you would usually walk past.','◌'],['LISTEN','Follow one sound.','Stay still for 30 seconds. What is closest? What is farthest?','◡'],['MOVE','Take the long way.','Choose the path with one extra turn. Notice what the shortcut would have hidden.','⌁'],['COLLECT','Frame a small view.','Make a rectangle with your hands. What belongs inside it?','□'],['REFLECT','Give it a name.','If this place had a title today, what would you call it?','✳']] },
  { title: 'A walk for the<br /><em>in-between.</em>', lead: 'Look for the places where one thing becomes another: shadow into light, street into soil, quiet into sound.', tasks: [['NOTICE','Find a border.','Look for where two textures meet. Stay with it longer than feels necessary.','◌'],['LISTEN','Count three layers.','Name the nearest sound, the farthest sound, and the one you almost missed.','◡'],['MOVE','Walk at half speed.','For one minute, move slowly enough to notice your own footsteps.','⌁'],['COLLECT','Photograph a threshold.','A doorway, a crack, a gate, a path. Something that says: this way.','□'],['REFLECT','Keep one question.','What is this place doing while nobody is looking?','✳']] },
  { title: 'The good news is<br /><em>already here.</em>', lead: 'A small scavenger hunt for proof that the world keeps making new things without asking for permission.', tasks: [['NOTICE','Find a new beginning.','A bud, a sprout, a nest, a patch of fresh paint. Let it be small.','◌'],['LISTEN','Hear something repeat.','Find a rhythm: a bird, a machine, your footsteps, a breeze.','◡'],['MOVE','Turn toward the sun.','Take ten steps toward the brightest place you can see.','⌁'],['COLLECT','Save a texture.','Photograph or remember the roughest, softest, or strangest surface nearby.','□'],['REFLECT','Say thanks silently.','To a tree, a stranger, a patch of moss, or the weather.','✳']] }
];

function slug(text) { return text.toUpperCase().replace(' MINUTES',' MIN').replace('A ','').replace('THE ',''); }
function selected(field) { return $(`[data-field="${field}"] .selected`)?.dataset.value || ''; }
function syncForm() { state.time = selected('time'); state.pace = selected('pace'); state.group = selected('group'); state.environment = $('#environment').value; }
function chooseButtons() { $$('.segmented').forEach(group => group.addEventListener('click', e => { if (e.target.tagName !== 'BUTTON') return; $$('.segmented button', group).forEach(b => b.classList.remove('selected')); e.target.classList.add('selected'); })); }

function makeLocalMission() {
  const index = (state.time.length + state.environment.length + state.pace.length + state.group.length) % missionSets.length;
  const base = missionSets[index];
  return { ...base, kicker: `${slug(state.time)} · ${state.environment} · ${state.pace}`, source: 'Offline fallback' };
}

async function tryLocalModel(fallback) {
  const endpoint = localStorage.getItem('wildquest-ollama-endpoint') || 'http://localhost:11434/api/generate';
  if (!navigator.onLine || !window.fetch) return fallback;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 850);
    const prompt = `Return JSON only with keys title, lead, tasks. Create five short outdoor prompts for ${state.time} in ${state.environment}, a ${state.pace} mood, for ${state.group}. tasks must be arrays of [type,title,prompt,icon], types NOTICE, LISTEN, MOVE, COLLECT, REFLECT. Keep a screen-free tone.`;
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'qwen2.5:3b', prompt, stream: false, format: 'json' }), signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return fallback;
    const data = await response.json();
    const parsed = JSON.parse(data.response || '{}');
    if (!parsed.title || !Array.isArray(parsed.tasks) || parsed.tasks.length < 5) return fallback;
    return { ...parsed, kicker: `${slug(state.time)} · ${state.environment} · ${state.pace}`, source: 'Local open model' };
  } catch { return fallback; }
}

function renderMission(mission) {
  state.mission = mission;
  $('#missionKicker').textContent = mission.kicker;
  $('#missionTitle').innerHTML = mission.title;
  $('#missionLead').textContent = mission.lead;
  $('#aiModeText').textContent = mission.source;
  $('#taskList').innerHTML = mission.tasks.map((task, i) => `<div class="task"><span class="task-index">0${i + 1}</span><div><span class="task-type">${task[0]}</span><span class="task-title">${task[1]}</span></div></div>`).join('');
  $('#missionCardSection').classList.remove('hidden');
  $('#missionCardSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function createMission(e) {
  e?.preventDefault(); syncForm();
  const button = $('#missionForm .primary-button'); button.disabled = true; button.innerHTML = 'Listening for a local model <span>…</span>';
  const fallback = makeLocalMission(); const mission = await tryLocalModel(fallback); renderMission(mission);
  button.disabled = false; button.innerHTML = 'Create a field mission <span>↗</span>';
}

function startTrail() {
  state.currentTask = 0; state.seconds = parseInt(state.time, 10) * 60 || 600;
  $('#trailEnvironment').textContent = state.environment.toUpperCase(); $('#missionCardSection').classList.add('hidden'); $('#trailMode').classList.remove('hidden'); $('#trailMode').scrollIntoView({ behavior: 'smooth' });
  renderTrailTask(); clearInterval(state.timer); state.timer = setInterval(() => { state.seconds = Math.max(0, state.seconds - 1); const min = String(Math.floor(state.seconds / 60)).padStart(2,'0'); const sec = String(state.seconds % 60).padStart(2,'0'); $('#trailTimer').textContent = `${min}:${sec}`; }, 1000);
}
function renderTrailTask() { const t = state.mission.tasks[state.currentTask]; $('#trailCount').textContent = `0${state.currentTask + 1} / 05`; $('#trailProgress').style.width = `${((state.currentTask + 1) / 5) * 100}%`; $('#trailIcon').textContent = t[3]; $('#trailType').textContent = t[0]; $('#trailTask').innerHTML = t[1]; $('#trailPrompt').textContent = t[2]; $('#completeTask').innerHTML = state.currentTask === 4 ? 'Finish the walk <span>↗</span>' : 'I noticed it <span>↗</span>'; }
function completeTask() { if (state.currentTask < 4) { state.currentTask += 1; renderTrailTask(); } else { clearInterval(state.timer); $('#trailMode').classList.add('hidden'); $('#fieldNote').classList.remove('hidden'); $('#fieldNote').scrollIntoView({ behavior: 'smooth' }); } }
function exitTrail() { clearInterval(state.timer); $('#trailMode').classList.add('hidden'); $('#missionCardSection').classList.remove('hidden'); $('#missionCardSection').scrollIntoView({ behavior: 'smooth' }); }

function synthesis() { const text = $('#reflection').value.trim(); const place = state.environment.replace(/^a /,''); const fallback = { title: text ? 'A pocketful of noticing.' : 'The walk kept its secret.', body: text ? `You went looking for one small thing and came back with a little more world than you left with. In ${place}, attention did the collecting.` : `You gave ${state.time} to ${place}. Sometimes the first field note is simply proof that you went.`, observations: text || 'The place, the pace, and the pause.', next: 'What changes here when you come back at a different hour?' }; return fallback; }
function makeNote(e) { e.preventDefault(); const note = synthesis(); $('#resultDate').textContent = new Date().toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}).toUpperCase(); $('#resultTitle').textContent = note.title; $('#resultBody').textContent = note.body; $('#resultObservations').textContent = note.observations; $('#resultNext').textContent = note.next; $('#fieldnoteResult').classList.remove('hidden'); $('#fieldnoteResult').scrollIntoView({ behavior: 'smooth', block: 'center' }); localStorage.setItem('wildquest-last-note', JSON.stringify(note)); }
function photoUpdate(e) { state.photos = e.target.files.length; $('#photoCount').textContent = state.photos ? `${state.photos} attached` : ''; }
function voiceToggle() { state.voice = !state.voice; $('#voiceButton').classList.toggle('recording', state.voice); $('#voiceText').textContent = state.voice ? 'Listening… tap to stop' : 'Record a voice note'; }
function reset() { clearInterval(state.timer); ['#missionCardSection','#trailMode','#fieldNote'].forEach(id => $(id).classList.add('hidden')); $('#fieldnoteResult').classList.add('hidden'); $('#reflection').value = ''; $('#missionSetup').scrollIntoView({ behavior: 'smooth' }); }

chooseButtons(); $('#missionForm').addEventListener('submit', createMission); $('#startMission').addEventListener('click', () => $('#missionSetup').scrollIntoView({ behavior:'smooth' })); $('#startTrail').addEventListener('click', startTrail); $('#completeTask').addEventListener('click', completeTask); $('#exitTrail').addEventListener('click', exitTrail); $('#noteForm').addEventListener('submit', makeNote); $('#photos').addEventListener('change', photoUpdate); $('#voiceButton').addEventListener('click', voiceToggle); $('#newMission').addEventListener('click', reset); $('#startAgain').addEventListener('click', reset);
const dialog = $('#aboutDialog'); $('#openAbout').addEventListener('click', () => dialog.showModal()); $('#closeAbout').addEventListener('click', () => dialog.close());
window.addEventListener('online', () => { $('#privacyStatus').innerHTML = '<span class="status-dot"></span>Local by default'; }); window.addEventListener('offline', () => { $('#privacyStatus').innerHTML = '<span class="status-dot"></span>Airplane mode ready'; });
