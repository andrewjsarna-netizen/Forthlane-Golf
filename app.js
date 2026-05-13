const STORAGE_KEY = "pga-championship-pool-teams-v1";
const MAX_PLAYERS = 5;
const POINT_CAP = 25;
const REGISTRATION_OPEN = true;
const DEMO_TEAM_ENABLED = true;
const SUPABASE_TABLE = "pga_championship_teams_2026";
const supabaseConfig = window.SUPABASE_CONFIG || { url: "", anonKey: "" };
const supabaseClient =
  window.supabase &&
  supabaseConfig.url &&
  supabaseConfig.anonKey
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
    : null;

const golfers = [
  { name: "Ludvig Aberg", rank: 15, avgPoints: 3.9606, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/ludvig-aberg-23950" },
  { name: "Angel Ayora", rank: 107, avgPoints: 1.1934, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/angel-ayora-30445" },
  { name: "Derek Berg", rank: null, avgPoints: 0, eligible: true, owgrUrl: null },
  { name: "Daniel Berger", rank: 42, avgPoints: 2.3437, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/daniel-berger-17606" },
  { name: "Christiaan Bezuidenhout", rank: 92, avgPoints: 1.3645, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/christiaan-bezuidenhout-18103" },
  { name: "Akshay Bhatia", rank: 23, avgPoints: 3.3718, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/akshay-bhatia-26096" },
  { name: "Francisco Bide", rank: 4976, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/francisco-bide-16776" },
  { name: "Chandler Blanchet", rank: 112, avgPoints: 1.1723, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/chandler-blanchet-24956" },
  { name: "Michael Block", rank: 4976, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/michael-block-12333" },
  { name: "Keegan Bradley", rank: 32, avgPoints: 2.8886, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/keegan-bradley-13872" },
  { name: "Michael Brennan", rank: 52, avgPoints: 2.0005, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/michael-brennan-29197" },
  { name: "Jacob Bridgeman", rank: 19, avgPoints: 3.5743, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jacob-bridgeman-29433" },
  { name: "Daniel Brown", rank: null, avgPoints: 0, eligible: true, owgrUrl: null },
  { name: "Sam Burns", rank: 35, avgPoints: 2.8188, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/sam-burns-19483" },
  { name: "Brian Campbell", rank: 104, avgPoints: 1.215, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/brian-campbell-18628" },
  { name: "Brandt Snedeker", rank: 131, avgPoints: 1.0887, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/brandt-snedeker-8820" },
  { name: "Patrick Cantlay", rank: 30, avgPoints: 2.9377, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/patrick-cantlay-15466" },
  { name: "Ricky Castillo", rank: 90, avgPoints: 1.3913, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/ricky-castillo-27819" },
  { name: "Bud Cauley", rank: 66, avgPoints: 1.6859, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/bud-cauley-14502" },
  { name: "Stewart Cink", rank: 1555, avgPoints: 0.0288, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/stewart-cink-5665" },
  { name: "Wyndham Clark", rank: 71, avgPoints: 1.6278, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/wyndham-clark-23604" },
  { name: "Tyler Collet", rank: 1931, avgPoints: 0.0145, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/tyler-collet-28077" },
  { name: "Corey Conners", rank: 50, avgPoints: 2.1072, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/corey-conners-17576" },
  { name: "Pierceson Coody", rank: 55, avgPoints: 1.958, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/pierceson-coody-28309" },
  { name: "Jason Day", rank: 41, avgPoints: 2.4035, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jason-day-9771" },
  { name: "Bryson DeChambeau", rank: 28, avgPoints: 3.0519, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/bryson-dechambeau-19841" },
  { name: "Thomas Detry", rank: 61, avgPoints: 1.7931, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/thomas-detry-14181" },
  { name: "Luke Donald", rank: 1300, avgPoints: 0.044, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/luke-donald-4163" },
  { name: "Jesse Droemer", rank: 4976, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jesse-droemer-24584" },
  { name: "Jason Dufner", rank: 1373, avgPoints: 0.0391, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jason-dufner-7301" },
  { name: "Nicolas Echavarria", rank: 48, avgPoints: 2.1999, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/nicolas-echavarria-22833" },
  { name: "Harris English", rank: 21, avgPoints: 3.4897, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/harris-english-14577" },
  { name: "Bryce Fisher", rank: null, avgPoints: 0, eligible: true, owgrUrl: null },
  { name: "Steven Fisk", rank: 134, avgPoints: 1.0699, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/steven-fisk-26657" },
  { name: "Alex Fitzpatrick", rank: 83, avgPoints: 1.4247, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/alex-fitzpatrick-25362" },
  { name: "Matt Fitzpatrick", rank: 4, avgPoints: 6.1758, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/matt-fitzpatrick-17646" },
  { name: "Tommy Fleetwood", rank: 6, avgPoints: 5.0877, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/tommy-fleetwood-12294" },
  { name: "Rickie Fowler", rank: 37, avgPoints: 2.6571, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/rickie-fowler-12965" },
  { name: "Ryan Fox", rank: 56, avgPoints: 1.9219, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/ryan-fox-11889" },
  { name: "Chris Gabriele", rank: null, avgPoints: 0, eligible: true, owgrUrl: null },
  { name: "Mark Geddes", rank: 4976, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/mark-geddes-21886" },
  { name: "Ryan Gerard", rank: 36, avgPoints: 2.8001, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/ryan-gerard-29767" },
  { name: "Lucas Glover", rank: 93, avgPoints: 1.3603, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/lucas-glover-7399" },
  { name: "Chris Gotterup", rank: 10, avgPoints: 4.64, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/chris-gotterup-27774" },
  { name: "Max Greyserman", rank: 70, avgPoints: 1.659, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/max-greyserman-23465" },
  { name: "Ben Griffin", rank: 14, avgPoints: 4.0681, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/ben-griffin-24968" },
  { name: "Emiliano Grillo", rank: 115, avgPoints: 1.1691, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/emiliano-grillo-12808" },
  { name: "Jordan Gumberg", rank: 315, avgPoints: 0.4513, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jordan-gumberg-23892" },
  { name: "Harry Hall", rank: 57, avgPoints: 1.8602, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/harry-hall-27194" },
  { name: "Brian Harman", rank: 53, avgPoints: 1.9637, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/brian-harman-8825" },
  { name: "Padraig Harrington", rank: 894, avgPoints: 0.0956, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/padraig-harrington-5716" },
  { name: "Tyrrell Hatton", rank: 26, avgPoints: 3.2706, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/tyrrell-hatton-14796" },
  { name: "Zach Haynes", rank: null, avgPoints: 0, eligible: true, owgrUrl: null },
  { name: "Russell Henley", rank: 9, avgPoints: 4.8566, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/russell-henley-14578" },
  { name: "Kazuki Higa", rank: 152, avgPoints: 0.9478, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/kazuki-higa-15756" },
  { name: "Garrick Higgo", rank: 85, avgPoints: 1.4158, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/garrick-higgo-24342" },
  { name: "Joe Highsmith", rank: 151, avgPoints: 0.9585, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/joe-highsmith-28469" },
  { name: "Daniel Hillier", rank: 96, avgPoints: 1.3136, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/daniel-hillier-21362" },
  { name: "Ryo Hisatsune", rank: 59, avgPoints: 1.827, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/ryo-hisatsune-22760" },
  { name: "Rico Hoey", rank: null, avgPoints: 0, eligible: true, owgrUrl: null },
  { name: "Nicolai Hojgaard", rank: 29, avgPoints: 3.0511, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/nicolai-hojgaard-23602" },
  { name: "Rasmus Hojgaard", rank: 64, avgPoints: 1.7188, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/rasmus-hojgaard-23838" },
  { name: "Ian Holt", rank: 113, avgPoints: 1.172, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/ian-holt-25036" },
  { name: "Max Homa", rank: 123, avgPoints: 1.1338, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/max-homa-17538" },
  { name: "Billy Horschel", rank: 117, avgPoints: 1.1656, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/billy-horschel-11276" },
  { name: "Viktor Hovland", rank: 27, avgPoints: 3.1244, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/viktor-hovland-18841" },
  { name: "Austin Hurt", rank: null, avgPoints: 0, eligible: true, owgrUrl: null },
  { name: "Sungjae Im", rank: 67, avgPoints: 1.6742, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/sungjae-im-17488" },
  { name: "Stephan Jaeger", rank: 100, avgPoints: 1.2574, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/stephan-jaeger-16394" },
  { name: "Casey Jarvis", rank: 72, avgPoints: 1.619, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/casey-jarvis-26947" },
  { name: "Dustin Johnson", rank: 471, avgPoints: 0.2811, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/dustin-johnson-12422" },
  { name: "Jared Jones", rank: 4976, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jared-jones-29501" },
  { name: "Kota Kaneko", rank: 192, avgPoints: 0.7576, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/kota-kaneko-28268" },
  { name: "Michael Kartrude", rank: 4976, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/michael-kartrude-23469" },
  { name: "Martin Kaymer", rank: 1160, avgPoints: 0.0584, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/martin-kaymer-8117" },
  { name: "John Keefer", rank: 74, avgPoints: 1.5879, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/john-keefer-32457" },
  { name: "Ben Kern", rank: null, avgPoints: 0, eligible: true, owgrUrl: null },
  { name: "Michael Kim", rank: 45, avgPoints: 2.2257, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/michael-kim-17543" },
  { name: "Si Woo Kim", rank: 22, avgPoints: 3.469, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/si-woo-kim-14609" },
  { name: "Chris Kirk", rank: 98, avgPoints: 1.2956, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/chris-kirk-12423" },
  { name: "Kurt Kitayama", rank: 34, avgPoints: 2.8302, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/kurt-kitayama-21891" },
  { name: "Jake Knapp", rank: 39, avgPoints: 2.5677, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jake-knapp-19396" },
  { name: "Brooks Koepka", rank: 125, avgPoints: 1.1307, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/brooks-koepka-16243" },
  { name: "Min Woo Lee", rank: 31, avgPoints: 2.9132, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/min-woo-lee-16841" },
  { name: "Ryan Lenahan", rank: 4976, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/ryan-lenahan-18711" },
  { name: "Haotong Li", rank: 80, avgPoints: 1.4429, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/haotong-li-15310" },
  { name: "Mikael Lindberg", rank: 137, avgPoints: 1.0464, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/mikael-lindberg-20084" },
  { name: "David Lipsky", rank: 91, avgPoints: 1.3701, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/david-lipsky-15980" },
  { name: "Shane Lowry", rank: 38, avgPoints: 2.5814, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/shane-lowry-13900" },
  { name: "Robert MacIntyre", rank: 12, avgPoints: 4.3581, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/robert-macintyre-23323" },
  { name: "Hideki Matsuyama", rank: 17, avgPoints: 3.6676, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/hideki-matsuyama-13562" },
  { name: "Denny McCarthy", rank: 99, avgPoints: 1.2902, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/denny-mccarthy-19870" },
  { name: "Matt McCarty", rank: 43, avgPoints: 2.2896, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/matt-mccarty-28635" },
  { name: "Paul McClure", rank: null, avgPoints: 0, eligible: true, owgrUrl: null },
  { name: "Max McGreevy", rank: 80, avgPoints: 1.4429, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/max-mcgreevy-23505" },
  { name: "Rory McIlroy", rank: 2, avgPoints: 9.7436, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/rory-mcilroy-10091" },
  { name: "Tom McKibbin", rank: 108, avgPoints: 1.1908, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/tom-mckibbin-22322" },
  { name: "Maverick McNealy", rank: 33, avgPoints: 2.8557, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/maverick-mcnealy-18634" },
  { name: "Shaun Micheel", rank: 4976, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/shaun-micheel-4377" },
  { name: "Keith Mitchell", rank: 109, avgPoints: 1.186, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/keith-mitchell-17365" },
  { name: "Collin Morikawa", rank: 5, avgPoints: 5.088, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/collin-morikawa-22085" },
  { name: "William Mouw", rank: 132, avgPoints: 1.0747, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/william-mouw-29770" },
  { name: "Rasmus Neergaard-Petersen", rank: 77, avgPoints: 1.5258, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/rasmus-neergaard-petersen-23841" },
  { name: "Joaquin Niemann", rank: 167, avgPoints: 0.8537, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/joaquin-niemann-18079" },
  { name: "Alex Noren", rank: 18, avgPoints: 3.5834, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/alex-noren-10419" },
  { name: "Andrew Novak", rank: 54, avgPoints: 1.9635, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/andrew-novak-23475" },
  { name: "John Parry", rank: 87, avgPoints: 1.4121, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/john-parry-13764" },
  { name: "Taylor Pendrith", rank: 86, avgPoints: 1.4124, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/taylor-pendrith-17780" },
  { name: "Marco Penge", rank: 40, avgPoints: 2.4068, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/marco-penge-22465" },
  { name: "Ben Polland", rank: null, avgPoints: 0, eligible: true, owgrUrl: null },
  { name: "J.T. Poston", rank: 79, avgPoints: 1.4461, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/j-t-poston-21554" },
  { name: "Aldrich Potgieter", rank: 75, avgPoints: 1.5585, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/aldrich-potgieter-27900" },
  { name: "David Puig", rank: 62, avgPoints: 1.7786, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/david-puig-28984" },
  { name: "Andrew Putnam", rank: 82, avgPoints: 1.4268, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/andrew-putnam-14704" },
  { name: "Jon Rahm", rank: 20, avgPoints: 3.5518, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jon-rahm-19195" },
  { name: "Aaron Rai", rank: 44, avgPoints: 2.2529, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/aaron-rai-18554" },
  { name: "Patrick Reed", rank: 24, avgPoints: 3.3578, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/patrick-reed-14838" },
  { name: "Kristoffer Reitan", rank: 25, avgPoints: 3.3483, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/kristoffer-reitan-21407" },
  { name: "Davis Riley", rank: 141, avgPoints: 1.0296, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/davis-riley-19872" },
  { name: "Patrick Rodgers", rank: 73, avgPoints: 1.5984, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/patrick-rodgers-16283" },
  { name: "Justin Rose", rank: 7, avgPoints: 5.0327, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/justin-rose-6093" },
  { name: "Adrien Saddier", rank: 101, avgPoints: 1.2481, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/adrien-saddier-14792" },
  { name: "Garrett Sapp", rank: 4976, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/garrett-sapp-13196" },
  { name: "Jayden Schaper", rank: 65, avgPoints: 1.7155, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jayden-schaper-26991" },
  { name: "Xander Schauffele", rank: 11, avgPoints: 4.6047, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/xander-schauffele-19895" },
  { name: "Scottie Scheffler", rank: 1, avgPoints: 16.4551, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/scottie-scheffler-18417" },
  { name: "Adam Schenk", rank: 155, avgPoints: 0.9371, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/adam-schenk-19477" },
  { name: "Matti Schmid", rank: 97, avgPoints: 1.2997, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/matti-schmid-20722" },
  { name: "Adam Scott", rank: 46, avgPoints: 2.2163, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/adam-scott-6430" },
  { name: "Braden Shattuck", rank: 4369, avgPoints: 0.0003, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/braden-shattuck-31027" },
  { name: "Alex Smalley", rank: 78, avgPoints: 1.4485, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/alex-smalley-18474" },
  { name: "Cameron Smith", rank: 239, avgPoints: 0.5983, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/cameron-smith-15856" },
  { name: "Jordan Smith", rank: 68, avgPoints: 1.6679, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jordan-smith-18586" },
  { name: "Austin Smotherman", rank: 84, avgPoints: 1.424, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/austin-smotherman-22985" },
  { name: "Elvis Smylie", rank: 94, avgPoints: 1.3288, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/elvis-smylie-24200" },
  { name: "Travis Smyth", rank: 145, avgPoints: 1.0014, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/travis-smyth-19232" },
  { name: "J.J. Spaun", rank: 8, avgPoints: 4.916, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/j-j-spaun-17536" },
  { name: "Jordan Spieth", rank: 51, avgPoints: 2.0708, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jordan-spieth-14636" },
  { name: "Samuel Stevens", rank: 49, avgPoints: 2.1633, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/samuel-stevens-25569" },
  { name: "Sepp Straka", rank: 13, avgPoints: 4.1283, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/sepp-straka-17511" },
  { name: "Sudarshan Yellamaraju", rank: 105, avgPoints: 1.2122, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/sudarshan-yellamaraju-29925" },
  { name: "Andy Sullivan", rank: 106, avgPoints: 1.2115, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/andy-sullivan-15326" },
  { name: "Nick Taylor", rank: 58, avgPoints: 1.8415, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/nick-taylor-13126" },
  { name: "Sahith Theegala", rank: 76, avgPoints: 1.5274, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/sahith-theegala-23014" },
  { name: "Justin Thomas", rank: 16, avgPoints: 3.7291, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/justin-thomas-14139" },
  { name: "Michael Thorbjornsen", rank: 63, avgPoints: 1.7331, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/michael-thorbjornsen-26649" },
  { name: "Sami Valimaki", rank: 60, avgPoints: 1.8192, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/sami-valimaki-23816" },
  { name: "Jhonattan Vegas", rank: 126, avgPoints: 1.1256, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jhonattan-vegas-13508" },
  { name: "Ryan Vermeer", rank: null, avgPoints: 0, eligible: true, owgrUrl: null },
  { name: "Jimmy Walker", rank: 1415, avgPoints: 0.0369, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/jimmy-walker-7293" },
  { name: "Matt Wallace", rank: 69, avgPoints: 1.6653, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/matt-wallace-20706" },
  { name: "Bernd Wiesberger", rank: 203, avgPoints: 0.7032, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/bernd-wiesberger-9531" },
  { name: "Timothy Wiseman", rank: 4976, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/timothy-wiseman-25085" },
  { name: "Gary Woodland", rank: 47, avgPoints: 2.2027, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/gary-woodland-12577" },
  { name: "Y.E. Yang", rank: 4976, avgPoints: 0, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/y-e-yang-6629" },
  { name: "Cameron Young", rank: 3, avgPoints: 7.1415, eligible: true, owgrUrl: "https://www.owgr.com/playerprofile/cameron-young-26651" }
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
          ? golfer.rank === null
            ? "No current OWGR average · counts as 0"
            : `OWGR #${golfer.rank} · counts as 0`
          : golfer.rank === null
            ? "Current OWGR average loaded"
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
