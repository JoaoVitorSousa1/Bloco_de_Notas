let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteIndex = null;
const noteEditor = document.getElementById('noteEditor');
const noteTitle = document.getElementById('noteTitle');
const recentNotes = document.getElementById('recentNotes');
const newNoteBtn = document.getElementById('newNoteBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const exportNoteBtn = document.getElementById('exportNoteBtn');
const deleteNoteBtn = document.getElementById('deleteNoteBtn');

// Salva todas as notas no localStorage (armazenamento local do navegador)
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Renderiza a lista de notas recentes na interface, mostrando título e prévia do texto
function renderRecentNotes() {
  recentNotes.innerHTML = '';
  notes.slice().reverse().forEach((note, idx) => {
    const li = document.createElement('li');
    const realIndex = notes.length - 1 - idx;
    const titleSpan = document.createElement('span');
    titleSpan.textContent = note.title || "Sem título";
    titleSpan.classList.add('note-title');
    const preview = document.createElement('p');
    preview.textContent = note.text.length > 50 ? note.text.substring(0, 50) + '...' : note.text;
    preview.classList.add('note-preview');
    li.appendChild(titleSpan);
    li.appendChild(preview);
    li.classList.toggle('selected', currentNoteIndex === realIndex);
    li.addEventListener('click', (e) => {
      if (e.target === titleSpan) return;
      currentNoteIndex = realIndex;
      loadNoteToEditor(currentNoteIndex);
      renderRecentNotes();
    });

    recentNotes.appendChild(li);
  });
}

//Carrega uma nota no editor, preenchendo título e texto
function loadNoteToEditor(index) {
  if (index === null || !notes[index]) {
    noteTitle.value = '';
    noteEditor.value = '';
    currentNoteIndex = null;
  } else {
    noteTitle.value = notes[index].title || '';
    noteEditor.value = notes[index].text || '';
  }
}

// Cria uma nova nota, limpando o editor e desmarcando seleção
function newNote() {
  currentNoteIndex = null;
  noteTitle.value = '';
  noteEditor.value = '';
  renderRecentNotes();
  noteTitle.focus(); // Foca no campo título para facilitar edição
}

// Salva a nota ou existente
function saveNote() {
  const text = noteEditor.value.trim();
  const title = noteTitle.value.trim() || "Sem título";

  if (!text) {
    alert('Digite algo para assim ser salvo!');
    return;
  }

  if (currentNoteIndex === null) {
    notes.push({ title, text, date: new Date().toISOString() });
    currentNoteIndex = notes.length - 1;
    alert("Nota salva com sucesso!");
  } else {
    notes[currentNoteIndex].text = text;
    notes[currentNoteIndex].title = title;
    notes[currentNoteIndex].date = new Date().toISOString();
  }

  saveNotes();
  renderRecentNotes();
  alert('Nota salva com sucesso!');
}

// Exporta o texto da nota atual para arquivo .txt para download
function exportNote() {
  const text = noteEditor.value.trim();
  if (!text) {
    alert('Não há nada para exportar!');
    return;
  }
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (noteTitle.value.trim() || "nota") + '.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Exclui a nota atual ou limpa o editor se nenhuma nota estiver selecionada
function deleteNote() {
  if (currentNoteIndex === null) {
    if (noteEditor.value.trim() !== '' || noteTitle.value.trim() !== '') {
      if (confirm('Deseja limpar o texto atual?')) {
        noteEditor.value = '';
        noteTitle.value = '';
      }
    }
    return;
  }
  if (confirm('Tem certeza que deseja excluir esta nota?')) {
    notes.splice(currentNoteIndex, 1);
    saveNotes();
    currentNoteIndex = null;
    noteEditor.value = '';
    noteTitle.value = '';
    renderRecentNotes();
    alert('Nota excluída.');
  }
}

// Liga os botões às funções correspondentes
newNoteBtn.onclick = newNote;
saveNoteBtn.onclick = saveNote;
exportNoteBtn.onclick = exportNote;
deleteNoteBtn.onclick = deleteNote;

// Inicializa a aplicação ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  renderRecentNotes();
  loadNoteToEditor(currentNoteIndex);
});