(() => {
  "use strict";
  const root = document.getElementById("__ROOT_ID__");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";
  root.dataset.enhanced = "true";
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];

  // Every query and mutation is confined to this page's root.
  $$("[data-explorer]").forEach((explorer) => {
    const panels = [...explorer.querySelectorAll("[data-panel]")];
    const buttons = [...explorer.querySelectorAll("[data-choice]")];
    panels.forEach((panel, i) => {
      panel.hidden = i !== 0;
    });
    buttons.forEach((button) =>
      button.addEventListener("click", () => {
        buttons.forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
        panels.forEach((panel) => {
          panel.hidden = panel.dataset.panel !== button.dataset.choice;
        });
        explorer.querySelector("[data-explorer-status]").textContent =
          `${button.textContent} selected. The explanation below has changed.`;
      }),
    );
  });

  let selectedSemester = "all";
  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filterReadings = () => {
    const search = normalize($("input[data-search]")?.value || "").trim();
    const theme = $("select[data-theme]")?.value || "all";
    let count = 0;
    $$("[data-reading-row]").forEach((row) => {
      const matches =
        normalize(row.dataset.search).includes(search) &&
        (selectedSemester === "all" ||
          row.dataset.semester === selectedSemester) &&
        (theme === "all" || row.dataset.theme === theme);
      row.hidden = !matches;
      if (matches) count++;
    });
    const countLabel = $("[data-result-count]");
    if (countLabel)
      countLabel.textContent = `${count} ${count === 1 ? "reading" : "readings"} in view`;
    const empty = $("[data-empty]");
    if (empty) empty.hidden = count > 0;
  };
  $("input[data-search]")?.addEventListener("input", filterReadings);
  $("select[data-theme]")?.addEventListener("change", filterReadings);
  $$("[data-filter-semester]").forEach((button) =>
    button.addEventListener("click", () => {
      selectedSemester = button.dataset.filterSemester;
      $$("[data-filter-semester]").forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      filterReadings();
    }),
  );
  filterReadings();

  $$("[data-sort]").forEach((activity) => {
    const selects = [...activity.querySelectorAll("select")];
    const status = activity.querySelector("[data-sort-status]");
    activity
      .querySelector("[data-check-sort]")
      .addEventListener("click", () => {
        let correct = 0;
        selects.forEach((select) => {
          const feedback = select.parentElement.querySelector(".sort-feedback");
          if (!select.value) {
            feedback.textContent = "Choose a category, then check again.";
            select.removeAttribute("aria-invalid");
          } else {
            const matched = select.value === select.dataset.answer;
            correct += matched ? 1 : 0;
            feedback.textContent = `${matched ? "Correct." : "Reconsider this choice."} ${select.dataset.why}`;
            select.setAttribute("aria-invalid", String(!matched));
          }
        });
        status.textContent = `${correct} of ${selects.length} categories match the source. You can change your choices and check again.`;
      });
    activity
      .querySelector("[data-reset-sort]")
      .addEventListener("click", () => {
        selects.forEach((select) => {
          select.value = "";
          select.removeAttribute("aria-invalid");
        });
        activity.querySelectorAll(".sort-feedback").forEach((item) => {
          item.textContent = "";
        });
        status.textContent = "Categories reset.";
        selects[0].focus();
      });
  });

  const accessResult = $("[data-access-result]");
  if (accessResult) {
    const responses = {
      distance:
        "Distance: support a nearby fresh-food provider or help an existing shop add fresh options.",
      transport:
        "Transport: grocery trips or delivery can connect households with food.",
      cost: "Cost: a closer shop does not make food affordable by itself. The article calls for attention to poverty.",
      safety:
        "Safety: safer walking and transit routes can make existing stores more reachable.",
    };
    const updateAccess = () => {
      const rural = $("[data-setting]").value === "rural";
      const intro = document.createElement("p");
      intro.textContent = rural
        ? "Rural context: stores may be far apart and have too few customers to buy fresh stock cheaply."
        : "Urban context: even a short distance can be difficult without transport or a safe route.";
      const list = document.createElement("ul");
      const selected = $$("[data-barrier]:checked");
      selected.forEach((input) => {
        const item = document.createElement("li");
        item.textContent = responses[input.value];
        list.append(item);
      });
      if (!selected.length) {
        const item = document.createElement("li");
        item.textContent =
          "No barriers selected. This does not prove that food access is adequate; choose a barrier to examine a response.";
        list.append(item);
      }
      accessResult.replaceChildren(intro, list);
    };
    $("[data-setting]").addEventListener("change", updateAccess);
    $$("[data-barrier]").forEach((input) =>
      input.addEventListener("change", updateAccess),
    );
    updateAccess();
  }

  const surveyResponses = [
    "Born or raised · 26%: early experiences can continue to anchor belonging even after a person moves.",
    "Currently live · 22%: present routines and relationships can make a current residence feel like home.",
    "Lived longest · 18%: accumulated experiences can make time spent in a place meaningful.",
    "Extended family roots · 15%: family history can connect someone to a place beyond their present address.",
  ];
  $$("[data-survey]").forEach((button) =>
    button.addEventListener("click", () => {
      $$("[data-survey]").forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      $("[data-survey-result]").textContent =
        surveyResponses[Number(button.dataset.survey)];
    }),
  );
})();
