"use client";

import { useState } from "react";

export default function Home() {
  const [temperature, setTemperature] = useState(110);
  const [budget, setBudget] = useState(100000);
  const [waterUsage, setWaterUsage] = useState(100);
  const [energyUsage, setEnergyUsage] = useState(100);
  const [happiness, setHappiness] = useState(50);

  const [city, setCity] = useState<string[]>(
    Array(64).fill("empty")
  );

  function plantTree(index: number) {
    if (city[index] === "tree") {
      return;
    }

    if (budget < 500) {
      alert("You don't have enough money!");
      return;
    }

    const newCity = [...city];
    newCity[index] = "tree";

    setCity(newCity);
    setBudget(budget - 500);
    setTemperature(temperature - 2);
    setWaterUsage(Math.min(100, waterUsage + 1));
    setHappiness(Math.min(100, happiness + 2));
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-gray-900">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-gray-950">
        🌵 AZ Simulator
      </h1>

      <p className="mt-2 text-gray-700">
        Build your neighborhood. Make Arizona cooler.
      </p>


      <div className="mt-8 grid grid-cols-3 gap-6">

        {/* NEWS */}
        <section className="rounded-xl bg-white p-5 shadow">

          <h2 className="text-xl font-bold text-gray-950">
            📰 Arizona News
          </h2>

          <div className="mt-4 rounded-lg bg-red-100 p-4">

            <p className="font-bold text-red-900">
              🔥 Heat Wave Warning
            </p>

            <p className="mt-2 text-sm text-gray-800">
              Temperatures are expected to reach 115°F.
            </p>

          </div>

        </section>


        {/* NEIGHBORHOOD */}
        <section className="rounded-xl bg-white p-5 shadow">

          <h2 className="text-xl font-bold text-gray-950">
            🏙️ Your Neighborhood
          </h2>

          <div className="mt-4 grid grid-cols-8 gap-1">

            {city.map((tile, index) => (
              <div
                key={index}
                onClick={() => plantTree(index)}
                className="flex aspect-square cursor-pointer items-center justify-center rounded bg-gray-300 text-2xl hover:bg-gray-400"
              >
                {tile === "tree" ? "🌳" : ""}
              </div>
            ))}

          </div>

          <p className="mt-4 text-sm text-gray-700">
            Click a square to plant a tree 🌳
          </p>

        </section>


        {/* STATS */}
        <section className="rounded-xl bg-white p-5 shadow">

          <h2 className="text-xl font-bold text-gray-950">
            📊 City Stats
          </h2>

          <div className="mt-5 space-y-4 text-gray-900">

            <p>
              🌡️ Temperature:{" "}
              <b>{temperature}°F</b>
            </p>

            <p>
              💰 Budget:{" "}
              <b>${budget.toLocaleString()}</b>
            </p>

            <p>
              💧 Water Usage:{" "}
              <b>{waterUsage}%</b>
            </p>

            <p>
              ⚡ Energy Usage:{" "}
              <b>{energyUsage}%</b>
            </p>

            <p>
              😊 Happiness:{" "}
              <b>{happiness}%</b>
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}