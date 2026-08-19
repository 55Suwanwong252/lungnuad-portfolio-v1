export default function LineIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M32 8C18.75 8 8 17.02 8 28.15c0 9.96 8.6 18.29 20.22 19.87.79.17 1.86.52 2.13 1.19.24.61.16 1.57.08 2.18l-.34 2.06c-.1.61-.48 2.39 2.08 1.3 2.56-1.08 13.8-8.13 18.83-13.92C54.48 36.99 56 32.95 56 28.15 56 17.02 45.25 8 32 8Z"
      />
      <path
        fill="#07B53B"
        d="M18.2 23.3h3.1v10.9h5.9v2.8h-9V23.3Zm11.5 0h3.1V37h-3.1V23.3Zm6.6 0h3l5.5 8.2v-8.2h3V37h-2.9l-5.6-8.4V37h-3V23.3Zm14.8 0h9v2.7h-5.9v2.6h5.5v2.6h-5.5v3h6.1V37h-9.2V23.3Z"
        transform="translate(-7 2) scale(.83)"
      />
    </svg>
  );
}
