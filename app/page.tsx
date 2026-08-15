"use client";

import { useEffect, useState } from "react";

type Tile = "empty" | "house" | "tree" | "solar" | "park" | "road";
type EventType = "heat" | "drought" | "monsoon" | "dust";

type Villager = {
  name: string;
  emoji: string;
  job: string;
  dialogue: string;
};

const BUILDINGS: Record<
  Exclude<Tile, "empty">,
  { emoji: string; name: string; cost: number }
> = {
  house: {
    emoji: "🏠",
    name: "House",
    cost: 5000,
  },
  tree: {
    emoji: "🌵",
    name: "Native Plants",
    cost: 500,
  },
  solar: {
    emoji: "☀️",
    name: "Solar Panel",
    cost: 4000,
  },
  park: {
    emoji: "🌳",
    name: "Desert Park",
    cost: 3000,
  },
  road: {
    emoji: "🛣️",
    name: "Road",
    cost: 1000,
  },
};

const VILLAGERS: Villager[] = [
  {
    name: "Maya",
    emoji: "👩🏽‍🌾",
    job: "Native Plant Gardener",
    dialogue:
      "Arizona doesn't have to mean a dead landscape. Native plants can survive with much less water while providing shade and habitat.",
  },
  {
    name: "Leo",
    emoji: "👨🏻‍🔧",
    job: "Solar Technician",
    dialogue:
      "We've got an incredible amount of sunlight. If we design the neighborhood around it, solar can help reduce our dependence on the grid.",
  },
  {
    name: "Sofia",
    emoji: "👩🏻‍🎨",
    job: "Community Artist",
    dialogue:
      "A neighborhood isn't just buildings. Parks, shade, and places where people actually want to spend time make a huge difference.",
  },
  {
    name: "Jay",
    emoji: "👨🏽‍🔬",
    job: "Water Scientist",
    dialogue:
      "Water is one of Arizona's biggest challenges. Every decision we make about landscaping and development affects our future supply.",
  },
];

const EVENTS: Record<
  EventType,
  {
    title: string;
    icon: string;
    description: string;
  }
> = {
  heat: {
    title: "EXTREME HEAT",
    icon: "🔥",
    description:
      "A major heat wave is moving through Desert Valley. Your residents need protection.",
  },
  drought: {
    title: "WATER SHORTAGE",
    icon: "💧",
    description:
      "Water supplies are falling. Your neighborhood needs to become more water-efficient.",
  },
  monsoon: {
    title: "MONSOON STORM",
    icon: "🌧️",
    description:
      "A powerful monsoon is approaching. Poor planning could leave parts of the neighborhood flooded.",
  },
  dust: {
    title: "DUST STORM",
    icon: "💨",
    description:
      "Strong desert winds are carrying dust through the neighborhood.",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/* =========================================================
   SOUND EFFECTS
   ========================================================= */

type SoundType =
  | "click"
  | "build"
  | "day"
  | "event"
  | "success";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    if (!audioContext) {
      const AudioContextConstructor =
        window.AudioContext ||
        (
          window as Window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextConstructor) return null;

      audioContext = new AudioContextConstructor();
    }

    return audioContext;
  } catch {
    return null;
  }
}

function playSound(type: SoundType) {
  const ctx = getAudioContext();

  if (!ctx) return;

  try {
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case "click":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(420, now);
        oscillator.frequency.exponentialRampToValueAtTime(
          650,
          now + 0.08
        );
        break;

      case "build":
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(260, now);
        oscillator.frequency.exponentialRampToValueAtTime(
          700,
          now + 0.2
        );
        break;

      case "day":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(330, now);
        oscillator.frequency.setValueAtTime(500, now + 0.1);
        oscillator.frequency.setValueAtTime(660, now + 0.2);
        break;

      case "event":
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(220, now);
        oscillator.frequency.exponentialRampToValueAtTime(
          75,
          now + 0.5
        );
        break;

      case "success":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(420, now);
        oscillator.frequency.setValueAtTime(620, now + 0.12);
        oscillator.frequency.setValueAtTime(820, now + 0.24);
        break;
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.1, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.35
    );

    oscillator.start(now);
    oscillator.stop(now + 0.4);
  } catch {
    // Audio is optional.
  }
}

/* =========================================================
   HEAT MAP
   ========================================================= */

function getTileHeat(
  tile: Tile,
  temperature: number
) {
  let heat = temperature;

  if (tile === "house") heat += 7;
  if (tile === "road") heat += 9;
  if (tile === "solar") heat += 2;

  if (tile === "tree") heat -= 8;
  if (tile === "park") heat -= 12;

  return clamp(heat, 70, 125);
}

function getHeatClasses(heat: number) {
  if (heat >= 118) {
    return "border-red-950 bg-red-500";
  }

  if (heat >= 113) {
    return "border-red-900 bg-orange-500";
  }

  if (heat >= 108) {
    return "border-orange-800 bg-orange-400";
  }

  if (heat >= 103) {
    return "border-amber-800 bg-amber-300";
  }

  if (heat >= 98) {
    return "border-yellow-700 bg-yellow-200";
  }

  if (heat >= 92) {
    return "border-lime-700 bg-lime-300";
  }

  return "border-emerald-800 bg-emerald-300";
}

/* =========================================================
   MAIN GAME
   ========================================================= */

