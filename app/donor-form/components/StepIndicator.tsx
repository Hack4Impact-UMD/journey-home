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
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isActive ? "bg-primary text-white" : 
                isCompleted ? "bg-primary text-white" : 
                "border border-gray-300 text-gray-400"
              }`}>
                <span className="text-sm">{isCompleted ? "✓" : step.number}</span>
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

