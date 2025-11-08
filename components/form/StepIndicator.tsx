"use client";

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Personal Information" },
    { number: 2, label: "Donations" },
    { number: 3, label: "Review" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <div key={step.number} className="flex items-center gap-2">
            {index !== 0 && <div className={`h-px w-24 ${isCompleted ? "bg-primary" : "bg-gray-200"}`} />}
            
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isActive
                    ? "bg-primary text-white"
                    : isCompleted
                    ? "bg-primary text-white"
                    : "border border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 16 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1.5 6.5L5.5 10.5L14.5 1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="text-sm">{step.number}</span>
                )}
              </div>
              
              <span className={`text-base ${
                isActive ? "text-black font-normal" : 
                isCompleted ? "text-black" : 
                "text-gray-400"
              }`}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

