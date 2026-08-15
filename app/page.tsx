"use client";

import { useState } from "react";

type Tile =
  | "empty"
  | "house"
  | "tree"
  | "solar"
  | "park"
  | "road";

type BuildingStatus =
  | "normal"
  | "hot"
  | "dry"
  | "flooded"
  | "dusty"
  | "overheated";

type EventType =
  | "heat"
  | "drought"
  | "monsoon"
  | "dust";

type GameEvent = {
  type: EventType;
  area: number[];
};

const BUILDINGS = {
  house: {
    emoji: "🏠",
    name: "House",
    cost: 5000,
  },
  tree: {
    emoji: "🌳",
    name: "Native Tree",
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

const EVENTS: Record<
  EventType,
  {
    title: string;
    icon: string;
    description: string;
  }
> = {
  heat: {
    title: "Extreme Heat",
    icon: "🔥",
    description:
      "A dangerous heat wave is affecting part of your neighborhood.",
  },

  drought: {
    title: "Water Shortage",
    icon: "💧",
    description:
      "Water supplies are running low in one area of the city.",
  },

  monsoon: {
    title: "Monsoon Storm",
    icon: "🌧️",
    description:
      "A powerful monsoon is moving through your neighborhood.",
  },

  dust: {
    title: "Dust Storm",
    icon: "💨",
    description:
      "Strong winds are blowing dust through the neighborhood.",
  },
};

const STATUS_INFO: Record<
  BuildingStatus,
  {
    label: string;
    icon: string;
  }
> = {
  normal: {
    label: "Normal",
    icon: "",
  },

  hot: {
    label: "Overheated",
    icon: "🔥",
  },

  dry: {
    label: "Drought Stress",
    icon: "🥀",
  },

  flooded: {
    label: "Flooded",
    icon: "🌊",
  },

  dusty: {
    label: "Dusty",
    icon: "💨",
  },

  overheated: {
    label: "Overheated",
    icon: "☀️",
  },
};

export default function Home() {
  const [day, setDay] = useState(1);

  const [budget, setBudget] = useState(100000);

  const [temperature, setTemperature] = useState(110);

  const [water, setWater] = useState(100);

  const [energy, setEnergy] = useState(100);

  const [happiness, setHappiness] = useState(50);

  const [population, setPopulation] = useState(0);

  const [selectedTool, setSelectedTool] =
    useState<Tile>("house");

  const [tiles, setTiles] = useState<Tile[]>(
    Array(64).fill("empty")
  );

  const [buildingStatuses, setBuildingStatuses] =
    useState<BuildingStatus[]>(
      Array(64).fill("normal")
    );

  const [activeEvent, setActiveEvent] =
    useState<GameEvent | null>(null);

  const [message, setMessage] = useState(
    "Your new Phoenix neighborhood is ready."
  );

  /*
   * CITY ECONOMY
   *
   * These values control the daily economy.
   */

  function calculateDailyFinances() {
    const houses = tiles.filter(
      (tile) => tile === "house"
    ).length;

    const trees = tiles.filter(
      (tile) => tile === "tree"
    ).length;

    const parks = tiles.filter(
      (tile) => tile === "park"
    ).length;

    const solarPanels = tiles.filter(
      (tile) => tile === "solar"
    ).length;

    const roads = tiles.filter(
      (tile) => tile === "road"
    ).length;

    const houseIncome = houses * 300;
    const populationIncome = population * 50;
    const treeIncome = trees * 50;
    const parkIncome = parks * 100;
    const solarIncome = solarPanels * 150;

    const roadMaintenance = roads * 50;

    /*
     * Arizona-specific environmental costs.
     */

    const heatCost =
      temperature >= 115 ? 300 : 0;

    const waterCost =
      water <= 30 ? 400 : 0;

    const energyCost =
      energy <= 30 ? 300 : 0;

    const totalIncome =
      houseIncome +
      populationIncome +
      treeIncome +
      parkIncome +
      solarIncome;

    const totalExpenses =
      roadMaintenance +
      heatCost +
      waterCost +
      energyCost;

    const net =
      totalIncome - totalExpenses;

    return {
      houses,
      trees,
      parks,
      solarPanels,
      roads,
      houseIncome,
      populationIncome,
      treeIncome,
      parkIncome,
      solarIncome,
      roadMaintenance,
      heatCost,
      waterCost,
      energyCost,
      totalIncome,
      totalExpenses,
      net,
    };
  }

  const finances =
    calculateDailyFinances();

  /*
   * Find an area that actually contains buildings.
   */

  function findOccupiedArea() {
    const occupied = tiles
      .map((tile, index) =>
        tile !== "empty" ? index : -1
      )
      .filter((index) => index !== -1);

    if (occupied.length === 0) {
      return [27, 28, 35, 36];
    }

    const randomIndex =
      occupied[
        Math.floor(
          Math.random() * occupied.length
        )
      ];

    const row = Math.floor(randomIndex / 8);
    const column = randomIndex % 8;

    const safeRow = Math.min(row, 6);
    const safeColumn = Math.min(column, 6);

    return [
      safeRow * 8 + safeColumn,
      safeRow * 8 + safeColumn + 1,
      (safeRow + 1) * 8 + safeColumn,
      (safeRow + 1) * 8 +
        safeColumn +
        1,
    ];
  }

  /*
   * Apply an event to the actual buildings
   * inside its affected area.
   */

  function applyEventEffects(
    eventType: EventType,
    area: number[]
  ) {
    const newStatuses = [
      ...buildingStatuses,
    ];

    let affectedBuildings = 0;

    area.forEach((index) => {
      const building = tiles[index];

      if (building === "empty") return;

      affectedBuildings++;

      if (eventType === "heat") {
        if (building === "house") {
          newStatuses[index] = "hot";
        }

        if (building === "solar") {
          newStatuses[index] =
            "overheated";
        }

        if (building === "tree") {
          newStatuses[index] = "dry";
        }

        if (building === "park") {
          newStatuses[index] = "dry";
        }
      }

      if (eventType === "drought") {
        if (
          building === "tree" ||
          building === "park"
        ) {
          newStatuses[index] = "dry";
        }

        if (building === "house") {
          newStatuses[index] = "dry";
        }
      }

      if (eventType === "monsoon") {
        if (
          building === "house" ||
          building === "road"
        ) {
          newStatuses[index] = "flooded";
        }

        if (
          building === "tree" ||
          building === "park"
        ) {
          newStatuses[index] = "flooded";
        }
      }

      if (eventType === "dust") {
        if (
          building === "house" ||
          building === "road"
        ) {
          newStatuses[index] = "dusty";
        }

        if (building === "tree") {
          newStatuses[index] = "dusty";
        }
      }
    });

    setBuildingStatuses(newStatuses);

    return affectedBuildings;
  }

  function createEvent() {
    const eventTypes: EventType[] = [
      "heat",
      "drought",
      "monsoon",
      "dust",
    ];

    const randomEvent =
      eventTypes[
        Math.floor(
          Math.random() * eventTypes.length
        )
      ];

    const area = findOccupiedArea();

    applyEventEffects(
      randomEvent,
      area
    );

    setActiveEvent({
      type: randomEvent,
      area,
    });
  }

  /*
   * ADVANCE DAY
   */

  function nextDay() {
    if (activeEvent) {
      setMessage(
        "⚠️ Respond to the current event before starting another day."
      );
      return;
    }

    const newDay = day + 1;

    /*
     * Calculate the city's daily finances
     * BEFORE environmental changes.
     */

    const daily = calculateDailyFinances();

    setBudget((value) =>
      Math.max(
        0,
        value + daily.net
      )
    );

    setDay(newDay);

    /*
     * Daily resource consumption.
     */

    setWater((value) =>
      Math.max(0, value - 2)
    );

    setEnergy((value) =>
      Math.max(0, value - 2)
    );

    /*
     * Every third day creates a challenge.
     */

    if (newDay % 3 === 0) {
      createEvent();

      if (daily.net >= 0) {
        setMessage(
          `Day ${newDay}: +$${daily.net.toLocaleString()} net city income. A Phoenix weather challenge is approaching.`
        );
      } else {
        setMessage(
          `Day ${newDay}: -$${Math.abs(
            daily.net
          ).toLocaleString()} net expenses. A Phoenix weather challenge is approaching.`
        );
      }

      return;
    }

    /*
     * Gradually return buildings to normal
     * if they survived the previous event.
     */

    setBuildingStatuses((statuses) =>
      statuses.map((status) => {
        if (status === "normal") {
          return status;
        }

        if (Math.random() < 0.35) {
          return "normal";
        }

        return status;
      })
    );

    if (daily.net > 0) {
      setMessage(
        `Day ${newDay} begins. Your city earned $${daily.net.toLocaleString()} today.`
      );
    } else if (daily.net < 0) {
      setMessage(
        `Day ${newDay} begins. Your city spent $${Math.abs(
          daily.net
        ).toLocaleString()} today.`
      );
    } else {
      setMessage(
        `Day ${newDay} begins. Your neighborhood broke even today.`
      );
    }
  }

  /*
   * WEATHER EVENT CHOICES
   */

  function handleEventChoice(
    choice:
      | "solar"
      | "trees"
      | "cooling"
      | "conserve"
      | "drainage"
      | "ignore"
  ) {
    if (!activeEvent) return;

    const event =
      activeEvent.type;

    const newStatuses = [
      ...buildingStatuses,
    ];

    /*
     * HEAT WAVE
     */

    if (event === "heat") {
      if (choice === "solar") {
        if (budget < 4000) {
          setMessage(
            "You don't have enough money for solar panels."
          );
          return;
        }

        setBudget(
          (value) => value - 4000
        );

        setEnergy((value) =>
          Math.min(100, value + 10)
        );

        setTemperature((value) =>
          Math.max(70, value - 2)
        );

        activeEvent.area.forEach(
          (index) => {
            if (
              tiles[index] === "house"
            ) {
              newStatuses[index] =
                "normal";
            }
          }
        );

        setMessage(
          "☀️ Solar power helped the neighborhood handle the heat."
        );
      }

      if (choice === "trees") {
        if (budget < 1000) {
          setMessage(
            "You don't have enough money to plant shade trees."
          );
          return;
        }

        setBudget(
          (value) => value - 1000
        );

        setTemperature((value) =>
          Math.max(70, value - 4)
        );

        setHappiness((value) =>
          Math.min(100, value + 5)
        );

        activeEvent.area.forEach(
          (index) => {
            if (
              tiles[index] === "house" ||
              tiles[index] === "tree"
            ) {
              newStatuses[index] =
                "normal";
            }
          }
        );

        setMessage(
          "🌳 Shade trees protected the affected neighborhood."
        );
      }

      if (choice === "cooling") {
        if (budget < 2000) {
          setMessage(
            "You don't have enough money for a cooling center."
          );
          return;
        }

        setBudget(
          (value) => value - 2000
        );

        setHappiness((value) =>
          Math.min(100, value + 8)
        );

        setEnergy((value) =>
          Math.max(0, value - 3)
        );

        activeEvent.area.forEach(
          (index) => {
            if (
              tiles[index] === "house"
            ) {
              newStatuses[index] =
                "normal";
            }
          }
        );

        setMessage(
          "🏥 The cooling center protected residents."
        );
      }

      if (choice === "ignore") {
        setEnergy((value) =>
          Math.max(0, value - 12)
        );

        setHappiness((value) =>
          Math.max(0, value - 10)
        );

        setTemperature((value) =>
          Math.min(125, value + 4)
        );

        setMessage(
          "🔥 The heat wave damaged buildings in the affected area."
        );
      }
    }

    /*
     * DROUGHT
     */

    if (event === "drought") {
      if (choice === "conserve") {
        setWater((value) =>
          Math.min(100, value + 8)
        );

        setHappiness((value) =>
          Math.max(0, value - 1)
        );

        activeEvent.area.forEach(
          (index) => {
            if (
              tiles[index] === "tree" ||
              tiles[index] === "park"
            ) {
              newStatuses[index] =
                "normal";
            }
          }
        );

        setMessage(
          "💧 Water conservation protected the neighborhood."
        );
      }

      if (choice === "trees") {
        if (budget < 1000) {
          setMessage(
            "You don't have enough money."
          );
          return;
        }

        setBudget(
          (value) => value - 1000
        );

        setWater((value) =>
          Math.max(0, value - 3)
        );

        setHappiness((value) =>
          Math.min(100, value + 5)
        );

        activeEvent.area.forEach(
          (index) => {
            if (
              tiles[index] === "tree" ||
              tiles[index] === "park"
            ) {
              newStatuses[index] =
                "normal";
            }
          }
        );

        setMessage(
          "🌳 Native landscaping reduced the impact of the drought."
        );
      }

      if (choice === "ignore") {
        setWater((value) =>
          Math.max(0, value - 18)
        );

        setHappiness((value) =>
          Math.max(0, value - 8)
        );

        setMessage(
          "💧 The drought stressed buildings and landscaping."
        );
      }
    }

    /*
     * MONSOON
     */

    if (event === "monsoon") {
      if (choice === "drainage") {
        if (budget < 3000) {
          setMessage(
            "You don't have enough money for drainage improvements."
          );
          return;
        }

        setBudget(
          (value) => value - 3000
        );

        setWater((value) =>
          Math.min(100, value + 12)
        );

        setHappiness((value) =>
          Math.min(100, value + 4)
        );

        activeEvent.area.forEach(
          (index) => {
            if (
              buildingStatuses[index] ===
              "flooded"
            ) {
              newStatuses[index] =
                "normal";
            }
          }
        );

        setMessage(
          "🌧️ New drainage protected the affected area from flooding."
        );
      }

      if (choice === "trees") {
        if (budget < 1000) {
          setMessage(
            "You don't have enough money."
          );
          return;
        }

        setBudget(
          (value) => value - 1000
        );

        setWater((value) =>
          Math.min(100, value + 8)
        );

        setHappiness((value) =>
          Math.min(100, value + 3)
        );

        activeEvent.area.forEach(
          (index) => {
            if (
              tiles[index] === "tree" ||
              tiles[index] === "park"
            ) {
              newStatuses[index] =
                "normal";
            }
          }
        );

        setMessage(
          "🌳 Green spaces helped absorb stormwater."
        );
      }

      if (choice === "ignore") {
        setWater((value) =>
          Math.min(100, value + 15)
        );

        setHappiness((value) =>
          Math.max(0, value - 7)
        );

        setBudget((value) =>
          Math.max(0, value - 3000)
        );

        setMessage(
          "🌧️ Flooding damaged the affected buildings and roads."
        );
      }
    }

    /*
     * DUST STORM
     */

    if (event === "dust") {
      if (choice === "trees") {
        if (budget < 1000) {
          setMessage(
            "You don't have enough money."
          );
          return;
        }

        setBudget(
          (value) => value - 1000
        );

        setHappiness((value) =>
          Math.min(100, value + 5)
        );

        setEnergy((value) =>
          Math.min(100, value + 3)
        );

        activeEvent.area.forEach(
          (index) => {
            if (
              tiles[index] !== "empty"
            ) {
              newStatuses[index] =
                "normal";
            }
          }
        );

        setMessage(
          "🌳 Windbreak trees reduced the dust storm's impact."
        );
      }

      if (choice === "ignore") {
        setHappiness((value) =>
          Math.max(0, value - 7)
        );

        setEnergy((value) =>
          Math.max(0, value - 6)
        );

        setMessage(
          "💨 Dust covered the affected part of the neighborhood."
        );
      }
    }

    setBuildingStatuses(
      newStatuses
    );

    setActiveEvent(null);
  }

  /*
   * RESET CITY
   */

  function resetCity() {
    const confirmed =
      window.confirm(
        "Are you sure you want to reset your city?"
      );

    if (!confirmed) return;

    setDay(1);
    setBudget(100000);
    setTemperature(110);
    setWater(100);
    setEnergy(100);
    setHappiness(50);
    setPopulation(0);

    setTiles(
      Array(64).fill("empty")
    );

    setBuildingStatuses(
      Array(64).fill("normal")
    );

    setActiveEvent(null);

    setMessage(
      "🌵 Your new Phoenix neighborhood is ready."
    );
  }

  /*
   * BUILD
   */

  function build(index: number) {
    if (tiles[index] !== "empty")
      return;

    if (
      activeEvent?.area.includes(
        index
      )
    ) {
      setMessage(
        "⚠️ This area is currently affected by a weather event."
      );

      return;
    }

    const building =
      BUILDINGS[
        selectedTool as keyof typeof BUILDINGS
      ];

    if (!building) return;

    if (budget < building.cost) {
      setMessage(
        "💰 You don't have enough money."
      );

      return;
    }

    const newTiles = [...tiles];

    newTiles[index] =
      selectedTool;

    setTiles(newTiles);

    const newStatuses = [
      ...buildingStatuses,
    ];

    newStatuses[index] =
      "normal";

    setBuildingStatuses(
      newStatuses
    );

    setBudget(
      (value) =>
        value - building.cost
    );

    if (
      selectedTool === "house"
    ) {
      setPopulation(
        (value) => value + 2
      );

      setHappiness(
        (value) =>
          Math.min(
            100,
            value + 3
          )
      );

      setEnergy(
        (value) =>
          Math.max(
            0,
            value - 5
          )
      );

      setWater(
        (value) =>
          Math.max(
            0,
            value - 3
          )
      );
    }

    if (
      selectedTool === "tree"
    ) {
      setTemperature(
        (value) =>
          Math.max(
            70,
            value - 2
          )
      );

      setHappiness(
        (value) =>
          Math.min(
            100,
            value + 2
          )
      );
    }

    if (
      selectedTool === "park"
    ) {
      setTemperature(
        (value) =>
          Math.max(
            70,
            value - 3
          )
      );

      setHappiness(
        (value) =>
          Math.min(
            100,
            value + 5
          )
      );
    }

    if (
      selectedTool === "solar"
    ) {
      setEnergy(
        (value) =>
          Math.min(
            100,
            value + 6
          )
      );
    }

    setMessage(
      `${building.name} was added to your neighborhood.`
    );
  }

  const currentEvent =
    activeEvent
      ? EVENTS[
          activeEvent.type
        ]
      : null;

  return (
    <main className="min-h-screen overflow-hidden bg-[#17121c] text-[#fff4d6]">

      {/* SKY */}

      <div className="relative h-[250px] bg-gradient-to-b from-[#21152f] via-[#8b3f55] to-[#e47b45]">

        <div className="absolute right-[12%] top-12 h-24 w-24 rounded-full bg-[#ffd86b] shadow-[0_0_60px_20px_rgba(255,174,72,0.45)]" />

        <div className="absolute bottom-0 left-0 right-0 h-40">

          <div
            className="absolute bottom-0 left-[-5%] h-48 w-[45%] bg-[#39283b]"
            style={{
              clipPath:
                "polygon(0 100%, 25% 30%, 45% 65%, 65% 10%, 100% 100%)",
            }}
          />

          <div
            className="absolute bottom-0 right-[-5%] h-44 w-[50%] bg-[#2c2234]"
            style={{
              clipPath:
                "polygon(0 100%, 25% 50%, 48% 5%, 65% 55%, 85% 25%, 100% 100%)",
            }}
          />

        </div>

        <div className="absolute left-6 top-6">

          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#ffd86b]">
            Phoenix, Arizona
          </p>

          <h1 className="mt-1 text-4xl font-black drop-shadow-[4px_4px_0px_#29182d]">
            🌵 AZ SIMULATOR
          </h1>

        </div>

      </div>

      {/* HUD */}

      <div className="relative z-10 -mt-5 px-4">

        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 rounded-2xl border-4 border-[#3b2636] bg-[#211a26] p-3 sm:grid-cols-3 md:grid-cols-7">

          <Stat
            icon="📅"
            label="Day"
            value={day.toString()}
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
            icon="⚡"
            label="Energy"
            value={`${energy}%`}
          />

          <Stat
            icon="💧"
            label="Water"
            value={`${water}%`}
          />

          <Stat
            icon="😊"
            label="Happiness"
            value={`${happiness}%`}
          />

          <Stat
            icon="👥"
            label="Population"
            value={population.toString()}
          />

        </div>

      </div>

      {/* GAME */}

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-6">

        <div className="grid gap-5 lg:grid-cols-[250px_1fr]">

          {/* BUILD MENU */}

          <aside className="rounded-2xl border-4 border-[#3b2636] bg-[#2b202d] p-4 shadow-xl">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e8a85a]">
              Town Builder
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Build
            </h2>

            <div className="mt-5 space-y-2">

              {(Object.keys(
                BUILDINGS
              ) as Tile[]).map(
                (type) => {
                  const building =
                    BUILDINGS[
                      type as keyof typeof BUILDINGS
                    ];

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setSelectedTool(
                          type
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-xl border-2 p-3 text-left ${
                        selectedTool ===
                        type
                          ? "border-[#ffd86b] bg-[#8b3f55]"
                          : "border-[#4b3443] bg-[#211a26]"
                      }`}
                    >

                      <span className="flex items-center gap-3">

                        <span className="text-2xl">
                          {
                            building.emoji
                          }
                        </span>

                        <span>

                          <span className="block font-bold">
                            {
                              building.name
                            }
                          </span>

                          <span className="text-xs text-[#cdb7a4]">
                            $
                            {building.cost.toLocaleString()}
                          </span>

                        </span>

                      </span>

                    </button>
                  );
                }
              )}

            </div>

            {/* DAILY FINANCES */}

            <div className="mt-6 rounded-xl border-2 border-[#4b3443] bg-[#211a26] p-3">

              <div className="flex items-center justify-between">

                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e8a85a]">
                  Daily Finances
                </p>

                <span
                  className={`text-sm font-black ${
                    finances.net >= 0
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  {finances.net >= 0
                    ? "+"
                    : "-"}
                  $
                  {Math.abs(
                    finances.net
                  ).toLocaleString()}
                </span>

              </div>

              <div className="mt-3 space-y-2 text-xs">

                <div className="flex justify-between">
                  <span>
                    🏠 Houses
                  </span>
                  <span className="text-green-300">
                    +$
                    {finances.houseIncome.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    👥 Residents
                  </span>
                  <span className="text-green-300">
                    +$
                    {finances.populationIncome.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    🌳 Green spaces
                  </span>
                  <span className="text-green-300">
                    +$
                    {(
                      finances.treeIncome +
                      finances.parkIncome
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    ☀️ Solar
                  </span>
                  <span className="text-green-300">
                    +$
                    {finances.solarIncome.toLocaleString()}
                  </span>
                </div>

                <div className="my-2 border-t border-[#4b3443]" />

                <div className="flex justify-between">
                  <span>
                    🛣️ Roads
                  </span>
                  <span className="text-red-300">
                    -$
                    {finances.roadMaintenance.toLocaleString()}
                  </span>
                </div>

                {finances.heatCost >
                  0 && (
                  <div className="flex justify-between">
                    <span>
                      🔥 Heat
                    </span>
                    <span className="text-red-300">
                      -$
                      {finances.heatCost.toLocaleString()}
                    </span>
                  </div>
                )}

                {finances.waterCost >
                  0 && (
                  <div className="flex justify-between">
                    <span>
                      💧 Water shortage
                    </span>
                    <span className="text-red-300">
                      -$
                      {finances.waterCost.toLocaleString()}
                    </span>
                  </div>
                )}

                {finances.energyCost >
                  0 && (
                  <div className="flex justify-between">
                    <span>
                      ⚡ Energy
                    </span>
                    <span className="text-red-300">
                      -$
                      {finances.energyCost.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="my-2 border-t border-[#4b3443]" />

                <div className="flex justify-between font-black">
                  <span>
                    Net per day
                  </span>

                  <span
                    className={
                      finances.net >=
                      0
                        ? "text-green-300"
                        : "text-red-300"
                    }
                  >
                    {finances.net >=
                    0
                      ? "+"
                      : "-"}
                    $
                    {Math.abs(
                      finances.net
                    ).toLocaleString()}
                  </span>
                </div>

              </div>

            </div>

            {/* CONTROLS */}

            <div className="mt-6 space-y-2">

              <button
                type="button"
                onClick={
                  nextDay
                }
                disabled={
                  !!activeEvent
                }
                className={`w-full rounded-xl px-4 py-3 font-black transition ${
                  activeEvent
                    ? "cursor-not-allowed bg-[#594451] text-[#a9919e]"
                    : "bg-[#e8a85a] text-[#29182d] hover:scale-[1.02]"
                }`}
              >
                🌅 Next Day
              </button>

              <button
                type="button"
                onClick={
                  resetCity
                }
                className="w-full rounded-xl border-2 border-[#8b3f55] bg-[#211a26] px-4 py-3 font-black transition hover:bg-[#8b3f55]"
              >
                🔄 Reset City
              </button>

            </div>

          </aside>

          {/* MAP */}

          <div className="relative overflow-hidden rounded-2xl border-4 border-[#3b2636] bg-[#c77b4b] shadow-2xl">

            <div className="relative p-6">

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

              {/* CITY */}

              <div className="grid grid-cols-8 gap-1 rounded-xl border-4 border-[#5a3030] bg-[#a85f45] p-3">

                {tiles.map(
                  (
                    tile,
                    index
                  ) => {

                    const building =
                      tile ===
                      "empty"
                        ? null
                        : BUILDINGS[
                            tile as keyof typeof BUILDINGS
                          ];

                    const status =
                      buildingStatuses[
                        index
                      ];

                    const affected =
                      activeEvent?.area.includes(
                        index
                      );

                    const statusInfo =
                      STATUS_INFO[
                        status
                      ];

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          build(
                            index
                          )
                        }
                        title={
                          building
                            ? `${building.name} — ${statusInfo.label}`
                            : "Empty desert"
                        }
                        className={`relative aspect-square rounded-md border-2 transition-all ${
                          affected
                            ? "animate-pulse border-red-300 bg-red-500/60 shadow-[0_0_20px_rgba(255,70,70,0.8)]"
                            : status ===
                              "flooded"
                            ? "border-blue-300 bg-blue-500/60"
                            : status ===
                              "hot"
                            ? "border-orange-300 bg-orange-500/50"
                            : status ===
                              "dry"
                            ? "border-yellow-300 bg-yellow-500/40"
                            : status ===
                              "dusty"
                            ? "border-gray-300 bg-gray-500/50"
                            : status ===
                              "overheated"
                            ? "border-orange-200 bg-orange-400/50"
                            : tile ===
                              "road"
                            ? "border-[#5c5961] bg-[#55525b]"
                            : "border-[#a85f45] bg-[#d39154] hover:-translate-y-1 hover:border-[#ffd86b]"
                        }`}
                      >

                        {building && (
                          <span
                            className={`text-3xl ${
                              status !==
                              "normal"
                                ? "opacity-70"
                                : ""
                            }`}
                          >
                            {
                              building.emoji
                            }
                          </span>
                        )}

                        {!building && (
                          <span className="text-xs opacity-30">
                            🌵
                          </span>
                        )}

                        {building &&
                          status !==
                            "normal" && (
                            <span className="absolute right-0 top-0 rounded-bl-md bg-[#211a26] px-1 text-xs">
                              {
                                statusInfo.icon
                              }
                            </span>
                          )}

                        {affected &&
                          building && (
                            <span className="absolute bottom-0 left-0 right-0 rounded-b-md bg-[#211a26]/90 px-1 text-[8px] font-black text-white">
                              AFFECTED
                            </span>
                          )}

                      </button>
                    );
                  }
                )}

              </div>

              {/* MESSAGE */}

              <div className="mt-5 rounded-xl border-2 border-[#5a3030] bg-[#211a26] px-4 py-3">

                <p className="text-sm font-bold">
                  {message}
                </p>

              </div>

            </div>

            {/* EVENT MODAL */}

            {activeEvent &&
              currentEvent && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#17121c]/75 p-5 backdrop-blur-sm">

                  <div className="w-full max-w-lg rounded-3xl border-4 border-[#ffd86b] bg-[#211a26] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.5)]">

                    <div className="text-center">

                      <div className="text-6xl">
                        {
                          currentEvent.icon
                        }
                      </div>

                      <p className="mt-3 text-xs font-black uppercase tracking-[0.3em] text-[#e8a85a]">
                        Phoenix Weather Alert
                      </p>

                      <h2 className="mt-1 text-3xl font-black">
                        {
                          currentEvent.title
                        }
                      </h2>

                      <p className="mt-3 text-[#cdb7a4]">
                        {
                          currentEvent.description
                        }
                      </p>

                      <div className="mt-4 rounded-xl border-2 border-red-400/50 bg-red-500/10 p-3">

                        <p className="text-sm font-bold text-red-200">
                          ⚠️ The highlighted
                          buildings are
                          actually affected.
                        </p>

                      </div>

                    </div>

                    {/* HEAT */}

                    {activeEvent.type ===
                      "heat" && (
                      <div className="mt-5 space-y-2">

                        <ChoiceButton
                          icon="☀️"
                          title="Install Solar Panels"
                          description="Protect your energy supply."
                          cost="$4,000"
                          onClick={() =>
                            handleEventChoice(
                              "solar"
                            )
                          }
                        />

                        <ChoiceButton
                          icon="🌳"
                          title="Plant Shade Trees"
                          description="Cool the affected area."
                          cost="$1,000"
                          onClick={() =>
                            handleEventChoice(
                              "trees"
                            )
                          }
                        />

                        <ChoiceButton
                          icon="🏥"
                          title="Open Cooling Center"
                          description="Protect residents from the heat."
                          cost="$2,000"
                          onClick={() =>
                            handleEventChoice(
                              "cooling"
                            )
                          }
                        />

                        <ChoiceButton
                          icon="❌"
                          title="Do Nothing"
                          description="Accept the consequences."
                          onClick={() =>
                            handleEventChoice(
                              "ignore"
                            )
                          }
                        />

                      </div>
                    )}

                    {/* DROUGHT */}

                    {activeEvent.type ===
                      "drought" && (
                      <div className="mt-5 space-y-2">

                        <ChoiceButton
                          icon="💧"
                          title="Start Water Conservation"
                          description="Reduce water demand."
                          onClick={() =>
                            handleEventChoice(
                              "conserve"
                            )
                          }
                        />

                        <ChoiceButton
                          icon="🌳"
                          title="Use Native Landscaping"
                          description="Improve drought resilience."
                          cost="$1,000"
                          onClick={() =>
                            handleEventChoice(
                              "trees"
                            )
                          }
                        />

                        <ChoiceButton
                          icon="❌"
                          title="Do Nothing"
                          description="Accept the water shortage."
                          onClick={() =>
                            handleEventChoice(
                              "ignore"
                            )
                          }
                        />

                      </div>
                    )}

                    {/* MONSOON */}

                    {activeEvent.type ===
                      "monsoon" && (
                      <div className="mt-5 space-y-2">

                        <ChoiceButton
                          icon="🌧️"
                          title="Improve Drainage"
                          description="Protect the neighborhood from flooding."
                          cost="$3,000"
                          onClick={() =>
                            handleEventChoice(
                              "drainage"
                            )
                          }
                        />

                        <ChoiceButton
                          icon="🌳"
                          title="Plant More Trees"
                          description="Help absorb stormwater."
                          cost="$1,000"
                          onClick={() =>
                            handleEventChoice(
                              "trees"
                            )
                          }
                        />

                        <ChoiceButton
                          icon="❌"
                          title="Do Nothing"
                          description="Risk flooding damage."
                          onClick={() =>
                            handleEventChoice(
                              "ignore"
                            )
                          }
                        />

                      </div>
                    )}

                    {/* DUST */}

                    {activeEvent.type ===
                      "dust" && (
                      <div className="mt-5 space-y-2">

                        <ChoiceButton
                          icon="🌳"
                          title="Plant Windbreak Trees"
                          description="Reduce the impact of strong winds."
                          cost="$1,000"
                          onClick={() =>
                            handleEventChoice(
                              "trees"
                            )
                          }
                        />

                        <ChoiceButton
                          icon="❌"
                          title="Do Nothing"
                          description="Let the storm pass naturally."
                          onClick={() =>
                            handleEventChoice(
                              "ignore"
                            )
                          }
                        />

                      </div>
                    )}

                  </div>

                </div>
              )}

          </div>

        </div>

      </section>

    </main>
  );
}

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
    <div className="rounded-xl border-2 border-[#4b3443] bg-[#2b202d] px-3 py-2">

      <p className="text-xs font-bold text-[#bda696]">
        {icon} {label}
      </p>

      <p className="mt-1 font-black text-[#fff4d6]">
        {value}
      </p>

    </div>
  );
}

function ChoiceButton({
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
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border-2 border-[#4b3443] bg-[#2b202d] p-3 text-left transition hover:border-[#ffd86b] hover:bg-[#8b3f55]"
    >

      <span className="text-2xl">
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