import { ref } from "vue";

export const INTERACTION_RADIUS = 6;

export const nearHenry = ref(false);
export const dialogueOpen = ref(false);
export const dialogueIndex = ref(0);

export const dialogue = [
  { speaker: "Omar", line: "Toni! Finally you arrived." },
  { speaker: "Toni", line: "I've been searching for you everywhere, Omar." },
  { speaker: "Omar", line: "I've been stranded on this island for weeks." },
  { speaker: "Toni", line: "What happened? Where is the rest of the crew?" },
  { speaker: "Omar", line: "Gone. We need to move before the others find us." },
  { speaker: "Toni", line: "Tell me where the treasure is first." },
  { speaker: "Omar", line: "Follow me. I'll show you." },
];

export function openDialogue() {
  dialogueIndex.value = 0;
  dialogueOpen.value = true;
}

export function advanceDialogue() {
  if (dialogueIndex.value < dialogue.length - 1) {
    dialogueIndex.value++;
  } else {
    dialogueOpen.value = false;
    dialogueIndex.value = 0;
  }
}
