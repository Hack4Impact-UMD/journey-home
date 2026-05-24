'use client';

interface AuthMobileNavbarProps {
  onBack?: () => void;
}

export default function AuthMobileNavbar({ onBack }: AuthMobileNavbarProps) {
  return (
    <div className="md:hidden w-full flex items-center justify-between" style={{ padding: '1rem' }}>
      {onBack ? (
        <button
          onClick={onBack}
          className="flex items-center justify-center"
          style={{ width: '2rem', height: '2rem' }}
          aria-label="Go back"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      ) : (
        <div style={{ width: '2rem' }} />
      )}

      <img
        src="/JOURNEYHOME.png"
        alt="Journey Home"
        style={{ height: '1rem', width: 'auto' }}
      />
    </div>
  );
}
