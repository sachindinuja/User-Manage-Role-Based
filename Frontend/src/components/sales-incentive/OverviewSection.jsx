import React from "react";
import DCard from "../common/DCard";
import { formatNumber } from "../../utils/utils";
import ShinyText from "../common/ShinyText";

function OverviewSection({ cards }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {cards.map((card, idx) => (
        <DCard key={idx}>
          <div className="block p-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">{card.label}</h2>
            </div>
            <p className="text-4xl font-bold text-white">
              {formatNumber(card.value)}
            </p>
          </div>
        </DCard>
      ))}
    </div>
  );
}

export default OverviewSection;
