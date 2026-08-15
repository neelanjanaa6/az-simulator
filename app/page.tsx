"use client";

import { useState } from "react";

type BuildingType =
  | "tree"
  | "house"
  | "parking"
  | "shade"
  | "solar"
  | "desert";

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

export default function Home() {
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

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-gray-900">

      {/* HEADER */}

      <div className="mx-auto max-w-7xl">

        <h1 className="text-4xl font-bold text-gray-950">
          🌵 AZ Simulator
        </h1>

        <p className="mt-2 text-gray-700">
          Build a better, cooler Arizona neighborhood.
        </p>

      </div>


      {/* STATS */}

      <div className="mx-auto mt-6 grid max-w-7xl grid-cols-5 gap-3">

        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm font-medium text-gray-700">
            🌡️ Temperature
          </p>
          <p className="text-2xl font-bold">
            {temperature}°F
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm font-medium text-gray-700">
            💰 Budget
          </p>
          <p className="text-2xl font-bold">
            ${budget.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm font-medium text-gray-700">
            💧 Water
          </p>
          <p className="text-2xl font-bold">
            {waterUsage}%
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm font-medium text-gray-700">
            ⚡ Energy
          </p>
          <p className="text-2xl font-bold">
            {energyUsage}%
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm font-medium text-gray-700">
            😊 Happiness
          </p>
          <p className="text-2xl font-bold">
            {happiness}%
          </p>
        </div>

      </div>


      {/* MAIN */}

      <div className="mx-auto mt-6 grid max-w-7xl grid-cols-4 gap-6">


        {/* BUILD MENU */}

        <section className="rounded-xl bg-white p-5 shadow">

          <h2 className="text-xl font-bold text-gray-950">
            🏗️ Build
          </h2>

          <p className="mt-2 text-sm text-gray-700">
            Choose an item, then click the map.
          </p>


          <div className="mt-5 space-y-3">

            <button
              type="button"
              onClick={() => setSelectedBuilding("tree")}
              className={
                selectedBuilding === "tree"
                  ? "w-full rounded-lg bg-blue-600 p-4 text-left text-white"
                  : "w-full rounded-lg border-2 border-gray-300 bg-white p-4 text-left text-gray-900 hover:bg-gray-100"
              }
            >
              <div className="text-lg font-bold">
                🌳 Tree
              </div>

              <div className="text-sm">
                $500 • -2°F
              </div>
            </button>


            <button
              type="button"
              onClick={() => setSelectedBuilding("house")}
              className={
                selectedBuilding === "house"
                  ? "w-full rounded-lg bg-blue-600 p-4 text-left text-white"
                  : "w-full rounded-lg border-2 border-gray-300 bg-white p-4 text-left text-gray-900 hover:bg-gray-100"
              }
            >
              <div className="text-lg font-bold">
                🏠 House
              </div>

              <div className="text-sm">
                $5,000 • +1°F
              </div>
            </button>


            <button
              type="button"
              onClick={() => setSelectedBuilding("parking")}
              className={
                selectedBuilding === "parking"
                  ? "w-full rounded-lg bg-blue-600 p-4 text-left text-white"
                  : "w-full rounded-lg border-2 border-gray-300 bg-white p-4 text-left text-gray-900 hover:bg-gray-100"
              }
            >
              <div className="text-lg font-bold">
                🅿️ Parking
              </div>

              <div className="text-sm">
                $2,000 • +2°F
              </div>
            </button>


            <button
              type="button"
              onClick={() => setSelectedBuilding("shade")}
              className={
                selectedBuilding === "shade"
                  ? "w-full rounded-lg bg-blue-600 p-4 text-left text-white"
                  : "w-full rounded-lg border-2 border-gray-300 bg-white p-4 text-left text-gray-900 hover:bg-gray-100"
              }
            >
              <div className="text-lg font-bold">
                ⛱️ Shade
              </div>

              <div className="text-sm">
                $2,500 • -3°F
              </div>
            </button>


            <button
              type="button"
              onClick={() => setSelectedBuilding("solar")}
              className={
                selectedBuilding === "solar"
                  ? "w-full rounded-lg bg-blue-600 p-4 text-left text-white"
                  : "w-full rounded-lg border-2 border-gray-300 bg-white p-4 text-left text-gray-900 hover:bg-gray-100"
              }
            >
              <div className="text-lg font-bold">
                ☀️ Solar
              </div>

              <div className="text-sm">
                $4,000 • -3 Energy
              </div>
            </button>


            <button
              type="button"
              onClick={() => setSelectedBuilding("desert")}
              className={
                selectedBuilding === "desert"
                  ? "w-full rounded-lg bg-blue-600 p-4 text-left text-white"
                  : "w-full rounded-lg border-2 border-gray-300 bg-white p-4 text-left text-gray-900 hover:bg-gray-100"
              }
            >
              <div className="text-lg font-bold">
                🌵 Desert Landscaping
              </div>

              <div className="text-sm">
                $1,000 • -2 Water
              </div>
            </button>

          </div>


          <div className="mt-5 rounded-lg bg-gray-100 p-4">

            <p className="text-sm font-medium text-gray-700">
              Selected:
            </p>

            <p className="mt-1 text-xl font-bold text-gray-950">
              {buildings[selectedBuilding].emoji}{" "}
              {buildings[selectedBuilding].name}
            </p>

          </div>

        </section>


        {/* MAP */}

        <section className="col-span-2 rounded-xl bg-white p-5 shadow">

          <h2 className="text-xl font-bold text-gray-950">
            🏙️ Your Neighborhood
          </h2>

          <p className="mt-1 text-sm text-gray-700">
            Click an empty square to build.
          </p>


          <div className="mx-auto mt-6 grid max-w-xl grid-cols-8 gap-1 rounded-xl bg-gray-200 p-2">

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
                  className="flex aspect-square items-center justify-center rounded-md bg-gray-300 text-2xl hover:bg-gray-400"
                >
                  {emoji}
                </button>
              );

            })}

          </div>

        </section>


        {/* NEWS */}

        <section className="rounded-xl bg-white p-5 shadow">

          <h2 className="text-xl font-bold text-gray-950">
            📰 Arizona News
          </h2>


          <div className="mt-4 space-y-3">

            <div className="rounded-lg bg-red-100 p-4">

              <p className="font-bold text-red-900">
                🔥 Heat Wave Warning
              </p>

              <p className="mt-1 text-sm text-gray-800">
                Temperatures could reach 115°F this week.
              </p>

            </div>


            <div className="rounded-lg bg-blue-100 p-4">

              <p className="font-bold text-blue-900">
                💧 Water Conservation
              </p>

              <p className="mt-1 text-sm text-gray-800">
                Desert landscaping can reduce water usage.
              </p>

            </div>


            <div className="rounded-lg bg-yellow-100 p-4">

              <p className="font-bold text-yellow-900">
                ☀️ Solar Opportunity
              </p>

              <p className="mt-1 text-sm text-gray-800">
                Solar power can reduce energy demand.
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}