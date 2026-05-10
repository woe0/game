const phrases = [
  "المرتد المونولوجي حضيض الدنى",
  "معهد معتوه ما فنى",
  "جنى على نفسه ما قد جنى",
  "يذوي هذا المكان فيهوي بنا",
  "i will sing it on the nai.. fuuuck hti",
  "say with me say.. this one is ugly",
  "Creatures and bird.. shout that he is a weird",
  "oh my god.. make this shit be sad",
];

const targetSources = [
  "assets/target.png",
  "assets/target.jpg",
  "assets/target.jpeg",
  "assets/target.webp",
  "assets/target.svg",
];

const targetImg = document.getElementById("target");
const targetWrap = document.getElementById("targetWrap");
const slapBtn = document.getElementById("slapBtn");
const chantDisplay = document.getElementById("chantDisplay");
const chantLog = document.getElementById("chantLog");
const stanceSelect = document.getElementById("stance");
const chantModeSelect = document.getElementById("chantMode");
const slipper = document.getElementById("slipper");

let chantIndex = 0;
let crescendoLevel = 0;
let crescendoPhrase = null;
let sourceIndex = 0;

const resetCrescendo = () => {
  crescendoLevel = 0;
  crescendoPhrase = null;
};

const loadTarget = () => {
  targetImg.src = targetSources[sourceIndex];
};

targetImg.addEventListener("error", () => {
  sourceIndex += 1;
  if (sourceIndex < targetSources.length) {
    loadTarget();
  } else {
    targetWrap.classList.add("missing");
    targetImg.style.opacity = "0";
    targetImg.alt = "لم يتم العثور على صورة في مجلد assets.";
  }
});

targetImg.addEventListener("load", () => {
  targetWrap.classList.remove("missing");
  targetImg.style.opacity = "1";
});

loadTarget();

const getPhrase = (mode) => {
  if (mode === "random") {
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  if (mode === "crescendo") {
    if (!crescendoPhrase) {
      crescendoPhrase = phrases[chantIndex % phrases.length];
    }
    const nextLevel = (crescendoLevel % 4) + 1;
    const phrase = `${crescendoPhrase} ${"!".repeat(nextLevel)}`;
    crescendoLevel = nextLevel;
    if (crescendoLevel === 4) {
      chantIndex += 1;
      resetCrescendo();
    }
    return phrase;
  }

  const phrase = phrases[chantIndex % phrases.length];
  chantIndex += 1;
  return phrase;
};

const updateStance = () => {
  slipper.dataset.stance = stanceSelect.value;
};

const pushLog = (phrase) => {
  const item = document.createElement("li");
  item.textContent = phrase;
  chantLog.prepend(item);
  const items = chantLog.querySelectorAll("li");
  if (items.length > 5) {
    items[items.length - 1].remove();
  }
};

const triggerSlap = () => {
  const mode = chantModeSelect.value;
  const phrase = getPhrase(mode);

  chantDisplay.textContent = phrase;
  pushLog(phrase);

  targetWrap.classList.remove("hit");
  slipper.classList.remove("slap");
  void slipper.offsetWidth;
  slipper.classList.add("slap");
  targetWrap.classList.add("hit");

  window.setTimeout(() => {
    slipper.classList.remove("slap");
    targetWrap.classList.remove("hit");
  }, 320);
};

slapBtn.addEventListener("click", triggerSlap);

document.addEventListener("keydown", (event) => {
  if (event.code !== "Space" && event.code !== "Enter") {
    return;
  }
  const targetTag = event.target.tagName;
  if (targetTag === "SELECT" || targetTag === "BUTTON") {
    return;
  }
  event.preventDefault();
  triggerSlap();
});

stanceSelect.addEventListener("change", updateStance);

chantModeSelect.addEventListener("change", () => {
  if (chantModeSelect.value !== "crescendo") {
    resetCrescendo();
  }
});

updateStance();
