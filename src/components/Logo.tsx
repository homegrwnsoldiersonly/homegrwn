/**
 * HOMEGRWN wordmark, recreated in code so it scales crisply everywhere.
 * Black/white wordmark with the signature bright-green sprout accent.
 * To use your original logo file instead, drop it in /public and swap
 * this component's contents for an <Image>.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6 shrink-0"
        aria-hidden="true"
      >
        {/* sprout mark */}
        <path
          d="M12 21V10"
          stroke="var(--green)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M12 12C12 8 9 5.5 4.5 5.5C4.5 9.5 7.5 12 12 12Z"
          fill="var(--green)"
        />
        <path
          d="M12 9.5C12 6.5 14.5 4 19.5 4C19.5 7.5 16.5 9.9 12 9.5Z"
          fill="var(--green-bright)"
          opacity="0.85"
        />
      </svg>
      <span className="font-extrabold tracking-tight text-lg leading-none">
        HOME<span className="text-green">GRWN</span>
      </span>
    </span>
  );
}
