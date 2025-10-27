"use client";

import Button from "../components/Button";

export default function Step4Confirmation() {
  return (
    <div className="space-y-6 text-center py-12">
      <div className="flex justify-center mb-8">
        <img
          src="/journey-home-logo.png"
          alt="Journey Home Logo"
          className="h-24"
        />
      </div>

      <div className="max-w-2xl mx-auto">
        <p className="text-xl text-gray-900 leading-relaxed">
          We have received your request! You can expect to hear back from us within 2 business days. Thank you so much for your help!
        </p>

        <div className="mt-12">
          <Button
            onClick={() => window.location.href = "/"}
            variant="primary"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