export default function Home() {
  const [started, setStarted] = useState(false);

  const [day, setDay] = useState(1);
  const [budget, setBudget] = useState(100000);
  const [temperature, setTemperature] = useState(110);
  const [water, setWater] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [happiness, setHappiness] = useState(70);

  const [selectedTool, setSelectedTool] =
    useState<Tile>("house");

  const [tiles, setTiles] = useState<Tile[]>(
    Array(64).fill("empty") as Tile[]
  );

  const [event, setEvent] =
    useState<EventType | null>(null);

  const [eventVisible, setEventVisible] =
    useState(false);

  const [message, setMessage] = useState(
    "Welcome to Desert Valley. Your decisions shape Arizona's future."
  );

  const [selectedVillager, setSelectedVillager] =
    useState<Villager | null>(null);

  const [showStats, setShowStats] = useState(false);

  /* =======================================================
     CITY STATS
     ======================================================= */

  const houses = tiles.filter(
    (tile) => tile === "house"
  ).length;

  const trees = tiles.filter(
    (tile) => tile === "tree"
  ).length;

  const parks = tiles.filter(
    (tile) => tile === "park"
  ).length;

  const solar = tiles.filter(
    (tile) => tile === "solar"
  ).length;

  const roads = tiles.filter(
    (tile) => tile === "road"
  ).length;

  const population = houses * 2;

  /* =======================================================
     DAILY FINANCES
     ======================================================= */

  const houseIncome = houses * 300;
  const residentIncome = population * 50;
  const plantIncome = trees * 50;
  const parkIncome = parks * 100;
  const solarIncome = solar * 150;

  const dailyIncome =
    houseIncome +
    residentIncome +
    plantIncome +
    parkIncome +
    solarIncome;

  const roadMaintenance = roads * 50;

  const heatCost =
    temperature >= 115 ? 300 : 0;

  const waterCost =
    water <= 30 ? 400 : 0;

  const energyCost =
    energy <= 30 ? 300 : 0;

  const dailyExpenses =
    roadMaintenance +
    heatCost +
    waterCost +
    energyCost;

  const dailyNet =
    dailyIncome - dailyExpenses;

  /* =======================================================
     FULL SCREEN EVENT ANIMATION
     ======================================================= */

  useEffect(() => {
    if (!event) {
      setEventVisible(false);
      return;
    }

    playSound("event");

    setEventVisible(false);

    const timer = window.setTimeout(() => {
      setEventVisible(true);
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [event]);

  /* =======================================================
     START
     ======================================================= */

  function startGame() {
    playSound("success");
    setStarted(true);
  }

  /* =======================================================
     BUILD
     ======================================================= */

  function build(index: number) {
    if (event) {
      setMessage(
        "⚠️ Resolve the current event first."
      );
      playSound("click");
      return;
    }

    const building =
      BUILDINGS[
        selectedTool as Exclude<Tile, "empty">
      ];

    if (!building) return;

    if (tiles[index] === selectedTool) {
      setMessage(
        `That tile already contains a ${building.name}.`
      );
      playSound("click");
      return;
    }

    const oldTile = tiles[index];

    let refund = 0;

    if (oldTile !== "empty") {
      refund = Math.floor(
        BUILDINGS[oldTile].cost * 0.5
      );
    }

    const finalCost =
      building.cost - refund;

    if (budget < finalCost) {
      setMessage(
        "💰 You don't have enough money for that."
      );
      playSound("click");
      return;
    }

    const newTiles = [...tiles];

    newTiles[index] = selectedTool;

    setTiles(newTiles);

    setBudget(
      (value) => value - finalCost
    );

    playSound("build");

    if (selectedTool === "house") {
      setWater((value) =>
        clamp(value - 3, 0, 100)
      );

      setEnergy((value) =>
        clamp(value - 4, 0, 100)
      );

      setHappiness((value) =>
        clamp(value + 3, 0, 100)
      );
    }

    if (selectedTool === "tree") {
      setTemperature((value) =>
        clamp(value - 2, 70, 125)
      );

      setHappiness((value) =>
        clamp(value + 2, 0, 100)
      );
    }

    if (selectedTool === "park") {
      setTemperature((value) =>
        clamp(value - 3, 70, 125)
      );

      setHappiness((value) =>
        clamp(value + 5, 0, 100)
      );
    }

    if (selectedTool === "solar") {
      setEnergy((value) =>
        clamp(value + 7, 0, 100)
      );
    }

    if (oldTile !== "empty") {
      setMessage(
        `🔄 ${building.name} replaced the old building. $${refund.toLocaleString()} refunded.`
      );
    } else {
      setMessage(
        `✨ ${building.name} added to Desert Valley.`
      );
    }
  }

  /* =======================================================
     NEXT DAY
     ======================================================= */

  function nextDay() {
    if (event) {
      setMessage(
        "⚠️ Resolve the current event first."
      );
      playSound("click");
      return;
    }

    const nextDayNumber = day + 1;

    setDay(nextDayNumber);

    setBudget((value) =>
      Math.max(0, value + dailyNet)
    );

    setWater((value) =>
      clamp(value - houses, 0, 100)
    );

    setEnergy((value) =>
      clamp(
        value - houses + solar,
        0,
        100
      )
    );

    playSound("day");

    /*
     * Climate challenge every 3 days.
     */

    if (nextDayNumber % 3 === 0) {
      const eventTypes: EventType[] = [
        "heat",
        "drought",
        "monsoon",
        "dust",
      ];

      const randomEvent =
        eventTypes[
          Math.floor(
            Math.random() *
              eventTypes.length
          )
        ];

      setEvent(randomEvent);

      setMessage(
        `Day ${nextDayNumber}: A major Arizona climate event is developing.`
      );

      return;
    }

    if (dailyNet >= 0) {
      setMessage(
        `🌅 Day ${nextDayNumber}. Your city earned $${dailyNet.toLocaleString()} today.`
      );
    } else {
      setMessage(
        `🌅 Day ${nextDayNumber}. Your city lost $${Math.abs(
          dailyNet
        ).toLocaleString()} today.`
      );
    }
  }

  /* =======================================================
     EVENT CHOICES
     ======================================================= */

  function handleEvent(choice: string) {
    if (!event) return;

    if (choice === "ignore") {
      setHappiness((value) =>
        clamp(value - 10, 0, 100)
      );

      setEnergy((value) =>
        clamp(value - 10, 0, 100)
      );

      if (event === "heat") {
        setTemperature((value) =>
          clamp(value + 5, 70, 125)
        );
      }

      if (event === "drought") {
        setWater((value) =>
          clamp(value - 20, 0, 100)
        );
      }

      if (event === "monsoon") {
        setBudget((value) =>
          Math.max(0, value - 3000)
        );
      }

      setMessage(
        "⚠️ You ignored the warning. The neighborhood suffered."
      );

      playSound("click");

      setEvent(null);

      return;
    }

    if (choice === "trees") {
      if (budget < 1000) {
        setMessage(
          "💰 You need $1,000 for this response."
        );

        playSound("click");
        return;
      }

      setBudget((value) =>
        value - 1000
      );

      setTemperature((value) =>
        clamp(value - 3, 70, 125)
      );

      setHappiness((value) =>
        clamp(value + 5, 0, 100)
      );

      setWater((value) =>
        clamp(value + 2, 0, 100)
      );

      setMessage(
        "🌵 Native landscaping reduced the impact of the climate event."
      );
    }

    if (choice === "solar") {
      if (budget < 4000) {
        setMessage(
          "💰 You need $4,000 for solar upgrades."
        );

        playSound("click");
        return;
      }

      setBudget((value) =>
        value - 4000
      );

      setEnergy((value) =>
        clamp(value + 15, 0, 100)
      );

      setTemperature((value) =>
        clamp(value - 2, 70, 125)
      );

      setMessage(
        "☀️ Solar infrastructure strengthened the neighborhood's resilience."
      );
    }

    if (choice === "water") {
      setWater((value) =>
        clamp(value + 20, 0, 100)
      );

      setHappiness((value) =>
        clamp(value - 2, 0, 100)
      );

      setMessage(
        "💧 Water conservation measures reduced demand."
      );
    }

    if (choice === "drainage") {
      if (budget < 3000) {
        setMessage(
          "💰 You need $3,000 for drainage improvements."
        );

        playSound("click");
        return;
      }

      setBudget((value) =>
        value - 3000
      );

      setWater((value) =>
        clamp(value + 10, 0, 100)
      );

      setHappiness((value) =>
        clamp(value + 3, 0, 100)
      );

      setMessage(
        "🌧️ Better drainage protected Desert Valley from flooding."
      );
    }

    playSound("success");

    setEvent(null);
  }

  /* =======================================================
     RESET
     ======================================================= */

  function resetGame() {
    setDay(1);
    setBudget(100000);
    setTemperature(110);
    setWater(100);
    setEnergy(100);
    setHappiness(70);

    setTiles(
      Array(64).fill("empty") as Tile[]
    );

    setEvent(null);
    setEventVisible(false);
    setSelectedVillager(null);
    setShowStats(false);

    setMessage(
      "🌵 Your new Phoenix neighborhood is ready."
    );

    playSound("click");
  }

  /* =======================================================
     INTRO SCREEN
     ======================================================= */

  if (!started) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#17121c] text-[#fff4d6]">
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">

          {/* Animated sky */}

          <div
            className="absolute inset-0 bg-gradient-to-b from-[#171329] via-[#75384f] to-[#e47b45]"
            style={{
              animation:
                "skyPulse 8s ease-in-out infinite",
            }}
          />

          {/* Sun */}

          <div
            className="absolute right-[12%] top-[12%] h-40 w-40 rounded-full bg-[#ffd86b] shadow-[0_0_100px_35px_rgba(255,174,72,0.35)]"
            style={{
              animation:
                "sunPulse 4s ease-in-out infinite",
            }}
          />

          {/* Mountains */}

          <div
            className="absolute bottom-0 left-0 h-[45%] w-full bg-[#39283b]"
            style={{
              clipPath:
                "polygon(0 100%,0 65%,12% 48%,23% 70%,37% 25%,51% 65%,66% 35%,78% 68%,90% 42%,100% 65%,100% 100%)",
            }}
          />

          <div className="absolute bottom-0 h-[20%] w-full bg-[#211a26]/80" />

          {/* Main title */}

          <div
            className="relative z-10 mx-4 max-w-4xl text-center"
            style={{
              animation:
                "fadeIn 1s ease-out both",
            }}
          >
            <p
              className="text-sm font-black uppercase tracking-[0.5em] text-[#ffd86b]"
              style={{
                animation:
                  "fadeIn 1.5s ease-out both",
              }}
            >
              An Arizona Climate Simulation
            </p>

            <div
              className="mt-5 text-7xl drop-shadow-[5px_5px_0px_#29182d]"
              style={{
                animation:
                  "float 3s ease-in-out infinite",
              }}
            >
              🌵
            </div>

            <h1 className="mt-2 text-6xl font-black tracking-tight drop-shadow-[5px_5px_0px_#29182d] sm:text-8xl">
              DESERT
              <br />
              <span className="text-[#ffd86b]">
                VALLEY
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[#ffe8c4] sm:text-lg">
              You are the mayor of a brand-new Arizona
              neighborhood. Every decision changes the
              future of your community.
            </p>

            {/* Challenge cards */}

            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["🔥", "Extreme Heat"],
                ["💧", "Water Scarcity"],
                ["🌧️", "Monsoons"],
                ["🌵", "Native Ecology"],
              ].map(([icon, title], index) => (
                <div
                  key={title}
                  className="rounded-2xl border-2 border-white/10 bg-[#211a26]/70 p-4 backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-[#ffd86b] hover:bg-[#2b202d]"
                  style={{
                    animation:
                      "fadeIn 0.8s ease-out both",
                    animationDelay:
                      `${index * 150}ms`,
                  }}
                >
                  <div className="text-3xl">
                    {icon}
                  </div>

                  <p className="mt-2 text-xs font-black">
                    {title}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={startGame}
              className="mt-10 rounded-2xl border-4 border-[#ffd86b] bg-[#e8a85a] px-10 py-4 text-xl font-black text-[#29182d] shadow-[0_8px_0px_#7b403d] transition duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-[#ffd86b] active:translate-y-1 active:shadow-none"
            >
              ENTER DESERT VALLEY →
            </button>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-[#f0c9a8]">
              Every decision shapes the future.
            </p>
          </div>
        </div>

        <GlobalStyles />
      </main>
    );
  }

  /* =======================================================
     GAME SCREEN
     ======================================================= */

  return (
    <main className="min-h-screen bg-[#17121c] text-[#fff4d6]">

      {/* SKY */}

      <div className="relative h-[220px] overflow-hidden bg-gradient-to-b from-[#21152f] via-[#8b3f55] to-[#e47b45]">

        <div
          className="absolute right-[12%] top-10 h-24 w-24 rounded-full bg-[#ffd86b] shadow-[0_0_60px_20px_rgba(255,174,72,0.4)]"
          style={{
            animation:
              "sunPulse 5s ease-in-out infinite",
          }}
        />

        <div
          className="absolute bottom-0 left-0 h-36 w-full bg-[#39283b]"
          style={{
            clipPath:
              "polygon(0 100%,0 70%,15% 35%,30% 70%,45% 20%,60% 70%,78% 35%,100% 65%,100% 100%)",
          }}
        />

        <div className="absolute left-6 top-6">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#ffd86b]">
            Phoenix, Arizona
          </p>

          <h1 className="mt-1 text-4xl font-black drop-shadow-[4px_4px_0px_#29182d]">
            🌵 DESERT VALLEY
          </h1>
        </div>
      </div>

      {/* HUD */}

      <div className="relative z-10 -mt-5 px-4">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 rounded-2xl border-4 border-[#3b2636] bg-[#211a26] p-3 shadow-2xl sm:grid-cols-4 lg:grid-cols-8">

          <Stat
            icon="📅"
            label="Day"
            value={`${day}`}
          />

          <Stat
            icon="🌡️"
            label="Temp"
            value={`${temperature}°F`}
          />

          <Stat
            icon="💰"
            label="Budget"
            value={`$${budget.toLocaleString()}`}
          />

          <Stat
            icon="💧"
            label="Water"
            value={`${water}%`}
          />

          <Stat
            icon="⚡"
            label="Energy"
            value={`${energy}%`}
          />

          <Stat
            icon="😊"
            label="Happiness"
            value={`${happiness}%`}
          />

          <Stat
            icon="👥"
            label="Population"
            value={`${population}`}
          />

          <button
            type="button"
            onClick={() => {
              setShowStats((value) => !value);
              playSound("click");
            }}
            className="rounded-xl border-2 border-[#4b3443] bg-[#2b202d] px-3 py-2 text-left transition duration-300 hover:-translate-y-1 hover:border-[#ffd86b]"
          >
            <p className="text-xs font-bold text-[#bda696]">
              📊 City
            </p>

            <p className="mt-1 font-black">
              {houses} homes
            </p>
          </button>
        </div>
      </div>

      {/* MAIN */}

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-6">

        <div className="grid gap-5 lg:grid-cols-[250px_1fr]">

          {/* SIDEBAR */}

          <aside className="rounded-2xl border-4 border-[#3b2636] bg-[#2b202d] p-4 shadow-xl">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e8a85a]">
              Town Builder
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Build
            </h2>

            <p className="mt-2 text-xs text-[#cdb7a4]">
              Choose what your neighborhood needs.
            </p>

            <div className="mt-5 space-y-2">
              {(
                Object.keys(
                  BUILDINGS
                ) as Array<
                  Exclude<Tile, "empty">
                >
              ).map((type) => {
                const building =
                  BUILDINGS[type];

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setSelectedTool(type);
                      playSound("click");
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition duration-300 hover:-translate-y-1 ${
                      selectedTool === type
                        ? "border-[#ffd86b] bg-[#8b3f55] shadow-lg"
                        : "border-[#4b3443] bg-[#211a26] hover:border-[#e8a85a]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">
                        {building.emoji}
                      </span>

                      <span>
                        <span className="block font-bold">
                          {building.name}
                        </span>

                        <span className="text-xs text-[#cdb7a4]">
                          $
                          {building.cost.toLocaleString()}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* DAILY FINANCES */}

            <div className="mt-5 rounded-xl border-2 border-[#4b3443] bg-[#211a26] p-3">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e8a85a]">
                💰 Daily Finances
              </p>

              <div
                className={`mt-3 rounded-xl border-2 p-3 ${
                  dailyNet >= 0
                    ? "border-green-500/40 bg-green-500/10"
                    : "border-red-500/40 bg-red-500/10"
                }`}
              >
                <p className="text-xs font-bold text-[#bda696]">
                  Daily Net
                </p>

                <p
                  className={`mt-1 text-3xl font-black ${
                    dailyNet >= 0
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  {dailyNet >= 0
                    ? "+"
                    : "-"}
                  $
                  {Math.abs(
                    dailyNet
                  ).toLocaleString()}
                </p>
              </div>

              <div className="mt-3 space-y-1 text-xs">

                <div className="flex justify-between">
                  <span className="text-[#cdb7a4]">
                    Building income
                  </span>

                  <span className="font-bold text-green-300">
                    +$
                    {(
                      houseIncome +
                      plantIncome +
                      parkIncome +
                      solarIncome
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#cdb7a4]">
                    Resident income
                  </span>

                  <span className="font-bold text-green-300">
                    +$
                    {residentIncome.toLocaleString()}
                  </span>
                </div>

                <div className="my-2 border-t border-[#4b3443]" />

                <div className="flex justify-between">
                  <span className="text-[#cdb7a4]">
                    Maintenance
                  </span>

                  <span className="font-bold text-red-300">
                    -$
                    {dailyExpenses.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* HEAT LEGEND */}

            <div className="mt-5 rounded-xl border-2 border-[#4b3443] bg-[#211a26] p-3">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e8a85a]">
                🌡️ Heat Map
              </p>

              <p className="mt-2 text-xs text-[#cdb7a4]">
                Each tile shows its local heat level.
              </p>

              <div className="mt-3 space-y-1.5">
                <HeatLegend
                  className="bg-red-500"
                  label="Very Hot"
                />

                <HeatLegend
                  className="bg-orange-400"
                  label="Hot"
                />

                <HeatLegend
                  className="bg-yellow-200"
                  label="Warm"
                />

                <HeatLegend
                  className="bg-lime-300"
                  label="Cool"
                />

                <HeatLegend
                  className="bg-emerald-300"
                  label="Very Cool"
                />
              </div>
            </div>

            {/* RESIDENTS */}

            <div className="mt-5 rounded-xl border-2 border-[#4b3443] bg-[#211a26] p-3">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e8a85a]">
                👥 Residents
              </p>

              <p className="mt-2 text-xs leading-relaxed text-[#cdb7a4]">
                Click a villager on the map to hear their perspective on life in Arizona.
              </p>
            </div>

            {/* BUTTONS */}

            <div className="mt-5 space-y-2">

              <button
                type="button"
                onClick={nextDay}
                disabled={!!event}
                className="w-full rounded-xl bg-[#e8a85a] px-4 py-3 font-black text-[#29182d] shadow-[0_4px_0px_#7b403d] transition duration-300 hover:-translate-y-1 hover:bg-[#ffd86b] disabled:cursor-not-allowed disabled:opacity-40"
              >
                🌅 NEXT DAY
              </button>

              <button
                type="button"
                onClick={resetGame}
                className="w-full rounded-xl border-2 border-[#8b3f55] bg-[#211a26] px-4 py-3 font-black transition duration-300 hover:-translate-y-1 hover:bg-[#8b3f55]"
              >
                🔄 RESET CITY
              </button>
            </div>
          </aside>

          {/* MAP */}

          <div className="relative overflow-hidden rounded-2xl border-4 border-[#3b2636] bg-[#c77b4b] shadow-2xl">

            <div className="p-5">

              <div className="mb-5 flex items-end justify-between">

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#5a3030]">
                    District 01
                  </p>

                  <h2 className="text-3xl font-black text-[#29182d]">
                    Desert Valley
                  </h2>
                </div>

                <div className="rounded-lg border-2 border-[#5a3030] bg-[#e8a85a] px-3 py-2 text-xs font-black text-[#29182d]">
                  DAY {day}
                </div>
              </div>

              {/* HEAT MAP GRID */}

              <div className="grid grid-cols-8 gap-1 rounded-xl border-4 border-[#5a3030] bg-[#a85f45] p-3">

                {tiles.map(
                  (tile, index) => {
                    const building =
                      tile === "empty"
                        ? null
                        : BUILDINGS[tile];

                    const villager =
                      VILLAGERS[
                        index %
                          VILLAGERS.length
                      ];

                    const showVillager =
                      index === 10 ||
                      index === 25 ||
                      index === 42 ||
                      index === 54;

                    const tileHeat =
                      getTileHeat(
                        tile,
                        temperature
                      );

                    const heatClasses =
                      getHeatClasses(
                        tileHeat
                      );

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          build(index)
                        }
                        title={`Local temperature: ${tileHeat}°F`}
                        className={`group relative aspect-square overflow-visible rounded-md border-2 ${heatClasses} transition duration-300 hover:z-10 hover:-translate-y-1 hover:scale-105 hover:border-[#ffd86b] hover:shadow-lg`}
                      >

                        {/* TEMPERATURE */}

                        <span className="absolute right-0.5 top-0.5 z-10 rounded bg-[#211a26]/70 px-1 text-[8px] font-black text-white opacity-0 transition group-hover:opacity-100">
                          {tileHeat}°
                        </span>

                        {/* BUILDING */}

                        {building ? (
                          <span className="relative z-10 text-3xl drop-shadow-[2px_2px_0px_rgba(41,24,45,0.6)] transition duration-300 group-hover:scale-110">
                            {building.emoji}
                          </span>
                        ) : (
                          <span className="text-xs opacity-40 transition group-hover:opacity-80">
                            🌵
                          </span>
                        )}

                        {/* VILLAGER */}

                        {showVillager && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();

                              setSelectedVillager(
                                villager
                              );

                              playSound(
                                "click"
                              );
                            }}
                            className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 cursor-pointer text-2xl drop-shadow-[2px_2px_0px_#29182d] transition duration-300 hover:scale-125"
                          >
                            {villager.emoji}
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              {/* MESSAGE */}

              <div className="mt-5 rounded-xl border-2 border-[#5a3030] bg-[#211a26] px-4 py-3 shadow-lg">
                <p className="text-sm font-bold">
                  {message}
                </p>
              </div>

              {/* CITY STATS */}

              {showStats && (
                <div
                  className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5"
                  style={{
                    animation:
                      "fadeIn 0.3s ease-out both",
                  }}
                >
                  <MiniStat
                    label="🏠 Houses"
                    value={houses}
                  />

                  <MiniStat
                    label="🌵 Plants"
                    value={trees}
                  />

                  <MiniStat
                    label="🌳 Parks"
                    value={parks}
                  />

                  <MiniStat
                    label="☀️ Solar"
                    value={solar}
                  />

                  <MiniStat
                    label="🛣️ Roads"
                    value={roads}
                  />
                </div>
              )}
            </div>

            {/* =================================================
                VILLAGER MODAL
               ================================================= */}

            {selectedVillager && (
              <div
                className="fixed inset-0 z-[900] flex items-end justify-center bg-black/60 p-5 backdrop-blur-sm"
                onClick={() =>
                  setSelectedVillager(null)
                }
              >
                <div
                  className="w-full max-w-lg rounded-3xl border-4 border-[#ffd86b] bg-[#211a26] p-5 shadow-2xl"
                  style={{
                    animation:
                      "eventCardIn 0.45s cubic-bezier(0.16,1,0.3,1) both",
                  }}
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#2b202d] text-5xl">
                      {selectedVillager.emoji}
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-[#e8a85a]">
                        Resident
                      </p>

                      <h2 className="text-2xl font-black">
                        {selectedVillager.name}
                      </h2>

                      <p className="text-xs text-[#cdb7a4]">
                        {selectedVillager.job}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#2b202d] p-4">
                    <p className="text-lg leading-relaxed">
                      💬 "
                      {
                        selectedVillager.dialogue
                      }
                      "
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVillager(
                        null
                      );
                      playSound(
                        "click"
                      );
                    }}
                    className="mt-4 w-full rounded-xl bg-[#8b3f55] px-4 py-3 font-black transition hover:bg-[#a94c62]"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          FULL SCREEN CLIMATE EVENT
          ===================================================== */}

      {event && (
        <div
          className={`fixed inset-0 z-[9999] flex min-h-screen w-screen items-center justify-center overflow-hidden p-5 ${
            eventVisible
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          style={{
            transition:
              "opacity 700ms ease, transform 700ms ease",
            transform: eventVisible
              ? "scale(1)"
              : "scale(1.12)",
          }}
        >

          {/* EVENT BACKGROUND */}

          <div
            className={`absolute inset-0 ${
              event === "heat"
                ? "bg-gradient-to-b from-red-950 via-red-700 to-orange-500"
                : event === "drought"
                  ? "bg-gradient-to-b from-sky-950 via-blue-800 to-amber-600"
                  : event === "monsoon"
                    ? "bg-gradient-to-b from-slate-950 via-blue-950 to-slate-700"
                    : "bg-gradient-to-b from-[#3f2b1c] via-[#9a663b] to-[#d6a15c]"
            }`}
            style={{
              animation:
                event === "heat"
                  ? "heatBackground 2s ease-in-out infinite"
                  : event === "drought"
                    ? "droughtBackground 3s ease-in-out infinite"
                    : event === "monsoon"
                      ? "stormBackground 1.5s ease-in-out infinite"
                      : "dustBackground 2s ease-in-out infinite",
            }}
          />

          {/* DARK OVERLAY */}

          <div className="absolute inset-0 bg-black/25" />

          {/* =================================================
              HEAT PARTICLES
             ================================================= */}

          {event === "heat" && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">

              {Array.from({
                length: 25,
              }).map((_, index) => (
                <span
                  key={index}
                  className="absolute bottom-[-80px] text-4xl"
                  style={{
                    left: `${(index * 13) % 100}%`,
                    animation:
                      "heatParticle 2s linear infinite",
                    animationDelay:
                      `${index * 0.1}s`,
                  }}
                >
                  🔥
                </span>
              ))}

              <div
                className="absolute inset-0 bg-red-500/10"
                style={{
                  animation:
                    "screenShake 0.35s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* =================================================
              DROUGHT
             ================================================= */}

          {event === "drought" && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">

              {Array.from({
                length: 25,
              }).map((_, index) => (
                <span
                  key={index}
                  className="absolute text-5xl opacity-40"
                  style={{
                    left: `${(index * 11) % 100}%`,
                    top: `${(index * 17) % 100}%`,
                    animation:
                      "droughtParticle 4s linear infinite",
                    animationDelay:
                      `${index * 0.12}s`,
                  }}
                >
                  💧
                </span>
              ))}

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle, transparent 20%, rgba(0,0,0,.25) 100%)",
                  animation:
                    "droughtPulse 3s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* =================================================
              MONSOON
             ================================================= */}

          {event === "monsoon" && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">

              {/* RAIN */}

              {Array.from({
                length: 80,
              }).map((_, index) => (
                <span
                  key={index}
                  className="absolute top-[-80px] block h-16 w-[2px] rounded-full bg-blue-200/70"
                  style={{
                    left: `${(index * 17) % 100}%`,
                    animation:
                      "rainFall 0.55s linear infinite",
                    animationDelay:
                      `${index * 0.025}s`,
                  }}
                />
              ))}

              {/* LIGHTNING */}

              <div
                className="absolute inset-0"
                style={{
                  animation:
                    "lightning 3s linear infinite",
                }}
              />

              {/* WIND */}

              <div
                className="absolute left-[-20%] top-1/3 h-1 w-[140%] bg-white/10 blur-sm"
                style={{
                  animation:
                    "stormWind 1.2s linear infinite",
                }}
              />

              <div
                className="absolute left-[-20%] top-2/3 h-1 w-[140%] bg-white/10 blur-sm"
                style={{
                  animation:
                    "stormWind 1.6s linear infinite",
                }}
              />
            </div>
          )}

          {/* =================================================
              DUST STORM
             ================================================= */}

          {event === "dust" && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">

              {Array.from({
                length: 45,
              }).map((_, index) => (
                <span
                  key={index}
                  className="absolute h-3 w-3 rounded-full bg-amber-200/50 blur-[2px]"
                  style={{
                    left: `${(index * 9) % 100}%`,
                    top: `${(index * 17) % 100}%`,
                    animation:
                      "dustMove 2.5s linear infinite",
                    animationDelay:
                      `${index * 0.07}s`,
                  }}
                />
              ))}

              <div
                className="absolute inset-0 bg-amber-300/10"
                style={{
                  animation:
                    "dustPulse 2s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* =================================================
              EVENT CARD
             ================================================= */}

          <div
            className="relative z-10 w-full max-w-2xl rounded-[2rem] border-4 border-[#ffd86b] bg-[#17121c]/95 p-7 shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-10"
            style={{
              animation:
                "eventCardIn 0.8s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >

            <div className="text-center">

              <div
                className="text-8xl drop-shadow-2xl sm:text-9xl"
                style={{
                  animation:
                    "eventIcon 1.5s ease-in-out infinite",
                }}
              >
                {EVENTS[event].icon}
              </div>

              <p className="mt-4 text-xs font-black uppercase tracking-[0.4em] text-[#ffd86b]">
                PHOENIX CLIMATE ALERT
              </p>

              <h2 className="mt-3 text-4xl font-black sm:text-6xl">
                {EVENTS[event].title}
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#dbc8bb] sm:text-lg">
                {EVENTS[event].description}
              </p>
            </div>

            {/* CHOICES */}

            <div className="mt-8 space-y-3">

              {event === "heat" && (
                <>
                  <Choice
                    icon="🌵"
                    title="Plant Native Landscaping"
                    description="Cool the neighborhood naturally."
                    cost="$1,000"
                    onClick={() =>
                      handleEvent(
                        "trees"
                      )
                    }
                  />

                  <Choice
                    icon="☀️"
                    title="Upgrade Solar"
                    description="Improve energy resilience."
                    cost="$4,000"
                    onClick={() =>
                      handleEvent(
                        "solar"
                      )
                    }
                  />
                </>
              )}

              {event === "drought" && (
                <>
                  <Choice
                    icon="💧"
                    title="Conserve Water"
                    description="Immediately reduce water demand."
                    onClick={() =>
                      handleEvent(
                        "water"
                      )
                    }
                  />

                  <Choice
                    icon="🌵"
                    title="Plant Native Landscaping"
                    description="Replace water-hungry landscaping."
                    cost="$1,000"
                    onClick={() =>
                      handleEvent(
                        "trees"
                      )
                    }
                  />
                </>
              )}

              {event === "monsoon" && (
                <>
                  <Choice
                    icon="🌧️"
                    title="Improve Drainage"
                    description="Prepare the neighborhood for flooding."
                    cost="$3,000"
                    onClick={() =>
                      handleEvent(
                        "drainage"
                      )
                    }
                  />

                  <Choice
                    icon="🌵"
                    title="Use Native Landscaping"
                    description="Help absorb stormwater."
                    cost="$1,000"
                    onClick={() =>
                      handleEvent(
                        "trees"
                      )
                    }
                  />
                </>
              )}

              {event === "dust" && (
                <Choice
                  icon="🌵"
                  title="Plant Native Landscaping"
                  description="Reduce the impact of desert winds."
                  cost="$1,000"
                  onClick={() =>
                    handleEvent(
                      "trees"
                    )
                  }
                />
              )}

              <Choice
                icon="❌"
                title="Do Nothing"
                description="Accept the consequences."
                onClick={() =>
                  handleEvent(
                    "ignore"
                  )
                }
              />
            </div>
          </div>
        </div>
      )}

      <GlobalStyles />
    </main>
  );
}

/* =========================================================
   STAT
   ========================================================= */

function Stat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border-2 border-[#4b3443] bg-[#2b202d] px-3 py-2 transition duration-300 hover:-translate-y-1 hover:border-[#ffd86b]">
      <p className="text-xs font-bold text-[#bda696]">
        {icon} {label}
      </p>

      <p className="mt-1 font-black">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   MINI STAT
   ========================================================= */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border-2 border-[#5a3030] bg-[#211a26] p-3 transition duration-300 hover:-translate-y-1 hover:border-[#ffd86b]">
      <p className="text-xs text-[#cdb7a4]">
        {label}
      </p>

      <p className="mt-1 text-xl font-black">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   HEAT LEGEND
   ========================================================= */

function HeatLegend({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`h-4 w-4 rounded border border-black/20 ${className}`}
      />

      <span className="text-[#cdb7a4]">
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   EVENT CHOICE
   ========================================================= */

function Choice({
  icon,
  title,
  description,
  cost,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  cost?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        playSound("click");
        onClick();
      }}
      className="group flex w-full items-center gap-3 rounded-xl border-2 border-[#4b3443] bg-[#2b202d] p-3 text-left transition duration-300 hover:-translate-y-1 hover:border-[#ffd86b] hover:bg-[#8b3f55]"
    >
      <span className="text-2xl transition duration-300 group-hover:scale-125">
        {icon}
      </span>

      <span className="flex-1">
        <span className="block font-black">
          {title}
        </span>

        <span className="block text-xs text-[#cdb7a4]">
          {description}
        </span>
      </span>

      {cost && (
        <span className="rounded-lg bg-[#211a26] px-2 py-1 text-xs font-black text-[#ffd86b]">
          {cost}
        </span>
      )}
    </button>
  );
}

/* =========================================================
   GLOBAL ANIMATIONS
   ========================================================= */

function GlobalStyles() {
  return (
    <style jsx global>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.97);
        }

        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-14px);
        }
      }

      @keyframes sunPulse {
        0%,
        100% {
          transform: scale(1);
        }

        50% {
          transform: scale(1.12);
        }
      }

      @keyframes skyPulse {
        0%,
        100% {
          filter: brightness(0.9);
        }

        50% {
          filter: brightness(1.15);
        }
      }

      /* ===============================
         EVENT CARD
         =============================== */

      @keyframes eventCardIn {
        from {
          opacity: 0;
          transform: scale(0.7)
            translateY(70px)
            rotate(-2deg);
        }

        to {
          opacity: 1;
          transform: scale(1)
            translateY(0)
            rotate(0);
        }
      }

      @keyframes eventIcon {
        0%,
        100% {
          transform: translateY(0)
            scale(1)
            rotate(-3deg);
        }

        50% {
          transform: translateY(-18px)
            scale(1.1)
            rotate(3deg);
        }
      }

      /* ===============================
         HEAT
         =============================== */

      @keyframes heatBackground {
        0%,
        100% {
          filter: brightness(0.8)
            saturate(1);
        }

        50% {
          filter: brightness(1.35)
            saturate(1.7);
        }
      }

      @keyframes heatParticle {
        0% {
          transform:
            translateY(0)
            scale(0.4)
            rotate(0deg);
          opacity: 0;
        }

        20% {
          opacity: 0.8;
        }

        100% {
          transform:
            translateY(-110vh)
            scale(1.5)
            rotate(220deg);
          opacity: 0;
        }
      }

      /* ===============================
         DROUGHT
         =============================== */

      @keyframes droughtBackground {
        0%,
        100% {
          filter:
            brightness(0.75)
            saturate(0.65);
        }

        50% {
          filter:
            brightness(1.15)
            saturate(1);
        }
      }

      @keyframes droughtParticle {
        0% {
          transform:
            translateY(-40px)
            rotate(0deg)
            scale(0.6);
          opacity: 0;
        }

        30% {
          opacity: 0.5;
        }

        100% {
          transform:
            translateY(130px)
            rotate(180deg)
            scale(1.2);
          opacity: 0;
        }
      }

      @keyframes droughtPulse {
        0%,
        100% {
          opacity: 0.1;
        }

        50% {
          opacity: 0.35;
        }
      }

      /* ===============================
         MONSOON
         =============================== */

      @keyframes stormBackground {
        0%,
        100% {
          filter: brightness(0.55);
        }

        50% {
          filter: brightness(1);
        }
      }

      @keyframes rainFall {
        0% {
          transform:
            translateY(-100px)
            translateX(0)
            rotate(10deg);
          opacity: 0;
        }

        15% {
          opacity: 0.8;
        }

        100% {
          transform:
            translateY(115vh)
            translateX(-80px)
            rotate(10deg);
          opacity: 0;
        }
      }

      @keyframes lightning {
        0%,
        90%,
        100% {
          background: rgba(
            255,
            255,
            255,
            0
          );
        }

        91% {
          background: rgba(
            255,
            255,
            255,
            0.05
          );
        }

        92% {
          background: rgba(
            255,
            255,
            255,
            0.65
          );
        }

        93% {
          background: rgba(
            255,
            255,
            255,
            0
          );
        }

        95% {
          background: rgba(
            255,
            255,
            255,
            0.3
          );
        }

        96% {
          background: rgba(
            255,
            255,
            255,
            0
          );
        }
      }

      @keyframes stormWind {
        from {
          transform: translateX(-30%);
          opacity: 0;
        }

        50% {
          opacity: 1;
        }

        to {
          transform: translateX(30%);
          opacity: 0;
        }
      }

      /* ===============================
         DUST
         =============================== */

      @keyframes dustBackground {
        0%,
        100% {
          filter:
            brightness(0.7)
            saturate(0.7);
        }

        50% {
          filter:
            brightness(1.15)
            saturate(1.1);
        }
      }

      @keyframes dustMove {
        0% {
          transform:
            translateX(-150px)
            translateY(0)
            scale(0.4);
          opacity: 0;
        }

        25% {
          opacity: 0.7;
        }

        100% {
          transform:
            translateX(120vw)
            translateY(-80px)
            scale(1.8);
          opacity: 0;
        }
      }

      @keyframes dustPulse {
        0%,
        100% {
          opacity: 0.1;
        }

        50% {
          opacity: 0.45;
        }
      }

      /* ===============================
         SCREEN SHAKE
         =============================== */

      @keyframes screenShake {
        0%,
        100% {
          transform: translate(0);
        }

        25% {
          transform: translate(
            2px,
            -2px
          );
        }

        50% {
          transform: translate(
            -2px,
            2px
          );
        }

        75% {
          transform: translate(
            2px,
            2px
          );
        }
      }
    `}</style>
  );
}