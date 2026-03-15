// ===== 1RM Formulas =====
function epley(weight, reps) {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

function brzycki(weight, reps) {
  if (reps >= 37) return Infinity;
  if (reps === 1) return weight;
  return weight * (36 / (37 - reps));
}

function lombardi(weight, reps) {
  return weight * Math.pow(reps, 0.10);
}

// ===== Helper =====
function fmt(val) {
  if (val === Infinity || isNaN(val) || val === 0) return '—';
  return val.toFixed(1);
}

function pctFmt(val) {
  if (val === Infinity || isNaN(val)) return '—';
  return val.toFixed(1) + '%';
}

// ===== Main Calculation =====
function calculate() {
  const lw = parseFloat(document.getElementById('left-weight').value) || 0;
  const lr = parseInt(document.getElementById('left-reps').value) || 0;
  const rw = parseFloat(document.getElementById('right-weight').value) || 0;
  const rr = parseInt(document.getElementById('right-reps').value) || 0;

  // Calculate 1RM for each side
  const leftEpley   = (lw > 0 && lr > 0) ? epley(lw, lr) : 0;
  const leftBrzycki = (lw > 0 && lr > 0) ? brzycki(lw, lr) : 0;
  const leftLombardi = (lw > 0 && lr > 0) ? lombardi(lw, lr) : 0;

  const rightEpley   = (rw > 0 && rr > 0) ? epley(rw, rr) : 0;
  const rightBrzycki = (rw > 0 && rr > 0) ? brzycki(rw, rr) : 0;
  const rightLombardi = (rw > 0 && rr > 0) ? lombardi(rw, rr) : 0;

  // Display 1RM values
  document.getElementById('epley-left').textContent = fmt(leftEpley);
  document.getElementById('epley-right').textContent = fmt(rightEpley);
  document.getElementById('brzycki-left').textContent = fmt(leftBrzycki);
  document.getElementById('brzycki-right').textContent = fmt(rightBrzycki);
  document.getElementById('lombardi-left').textContent = fmt(leftLombardi);
  document.getElementById('lombardi-right').textContent = fmt(rightLombardi);

  // Calculate Symmetry (L/R and R/L)
  const hasLeft = leftEpley > 0;
  const hasRight = rightEpley > 0;

  // Epley symmetry
  if (hasLeft && hasRight) {
    document.getElementById('sym-epley-lr').textContent = pctFmt((leftEpley / rightEpley) * 100);
    document.getElementById('sym-epley-rl').textContent = pctFmt((rightEpley / leftEpley) * 100);
  } else {
    document.getElementById('sym-epley-lr').textContent = '—';
    document.getElementById('sym-epley-rl').textContent = '—';
  }

  // Brzycki symmetry
  if (hasLeft && hasRight && leftBrzycki !== Infinity && rightBrzycki !== Infinity) {
    document.getElementById('sym-brzycki-lr').textContent = pctFmt((leftBrzycki / rightBrzycki) * 100);
    document.getElementById('sym-brzycki-rl').textContent = pctFmt((rightBrzycki / leftBrzycki) * 100);
  } else {
    document.getElementById('sym-brzycki-lr').textContent = '—';
    document.getElementById('sym-brzycki-rl').textContent = '—';
  }

  // Lombardi symmetry
  if (hasLeft && hasRight) {
    document.getElementById('sym-lombardi-lr').textContent = pctFmt((leftLombardi / rightLombardi) * 100);
    document.getElementById('sym-lombardi-rl').textContent = pctFmt((rightLombardi / leftLombardi) * 100);
  } else {
    document.getElementById('sym-lombardi-lr').textContent = '—';
    document.getElementById('sym-lombardi-rl').textContent = '—';
  }

  // Symmetry bar (using Epley L/R as primary indicator)
  const barVis = document.getElementById('symmetry-bar-visual');
  if (hasLeft && hasRight) {
    barVis.style.display = 'block';
    const symPct = Math.min((leftEpley / rightEpley) * 100, (rightEpley / leftEpley) * 100);
    const barPct = Math.max(0, Math.min(100, symPct));
    document.getElementById('symmetry-bar-fill').style.width = barPct + '%';
    document.getElementById('symmetry-bar-marker').style.left = barPct + '%';
    document.getElementById('symmetry-bar-pct').textContent = barPct.toFixed(1) + '%';
  } else {
    barVis.style.display = 'none';
  }
}

// ===== Hop Test Calculation =====
function calculateHop() {
  const hopLeft  = parseFloat(document.getElementById('hop-left').value) || 0;
  const hopRight = parseFloat(document.getElementById('hop-right').value) || 0;
  const isRL     = document.getElementById('hop-toggle').checked;

  // Update toggle label colours
  const lblLR = document.getElementById('toggle-label-lr');
  const lblRL = document.getElementById('toggle-label-rl');

  if (isRL) {
    lblLR.style.color = '';
    lblRL.style.color = 'var(--right-color)';
  } else {
    lblLR.style.color = 'var(--left-color)';
    lblRL.style.color = '';
  }

  const resultEl = document.getElementById('hop-result-value');
  const labelEl  = document.getElementById('hop-result-label');

  if (hopLeft > 0 && hopRight > 0) {
    let ratio;
    if (isRL) {
      ratio = (hopRight / hopLeft) * 100;
      labelEl.textContent = 'Symmetry Index (R / L)';
    } else {
      ratio = (hopLeft / hopRight) * 100;
      labelEl.textContent = 'Symmetry Index (L / R)';
    }

    resultEl.textContent = ratio.toFixed(1) + '%';

    // Color-code result
    resultEl.classList.remove('good', 'warning', 'danger');
    if (ratio >= 90) {
      resultEl.classList.add('good');
    } else if (ratio >= 80) {
      resultEl.classList.add('warning');
    } else {
      resultEl.classList.add('danger');
    }
  } else {
    resultEl.textContent = '—';
    resultEl.classList.remove('good', 'warning', 'danger');
    labelEl.textContent = 'Symmetry Index';
  }
}
