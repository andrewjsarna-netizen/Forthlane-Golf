const SCOREBOARD_STORAGE_KEY = "masters-pool-teams-v2";
const SCOREBOARD_SUPABASE_TABLE = "teams";
const MASTERS_EVENT_ID = "401811941";
const SCOREBOARD_REFRESH_MS = 60000;
const SCOREBOARD_DEMO_TEAM_ENABLED = true;
const MASTERS_PAYOUTS = {
  1: 3600000,
  2: 2160000,
  3: 1360000,
  4: 960000,
  5: 800000,
  6: 720000,
  7: 670000,
  8: 620000,
  9: 580000,
  10: 540000,
  11: 500000,
  12: 460000,
  13: 420000,
  14: 380000,
  15: 360000,
  16: 340000,
  17: 320000,
  18: 300000,
  19: 280000,
  20: 260000,
  21: 240000,
  22: 224000,
  23: 208000,
  24: 192000,
  25: 176000,
  26: 160000,
  27: 154000,
  28: 148000,
  29: 142000,
  30: 136000,
  31: 130000,
  32: 124000,
  33: 118000,
  34: 113000,
  35: 108000,
  36: 103000,
  37: 98000,
  38: 94000,
  39: 90000,
  40: 86000,
  41: 82000,
  42: 78000,
  43: 74000,
  44: 70000,
  45: 66000,
  46: 62000,
  47: 58000,
  48: 54800,
  49: 52000,
  50: 50400
};

const scoreboardSupabaseConfig = window.SUPABASE_CONFIG || { url: "", anonKey: "" };
const scoreboardSupabaseClient =
  window.supabase &&
  scoreboardSupabaseConfig.url &&
  scoreboardSupabaseConfig.anonKey
    ? window.supabase.createClient(
        scoreboardSupabaseConfig.url,
        scoreboardSupabaseConfig.anonKey
      )
    : null;

function normalizePlayerName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function formatUpdatedTime(value) {
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function readDisplayValue(value) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    return (
      value.displayValue ||
      value.displayName ||
      value.shortDisplayName ||
      value.shortDetail ||
      value.detail ||
      value.value ||
      value.current ||
      "-"
    );
  }
  return "-";
}

function isGolfScore(value) {
  return /^(?:E|[-+]\d+|\d+)$/.test(String(value || "").trim());
}

function formatGolfScore(value) {
  const text = String(value || "").trim();
  if (!text) return "-";
  if (text === "0") return "E";
  if (/^-/.test(text) || /^\+/.test(text) || text === "E") return text;
  if (/^\d+$/.test(text)) return `+${text}`;
  return text;
}

function parseGolfScoreNumber(value) {
  const text = String(value || "").trim().toUpperCase();
  if (!text) return null;
  if (text === "E") return 0;
  if (/^[+-]?\d+$/.test(text)) return Number.parseInt(text, 10);
  return null;
}

function findStatisticValue(competitor, matchers) {
  const buckets = [
    competitor?.statistics,
    competitor?.stats,
    competitor?.score?.statistics,
    competitor?.scorecard?.statistics,
    competitor?.athlete?.statistics
  ].filter(Array.isArray);

  for (const bucket of buckets) {
    for (const stat of bucket) {
      const label = [
        stat?.name,
        stat?.displayName,
        stat?.shortDisplayName,
        stat?.abbreviation
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!label) continue;
      if (!matchers.some((matcher) => matcher.test(label))) continue;

      const candidates = [
        stat?.displayValue,
        stat?.value,
        stat?.summary,
        stat?.stat,
        stat?.current
      ];

      for (const candidate of candidates) {
        const value = readDisplayValue(candidate);
        if (isGolfScore(value)) {
          return formatGolfScore(value);
        }
      }
    }
  }

  return null;
}

function findAllStatisticValues(competitor, matchers) {
  const buckets = [
    competitor?.statistics,
    competitor?.stats,
    competitor?.score?.statistics,
    competitor?.scorecard?.statistics,
    competitor?.athlete?.statistics
  ].filter(Array.isArray);

  const values = [];

  for (const bucket of buckets) {
    for (const stat of bucket) {
      const label = [
        stat?.name,
        stat?.displayName,
        stat?.shortDisplayName,
        stat?.abbreviation
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!label) continue;
      if (!matchers.some((matcher) => matcher.test(label))) continue;

      const candidates = [
        stat?.displayValue,
        stat?.value,
        stat?.summary,
        stat?.stat,
        stat?.current
      ];

      for (const candidate of candidates) {
        const value = readDisplayValue(candidate);
        if (isGolfScore(value)) {
          values.push(formatGolfScore(value));
        }
      }
    }
  }

  return values;
}

