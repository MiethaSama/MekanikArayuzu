function calculateOil() {
  const level = parseFloat(document.getElementById("oilLevel").value);
  const capacity = parseFloat(document.getElementById("oilCapacity").value);

  if (isNaN(level) || isNaN(capacity) || level < 0 || level > 100 || capacity <= 0) {
    alert("Geçerli değerler girin.");
    return;
  }

  const missingPercent = 100 - level;
  const missingLiters = (missingPercent / 100) * capacity;

  document.getElementById("oilResult").textContent = missingLiters.toFixed(2);
  document.getElementById("oilPercent").textContent = missingPercent;
  document.getElementById("targetOil").value = missingPercent;
}

function getAvailableUnitsWithStock() {
  return [
    { value: 100, stock: parseInt(document.getElementById("stock100").value) || 0 },
    { value: 50, stock: parseInt(document.getElementById("stock50").value) || 0 },
    { value: 25, stock: parseInt(document.getElementById("stock25").value) || 0 },
    { value: 15, stock: parseInt(document.getElementById("stock15").value) || 0 },
    { value: 5, stock: parseInt(document.getElementById("stock5").value) || 0 }
  ].filter(unit => unit.stock > 0);
}

function findOilCombinationWithStock(targetPercent, unitsWithStock) {
  const result = [];
  let remaining = targetPercent;

  for (let i = 0; i < unitsWithStock.length; i++) {
    const { value, stock } = unitsWithStock[i];
    let count = 0;
    while (remaining >= value && count < stock) {
      result.push(value);
      remaining -= value;
      count++;
    }
  }

  return {
    combo: result,
    leftover: remaining
  };
}

function showOilCombo() {
  const target = parseInt(document.getElementById("targetOil").value);
  const unitsWithStock = getAvailableUnitsWithStock();
  const { combo, leftover } = findOilCombinationWithStock(target, unitsWithStock);

  document.getElementById("comboResult").textContent = combo.join(" + ") + " = %" + combo.reduce((a, b) => a + b, 0);
  document.getElementById("comboLeftover").textContent = leftover;
}

const fiyatlar = {
  binek: {
    5: 6000,
    15: 18000,
    25: 30000,
    50: 60000,
    100: 120000,
    tamir: 2500,
    temizlik: 2500
  },

  meslek: {
    5: 5000,
    15: 15000,
    25: 25000,
    50: 50000,
    100: 100000,
    tamir: 2500,
    temizlik: 2500
  }
};

function calculateCost(type) {
  const target = parseInt(document.getElementById("targetOil").value);
  const unitsWithStock = getAvailableUnitsWithStock();
  const { combo } = findOilCombinationWithStock(target, unitsWithStock);
  const fiyat = fiyatlar[type];
  let total = 0;

  combo.forEach(percent => {
    if (fiyat[percent]) {
      total += fiyat[percent];
    }
  });

  const outputId = type === "binek" ? "costBinek" : "costMeslek";
  document.getElementById(outputId).textContent = total.toLocaleString();
}