"use client";

import { useState } from "react";

type Tile =
  | "empty"
  | "house"
  | "tree"
  | "solar"
  | "park"
  | "road";

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

  const [activeEvent, setActiveEvent] =
    useState<GameEvent | null>(null);

  const [message, setMessage] = useState(
    "Your new Phoenix neighborhood is ready."
  );

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

    const startRow =
      Math.floor(Math.random() * 6);

    const startColumn =
      Math.floor(Math.random() * 6);

    const area = [
      startRow * 8 + startColumn,
      startRow * 8 + startColumn + 1,
      (startRow + 1) * 8 + startColumn,
      (startRow + 1) * 8 +
        startColumn +
        1,
    ];

    setActiveEvent({
      type: randomEvent,
      area,
    });
  }

  function nextDay() {
    if (activeEvent) {
      setMessage(
        "⚠️ You need to respond to the current event first!"
      );
      return;
    }

    const newDay = day + 1;

    setDay(newDay);

    /*
      Every third day creates a weather challenge.
    */

    if (newDay % 3 === 0) {
      createEvent();
      return;
    }

    /*
      Normal daily changes.
    */

    setWater((value) =>
      Math.max(0, value - 2)
    );

    setEnergy((value) =>
      Math.max(0, value - 2)
    );

    setMessage(
      `Day ${newDay} begins. The neighborhood is growing.`
    );
  }

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

    const event = activeEvent.type;

    /*
      HEAT WAVE
    */

    if (event === "heat") {
      if (choice === "solar") {
        if (budget < 4000) {
          setMessage(
            "You don't have enough money for solar panels."
          );
          return;
        }

        setBudget((value) => value - 4000);

        setEnergy((value) =>
          Math.min(100, value + 10)
        );

        setTemperature((value) =>
          Math.max(70, value - 2)
        );

        setMessage(
          "☀️ Solar panels helped the neighborhood handle the heat."
        );
      }

      if (choice === "trees") {
        if (budget < 1000) {
          setMessage(
            "You don't have enough money to plant shade trees."
          );
          return;
        }

        setBudget((value) => value - 1000);

        setTemperature((value) =>
          Math.max(70, value - 4)
        );

        setHappiness((value) =>
          Math.min(100, value + 5)
        );

        setMessage(
          "🌳 New shade trees helped cool the affected area."
        );
      }

      if (choice === "cooling") {
        if (budget < 2000) {
          setMessage(
            "You don't have enough money for a cooling center."
          );
          return;
        }

        setBudget((value) => value - 2000);

        setHappiness((value) =>
          Math.min(100, value + 8)
        );

        setEnergy((value) =>
          Math.max(0, value - 3)
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
          "🔥 The heat wave hit the neighborhood hard."
        );
      }
    }

    /*
      DROUGHT
    */

    if (event === "drought") {
      if (choice === "conserve") {
        setWater((value) =>
          Math.min(100, value + 8)
        );

        setHappiness((value) =>
          Math.max(0, value - 1)
        );

        setMessage(
          "💧 Water conservation helped your city get through the shortage."
        );
      }

      if (choice === "trees") {
        if (budget < 1000) {
          setMessage(
            "You don't have enough money."
          );
          return;
        }

        setBudget((value) => value - 1000);

        setWater((value) =>
          Math.max(0, value - 3)
        );

        setHappiness((value) =>
          Math.min(100, value + 5)
        );

        setMessage(
          "🌳 Native landscaping reduced water demand."
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
          "💧 The drought caused serious water shortages."
        );
      }
    }

    /*
      MONSOON
    */

    if (event === "monsoon") {
      if (choice === "drainage") {
        if (budget < 3000) {
          setMessage(
            "You don't have enough money for drainage improvements."
          );
          return;
        }

        setBudget((value) => value - 3000);

        setWater((value) =>
          Math.min(100, value + 12)
        );

        setHappiness((value) =>
          Math.min(100, value + 4)
        );

        setMessage(
          "🌧️ Your drainage system handled the monsoon."
        );
      }

      if (choice === "trees") {
        if (budget < 1000) {
          setMessage(
            "You don't have enough money."
          );
          return;
        }

        setBudget((value) => value - 1000);

        setWater((value) =>
          Math.min(100, value + 8)
        );

        setHappiness((value) =>
          Math.min(100, value + 3)
        );

        setMessage(
          "🌳 Trees helped absorb some of the stormwater."
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
          "🌧️ Flooding damaged part of the neighborhood."
        );
      }
    }

    /*
      DUST STORM
    */

    if (event === "dust") {
      if (choice === "trees") {
        if (budget < 1000) {
          setMessage(
            "You don't have enough money."
          );
          return;
        }

        setBudget((value) => value - 1000);

        setHappiness((value) =>
          Math.min(100, value + 5)
        );

        setEnergy((value) =>
          Math.min(100, value + 3)
        );

        setMessage(
          "🌳 Trees acted as a windbreak during the dust storm."
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
          "💨 The dust storm made life difficult for residents."
        );
      }
    }

    setActiveEvent(null);
  }

  function resetCity() {
    const confirmed = window.confirm(
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
    setTiles(Array(64).fill("empty"));
    setActiveEvent(null);

    setMessage(
      "🌵 Your new Phoenix neighborhood is ready."
    );
  }

  function build(index: number) {
    if (tiles[index] !== "empty") return;

    if (activeEvent?.area.includes(index)) {
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

    newTiles[index] = selectedTool;

    setTiles(newTiles);

    setBudget(
      (value) => value - building.cost
    );

    if (selectedTool === "house") {
      setPopulation(
        (value) => value + 2
      );

      setHappiness(
        (value) =>
          Math.min(100, value + 3)
      );

      setEnergy(
        (value) =>
          Math.max(0, value - 5)
      );

      setWater(
        (value) =>
          Math.max(0, value - 3)
      );
    }

    if (selectedTool === "tree") {
      setTemperature(
        (value) =>
          Math.max(70, value - 2)
      );

      setHappiness(
        (value) =>
          Math.min(100, value + 2)
      );
    }

    if (selectedTool === "park") {
      setTemperature(
        (value) =>
          Math.max(70, value - 3)
      );

      setHappiness(
        (value) =>
          Math.min(100, value + 5)
      );
    }

    if (selectedTool === "solar") {
      setEnergy(
        (value) =>
          Math.min(100, value + 6)
      );
    }

    setMessage(
      `${building.name} was added to your neighborhood.`
    );
  }

  const currentEvent =
    activeEvent
      ? EVENTS[activeEvent.type]
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

        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">

          {/* BUILD MENU */}

          <aside className="rounded-2xl border-4 border-[#3b2636] bg-[#2b202d] p-4 shadow-xl">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e8a85a]">
              Town Builder
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Build
            </h2>

            <div className="mt-5 space-y-2">

              {(Object.keys(BUILDINGS) as Tile[]).map(
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
                        setSelectedTool(type)
                      }
                      className={`flex w-full items-center justify-between rounded-xl border-2 p-3 text-left ${
                        selectedTool === type
                          ? "border-[#ffd86b] bg-[#8b3f55]"
                          : "border-[#4b3443] bg-[#211a26]"
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
                            ${building.cost.toLocaleString()}
                          </span>

                        </span>

                      </span>

                    </button>
                  );
                }
              )}

            </div>


            {/* GAME CONTROLS */}

            <div className="mt-6 space-y-2">

              <button
                type="button"
                onClick={nextDay}
                disabled={!!activeEvent}
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
                onClick={resetCity}
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

                {tiles.map((tile, index) => {

                  const building =
                    tile === "empty"
                      ? null
                      : BUILDINGS[
                          tile as keyof typeof BUILDINGS
                        ];

                  const affected =
                    activeEvent?.area.includes(
                      index
                    );

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => build(index)}
                      className={`relative aspect-square rounded-md border-2 transition-all ${
                        affected
                          ? "animate-pulse border-red-300 bg-red-500/70 shadow-[0_0_20px_rgba(255,70,70,0.9)]"
                          : tile === "road"
                          ? "border-[#5c5961] bg-[#55525b]"
                          : "border-[#a85f45] bg-[#d39154] hover:-translate-y-1 hover:border-[#ffd86b]"
                      }`}
                    >

                      {affected && (
                        <span className="absolute inset-0 flex items-center justify-center text-2xl">
                          {currentEvent?.icon}
                        </span>
                      )}

                      {!affected &&
                        building && (
                          <span className="text-3xl">
                            {building.emoji}
                          </span>
                        )}

                      {!affected &&
                        tile === "empty" && (
                          <span className="text-xs opacity-30">
                            🌵
                          </span>
                        )}

                    </button>
                  );
                })}

              </div>


              {/* MESSAGE */}

              <div className="mt-5 rounded-xl border-2 border-[#5a3030] bg-[#211a26] px-4 py-3">

                <p className="text-sm font-bold">
                  {message}
                </p>

              </div>

            </div>


            {/* EVENT MODAL */}

            {activeEvent && currentEvent && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#17121c]/75 p-5 backdrop-blur-sm">

                <div className="w-full max-w-lg rounded-3xl border-4 border-[#ffd86b] bg-[#211a26] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.5)]">

                  <div className="text-center">

                    <div className="text-6xl">
                      {currentEvent.icon}
                    </div>

                    <p className="mt-3 text-xs font-black uppercase tracking-[0.3em] text-[#e8a85a]">
                      Phoenix Weather Alert
                    </p>

                    <h2 className="mt-1 text-3xl font-black">
                      {currentEvent.title}
                    </h2>

                    <p className="mt-3 text-[#cdb7a4]">
                      {currentEvent.description}
                    </p>

                    <div className="mt-4 rounded-xl border-2 border-red-400/50 bg-red-500/10 p-3">

                      <p className="text-sm font-bold text-red-200">
                        ⚠️ Affected area highlighted
                        on your map.
                      </p>

                    </div>

                  </div>


                  {/* HEAT OPTIONS */}

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


                  {/* DROUGHT OPTIONS */}

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
                        title="Plant Native Landscaping"
                        description="Reduce long-term water use."
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


                  {/* MONSOON OPTIONS */}

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


                  {/* DUST OPTIONS */}

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