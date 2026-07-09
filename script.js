const planButtons = document.querySelectorAll(".plan");
const selectedPlan = document.querySelector("#selectedPlan");
const lockNotice = document.querySelector("#lockNotice");
const signupForm = document.querySelector("#signupForm");
const formMessage = document.querySelector("#formMessage");
const m2Options = document.querySelectorAll('input[name="m2Device"]');
const contractPriceSummary = document.querySelector("#contractPriceSummary");
const activateContractButton = document.querySelector("#activateContractButton");
const cancelSubscriptionButton = document.querySelector("#cancelSubscriptionButton");
const contractMessage = document.querySelector("#contractMessage");
const cancelContractForm = document.querySelector("#cancelContractForm");
const cancelContractPeriod = document.querySelector("#cancelContractPeriod");
const cancelMessage = document.querySelector("#cancelMessage");

const storageKeys = {
  active: "carmaxSubscriptionActive",
  cancellationRequested: "carmaxCancellationRequested",
  m2Device: "carmaxM2Device",
  planPeriod: "carmaxPlanPeriod",
  planPrice: "carmaxPlanPrice",
};

const basePrices = {
  oneYear: 89,
  twoYears: 79,
};

let currentPlan = {
  period: localStorage.getItem(storageKeys.planPeriod) || "1 year",
  price: Number(localStorage.getItem(storageKeys.planPrice) || 89),
};

function saveCurrentPlan() {
  localStorage.setItem(storageKeys.planPeriod, currentPlan.period);
  localStorage.setItem(storageKeys.planPrice, String(currentPlan.price));
}

function getSelectedM2Option() {
  return document.querySelector('input[name="m2Device"]:checked');
}

function getAdjustedPrice(basePrice, option = getSelectedM2Option()) {
  const adjustment = Number(option?.dataset.adjust || 0);
  return Number(basePrice) + adjustment;
}

function updateSelectedPlanText() {
  const activePlan = document.querySelector(".plan.active");

  if (activePlan) {
    currentPlan = {
      period: activePlan.dataset.plan,
      price: Number(activePlan.dataset.price),
    };
  }

  if (selectedPlan) {
    selectedPlan.textContent = `${currentPlan.period}, ${currentPlan.price} € / month`;
  }

  if (lockNotice) {
    lockNotice.textContent = `After ${currentPlan.period} contract ends`;
  }

  saveCurrentPlan();
}

function updatePlanPrices(option = getSelectedM2Option()) {
  planButtons.forEach((button) => {
    const basePrice = button.dataset.basePrice || button.dataset.price;
    const nextPrice = getAdjustedPrice(basePrice, option);
    const priceLabel = button.querySelector(".plan-price");

    button.dataset.price = String(nextPrice);

    if (priceLabel) {
      priceLabel.innerHTML = `${nextPrice} € <small>/ month</small>`;
    }
  });

  updateSelectedPlanText();
}

function hydratePlanSelection() {
  if (!planButtons.length) {
    return;
  }

  const savedPeriod = localStorage.getItem(storageKeys.planPeriod);
  const savedPlan = savedPeriod
    ? document.querySelector(`.plan[data-plan="${savedPeriod}"]`)
    : null;

  if (!savedPlan) {
    return;
  }

  planButtons.forEach((item) => {
    item.classList.remove("active");
    item.setAttribute("aria-pressed", "false");
  });

  savedPlan.classList.add("active");
  savedPlan.setAttribute("aria-pressed", "true");
}

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    planButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    currentPlan = {
      period: button.dataset.plan,
      price: Number(button.dataset.price),
    };

    updateSelectedPlanText();

    if (lockNotice) {
      lockNotice.textContent = `After ${currentPlan.period} contract ends`;
    }

    if (formMessage) {
      formMessage.textContent = "";
      formMessage.classList.remove("success");
    }
  });
});

if (signupForm && formMessage) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = `Account ready for ${currentPlan.period} contract billing at ${currentPlan.price} € per month.`;
    formMessage.classList.add("success");
    signupForm.reset();
  });
}

function updateM2Summary(option) {
  if (!option) {
    return;
  }

  const oneYear = getAdjustedPrice(basePrices.oneYear, option);
  const twoYears = getAdjustedPrice(basePrices.twoYears, option);

  if (contractPriceSummary) {
    contractPriceSummary.textContent = `${option.value}: 1 year at ${oneYear} € / month or 2 years at ${twoYears} € / month`;
  }
}

m2Options.forEach((option) => {
  option.addEventListener("change", () => {
    localStorage.setItem(storageKeys.m2Device, option.value);
    updatePlanPrices(option);
    updateM2Summary(option);

    if (formMessage) {
      formMessage.textContent = "";
      formMessage.classList.remove("success");
    }
  });

  if (option.checked) {
    updatePlanPrices(option);
    updateM2Summary(option);
  }
});

function hydrateM2Selection() {
  hydratePlanSelection();

  const savedM2 = localStorage.getItem(storageKeys.m2Device);
  const savedOption = savedM2
    ? document.querySelector(`input[name="m2Device"][value="${savedM2}"]`)
    : null;
  const option = savedOption || getSelectedM2Option();

  if (option) {
    option.checked = true;
    updatePlanPrices(option);
    updateM2Summary(option);
  }
}

function refreshSubscriptionControls() {
  const isActive = localStorage.getItem(storageKeys.active) === "true";
  const isCancellationRequested = localStorage.getItem(storageKeys.cancellationRequested) === "true";

  if (cancelSubscriptionButton) {
    cancelSubscriptionButton.disabled = !isActive;
    cancelSubscriptionButton.textContent = isCancellationRequested
      ? "Cancellation scheduled"
      : "Cancel subscription";
  }
}

hydrateM2Selection();
refreshSubscriptionControls();

if (activateContractButton) {
  activateContractButton.addEventListener("click", () => {
    localStorage.setItem(storageKeys.active, "true");
    localStorage.setItem(storageKeys.cancellationRequested, "false");
    saveCurrentPlan();
    refreshSubscriptionControls();

    if (contractMessage) {
      contractMessage.textContent = `${currentPlan.period} subscription is active. Cancel subscription is now available.`;
      contractMessage.classList.add("success");
    }
  });
}

if (cancelSubscriptionButton) {
  cancelSubscriptionButton.addEventListener("click", () => {
    if (cancelSubscriptionButton.disabled) {
      return;
    }

    window.location.href = "cancel.html";
  });
}

if (cancelContractPeriod) {
  const savedPeriod = localStorage.getItem(storageKeys.planPeriod) || "1 year";
  cancelContractPeriod.textContent = `${savedPeriod} contract`;
}

if (cancelContractForm && cancelMessage) {
  cancelContractForm.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem(storageKeys.cancellationRequested, "true");
    cancelMessage.textContent = "The Contract will be cancelled when subscription time ends.";
    cancelMessage.classList.add("success");
  });
}
