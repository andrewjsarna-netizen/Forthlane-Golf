const STORAGE_KEY = "masters-pool-teams-v2";
const MAX_PLAYERS = 5;
const POINT_CAP = 25;
const REGISTRATION_OPEN = false;
const DEMO_TEAM_ENABLED = true;
const SUPABASE_TABLE = "teams";
const supabaseConfig = window.SUPABASE_CONFIG || { url: "", anonKey: "" };
const supabaseClient =
  window.supabase &&
  supabaseConfig.url &&
  supabaseConfig.anonKey
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
    : null;

const golfers = [
  { name: "Scottie Scheffler", rank: 1, avgPoints: 15.1, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/scottie-scheffler-18417" },
  { name: "Rory McIlroy", rank: 2, avgPoints: 8.0586, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/rory-mcilroy-10091" },
  { name: "Cameron Young", rank: 3, avgPoints: 5.3068, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/cameron-young-26651" },
  { name: "Tommy Fleetwood", rank: 4, avgPoints: 5.2339, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/tommy-fleetwood-12294" },
  { name: "J.J. Spaun", rank: 5, avgPoints: 5.0094, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/j.j.-spaun-17536" },
  { name: "Matt Fitzpatrick", rank: 6, avgPoints: 4.9741, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/matt-fitzpatrick-17646" },
  { name: "Collin Morikawa", rank: 7, avgPoints: 4.7627, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/collin-morikawa-22085" },
  { name: "Robert MacIntyre", rank: 8, avgPoints: 4.7622, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/robert-macintyre-23323" },
  { name: "Justin Rose", rank: 9, avgPoints: 4.735, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/justin-rose-6093" },
  { name: "Xander Schauffele", rank: 10, avgPoints: 4.7059, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/xander-schauffele-19895" },
  { name: "Chris Gotterup", rank: 11, avgPoints: 4.6311, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/chris-gotterup-27774" },
  { name: "Russell Henley", rank: 12, avgPoints: 4.477, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/russell-henley-14578" },
  { name: "Sepp Straka", rank: 13, avgPoints: 4.1614, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/sepp-straka-17511" },
  { name: "Hideki Matsuyama", rank: 14, avgPoints: 3.9537, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/hideki-matsuyama-13562" },
  { name: "Justin Thomas", rank: 15, avgPoints: 3.8604, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/justin-thomas-14139" },
  { name: "Ben Griffin", rank: 16, avgPoints: 3.8342, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/ben-griffin-24968" },
  { name: "Ludvig Aberg", rank: 17, avgPoints: 3.7233, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/ludvig-aberg-23950" },
  { name: "Jacob Bridgeman", rank: 18, avgPoints: 3.6087, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jacob-bridgeman-29433" },
  { name: "Alex Noren", rank: 19, avgPoints: 3.472, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/alex-noren-10419" },
  { name: "Harris English", rank: 20, avgPoints: 3.4272, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/harris-english-12970" },
  { name: "Akshay Bhatia", rank: 21, avgPoints: 3.3967, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/akshay-bhatia-25164" },
  { name: "Viktor Hovland", rank: 22, avgPoints: 3.3338, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/viktor-hovland-22398" },
  { name: "Patrick Reed", rank: 23, avgPoints: 3.2964, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/patrick-reed-14060" },
  { name: "Bryson DeChambeau", rank: 24, avgPoints: 3.1647, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/bryson-dechambeau-19811" },
  { name: "Min Woo Lee", rank: 25, avgPoints: 3.0216, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/min-woo-lee-22954" },
  { name: "Keegan Bradley", rank: 26, avgPoints: 2.9365, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/keegan-bradley-15412" },
  { name: "Maverick McNealy", rank: 27, avgPoints: 2.9134, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/maverick-mcnealy-21466" },
  { name: "Si Woo Kim", rank: 28, avgPoints: 2.9066, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/si-woo-kim-17700" },
  { name: "Ryan Gerard", rank: 29, avgPoints: 2.8502, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/ryan-gerard-29622" },
  { name: "Jon Rahm", rank: 30, avgPoints: 2.8437, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jon-rahm-19195" },
  { name: "Tyrrell Hatton", rank: 31, avgPoints: 2.73, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/tyrrell-hatton-17108" },
  { name: "Shane Lowry", rank: 32, avgPoints: 2.6802, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/shane-lowry-15486" },
  { name: "Sam Burns", rank: 33, avgPoints: 2.6381, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/sam-burns-21749" },
  { name: "Kurt Kitayama", rank: 34, avgPoints: 2.6012, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/kurt-kitayama-21214" },
  { name: "Patrick Cantlay", rank: 35, avgPoints: 2.5836, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/patrick-cantlay-19052" },
  { name: "Nicolai Hojgaard", rank: 36, avgPoints: 2.5479, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/nicolai-hojgaard-23955" },
  { name: "Marco Penge", rank: 37, avgPoints: 2.5187, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/marco-penge-23510" },
  { name: "Daniel Berger", rank: 38, avgPoints: 2.4564, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/daniel-berger-15523" },
  { name: "Aaron Rai", rank: 39, avgPoints: 2.35, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/aaron-rai-23686" },
  { name: "Nicolas Echavarria", rank: 40, avgPoints: 2.3298, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/nicolas-echavarria-25243" },
  { name: "Jason Day", rank: 41, avgPoints: 2.2858, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jason-day-12469" },
  { name: "Jake Knapp", rank: 42, avgPoints: 2.267, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jake-knapp-23978" },
  { name: "Michael Kim", rank: 43, avgPoints: 2.2593, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/michael-kim-17166" },
  { name: "Corey Conners", rank: 44, avgPoints: 2.2478, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/corey-conners-22483" },
  { name: "Samuel Stevens", rank: 45, avgPoints: 2.1529, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/samuel-stevens-29529" },
  { name: "Kristoffer Reitan", rank: 46, avgPoints: 2.096, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/kristoffer-reitan-24257" },
  { name: "Michael Brennan", rank: 47, avgPoints: 2.067, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/michael-brennan-36091" },
  { name: "Andrew Novak", rank: 48, avgPoints: 2.0652, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/andrew-novak-23748" },
  { name: "Matt McCarty", rank: 49, avgPoints: 2.0211, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/matt-mccarty-30773" },
  { name: "Brian Harman", rank: 50, avgPoints: 2.0018, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/brian-harman-11044" },
  { name: "Ryan Fox", rank: 51, avgPoints: 1.9832, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/ryan-fox-15552" },
  { name: "Gary Woodland", rank: 52, avgPoints: 1.9808, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/gary-woodland-12534" },
  { name: "Adam Scott", rank: 53, avgPoints: 1.9728, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/adam-scott-6430" },
  { name: "Sami Valimaki", rank: 56, avgPoints: 1.9361, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/sami-valimaki-24730" },
  { name: "Rasmus Hojgaard", rank: 57, avgPoints: 1.8962, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/rasmus-hojgaard-23956" },
  { name: "Max Greyserman", rank: 59, avgPoints: 1.8295, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/max-greyserman-23784" },
  { name: "Jordan Spieth", rank: 61, avgPoints: 1.8209, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jordan-spieth-16107" },
  { name: "Harry Hall", rank: 62, avgPoints: 1.8197, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/harry-hall-24008" },
  { name: "John Keefer", rank: 64, avgPoints: 1.7811, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/john-keefer-33790" },
  { name: "Nick Taylor", rank: 67, avgPoints: 1.7228, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/nick-taylor-15760" },
  { name: "Rasmus Neergaard-Petersen", rank: 69, avgPoints: 1.6642, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/rasmus-neergaard-petersen-27961" },
  { name: "Casey Jarvis", rank: 70, avgPoints: 1.6496, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/casey-jarvis-28354" },
  { name: "Sungjae Im", rank: 71, avgPoints: 1.5939, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/sungjae-im-22078" },
  { name: "Aldrich Potgieter", rank: 77, avgPoints: 1.5448, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/aldrich-potgieter-32121" },
  { name: "Wyndham Clark", rank: 78, avgPoints: 1.5379, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/wyndham-clark-20672" },
  { name: "Haotong Li", rank: 84, avgPoints: 1.4883, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/haotong-li-19086" },
  { name: "Tom McKibbin", rank: 105, avgPoints: 1.2857, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/tom-mckibbin-27140" },
  { name: "Brian Campbell", rank: 112, avgPoints: 1.2444, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/brian-campbell-17026" },
  { name: "Davis Riley", rank: 120, avgPoints: 1.1633, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/davis-riley-23739" },
  { name: "Carlos Ortiz", rank: 161, avgPoints: 0.8966, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/carlos-ortiz-19018" },
  { name: "Max Homa", rank: 163, avgPoints: 0.8896, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/max-homa-18677" },
  { name: "Brooks Koepka", rank: 169, avgPoints: 0.8503, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/brooks-koepka-16229" },
  { name: "Cameron Smith", rank: 222, avgPoints: 0.656, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/cameron-smith-16860" },
  { name: "Zach Johnson", rank: 321, avgPoints: 0.4358, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/zach-johnson-6868" },
  { name: "Sergio Garcia", rank: 345, avgPoints: 0.4039, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/sergio-garcia-6904" },
  { name: "Naoyuki Kataoka", rank: 372, avgPoints: 0.3727, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/naoyuki-kataoka-32164" },
  { name: "Danny Willett", rank: 400, avgPoints: 0.3512, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/danny-willett-14014" },
  { name: "Charl Schwartzel", rank: 566, avgPoints: 0.2126, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/charl-schwartzel-8569" },
  { name: "Dustin Johnson", rank: 593, avgPoints: 0.1989, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/dustin-johnson-13218" },
  { name: "Bubba Watson", rank: 702, avgPoints: 0.1505, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/bubba-watson-8268" },
  { name: "Vijay Singh", rank: 1418, avgPoints: 0.0362, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/vijay-singh-1919" },
  { name: "Angel Cabrera", rank: 3092, avgPoints: 0.0021, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/angel-cabrera-2646" },
  { name: "Jose M Olazabal", rank: 3804, avgPoints: 0.0007, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jose-m-olazabal-1104" },
  { name: "Mike Weir", rank: 4935, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/mike-weir-2876" },
  { name: "Pongsapak Laopakdee (Am)", rank: null, avgPoints: null, eligible: false, owgrUrl: null },
  { name: "Fred Couples", rank: 4935, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/fred-couples-126" },
  { name: "Ethan Fang (Am)", rank: null, avgPoints: null, eligible: false, owgrUrl: null },
  { name: "Mason Howell (Am)", rank: null, avgPoints: null, eligible: false, owgrUrl: null },
  { name: "Mateo Pulcini (Am)", rank: null, avgPoints: null, eligible: false, owgrUrl: null },
  { name: "Brandon Holtz (Am)", rank: null, avgPoints: null, eligible: false, owgrUrl: null },
  { name: "Jackson Herrington (Am)", rank: null, avgPoints: null, eligible: false, owgrUrl: null }
];

const sortableGolfers = [...golfers].sort((a, b) => {
  if (a.rank === null) return 1;
  if (b.rank === null) return -1;
  return a.rank - b.rank;
});

const golferByName = new Map(sortableGolfers.map((golfer) => [golfer.name, golfer]));

function formatTimestamp(value) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function getStoredTeams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed.map((team) => {
      const players = Array.isArray(team.players)
        ? team.players
            .map((player) => {
              const latest = golferByName.get(player.name);
              if (!latest) return null;

              return {
                name: latest.name,
                rank: latest.rank,
                avgPoints: latest.avgPoints
              };
            })
            .filter(Boolean)
        : [];

      return {
        ...team,
        players,
        totalPoints: getTotalPoints(players)
      };
    });
  } catch (error) {
    return [];
  }
}

function saveStoredTeams(teams) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
}

function seedDemoTeam() {
  if (!DEMO_TEAM_ENABLED) return;
  if (supabaseClient) return;

  const existingTeams = getStoredTeams();
  const hasDemo = existingTeams.some(
    (team) => (team.teamName || "").toLowerCase() === "aces"
  );

  if (hasDemo) return;

  const demoPlayers = [
    "Harris English",
    "Akshay Bhatia",
    "Viktor Hovland",
    "Patrick Reed",
    "Bryson DeChambeau"
  ]
    .map((name) => golferByName.get(name))
    .filter(Boolean)
    .map((player) => ({
      name: player.name,
      rank: player.rank,
      avgPoints: player.avgPoints
    }));

  if (!demoPlayers.length) return;

  existingTeams.push({
    id: "demo-aces",
    teamName: "aces",
    teamOwner: "Demo",
    totalPoints: getTotalPoints(demoPlayers),
    createdAt: new Date().toISOString(),
    players: demoPlayers
  });

  saveStoredTeams(existingTeams);
}

async function fetchTeams() {
  if (!supabaseClient) {
    return getStoredTeams();
  }

  const { data, error } = await supabaseClient
    .from(SUPABASE_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load teams from Supabase:", error);
    return getStoredTeams();
  }

  return (data || []).map((team) => {
    const players = Array.isArray(team.players)
      ? team.players
          .map((player) => {
            const latest = golferByName.get(player.name);
            if (!latest) return null;

            return {
              name: latest.name,
              rank: latest.rank,
              avgPoints: latest.avgPoints
            };
          })
          .filter(Boolean)
      : [];

    return {
      id: team.id,
      teamName: team.team_name,
      teamOwner: team.team_owner,
      totalPoints:
        typeof team.total_points === "number"
          ? team.total_points
          : Number.parseFloat(team.total_points) || getTotalPoints(players),
      createdAt: team.created_at,
      players
    };
  });
}

async function createTeam(team) {
  if (!supabaseClient) {
    const teams = getStoredTeams();
    teams.push(team);
    saveStoredTeams(teams);
    return { ok: true, mode: "local" };
  }

  const { error } = await supabaseClient.from(SUPABASE_TABLE).insert({
    team_name: team.teamName,
    team_owner: team.teamOwner,
    total_points: team.totalPoints,
    created_at: team.createdAt,
    players: team.players
  });

  if (error) {
    console.error("Failed to save team to Supabase:", error);
    return { ok: false, mode: "supabase", error };
  }

  return { ok: true, mode: "supabase" };
}

function getSelectedGolfers(selectedNames) {
  return sortableGolfers.filter((golfer) => selectedNames.includes(golfer.name));
}

function getTotalPoints(players) {
  return players.reduce((sum, player) => sum + (player.avgPoints || 0), 0);
}

function formatPoints(value) {
  if (value === null || value === undefined) return "-";
  return value.toFixed(4).replace(/\.?0+$/, "");
}

function canCompleteValidRoster(selectedNames, candidate) {
  if (!candidate.eligible) {
    return false;
  }

  const currentPlayers = getSelectedGolfers(selectedNames);
  const currentTotal = getTotalPoints(currentPlayers);
  const rosterAfterAdd = currentPlayers.length + 1;
  const remainingSlots = MAX_PLAYERS - rosterAfterAdd;
  const lockedNames = new Set([...selectedNames, candidate.name]);

  const cheapestRemaining = sortableGolfers
    .filter((golfer) => golfer.eligible && !lockedNames.has(golfer.name))
    .sort((a, b) => a.avgPoints - b.avgPoints)
    .slice(0, remainingSlots);

  if (cheapestRemaining.length !== remainingSlots) {
    return false;
  }

  const projectedTotal =
    currentTotal + candidate.avgPoints + getTotalPoints(cheapestRemaining);

  return projectedTotal < POINT_CAP;
}

function createChip(content) {
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = content;
  return chip;
}

async function renderHomePage() {
  const teamsList = document.getElementById("teams-list");
  const emptyState = document.getElementById("teams-empty");
  const valueBoard = document.getElementById("value-board");

  if (!teamsList || !emptyState || !valueBoard) return;

  const teams = (await fetchTeams()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  teamsList.innerHTML = "";

  if (!teams.length) {
    emptyState.classList.remove("is-hidden");
    teamsList.classList.add("is-hidden");
  } else {
    emptyState.classList.add("is-hidden");
    teamsList.classList.remove("is-hidden");

    teams.forEach((team) => {
      const card = document.createElement("article");
      card.className = "team-card";

      const header = document.createElement("div");
      header.className = "team-card-header";

      const titleWrap = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = team.teamName;
      const meta = document.createElement("p");
      meta.className = "team-meta";
      meta.textContent = `${team.teamOwner || "Unknown owner"} · ${team.players.length} golfer${team.players.length === 1 ? "" : "s"} · Submitted ${formatTimestamp(team.createdAt)}`;
      titleWrap.append(title, meta);

      header.append(titleWrap, createChip(`${formatPoints(team.totalPoints)} avg`));

      const list = document.createElement("ul");
      list.className = "player-list";

      team.players.forEach((player) => {
        const item = document.createElement("li");
        item.className = "player-line";
        item.innerHTML = `<span>${player.name}</span>`;
        item.appendChild(createChip(`${formatPoints(player.avgPoints)} avg`));
        list.appendChild(item);
      });

      card.append(header, list);
      teamsList.appendChild(card);
    });
  }

  valueBoard.innerHTML = "";
  sortableGolfers
    .filter((golfer) => golfer.eligible)
    .sort((a, b) => a.avgPoints - b.avgPoints)
    .slice(0, 10)
    .forEach((golfer) => {
      const card = document.createElement("article");
      card.className = "value-card";

      const header = document.createElement("div");
      header.className = "team-card-header";

      const title = document.createElement("h3");
      title.textContent = golfer.name;

      const note = document.createElement("p");
      note.className = "team-meta";
      note.textContent = "Currently roster-legal";

      const titleWrap = document.createElement("div");
      titleWrap.append(title, note);

      header.append(titleWrap, createChip(`${formatPoints(golfer.avgPoints)} avg`));
      card.appendChild(header);
      valueBoard.appendChild(card);
    });
}

function renderCreatePage() {
  const optionsRoot = document.getElementById("golfer-options");
  const searchInput = document.getElementById("golfer-search");
  const teamForm = document.getElementById("team-form");
  const teamNameInput = document.getElementById("team-name");
  const teamOwnerInput = document.getElementById("team-owner");
  const selectedCount = document.getElementById("selected-count");
  const selectedPoints = document.getElementById("selected-points");
  const selectedPlayersRoot = document.getElementById("selected-players");
  const formMessage = document.getElementById("form-message");

  if (
    !optionsRoot ||
    !searchInput ||
    !teamForm ||
    !teamNameInput ||
    !teamOwnerInput ||
    !selectedCount ||
    !selectedPoints ||
    !selectedPlayersRoot ||
    !formMessage
  ) {
    return;
  }

  const selectedNames = new Set();

  if (!REGISTRATION_OPEN) {
    teamForm
      .querySelectorAll("input, button")
      .forEach((element) => {
        if (element.id !== "golfer-search") {
          element.disabled = true;
        }
      });
    setMessage("Registration is closed.", "error");
  }

  function setMessage(message, type = "") {
    formMessage.textContent = message;
    formMessage.className = `form-message${type ? ` ${type}` : ""}`;
  }

  function updateSummary() {
    const selectedPlayers = getSelectedGolfers([...selectedNames]);
    const totalPoints = getTotalPoints(selectedPlayers);
    const isInvalid = selectedPlayers.length > MAX_PLAYERS || totalPoints >= POINT_CAP;

    selectedCount.textContent = `${selectedPlayers.length} / ${MAX_PLAYERS} max`;
    selectedPoints.textContent = `${formatPoints(totalPoints)} / <25`;

    selectedPlayersRoot.innerHTML = "";

    if (!selectedPlayers.length) {
      const empty = document.createElement("div");
      empty.className = "selected-card";
      empty.innerHTML = `<p class="muted">No golfers selected yet.</p>`;
      selectedPlayersRoot.appendChild(empty);
    } else {
      selectedPlayers.forEach((player) => {
        const card = document.createElement("article");
        card.className = `selected-card${isInvalid ? " invalid" : ""}`;

        const line = document.createElement("div");
        line.className = "team-card-header";

        const title = document.createElement("h3");
        title.textContent = player.name;

        line.append(title, createChip(`${formatPoints(player.avgPoints)} avg`));
        card.appendChild(line);
        selectedPlayersRoot.appendChild(card);
      });
    }

    document
      .querySelectorAll(".metric-card")
      .forEach((card) => card.classList.toggle("invalid", isInvalid));
  }

  function renderOptions() {
    const query = searchInput.value.trim().toLowerCase();
    optionsRoot.innerHTML = "";

    const filtered = sortableGolfers.filter((golfer) => golfer.name.toLowerCase().includes(query));

    filtered.forEach((golfer) => {
      const option = document.createElement("div");
      const checked = selectedNames.has(golfer.name);
      const maxPlayersReached = selectedNames.size >= MAX_PLAYERS && !checked;
      const cannotFitCap = golfer.eligible && !checked && !canCompleteValidRoster([...selectedNames], golfer);
      const disabled = !golfer.eligible || maxPlayersReached || cannotFitCap;

      option.className = [
        "golfer-option",
        checked ? "selected" : "",
        !golfer.eligible ? "ineligible" : "",
        disabled && !checked ? "disabled" : ""
      ]
        .filter(Boolean)
        .join(" ");

      const rankLabel =
        golfer.avgPoints === null
          ? "No current average"
          : `${formatPoints(golfer.avgPoints)} avg`;
      let note = golfer.eligible
        ? golfer.avgPoints === 0
          ? `OWGR #${golfer.rank} · counts as 0`
          : `OWGR #${golfer.rank}`
        : "Amateurs are not eligible";
      if (maxPlayersReached) note = "You already have the maximum 5 golfers selected";
      if (cannotFitCap) note = "Adding this golfer would break the 25-point cap";

      const label = document.createElement("label");

      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "golfers";
      input.value = golfer.name;
      input.checked = checked;
      input.disabled = disabled && !checked;

      const details = document.createElement("div");
      details.className = "golfer-details";

      const nameEl = document.createElement("strong");
      nameEl.className = "golfer-name";
      nameEl.textContent = golfer.name;

      const meta = document.createElement("div");
      meta.className = "golfer-meta";

      const noteEl = document.createElement("span");
      noteEl.className = "golfer-note";
      noteEl.textContent = note;

      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = rankLabel;

      meta.append(noteEl, chip);
      details.append(nameEl, meta);

      if (golfer.owgrUrl) {
        const link = document.createElement("a");
        link.className = "golfer-link";
        link.href = golfer.owgrUrl;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = "View OWGR profile";
        details.appendChild(link);
      }

      label.append(input, details);
      option.appendChild(label);

      input?.addEventListener("change", () => {
        if (input.checked) {
          selectedNames.add(golfer.name);
        } else {
          selectedNames.delete(golfer.name);
        }

        setMessage("");
        renderOptions();
        updateSummary();
      });

      optionsRoot.appendChild(option);
    });

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "selected-card";
      empty.innerHTML = `<p class="muted">No golfers match that search.</p>`;
      optionsRoot.appendChild(empty);
    }
  }

  searchInput.addEventListener("input", renderOptions);

  teamForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!REGISTRATION_OPEN) {
      setMessage("Registration is closed.", "error");
      return;
    }

    const teamName = teamNameInput.value.trim();
    const teamOwner = teamOwnerInput.value.trim();
    const selectedPlayers = getSelectedGolfers([...selectedNames]);
    const totalPoints = getTotalPoints(selectedPlayers);

    if (!teamName) {
      setMessage("Enter a team name before submitting.", "error");
      return;
    }

    if (!teamOwner) {
      setMessage("Enter a team owner before submitting.", "error");
      return;
    }

    if (selectedPlayers.length < 1) {
      setMessage("Pick at least 1 golfer.", "error");
      return;
    }

    if (totalPoints >= POINT_CAP) {
      setMessage("Your roster must stay under 25 OWGR average points.", "error");
      return;
    }

    const newTeam = {
      id: crypto.randomUUID(),
      teamName,
      teamOwner,
      totalPoints,
      createdAt: new Date().toISOString(),
      players: selectedPlayers.map((player) => ({
        name: player.name,
        rank: player.rank,
        avgPoints: player.avgPoints
      }))
    };

    const result = await createTeam(newTeam);
    if (!result.ok) {
      setMessage("Could not save the team right now. Please try again.", "error");
      return;
    }

    teamForm.reset();
    selectedNames.clear();
    setMessage(
      result.mode === "supabase"
        ? "Team submitted and synced."
        : "Team submitted locally. Add Supabase config to sync across devices.",
      "success"
    );
    renderOptions();
    updateSummary();
    window.location.href = "./index.html";
  });

  renderOptions();
  updateSummary();
}

if (document.body.dataset.page === "home") {
  seedDemoTeam();
  renderHomePage();
}

if (document.body.dataset.page === "create") {
  seedDemoTeam();
  renderCreatePage();
}
