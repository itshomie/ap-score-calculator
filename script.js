const presets = {
  general: {
    label: "General AP® exam",
    mcMax: 60,
    frqMax: 40,
    mcWeight: 50,
    frqWeight: 50,
    sample: [38, 24]
  },
  "calc-ab": {
    label: "AP® Calculus AB",
    mcMax: 45,
    frqMax: 54,
    mcWeight: 50,
    frqWeight: 50,
    sample: [32, 34]
  },
  "calc-bc": {
    label: "AP® Calculus BC",
    mcMax: 45,
    frqMax: 54,
    mcWeight: 50,
    frqWeight: 50,
    sample: [34, 36]
  },
  biology: {
    label: "AP® Biology",
    mcMax: 60,
    frqMax: 34,
    mcWeight: 50,
    frqWeight: 50,
    sample: [42, 22]
  },
  chemistry: {
    label: "AP® Chemistry",
    mcMax: 60,
    frqMax: 46,
    mcWeight: 50,
    frqWeight: 50,
    sample: [40, 28]
  },
  "english-lang": {
    label: "AP® English Language",
    mcMax: 45,
    frqMax: 18,
    mcWeight: 45,
    frqWeight: 55,
    sample: [32, 13]
  },
  "english-lit": {
    label: "AP® English Literature",
    mcMax: 55,
    frqMax: 18,
    mcWeight: 45,
    frqWeight: 55,
    sample: [38, 12]
  },
  "us-history": {
    label: "AP® U.S. History",
    mcMax: 55,
    frqMax: 22,
    mcWeight: 40,
    frqWeight: 60,
    sample: [39, 15]
  },
  "world-history": {
    label: "AP® World History: Modern",
    mcMax: 55,
    frqMax: 22,
    mcWeight: 40,
    frqWeight: 60,
    sample: [38, 15]
  },
  "us-gov": {
    label: "AP® U.S. Government",
    mcMax: 55,
    frqMax: 17,
    mcWeight: 50,
    frqWeight: 50,
    sample: [39, 12]
  },
  macro: {
    label: "AP® Macroeconomics",
    mcMax: 60,
    frqMax: 20,
    mcWeight: 66.7,
    frqWeight: 33.3,
    sample: [43, 13]
  },
  micro: {
    label: "AP® Microeconomics",
    mcMax: 60,
    frqMax: 20,
    mcWeight: 66.7,
    frqWeight: 33.3,
    sample: [43, 13]
  },
  statistics: {
    label: "AP® Statistics",
    mcMax: 40,
    frqMax: 24,
    mcWeight: 50,
    frqWeight: 50,
    sample: [28, 16]
  },
  csa: {
    label: "AP® Computer Science A",
    mcMax: 40,
    frqMax: 36,
    mcWeight: 50,
    frqWeight: 50,
    sample: [30, 24]
  }
};

const curveProfiles = {
  generous: { 5: 66, 4: 52, 3: 38, 2: 26 },
  standard: { 5: 72, 4: 58, 3: 43, 2: 30 },
  strict: { 5: 78, 4: 64, 3: 50, 2: 35 }
};

