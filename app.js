const firms = [
  {
    name: "Apex Trader Funding",
    initials: "AT",
    platform: "Tradovate / Rithmic",
    account: 100,
    price: 207,
    payout: 90,
    drawdown: 2500,
    score: 4.8,
    tags: ["futures", "news", "fast payout"],
    strategy: ["news", "swing"],
    coupon: "APEX35",
    deal: "最高 35% off futures evaluations",
    color: "#3366cc",
  },
  {
    name: "FTMO",
    initials: "FT",
    platform: "MT4 / MT5 / cTrader",
    account: 200,
    price: 1080,
    payout: 90,
    drawdown: 10000,
    score: 4.7,
    tags: ["forex", "refund", "established"],
    strategy: ["ea", "swing"],
    coupon: "FTMO-PRO",
    deal: "首次挑战退款规则清晰",
    color: "#0e8f79",
  },
  {
    name: "The5ers",
    initials: "5R",
    platform: "MT5",
    account: 100,
    price: 495,
    payout: 100,
    drawdown: 6000,
    score: 4.6,
    tags: ["instant", "scaling", "low target"],
    strategy: ["ea", "swing"],
    coupon: "FIVE10",
    deal: "部分账户 10% off",
    color: "#d59d28",
  },
  {
    name: "Topstep",
    initials: "TS",
    platform: "TopstepX / NinjaTrader",
    account: 150,
    price: 149,
    payout: 90,
    drawdown: 4500,
    score: 4.5,
    tags: ["futures", "coaching", "simple rules"],
    strategy: ["news"],
    coupon: "TOP20",
    deal: "首月挑战费用优惠",
    color: "#d75d4b",
  },
  {
    name: "FundedNext",
    initials: "FN",
    platform: "MT4 / MT5",
    account: 200,
    price: 999,
    payout: 95,
    drawdown: 10000,
    score: 4.4,
    tags: ["forex", "news", "profit share"],
    strategy: ["news", "ea"],
    coupon: "NEXT15",
    deal: "挑战账户 15% off",
    color: "#7a4fc4",
  },
  {
    name: "Blue Guardian",
    initials: "BG",
    platform: "MT5",
    account: 50,
    price: 297,
    payout: 85,
    drawdown: 5000,
    score: 4.2,
    tags: ["forex", "ea", "weekend hold"],
    strategy: ["ea", "swing"],
    coupon: "BLUE12",
    deal: "精选账户 12% off",
    color: "#1f8aaf",
  },
];

const state = {
  search: "",
  size: "all",
  strategy: "all",
  budget: 1100,
  sort: "score",
  favorites: new Set(),
};

const rowsEl = document.querySelector("#firmRows");
const emptyEl = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const sizeFilter = document.querySelector("#sizeFilter");
const strategyFilter = document.querySelector("#strategyFilter");
const budgetFilter = document.querySelector("#budgetFilter");
const budgetLabel = document.querySelector("#budgetLabel");
const sortSelect = document.querySelector("#sortSelect");
const dealGrid = document.querySelector("#dealGrid");

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getFilteredFirms() {
  const query = state.search.trim().toLowerCase();

  return firms
    .filter((firm) => {
      const matchesQuery =
        !query ||
        [firm.name, firm.platform, ...firm.tags].join(" ").toLowerCase().includes(query);
      const matchesSize = state.size === "all" || firm.account >= Number(state.size);
      const matchesStrategy =
        state.strategy === "all" || firm.strategy.includes(state.strategy);
      const matchesBudget = firm.price <= state.budget;

      return matchesQuery && matchesSize && matchesStrategy && matchesBudget;
    })
    .sort((a, b) => {
      if (state.sort === "price") return a.price - b.price;
      if (state.sort === "payout") return b.payout - a.payout;
      if (state.sort === "drawdown") return b.drawdown - a.drawdown;
      return b.score - a.score;
    });
}

function renderRows() {
  const filtered = getFilteredFirms();
  rowsEl.innerHTML = "";
  emptyEl.hidden = filtered.length > 0;

  filtered.forEach((firm) => {
    const row = document.createElement("tr");
    const isFavorite = state.favorites.has(firm.name);
    row.innerHTML = `
      <td data-label="Firm">
        <div class="firm-cell">
          <span class="firm-logo" style="background:${firm.color}">${firm.initials}</span>
          <span>
            <span class="firm-name">${firm.name}</span>
            <span class="firm-meta">${firm.platform}</span>
          </span>
        </div>
      </td>
      <td data-label="账户">${firm.account}K</td>
      <td data-label="价格">${money(firm.price)}</td>
      <td data-label="分润">${firm.payout}%</td>
      <td data-label="回撤">${money(firm.drawdown)}</td>
      <td data-label="规则">
        <span class="tag-list">${firm.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</span>
      </td>
      <td data-label="评分"><span class="score">${firm.score.toFixed(1)}</span></td>
      <td data-label="操作">
        <div class="row-actions">
          <button class="favorite ${isFavorite ? "is-active" : ""}" type="button" aria-label="收藏 ${firm.name}" data-favorite="${firm.name}">☆</button>
          <a class="visit-button" href="#deals">查看优惠</a>
        </div>
      </td>
    `;
    rowsEl.append(row);
  });
}

function renderDeals() {
  dealGrid.innerHTML = firms
    .slice(0, 3)
    .map(
      (firm) => `
        <article class="deal-card">
          <div class="deal-top">
            <div>
              <strong>${firm.name}</strong>
              <p>${firm.deal}</p>
            </div>
            <span class="deal-code">${firm.coupon}</span>
          </div>
          <button class="copy-button" type="button" data-code="${firm.coupon}">复制优惠码</button>
        </article>
      `,
    )
    .join("");
}

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderRows();
});

sizeFilter.addEventListener("change", (event) => {
  state.size = event.target.value;
  renderRows();
});

strategyFilter.addEventListener("change", (event) => {
  state.strategy = event.target.value;
  renderRows();
});

budgetFilter.addEventListener("input", (event) => {
  state.budget = Number(event.target.value);
  budgetLabel.textContent = money(state.budget);
  renderRows();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderRows();
});

document.addEventListener("click", async (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const copyButton = event.target.closest("[data-code]");

  if (favoriteButton) {
    const name = favoriteButton.dataset.favorite;
    if (state.favorites.has(name)) {
      state.favorites.delete(name);
    } else {
      state.favorites.add(name);
    }
    renderRows();
  }

  if (copyButton) {
    const code = copyButton.dataset.code;
    await navigator.clipboard.writeText(code);
    copyButton.textContent = "已复制";
    setTimeout(() => {
      copyButton.textContent = "复制优惠码";
    }, 1400);
  }
});

budgetLabel.textContent = money(state.budget);
renderRows();
renderDeals();
