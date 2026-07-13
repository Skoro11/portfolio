import { ref } from "vue";

export const INTERACTION_RADIUS = 6;

export const BOOKCASE_POS = { x: 41.0, z: 9.0 };
export const BOOKCASE_FRONT_DIR = { x: 0, z: 1 };
export const BOOKCASE_HALF_WIDTH = 5.5;
export const BOOKCASE_HALF_DEPTH = 3;
export const BOOKCASE_INTERACTION_RADIUS = 6;

export const nearHenry = ref(false);
export const nearBookcase = ref(false);
export const dialogueOpen = ref(false);
export const dialogueIndex = ref(0);

export const omarDialogue = [
  { speaker: "Omar", line: "Toni! Finally you arrived." },
  { speaker: "Toni", line: "I've been searching for you everywhere, Omar." },
  { speaker: "Omar", line: "I've been stranded on this island for weeks." },
  { speaker: "Toni", line: "What happened? Where is the rest of the crew?" },
  { speaker: "Omar", line: "Gone. We need to move before the others find us." },
  { speaker: "Toni", line: "Tell me where the treasure is first." },
  { speaker: "Omar", line: "Follow me. I'll show you." },
];

export const bookcaseTopics = [
  {
    title: "Personal Life",
    lines: [
      { speaker: "Toni", line: "A journal, mostly about life outside of work." },
      { speaker: "Toni", line: "Add your personal-life notes here." },
    ],
  },
  {
    title: "Work",
    lines: [
      { speaker: "Toni", line: "A ledger of jobs and projects over the years." },
      { speaker: "Toni", line: "Add your work-history notes here." },
    ],
  },
  {
    title: "Portfolio",
    lines: [
      { speaker: "Toni", line: "A collection of everything I've built." },
      { speaker: "Toni", line: "Add your portfolio notes here." },
    ],
  },
];

export const activeDialogue = ref(omarDialogue);
export const bookcaseMenuOpen = ref(false);
export const bookcaseMenuIndex = ref(0);

let returnToBookcaseMenu = false;

export function openDialogue(source: typeof omarDialogue = omarDialogue) {
  returnToBookcaseMenu = false;
  activeDialogue.value = source;
  dialogueIndex.value = 0;
  dialogueOpen.value = true;
}

export const BOOKCASE_EXIT_INDEX = bookcaseTopics.length;

export function openBookcaseMenu() {
  bookcaseMenuOpen.value = true;
  bookcaseMenuIndex.value = 0;
}

export function closeBookcaseMenu() {
  bookcaseMenuOpen.value = false;
  bookcaseMenuIndex.value = 0;
}

export function moveBookcaseMenu(dir: 1 | -1) {
  const count = bookcaseTopics.length + 1;
  bookcaseMenuIndex.value = (bookcaseMenuIndex.value + dir + count) % count;
}

export function selectBookcaseTopic() {
  if (bookcaseMenuIndex.value === BOOKCASE_EXIT_INDEX) {
    closeBookcaseMenu();
    return;
  }
  const topic = bookcaseTopics[bookcaseMenuIndex.value];
  if (!topic) return;
  returnToBookcaseMenu = true;
  activeDialogue.value = topic.lines;
  dialogueIndex.value = 0;
  dialogueOpen.value = true;
  bookcaseMenuOpen.value = false;
}

export function advanceDialogue() {
  if (dialogueIndex.value < activeDialogue.value.length - 1) {
    dialogueIndex.value++;
  } else {
    dialogueOpen.value = false;
    dialogueIndex.value = 0;
    if (returnToBookcaseMenu) {
      returnToBookcaseMenu = false;
      openBookcaseMenu();
    }
  }
}
