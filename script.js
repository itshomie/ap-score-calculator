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
    mcMax: 42,
    frqMax: 54,
    mcWeight: 50,
    frqWeight: 50,
    sample: [30, 34]
  },
  "calc-bc": {
    label: "AP® Calculus BC",
    mcMax: 42,
    frqMax: 54,
    mcWeight: 50,
    frqWeight: 50,
    sample: [32, 36]
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
    sample: [39, 15],
    components: [
      { key: "mcq", label: "Multiple-choice correct", max: 55, weight: 40, sample: 39 },
      { key: "saq", label: "Short-answer raw points", max: 9, weight: 20, sample: 6 },
      { key: "dbq", label: "DBQ raw points", max: 7, weight: 25, sample: 5 },
      { key: "leq", label: "Long essay raw points", max: 6, weight: 15, sample: 4 }
    ]
  },
  "world-history": {
    label: "AP® World History: Modern",
    mcMax: 55,
    frqMax: 22,
    mcWeight: 40,
    frqWeight: 60,
    sample: [38, 15],
    components: [
      { key: "mcq", label: "Multiple-choice correct", max: 55, weight: 40, sample: 38 },
      { key: "saq", label: "Short-answer raw points", max: 9, weight: 20, sample: 6 },
      { key: "dbq", label: "DBQ raw points", max: 7, weight: 25, sample: 5 },
      { key: "leq", label: "Long essay raw points", max: 6, weight: 15, sample: 4 }
    ]
  },
  "us-gov": {
    label: "AP® U.S. Government",
    mcMax: 55,
    frqMax: 17,
    mcWeight: 50,
    frqWeight: 50,
    sample: [39, 12],
    components: [
      { key: "mcq", label: "Multiple-choice correct", max: 55, weight: 50, sample: 39 },
      { key: "concept", label: "Concept application", max: 3, weight: 12.5, sample: 2 },
      { key: "data", label: "Quantitative analysis", max: 4, weight: 12.5, sample: 3 },
      { key: "scotus", label: "SCOTUS comparison", max: 4, weight: 12.5, sample: 3 },
      { key: "essay", label: "Argument essay", max: 6, weight: 12.5, sample: 4 }
    ]
  },
  macro: {
    label: "AP® Macroeconomics",
    mcMax: 60,
    frqMax: 20,
    mcWeight: 66.65,
    frqWeight: 33.35,
    sample: [43, 13]
  },
  micro: {
    label: "AP® Microeconomics",
    mcMax: 60,
    frqMax: 20,
    mcWeight: 66.65,
    frqWeight: 33.35,
    sample: [43, 13]
  },
  statistics: {
    label: "AP® Statistics",
    mcMax: 42,
    frqMax: 40,
    mcWeight: 50,
    frqWeight: 50,
    sample: [30, 26]
  },
  csa: {
    label: "AP® Computer Science A",
    mcMax: 42,
    frqMax: 25,
    mcWeight: 55,
    frqWeight: 45,
    sample: [31, 18]
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
const standardScoreInputs = scoreForm?.querySelector(".score-input-grid");
const advancedSetup = scoreForm?.querySelector(".advanced");
const advancedSetupSummary = advancedSetup?.querySelector("summary");
const advancedSetupGrid = advancedSetup?.querySelector(".advanced-grid");
let homepageComponentFields = null;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getNumericValue(input, fallback = 0) {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function configureHomepageScoreInputs(preset) {
  const usesComponents = Array.isArray(preset.components) && preset.components.length > 0;

  if (standardScoreInputs) standardScoreInputs.hidden = usesComponents;
  if (advancedSetupGrid) advancedSetupGrid.hidden = usesComponents;
  if (advancedSetupSummary) {
    advancedSetupSummary.textContent = usesComponents ? "Choose estimate profile" : "Adjust exam setup";
  }
  if (advancedSetup) advancedSetup.open = false;

  homepageComponentFields?.remove();
  homepageComponentFields = null;

  if (!usesComponents || !standardScoreInputs) return;

  homepageComponentFields = document.createElement("div");
  homepageComponentFields.className = "homepage-component-fields";
  homepageComponentFields.innerHTML = `
    <div class="component-model-note">
      <strong>Official component weights</strong>
      <span>Enter each section separately so unlike FRQ rubrics are not treated as equal points.</span>
    </div>
    <div class="component-input-grid">
      ${preset.components.map((component, index) => `
        <div>
          <label for="homepage-${subjectSelect.value}-${component.key}">${component.label}</label>
          <div class="with-max">
            <input id="homepage-${subjectSelect.value}-${component.key}" data-home-component-score data-component-index="${index}" type="number" min="0" max="${component.max}" step="1" inputmode="numeric" value="${component.sample}">
            <span>/ ${component.max}</span>
          </div>
          <small>${component.weight}% of composite</small>
        </div>
      `).join("")}
    </div>
  `;
  standardScoreInputs.insertAdjacentElement("afterend", homepageComponentFields);
}

function setPreset(key, useSample = true) {
  const preset = presets[key] || presets.general;
  configureHomepageScoreInputs(preset);
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
  const preset = presets[subjectSelect.value] || presets.general;
  const usesComponents = Array.isArray(preset.components) && preset.components.length > 0;
  const thresholds = curveProfiles[curveSelect.value] || curveProfiles.standard;
  let composite = 0;

  if (usesComponents) {
    const componentInputs = Array.from(scoreForm.querySelectorAll("[data-home-component-score]"));
    composite = componentInputs.reduce((total, input, index) => {
      const component = preset.components[index];
      const rawScore = clamp(getNumericValue(input, 0), 0, component.max);
      input.value = rawScore;
      return total + (rawScore / component.max) * component.weight;
    }, 0);
  } else {
    const maxMc = Math.max(getNumericValue(mcMax, 60), 1);
    const maxFrq = Math.max(getNumericValue(frqMax, 40), 1);
    const rawMc = clamp(getNumericValue(mcScore, 0), 0, maxMc);
    const rawFrq = clamp(getNumericValue(frqScore, 0), 0, maxFrq);
    const weights = normalizeWeights();

    mcScore.value = rawMc;
    frqScore.value = rawFrq;
    mcScore.max = maxMc;
    frqScore.max = maxFrq;
    mcMaxLabel.textContent = `/ ${maxMc}`;
    frqMaxLabel.textContent = `/ ${maxFrq}`;

    const mcPercent = rawMc / maxMc;
    const frqPercent = rawFrq / maxFrq;
    composite = (mcPercent * weights.mc + frqPercent * weights.frq) * 100;
  }

  const rounded = Number(composite.toFixed(1));
  const estimatedScore = scoreFromComposite(composite, thresholds);
  const distance = nearestThresholdDistance(composite, estimatedScore, thresholds);
  const subjectName = preset.label;

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

function initializeSubjectCalculator(root) {
  const subjectKey = root.getAttribute("data-subject-calculator");
  const preset = presets[subjectKey];

  if (!preset) return;

  const idPrefix = `subject-${subjectKey}`;
  const subjectName = preset.label;
  const usesComponents = Array.isArray(preset.components) && preset.components.length > 0;
  const inputHelp = usesComponents
    ? "Enter each weighted exam component separately. The result is an unofficial planning estimate."
    : "Enter checked multiple-choice and free-response raw points. The result is an unofficial planning estimate.";
  const estimateModelMarkup = `
    <label class="curve-label" for="${idPrefix}-curve">Estimate model</label>
    <select id="${idPrefix}-curve" data-role="curve">
      <option value="standard">Standard model</option>
      <option value="generous">Lower-threshold model</option>
      <option value="strict">Higher-threshold model</option>
    </select>
  `;
  const scoreInputsMarkup = usesComponents
    ? `<div class="component-input-grid">
        ${preset.components.map((component, index) => `
          <div>
            <label for="${idPrefix}-${component.key}">${component.label}</label>
            <div class="with-max">
              <input id="${idPrefix}-${component.key}" data-role="component-score" data-component-index="${index}" type="number" min="0" max="${component.max}" step="1" inputmode="numeric">
              <span>/ ${component.max}</span>
            </div>
            <small>${component.weight}% of composite</small>
          </div>
        `).join("")}
      </div>`
    : `<div class="score-input-grid">
        <div>
          <label for="${idPrefix}-mc-score">Multiple-choice raw score</label>
          <div class="with-max">
            <input id="${idPrefix}-mc-score" data-role="mc-score" type="number" min="0" step="1" inputmode="numeric">
            <span data-role="mc-max-label"></span>
          </div>
        </div>
        <div>
          <label for="${idPrefix}-frq-score">Free-response raw score</label>
          <div class="with-max">
            <input id="${idPrefix}-frq-score" data-role="frq-score" type="number" min="0" step="1" inputmode="numeric">
            <span data-role="frq-max-label"></span>
          </div>
        </div>
      </div>`;
  const setupMarkup = usesComponents
    ? `<div class="component-model-note"><strong>Official component weights</strong><span>Each field is normalized to its published share of the composite.</span></div>${estimateModelMarkup}`
    : `<details class="advanced">
        <summary>Adjust exam setup</summary>
        <div class="advanced-grid">
          <label for="${idPrefix}-mc-max">
            MCQ max
            <input id="${idPrefix}-mc-max" data-role="mc-max" type="number" min="1" max="120" step="1">
          </label>
          <label for="${idPrefix}-mc-weight">
            MCQ weight
            <input id="${idPrefix}-mc-weight" data-role="mc-weight" type="number" min="1" max="99" step="0.01">
          </label>
          <label for="${idPrefix}-frq-max">
            FRQ max
            <input id="${idPrefix}-frq-max" data-role="frq-max" type="number" min="1" max="120" step="1">
          </label>
          <label for="${idPrefix}-frq-weight">
            FRQ weight
            <input id="${idPrefix}-frq-weight" data-role="frq-weight" type="number" min="1" max="99" step="0.01">
          </label>
        </div>
        ${estimateModelMarkup}
      </details>`;

  root.setAttribute("aria-labelledby", `${idPrefix}-title`);
  root.innerHTML = `
    <div class="card-head">
      <div>
        <p class="calculator-kicker">On-page calculator</p>
        <h2 id="${idPrefix}-title">${subjectName} Practice Score Calculator</h2>
        <p>${inputHelp}</p>
      </div>
      <button class="reset-button" type="button" data-role="reset">Reset</button>
    </div>

    <form class="score-form" data-role="form">
      ${scoreInputsMarkup}
      ${setupMarkup}

      <button class="button primary full" type="submit">Calculate practice score</button>
    </form>

    <div class="result-panel" aria-live="polite">
      <p class="result-label">Your estimated practice score</p>
      <div class="result-main">
        <strong data-role="score">4</strong>
        <div>
          <span class="confidence" data-role="confidence">Solid estimate</span>
          <p class="result-summary" data-role="summary"></p>
        </div>
      </div>
      <div class="meter" aria-hidden="true"><span data-role="meter"></span></div>
      <p class="next-step" data-role="next-step"></p>
    </div>

    <p class="calculator-note">
      This is an independent practice estimate, not an official College Board score conversion. The thresholds are modeling assumptions, and official cut points can vary by exam form.
      <a href="https://apstudents.collegeboard.org/help-center/how-are-ap-exams-scored" rel="noopener">Review the official scoring overview</a>.
    </p>
  `;

  const controls = {
    form: root.querySelector("[data-role='form']"),
    reset: root.querySelector("[data-role='reset']"),
    mcScore: root.querySelector("[data-role='mc-score']"),
    frqScore: root.querySelector("[data-role='frq-score']"),
    mcMax: root.querySelector("[data-role='mc-max']"),
    frqMax: root.querySelector("[data-role='frq-max']"),
    mcWeight: root.querySelector("[data-role='mc-weight']"),
    frqWeight: root.querySelector("[data-role='frq-weight']"),
    curve: root.querySelector("[data-role='curve']"),
    componentInputs: Array.from(root.querySelectorAll("[data-role='component-score']")),
    mcMaxLabel: root.querySelector("[data-role='mc-max-label']"),
    frqMaxLabel: root.querySelector("[data-role='frq-max-label']"),
    score: root.querySelector("[data-role='score']"),
    confidence: root.querySelector("[data-role='confidence']"),
    summary: root.querySelector("[data-role='summary']"),
    nextStep: root.querySelector("[data-role='next-step']"),
    meter: root.querySelector("[data-role='meter']")
  };

  function calculateSubjectEstimate() {
    const thresholds = curveProfiles[controls.curve.value] || curveProfiles.standard;
    let composite = 0;

    if (usesComponents) {
      composite = controls.componentInputs.reduce((total, input, index) => {
        const component = preset.components[index];
        const rawScore = clamp(getNumericValue(input, 0), 0, component.max);
        input.value = rawScore;
        return total + (rawScore / component.max) * component.weight;
      }, 0);
    } else {
      const maxMc = Math.max(getNumericValue(controls.mcMax, preset.mcMax), 1);
      const maxFrq = Math.max(getNumericValue(controls.frqMax, preset.frqMax), 1);
      const rawMc = clamp(getNumericValue(controls.mcScore, 0), 0, maxMc);
      const rawFrq = clamp(getNumericValue(controls.frqScore, 0), 0, maxFrq);
      const mcWeightValue = Math.max(getNumericValue(controls.mcWeight, preset.mcWeight), 0);
      const frqWeightValue = Math.max(getNumericValue(controls.frqWeight, preset.frqWeight), 0);
      const totalWeight = mcWeightValue + frqWeightValue || 100;

      composite = (
        (rawMc / maxMc) * (mcWeightValue / totalWeight) +
        (rawFrq / maxFrq) * (frqWeightValue / totalWeight)
      ) * 100;

      controls.mcScore.value = rawMc;
      controls.frqScore.value = rawFrq;
      controls.mcScore.max = maxMc;
      controls.frqScore.max = maxFrq;
      controls.mcMaxLabel.textContent = `/ ${maxMc}`;
      controls.frqMaxLabel.textContent = `/ ${maxFrq}`;
    }

    const rounded = Number(composite.toFixed(1));
    const estimatedScore = scoreFromComposite(composite, thresholds);
    const distance = nearestThresholdDistance(composite, estimatedScore, thresholds);

    controls.score.textContent = estimatedScore;
    controls.score.style.color = estimatedScore >= 4 ? "var(--green)" : estimatedScore === 3 ? "var(--amber)" : "var(--red)";
    controls.summary.textContent = `${subjectName}: composite score ${rounded} out of 100.`;
    controls.meter.style.width = `${clamp(composite, 0, 100)}%`;

    if (distance.nearest <= 3) {
      controls.confidence.textContent = "Borderline range";
      controls.confidence.style.background = "#fff3d6";
      controls.confidence.style.color = "var(--amber)";
    } else {
      controls.confidence.textContent = estimatedScore >= 3 ? "Solid estimate" : "Needs review";
      controls.confidence.style.background = estimatedScore >= 3 ? "#e6f4ed" : "#fde8e5";
      controls.confidence.style.color = estimatedScore >= 3 ? "var(--green)" : "var(--red)";
    }

    if (distance.nextScore && distance.nextThreshold) {
      const needed = Math.max(distance.nextThreshold - composite, 0).toFixed(1);
      controls.nextStep.textContent = `You are ${needed} composite points below the estimated ${distance.nextScore} range.`;
    } else {
      controls.nextStep.textContent = "This estimate is already in the top score range. Use practice review to protect your margin.";
    }
  }

  function resetSubjectEstimate() {
    if (usesComponents) {
      controls.componentInputs.forEach((input, index) => {
        input.value = preset.components[index].sample;
      });
    } else {
      controls.mcMax.value = preset.mcMax;
      controls.frqMax.value = preset.frqMax;
      controls.mcWeight.value = preset.mcWeight;
      controls.frqWeight.value = preset.frqWeight;
      controls.mcScore.value = preset.sample[0];
      controls.frqScore.value = preset.sample[1];
    }
    controls.curve.value = "standard";
    calculateSubjectEstimate();
  }

  controls.form.addEventListener("input", calculateSubjectEstimate);
  controls.form.addEventListener("change", calculateSubjectEstimate);
  controls.form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculateSubjectEstimate();
  });
  controls.reset.addEventListener("click", resetSubjectEstimate);
  resetSubjectEstimate();
}

function initializeSubjectCalculators() {
  document.querySelectorAll("[data-subject-calculator]").forEach(initializeSubjectCalculator);
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
initializeSubjectCalculators();
initializeCalculator();
