import React from "react";
import { Clock, ChefHat, Package, Bike, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { key: "pending", label: "Reçue", icon: Clock },
  { key: "preparing", label: "En cuisine", icon: ChefHat },
  { key: "ready", label: "Prête", icon: Package },
  { key: "delivering", label: "En route", icon: Bike },
  { key: "delivered", label: "Livrée", icon: CheckCircle },
];

export default function OrderTracker({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center justify-center gap-2 py-4 bg-gray-100 rounded-xl">
        <XCircle className="w-6 h-6 text-gray-500" />
        <span className="font-bold text-gray-600">Commande annulée</span>
      </div>
    );
  }

  const currentIndex = steps.findIndex(s => s.key === status);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-[#fc0000]"
          />
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center z-10">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.2 : 1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isActive 
                    ? "bg-[#fc0000] text-white shadow-lg" 
                    : "bg-gray-200 text-gray-400"
                } ${isCurrent ? "ring-4 ring-[#FFB703]" : ""}`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className={`text-xs mt-2 font-semibold ${isActive ? "text-[#fc0000]" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Estimated time */}
      {status !== "delivered" && status !== "cancelled" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-600">Temps estimé</p>
          <p className="text-2xl font-extrabold text-[#fc0000]">
            {status === "pending" && "25-35 min"}
            {status === "preparing" && "15-25 min"}
            {status === "ready" && "10-15 min"}
            {status === "delivering" && "5-10 min"}
          </p>
        </motion.div>
      )}
    </div>
  );
}