function isThruValue(value) {
  return /^(?:\d+|F|CUT|WD|DQ|MDF|MC)$/i.test(String(value || "").trim());
}

function readThruValue(competitor) {
  const statBuckets = [
    competitor?.statistics,
    competitor?.stats,
    competitor?.score?.statistics,
    competitor?.scorecard?.statistics,
    competitor?.athlete?.statistics
  ].filter(Array.isArray);

  for (const bucket of statBuckets) {
    for (const stat of bucket) {
      const label = [
        stat?.name,
        stat?.displayName,
        stat?.shortDisplayName,
        stat?.abbreviation
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!label) continue;
      if (![/(^|\s)thru($|\s)/, /holes?/, /progress/, /round status/].some((matcher) => matcher.test(label))) {
        continue;
      }

      const candidates = [
        stat?.displayValue,
        stat?.value,
        stat?.summary,
        stat?.stat,
        stat?.current
      ];

      for (const candidate of candidates) {
        const value = readDisplayValue(candidate);
        if (isThruValue(value)) {
          return value;
        }
      }
    }
  }

  const fallbackCandidates = [
    competitor?.status?.thru,
    competitor?.thru,
    competitor?.holesCompleted,
    competitor?.status?.displayValue,
    competitor?.status?.type?.shortDetail,
    competitor?.status?.type?.detail
  ];

  for (const candidate of fallbackCandidates) {
    const value = readDisplayValue(candidate);
    if (isThruValue(value)) {
      return value;
    }
  }

  return "-";
}

function normalizePositionKey(value) {
  return String(value || "").trim().toUpperCase();
}

