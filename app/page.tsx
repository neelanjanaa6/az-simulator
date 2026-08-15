"use client";

import { useState } from "react";

type BuildingType =
  | "tree"
  | "house"
  | "parking"
  | "shade"
  | "solar"
  | "desert";

type CharacterType = "maya" | "carlos" | "linda";

const buildings = {
  tree: {
    emoji: "🌳",
    name: "Tree",
    cost: 500,
    temperature: -2,
    water: 1,
    energy: 0,
    happiness: 2,
  },

  house: {
    emoji: "🏠",
    name: "House",
    cost: 5000,
    temperature: 1,
    water: 2,
    energy: 3,
    happiness: 5,
  },

  parking: {
    emoji: "🅿️",
    name: "Parking",
    cost: 2000,
    temperature: 2,
    water: 0,
    energy: 0,
    happiness: -2,
  },

  shade: {
    emoji: "⛱️",
    name: "Shade",
    cost: 2500,
    temperature: -3,
    water: 0,
    energy: 0,
    happiness: 3,
  },

  solar: {
    emoji: "☀️",
    name: "Solar",
    cost: 4000,
    temperature: 0,
    water: 0,
    energy: -3,
    happiness: 2,
  },

  desert: {
    emoji: "🌵",
    name: "Desert Landscaping",
    cost: 1000,
    temperature: -1,
    water: -2,
    energy: 0,
    happiness: 1,
  },
};

const characters = {
  maya: {
    emoji: "👩",
    name: "Maya",
    role: "Parent",
    color: "bg-pink-100",
    textColor: "text-pink-900",
    dialogue:
      "Hi! I'm Maya. I'm moving here with my kids. I'm excited about our new neighborhood, but I'm worried about the heat. Where will my kids be able to play outside?",
    need: "🌳 Shade and trees",
  },

  carlos: {
    emoji: "👨",
    name: "Carlos",
    role: "Business Owner",
    color: "bg-blue-100",
    textColor: "text-blue-900",
    dialogue:
      "Hey! I'm Carlos. I'm planning to open a small business here. Phoenix summers can make energy bills really expensive. Can we make this neighborhood more energy efficient?",
    need: "☀️ Solar energy",
  },

  linda: {
    emoji: "👵",
    name: "Linda",
    role: "Longtime Resident",
    color: "bg-green-100",
    textColor: "text-green-900",
    dialogue:
      "I've lived in Arizona for decades. Water is something we can't take for granted. I hope this new community can use water wisely.",
    need: "🌵 Desert landscaping",
  },
};

