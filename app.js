const firms = [
  {
    name: "Apex Trader Funding",
    initials: "AT",
    platform: "Tradovate / Rithmic",
    type: "Futures",
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
    type: "Forex CFD",
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
    type: "Forex CFD",
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
    type: "Futures",
    account: 150,
    price: 149,
    payout: 90,
    drawdown: 4500,
    score: 4.5,
    tags: ["futures", "coaching", "top step"],
    strategy: ["news"],
    coupon: "TOP20",
    deal: "首月挑战费用优惠",
    color: "#d75d4b",
  },
  {
    name: "FundedNext",
    initials: "FN",
    platform: "MT4 / MT5",
    type: "Forex CFD",
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
    type: "Forex CFD",
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
  {
    name: "Lucid Trading",
    initials: "LU",
    platform: "Match-Trader / MT5",
    type: "Forex CFD",
    account: 100,
    price: 549,
    payout: 90,
    drawdown: 8000,
    score: 4.5,
    tags: ["lucid", "instant", "news"],
    strategy: ["news", "ea"],
    coupon: "LUCID15",
    deal: "Lucid challenge 15% off",
    color: "#14a085",
  },
  {
    name: "Top One Trader",
    initials: "TO",
    platform: "TradeLocker / MT5",
    type: "Forex CFD",
    account: 200,
    price: 950,
    payout: 90,
    drawdown: 10000,
    score: 4.3,
    tags: ["top one", "scaling", "ea"],
    strategy: ["ea", "swing"],
    coupon: "YYDS",
    deal: "Top One selected plans 20% off",
    color: "#4656d9",
  },
  {
    name: "YRM Funding",
    initials: "YR",
    platform: "MT5 / Match-Trader",
    type: "Forex CFD",
    account: 100,
    price: 499,
    payout: 85,
    drawdown: 7000,
    score: 4.1,
    tags: ["yrm", "low target", "weekend hold"],
    strategy: ["swing", "ea"],
    coupon: "QA",
    deal: "YRM evaluation 10% off",
    color: "#be4b73",
  },
  {
    name: "MyFundedFutures",
    initials: "MF",
    platform: "Tradovate / NinjaTrader",
    type: "Futures",
    account: 150,
    price: 225,
    payout: 90,
    drawdown: 4500,
    score: 4.4,
    tags: ["futures", "fast payout", "news"],
    strategy: ["news"],
    coupon: "MFF25",
    deal: "Futures evaluation 25% off",
    color: "#0f766e",
  },
  {
    name: "Take Profit Trader",
    initials: "TP",
    platform: "Rithmic / Tradovate",
    type: "Futures",
    account: 150,
    price: 170,
    payout: 80,
    drawdown: 4500,
    score: 4.2,
    tags: ["futures", "simple rules", "drawdown"],
    strategy: ["news", "swing"],
    coupon: "TAKE20",
    deal: "Monthly futures challenge 20% off",
    color: "#c26d2b",
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
const trackedCount = document.querySelector("#trackedCount");
const plansCount = document.querySelector("#plansCount");
const resultCount = document.querySelector("#resultCount");
const activeFilters = document.querySelector("#activeFilters");

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
        [firm.name, firm.platform, firm.type, ...firm.tags].join(" ").toLowerCase().includes(query);
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
  renderResultState(filtered.length);

  filtered.forEach((firm) => {
    const row = document.createElement("tr");
    const isFavorite = state.favorites.has(firm.name);
    const isFeatured = ["Top One Trader", "YRM Funding", "Lucid Trading", "Topstep"].includes(firm.name);
    row.innerHTML = `
      <td data-label="Firm">
        <div class="firm-cell">
          <span class="firm-logo" style="background:${firm.color}">${firm.initials}</span>
          <span>
            <span class="firm-name">${firm.name}${isFeatured ? '<span class="recommended-badge">Featured</span>' : ""}</span>
            <span class="firm-meta">${firm.platform}</span>
          </span>
        </div>
      </td>
      <td data-label="账户">${firm.account}K</td>
      <td data-label="类型"><span class="type-pill">${firm.type}</span></td>
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
    .filter((firm) =>
      ["Lucid Trading", "Top One Trader", "YRM Funding", "Topstep", "Apex Trader Funding", "FTMO"].includes(
        firm.name,
      ),
    )
    .map(
      (firm) => `
        <article class="deal-card ${["YYDS", "QA"].includes(firm.coupon) ? "deal-card-featured" : ""}">
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

function renderStats() {
  trackedCount.textContent = firms.length;
  plansCount.textContent = firms.reduce((sum, firm) => sum + Math.max(2, Math.round(firm.account / 25)), 0);
}

function renderResultState(count) {
  const sizeText = state.size === "all" ? "全部账户" : `${state.size}K+ 账户`;
  const strategyText =
    {
      all: "全部策略",
      news: "允许新闻交易",
      ea: "允许 EA",
      swing: "适合隔夜持仓",
    }[state.strategy] || "全部策略";

  resultCount.textContent = `${count} firms matched`;
  activeFilters.textContent = `${sizeText} · ${strategyText} · ${money(state.budget)} 以下`;
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
renderStats();
renderRows();
renderDeals();