function parsePositionNumber(value) {
  const match = String(value || "").trim().toUpperCase().match(/^T?(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : null;
}

function buildPayoutMap(competitors) {
  const grouped = new Map();

  competitors.forEach((competitor) => {
    const key = normalizePositionKey(
      readDisplayValue(
        competitor?.score?.position ||
          competitor?.curatedRank ||
          competitor?.status?.position ||
          competitor?.position
      )
    );

    if (!key || key === "-") return;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(competitor);
  });

  const payoutMap = new Map();

  grouped.forEach((group, key) => {
    const startPos = parsePositionNumber(key);
    if (!startPos || !MASTERS_PAYOUTS[startPos]) return;

    const tieCount = group.length;
    let total = 0;

    for (let pos = startPos; pos < startPos + tieCount; pos += 1) {
      total += MASTERS_PAYOUTS[pos] || 0;
    }

    if (!total) return;

    const average = total / tieCount;

    group.forEach((competitor) => {
      payoutMap.set(
        normalizePlayerName(competitor?.athlete?.displayName || ""),
        average
      );
    });
  });

  return payoutMap;
}

function readScoreValue(competitor) {
  const lineScores = Array.isArray(competitor?.linescores) ? competitor.linescores : [];
  const lineScoreNumbers = lineScores
    .map((line) =>
      parseGolfScoreNumber(
        readDisplayValue(
          line?.displayValue ??
            line?.toPar ??
            line?.scoreToPar ??
            line?.value
        )
      )
    )
    .filter((value) => value !== null);

  if (lineScoreNumbers.length) {
    return formatGolfScore(String(lineScoreNumbers.reduce((sum, value) => sum + value, 0)));
  }

  const exactScoreValues = findAllStatisticValues(competitor, [/^score$/, /^total$/, /to par/]);
  const todayValues = findAllStatisticValues(competitor, [/^today$/]);

  const nonEvenExact = exactScoreValues.find((value) => value !== "E" && value !== "-");
  if (nonEvenExact) return nonEvenExact;

  const nonEvenToday = todayValues.find((value) => value !== "E" && value !== "-");
  if (nonEvenToday) return nonEvenToday;

  const statScore = exactScoreValues[0] || todayValues[0] || null;
  if (statScore) return statScore;

  const candidates = [
    competitor?.scoreToPar,
    competitor?.toPar,
    competitor?.totalToPar,
    competitor?.score?.toPar,
    competitor?.score?.scoreToPar,
    competitor?.score?.displayValue,
    competitor?.score?.value,
    competitor?.status?.displayValue,
    competitor?.status?.type?.shortDetail
  ];

  for (const candidate of candidates) {
    const value = readDisplayValue(candidate);
    if (isGolfScore(value)) {
      return formatGolfScore(value);
    }
  }

  return "-";
}

function getLocalTeams() {
  try {
    const raw = localStorage.getItem(SCOREBOARD_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveLocalTeams(teams) {
  localStorage.setItem(SCOREBOARD_STORAGE_KEY, JSON.stringify(teams));
}

function seedScoreboardDemoTeam() {
  if (!SCOREBOARD_DEMO_TEAM_ENABLED) return;
  if (scoreboardSupabaseClient) return;

  const teams = getLocalTeams();
  const hasDemo = teams.some((team) => (team.teamName || "").toLowerCase() === "aces");
  if (hasDemo) return;

  teams.push({
    id: "demo-aces",
    teamName: "aces",
    teamOwner: "Demo",
    totalPoints: 16.6208,
    createdAt: new Date().toISOString(),
    players: [
      { name: "Harris English", rank: 20, avgPoints: 3.4272 },
      { name: "Akshay Bhatia", rank: 21, avgPoints: 3.3967 },
      { name: "Viktor Hovland", rank: 22, avgPoints: 3.3338 },
      { name: "Patrick Reed", rank: 23, avgPoints: 3.2964 },
      { name: "Bryson DeChambeau", rank: 24, avgPoints: 3.1647 }
    ]
  });

  saveLocalTeams(teams);
}

async function fetchTeamsForScoreboard() {
  if (!scoreboardSupabaseClient) {
    return getLocalTeams();
  }

  const { data, error } = await scoreboardSupabaseClient
    .from(SCOREBOARD_SUPABASE_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load Supabase teams for scoreboard:", error);
    return getLocalTeams();
  }

  return (data || []).map((team) => ({
    id: team.id,
    teamName: team.team_name,
    teamOwner: team.team_owner,
    totalPoints: Number.parseFloat(team.total_points) || 0,
    createdAt: team.created_at,
    players: Array.isArray(team.players) ? team.players : []
  }));
}

async function fetchLeaderboardMap() {
  const endpoint =
    `https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard` +
    `?league=pga&event=${MASTERS_EVENT_ID}`;

  const response = await fetch(endpoint, { credentials: "omit" });
  if (!response.ok) {
    throw new Error(`Leaderboard request failed (${response.status})`);
  }

  const payload = await response.json();
  const competitors =
    payload?.events?.[0]?.competitions?.[0]?.competitors || [];

  window.__mastersLeaderboardPayload = payload;
  window.__mastersLeaderboardCompetitors = competitors;
  window.__patrickReedCompetitor = competitors.find((competitor) =>
    normalizePlayerName(competitor?.athlete?.displayName) === normalizePlayerName("Patrick Reed")
  );
  const payoutMap = buildPayoutMap(competitors);

  const map = new Map();

  competitors.forEach((competitor) => {
    const athleteName = competitor?.athlete?.displayName || competitor?.athlete?.shortName || "";
    if (!athleteName) return;

    const entry = {
      position: readDisplayValue(
        competitor?.score?.position ||
          competitor?.curatedRank ||
          competitor?.status?.position ||
          competitor?.position
      ),
      score: readScoreValue(competitor),
      thru: readThruValue(competitor),
      estimatedWinnings:
        payoutMap.get(normalizePlayerName(athleteName)) ?? null,
      sortPosition: competitor?.order || 9999
    };

    map.set(normalizePlayerName(athleteName), entry);
  });

  return map;
}

function teamSortValue(team, leaderboardMap) {
  const positions = (team.players || []).map((player) => {
    const live = leaderboardMap.get(normalizePlayerName(player.name));
    return typeof live?.sortPosition === "number" ? live.sortPosition : 9999;
  });

  return positions.length ? Math.min(...positions) : 9999;
}

function renderScoreboardRows(teams, leaderboardMap) {
  const tbody = document.getElementById("scoreboard-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!teams.length) {
    tbody.innerHTML =
      '<tr><td colspan="8" class="scoreboard-empty">No submitted teams yet.</td></tr>';
    return;
  }

  const rankedTeams = teams.map((team) => {
    const estimatedTotal = (team.players || []).reduce((sum, player) => {
      const live = leaderboardMap.get(normalizePlayerName(player.name));
      return sum + (live?.estimatedWinnings || 0);
    }, 0);

    return {
      ...team,
      estimatedTotal
    };
  });

  const sortedTeams = [...rankedTeams].sort((a, b) => {
    const diff = b.estimatedTotal - a.estimatedTotal;
    if (diff !== 0) return diff;
    const posDiff = teamSortValue(a, leaderboardMap) - teamSortValue(b, leaderboardMap);
    if (posDiff !== 0) return posDiff;
    return (a.teamName || "").localeCompare(b.teamName || "");
  });

  let lastTotal = null;
  let displayRank = 0;

  sortedTeams.forEach((team, index) => {
    if (lastTotal === null || team.estimatedTotal !== lastTotal) {
      displayRank = index + 1;
      lastTotal = team.estimatedTotal;
    }
    team.teamPosition = displayRank;
  });

  sortedTeams.forEach((team) => {
    const players = team.players || [];

    players.forEach((player, index) => {
      const live = leaderboardMap.get(normalizePlayerName(player.name)) || {
        position: "-",
        score: "-",
        thru: "-"
      };

      const tr = document.createElement("tr");

      if (index === 0) {
        const teamPosCell = document.createElement("td");
        teamPosCell.rowSpan = players.length || 1;
        teamPosCell.className = "team-stub team-rank-stub";
        teamPosCell.textContent = `#${team.teamPosition}`;

        const teamCell = document.createElement("td");
        teamCell.rowSpan = players.length || 1;
        teamCell.className = "team-stub";
        teamCell.innerHTML = `
          <div>${team.teamName || "Unnamed Team"}</div>
          <div class="team-total-note">${formatCurrency(team.estimatedTotal)}</div>
        `;

        const ownerCell = document.createElement("td");
        ownerCell.rowSpan = players.length || 1;
        ownerCell.className = "owner-stub";
        ownerCell.textContent = team.teamOwner || "Unknown";

        tr.append(teamPosCell, teamCell, ownerCell);
      }

      const playerCell = document.createElement("td");
      playerCell.textContent = player.name;

      const posCell = document.createElement("td");
      posCell.textContent = live.position || "-";

      const scoreCell = document.createElement("td");
      scoreCell.textContent = live.score || "-";
      scoreCell.className =
        typeof live.score === "string" && live.score.startsWith("-")
          ? "score-good"
          : live.score === "E"
            ? "score-even"
            : "score-bad";

      const thruCell = document.createElement("td");
      thruCell.textContent = live.thru || "-";

      const winningsCell = document.createElement("td");
      winningsCell.textContent = formatCurrency(live.estimatedWinnings);
      winningsCell.className = "winnings-cell";

      tr.append(playerCell, posCell, scoreCell, thruCell, winningsCell);
      tbody.appendChild(tr);
    });
  });

  fitScoreboardTableForMobile();
}

function fitScoreboardTableForMobile() {
  const wrap = document.querySelector(".scoreboard-table-wrap");
  const table = document.querySelector(".scoreboard-table");
  if (!wrap || !table) return;

  table.style.transform = "";
  table.style.transformOrigin = "";
  wrap.style.height = "";

  if (window.innerWidth > 640) return;

  const availableWidth = wrap.clientWidth;
  const naturalWidth = table.scrollWidth;
  if (!availableWidth || !naturalWidth) return;

  const scale = Math.min(1, availableWidth / naturalWidth);
  table.style.transform = `scale(${scale})`;
  table.style.transformOrigin = "top left";
  wrap.style.height = `${table.offsetHeight * scale}px`;
}

async function renderScoreboard() {
  const status = document.getElementById("scoreboard-status");
  const updated = document.getElementById("leaderboard-updated");

  try {
    const [teams, leaderboardMap] = await Promise.all([
      fetchTeamsForScoreboard(),
      fetchLeaderboardMap()
    ]);

    renderScoreboardRows(teams, leaderboardMap);

    if (status) {
      status.textContent = "Live Masters positions, scores, and thru data are updating automatically.";
    }
    if (updated) {
      updated.textContent = `Updated ${formatUpdatedTime(Date.now())} · Auto-refresh every 60 seconds`;
    }
  } catch (error) {
    console.error(error);
    const tbody = document.getElementById("scoreboard-body");
    if (tbody) {
      tbody.innerHTML =
        '<tr><td colspan="8" class="scoreboard-empty">Could not load live leaderboard data right now.</td></tr>';
    }
    if (status) {
      status.textContent = "Live data could not be loaded right now.";
    }
  }
}

seedScoreboardDemoTeam();
renderScoreboard();
window.setInterval(renderScoreboard, SCOREBOARD_REFRESH_MS);
window.addEventListener("resize", fitScoreboardTableForMobile);