const subjectSelect = document.querySelector("#subjectSelect");
const curveSelect = document.querySelector("#curveSelect");
const scoreForm = document.querySelector("#scoreForm");
const resetButton = document.querySelector("#resetButton");
const mcScore = document.querySelector("#mcScore");
const frqScore = document.querySelector("#frqScore");
const mcMax = document.querySelector("#mcMax");
const frqMax = document.querySelector("#frqMax");
const mcWeight = document.querySelector("#mcWeight");
const frqWeight = document.querySelector("#frqWeight");
const mcMaxLabel = document.querySelector("#mcMaxLabel");
const frqMaxLabel = document.querySelector("#frqMaxLabel");
const scoreResult = document.querySelector("#scoreResult");
const confidencePill = document.querySelector("#confidencePill");
const resultSummary = document.querySelector("#resultSummary");
const nextStep = document.querySelector("#nextStep");
const meterFill = document.querySelector("#meterFill");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getNumericValue(input, fallback = 0) {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function setPreset(key, useSample = true) {
  const preset = presets[key] || presets.general;
  mcMax.value = preset.mcMax;
  frqMax.value = preset.frqMax;
  mcWeight.value = preset.mcWeight;
  frqWeight.value = preset.frqWeight;
  mcMaxLabel.textContent = `/ ${preset.mcMax}`;
  frqMaxLabel.textContent = `/ ${preset.frqMax}`;

  if (useSample) {
    mcScore.value = preset.sample[0];
    frqScore.value = preset.sample[1];
  }

  mcScore.max = preset.mcMax;
  frqScore.max = preset.frqMax;
  calculate();
}

function normalizeWeights() {
  const mc = getNumericValue(mcWeight, 50);
  const frq = getNumericValue(frqWeight, 50);
  const total = mc + frq || 100;
  return {
    mc: mc / total,
    frq: frq / total
  };
}

function scoreFromComposite(composite, thresholds) {
  if (composite >= thresholds[5]) return 5;
  if (composite >= thresholds[4]) return 4;
  if (composite >= thresholds[3]) return 3;
  if (composite >= thresholds[2]) return 2;
  return 1;
}

function nearestThresholdDistance(composite, score, thresholds) {
  const targets = [thresholds[2], thresholds[3], thresholds[4], thresholds[5]].filter(Boolean);
  const nearest = targets.reduce((best, threshold) => {
    const distance = Math.abs(composite - threshold);
    return distance < best ? distance : best;
  }, Infinity);
  const nextScore = score < 5 ? score + 1 : null;
  const nextThreshold = nextScore ? thresholds[nextScore] : null;
  return { nearest, nextScore, nextThreshold };
}

function calculate() {
  const maxMc = Math.max(getNumericValue(mcMax, 60), 1);
  const maxFrq = Math.max(getNumericValue(frqMax, 40), 1);
  const rawMc = clamp(getNumericValue(mcScore, 0), 0, maxMc);
  const rawFrq = clamp(getNumericValue(frqScore, 0), 0, maxFrq);
  const weights = normalizeWeights();
  const thresholds = curveProfiles[curveSelect.value] || curveProfiles.standard;

  mcScore.value = rawMc;
  frqScore.value = rawFrq;
  mcScore.max = maxMc;
  frqScore.max = maxFrq;
  mcMaxLabel.textContent = `/ ${maxMc}`;
  frqMaxLabel.textContent = `/ ${maxFrq}`;

  const mcPercent = rawMc / maxMc;
  const frqPercent = rawFrq / maxFrq;
  const composite = (mcPercent * weights.mc + frqPercent * weights.frq) * 100;
  const rounded = Number(composite.toFixed(1));
  const estimatedScore = scoreFromComposite(composite, thresholds);
  const distance = nearestThresholdDistance(composite, estimatedScore, thresholds);
  const subjectName = presets[subjectSelect.value]?.label || "this AP® exam";

  scoreResult.textContent = estimatedScore;
  scoreResult.style.color = estimatedScore >= 4 ? "var(--green)" : estimatedScore === 3 ? "var(--amber)" : "var(--red)";
  resultSummary.textContent = `${subjectName}: composite score ${rounded} out of 100.`;
  meterFill.style.width = `${clamp(composite, 0, 100)}%`;

  if (distance.nearest <= 3) {
    confidencePill.textContent = "Borderline range";
    confidencePill.style.background = "#fff3d6";
    confidencePill.style.color = "var(--amber)";
  } else {
    confidencePill.textContent = estimatedScore >= 3 ? "Solid estimate" : "Needs review";
    confidencePill.style.background = estimatedScore >= 3 ? "#e6f4ed" : "#fde8e5";
    confidencePill.style.color = estimatedScore >= 3 ? "var(--green)" : "var(--red)";
  }

  if (distance.nextScore && distance.nextThreshold) {
    const needed = Math.max(distance.nextThreshold - composite, 0).toFixed(1);
    nextStep.textContent = `You are ${needed} composite points below the estimated ${distance.nextScore} range.`;
  } else {
    nextStep.textContent = "This estimate is already in the top score range. Use practice review to protect your margin.";
  }
}

subjectSelect?.addEventListener("change", (event) => setPreset(event.target.value, true));
curveSelect?.addEventListener("change", calculate);
scoreForm?.addEventListener("input", calculate);
scoreForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  calculate();
});
resetButton?.addEventListener("click", () => setPreset(subjectSelect.value, true));

document.querySelectorAll("[data-subject-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.getAttribute("data-subject-jump");
    subjectSelect.value = key;
    setPreset(key, true);
    document.querySelector("#calculator").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function initializeEmailLinks() {
  document.querySelectorAll("[data-email-user][data-email-domain]").forEach((link) => {
    const user = link.getAttribute("data-email-user");
    const domain = link.getAttribute("data-email-domain");
    const address = `${user}@${domain}`;

    link.textContent = address;
    link.href = `mailto:${address}`;
    link.removeAttribute("rel");
  });
}

function initializeCalculator() {
  if (!subjectSelect) return;

  const params = new URLSearchParams(window.location.search);
  const requestedSubject = params.get("subject");
  const initialSubject = presets[requestedSubject] ? requestedSubject : subjectSelect.value;

  subjectSelect.value = initialSubject;
  setPreset(initialSubject, true);
}

initializeEmailLinks();
initializeCalculator();