export default function Home() {
  const [started, setStarted] = useState(false);

  const [temperature, setTemperature] = useState(110);
  const [budget, setBudget] = useState(100000);
  const [waterUsage, setWaterUsage] = useState(100);
  const [energyUsage, setEnergyUsage] = useState(100);
  const [happiness, setHappiness] = useState(50);

  const [selectedBuilding, setSelectedBuilding] =
    useState<BuildingType>("tree");

  const [city, setCity] = useState<string[]>(
    Array(64).fill("empty")
  );

  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterType | null>(null);

  function placeBuilding(index: number) {
    if (city[index] !== "empty") {
      return;
    }

    const building = buildings[selectedBuilding];

    if (budget < building.cost) {
      alert("You don't have enough money!");
      return;
    }

    const newCity = [...city];

    newCity[index] = selectedBuilding;

    setCity(newCity);

    setBudget(budget - building.cost);

    setTemperature(
      Math.max(70, temperature + building.temperature)
    );

    setWaterUsage(
      Math.max(
        0,
        Math.min(100, waterUsage + building.water)
      )
    );

    setEnergyUsage(
      Math.max(
        0,
        Math.min(100, energyUsage + building.energy)
      )
    );

    setHappiness(
      Math.max(
        0,
        Math.min(100, happiness + building.happiness)
      )
    );
  }

  if (!started) {
    return (
      <main className="min-h-screen overflow-hidden bg-gradient-to-b from-orange-900 via-orange-500 to-amber-200">

        <div className="flex min-h-screen items-center justify-center px-6">

          <div className="w-full max-w-3xl text-center text-white">

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-100">
              Phoenix, Arizona
            </p>

            <h1 className="mt-4 text-6xl font-black drop-shadow-lg md:text-8xl">
              🌵
            </h1>

            <h2 className="mt-2 text-5xl font-black md:text-6xl">
              AZ SIMULATOR
            </h2>

            <p className="mt-3 text-xl font-bold text-orange-100">
              Summer 2026
            </p>

            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/30 bg-black/20 p-8 shadow-2xl backdrop-blur-sm">

              <p className="text-lg leading-8">
                The sun is already blazing.
              </p>

              <p className="mt-4 text-lg leading-8">
                In front of you is a stretch of empty
                Arizona desert.
              </p>

              <p className="mt-4 text-lg leading-8">
                A new community is about to be built here.
              </p>

              <p className="mt-4 text-lg leading-8">
                But Phoenix summers are getting hotter,
                water is limited, and monsoon storms can
                change everything.
              </p>

              <div className="my-7 h-px bg-white/30" />

              <p className="text-sm font-bold uppercase tracking-widest text-orange-200">
                Your Mission
              </p>

              <p className="mt-3 text-2xl font-black">
                Build a neighborhood that can survive
                the Phoenix heat.
              </p>

              <div className="mt-7 rounded-2xl bg-white/10 p-5">

                <p className="text-sm uppercase tracking-widest text-orange-200">
                  Starting Resources
                </p>

                <p className="mt-2 text-3xl font-black">
                  💰 $100,000
                </p>

              </div>

              <button
                type="button"
                onClick={() => setStarted(true)}
                className="mt-8 rounded-2xl bg-white px-8 py-4 text-lg font-black text-orange-900 shadow-xl transition hover:scale-105 hover:bg-orange-50"
              >
                🌵 BEGIN YOUR COMMUNITY →
              </button>

            </div>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-200 via-amber-100 to-orange-50 text-gray-900">

      {/* HEADER */}

      <header className="border-b border-orange-300 bg-orange-900 px-6 py-5 text-white shadow-lg">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <div>

            <p className="text-sm font-bold uppercase tracking-widest text-orange-200">
              Phoenix, Arizona • Summer 2026
            </p>

            <h1 className="mt-1 text-4xl font-black">
              🌵 AZ SIMULATOR
            </h1>

            <p className="mt-1 text-orange-100">
              Build a neighborhood that can survive the heat.
            </p>

          </div>

          <div className="hidden rounded-xl bg-orange-800 px-5 py-3 text-right md:block">

            <p className="text-xs uppercase text-orange-200">
              Current Weather
            </p>

            <p className="text-2xl font-black">
              ☀️ {temperature}°F
            </p>

            <p className="text-xs text-orange-200">
              Extreme Heat
            </p>

          </div>

        </div>

      </header>


      {/* STORY */}

      <section className="mx-auto max-w-7xl px-6 pt-8">

        <div className="rounded-2xl border border-orange-300 bg-orange-100 p-6 shadow-md">

          <p className="text-sm font-bold uppercase tracking-wide text-orange-800">
            📖 Your Story
          </p>

          <h2 className="mt-2 text-2xl font-black text-orange-950">
            The land is waiting.
          </h2>

          <p className="mt-2 max-w-3xl leading-7 text-orange-950">
            A new community is being built in Phoenix.
            The desert is empty, but the summer heat is not.
            You have a limited budget and a growing group
            of future residents depending on you.
          </p>

          <p className="mt-3 font-bold text-orange-900">
            Talk to your future residents before you build.
          </p>

        </div>

      </section>


      {/* CHARACTERS */}

      <section className="mx-auto mt-6 max-w-7xl px-6">

        <div className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-black">
                👥 Your Future Residents
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Click someone to hear what they need.
              </p>
            </div>

          </div>


          <div className="mt-5 grid gap-4 md:grid-cols-3">

            {(Object.keys(characters) as CharacterType[]).map(
              (characterKey) => {

                const character = characters[characterKey];

                return (

                  <button
                    type="button"
                    key={characterKey}
                    onClick={() =>
                      setSelectedCharacter(characterKey)
                    }
                    className={`rounded-2xl ${character.color} p-5 text-left transition hover:-translate-y-1 hover:shadow-lg`}
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl shadow">
                        {character.emoji}
                      </div>

                      <div>

                        <p className={`text-xl font-black ${character.textColor}`}>
                          {character.name}
                        </p>

                        <p className="text-sm font-bold text-gray-700">
                          {character.role}
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 rounded-xl bg-white/70 p-3">

                      <p className="text-xs font-bold uppercase text-gray-600">
                        Main Concern
                      </p>

                      <p className="mt-1 font-bold">
                        {character.need}
                      </p>

                    </div>

                  </button>

                );
              }
            )}

          </div>

        </div>

      </section>


      {/* DIALOGUE BOX */}

      {selectedCharacter && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">

          <div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl">

            <div className="flex items-center gap-4">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-5xl">
                {characters[selectedCharacter].emoji}
              </div>

              <div>

                <p className="text-2xl font-black">
                  {characters[selectedCharacter].name}
                </p>

                <p className="font-bold text-gray-600">
                  {characters[selectedCharacter].role}
                </p>

              </div>

            </div>


            <div className="mt-6 rounded-2xl bg-gray-100 p-6">

              <p className="text-lg leading-8 text-gray-900">
                "{characters[selectedCharacter].dialogue}"
              </p>

            </div>


            <div className="mt-5 rounded-xl bg-orange-50 p-4">

              <p className="text-sm font-bold text-orange-800">
                💡 THEIR PRIORITY
              </p>

              <p className="mt-1 font-black text-orange-950">
                {characters[selectedCharacter].need}
              </p>

            </div>


            <button
              type="button"
              onClick={() => setSelectedCharacter(null)}
              className="mt-6 w-full rounded-xl bg-orange-700 px-5 py-3 font-black text-white hover:bg-orange-800"
            >
              Continue Building →
            </button>

          </div>

        </div>

      )}


      {/* STATS */}

      <section className="mx-auto mt-6 grid max-w-7xl grid-cols-2 gap-3 px-6 md:grid-cols-5">

        <div className="rounded-xl border border-red-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-gray-600">
            🌡️ HEAT
          </p>

          <p className="mt-1 text-2xl font-black text-red-700">
            {temperature}°F
          </p>
        </div>


        <div className="rounded-xl border border-yellow-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-gray-600">
            💰 BUDGET
          </p>

          <p className="mt-1 text-2xl font-black">
            ${budget.toLocaleString()}
          </p>
        </div>


        <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-gray-600">
            💧 WATER
          </p>

          <p className="mt-1 text-2xl font-black text-blue-700">
            {waterUsage}%
          </p>
        </div>


        <div className="rounded-xl border border-yellow-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-gray-600">
            ⚡ ENERGY
          </p>

          <p className="mt-1 text-2xl font-black text-yellow-700">
            {energyUsage}%
          </p>
        </div>


        <div className="rounded-xl border border-green-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-gray-600">
            😊 COMMUNITY
          </p>

          <p className="mt-1 text-2xl font-black text-green-700">
            {happiness}%
          </p>
        </div>

      </section>


      {/* GAME */}

      <div className="mx-auto mt-6 grid max-w-7xl gap-6 px-6 pb-12 lg:grid-cols-4">


        {/* BUILD MENU */}

        <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg">

          <h2 className="text-xl font-black">
            🏗️ BUILD
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Choose something to build.
          </p>


          <div className="mt-5 space-y-3">

            <button
              type="button"
              onClick={() => setSelectedBuilding("tree")}
              className={
                selectedBuilding === "tree"
                  ? "w-full rounded-xl bg-green-700 p-4 text-left text-white shadow-md"
                  : "w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-left hover:bg-green-50"
              }
            >
              <div className="text-lg font-black">
                🌳 Tree
              </div>

              <div className="text-sm">
                $500 • Cool the area
              </div>
            </button>


            <button
              type="button"
              onClick={() => setSelectedBuilding("house")}
              className={
                selectedBuilding === "house"
                  ? "w-full rounded-xl bg-blue-700 p-4 text-left text-white shadow-md"
                  : "w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-left hover:bg-blue-50"
              }
            >
              <div className="text-lg font-black">
                🏠 House
              </div>

              <div className="text-sm">
                $5,000 • +5 happiness
              </div>
            </button>


            <button
              type="button"
              onClick={() => setSelectedBuilding("shade")}
              className={
                selectedBuilding === "shade"
                  ? "w-full rounded-xl bg-purple-700 p-4 text-left text-white shadow-md"
                  : "w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-left hover:bg-purple-50"
              }
            >
              <div className="text-lg font-black">
                ⛱️ Shade
              </div>

              <div className="text-sm">
                $2,500 • Cool the area
              </div>
            </button>


            <button
              type="button"
              onClick={() => setSelectedBuilding("solar")}
              className={
                selectedBuilding === "solar"
                  ? "w-full rounded-xl bg-yellow-600 p-4 text-left text-white shadow-md"
                  : "w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-left hover:bg-yellow-50"
              }
            >
              <div className="text-lg font-black">
                ☀️ Solar
              </div>

              <div className="text-sm">
                $4,000 • Reduce energy
              </div>
            </button>


            <button
              type="button"
              onClick={() => setSelectedBuilding("parking")}
              className={
                selectedBuilding === "parking"
                  ? "w-full rounded-xl bg-gray-700 p-4 text-left text-white shadow-md"
                  : "w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-left hover:bg-gray-100"
              }
            >
              <div className="text-lg font-black">
                🅿️ Parking
              </div>

              <div className="text-sm">
                $2,000 • Increases heat
              </div>
            </button>


            <button
              type="button"
              onClick={() => setSelectedBuilding("desert")}
              className={
                selectedBuilding === "desert"
                  ? "w-full rounded-xl bg-orange-700 p-4 text-left text-white shadow-md"
                  : "w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-left hover:bg-orange-50"
              }
            >
              <div className="text-lg font-black">
                🌵 Desert Landscaping
              </div>

              <div className="text-sm">
                $1,000 • Save water
              </div>
            </button>

          </div>


          <div className="mt-5 rounded-xl bg-orange-50 p-4">

            <p className="text-xs font-bold uppercase text-orange-700">
              Selected
            </p>

            <p className="mt-1 text-lg font-black text-orange-950">
              {buildings[selectedBuilding].emoji}{" "}
              {buildings[selectedBuilding].name}
            </p>

            <p className="mt-1 text-sm text-gray-700">
              Click an empty tile on your land to build.
            </p>

          </div>

        </section>


        {/* MAP */}

        <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg lg:col-span-2">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-wide text-orange-700">
                📍 Phoenix, Arizona
              </p>

              <h2 className="text-2xl font-black">
                Your Neighborhood
              </h2>

            </div>

            <div className="rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-800">
              🔥 {temperature}°F
            </div>

          </div>


          <div className="mt-5 rounded-2xl border-4 border-orange-300 bg-gradient-to-b from-amber-200 to-yellow-100 p-4">

            <div className="grid grid-cols-8 gap-1">

              {city.map((tile, index) => {

                let emoji = "";

                if (tile === "tree") {
                  emoji = "🌳";
                }

                if (tile === "house") {
                  emoji = "🏠";
                }

                if (tile === "parking") {
                  emoji = "🅿️";
                }

                if (tile === "shade") {
                  emoji = "⛱️";
                }

                if (tile === "solar") {
                  emoji = "☀️";
                }

                if (tile === "desert") {
                  emoji = "🌵";
                }

                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => placeBuilding(index)}
                    className="flex aspect-square items-center justify-center rounded-lg border border-orange-200 bg-amber-100 text-2xl shadow-sm transition hover:scale-105 hover:bg-amber-50"
                  >
                    {emoji || "·"}
                  </button>
                );

              })}

            </div>

          </div>


          <div className="mt-4 rounded-xl bg-orange-50 p-4">

            <p className="font-bold text-orange-950">
              💡 Phoenix Strategy
            </p>

            <p className="mt-1 text-sm text-orange-900">
              Listen to your residents. Their needs can
              help you decide what to build.
            </p>

          </div>

        </section>


        {/* NEWS */}

        <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg">

          <h2 className="text-xl font-black">
            📰 PHOENIX TODAY
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            What's happening around your city?
          </p>


          <div className="mt-5 space-y-3">

            <div className="rounded-xl border border-red-200 bg-red-50 p-4">

              <p className="font-black text-red-900">
                🔥 EXTREME HEAT
              </p>

              <p className="mt-1 text-sm text-red-950">
                Phoenix is facing intense summer heat.
                Your neighborhood needs shade and cooling.
              </p>

            </div>


            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

              <p className="font-black text-blue-900">
                💧 WATER
              </p>

              <p className="mt-1 text-sm text-blue-950">
                Water conservation is important in
                Arizona's desert climate.
              </p>

            </div>


            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">

              <p className="font-black text-yellow-900">
                ☀️ SOLAR
              </p>

              <p className="mt-1 text-sm text-yellow-950">
                Arizona's sunshine creates opportunities
                for solar energy.
              </p>

            </div>


            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">

              <p className="font-black text-purple-900">
                🌧️ MONSOON
              </p>

              <p className="mt-1 text-sm text-purple-950">
                Monsoon storms can bring intense rain,
                wind, and dust.
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}