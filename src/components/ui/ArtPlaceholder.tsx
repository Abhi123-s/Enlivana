import type { Artwork } from "@/data/catalog";

/** Procedural folk-art style SVG so the demo needs no licensed images. */
export function ArtPlaceholder({
  art,
  className = "",
}: {
  art: Pick<Artwork, "palette" | "motif" | "handle">;
  className?: string;
}) {
  const [dark, accent, light] = art.palette;
  const id = `g-${art.handle}`;
  // Round trig output: Math.cos/sin can differ in the last digits between Node (SSR) and the browser,
  // which would cause a hydration attribute mismatch.
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const dots = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    return <circle key={i} cx={r2(150 + Math.cos(a) * 118)} cy={r2(200 + Math.sin(a) * 118)} r="3.2" fill={accent} />;
  });
  const rays = Array.from({ length: 16 }, (_, i) => (
    <line
      key={i}
      x1="150"
      y1="200"
      x2={r2(150 + Math.cos((i / 16) * 6.283) * 96)}
      y2={r2(200 + Math.sin((i / 16) * 6.283) * 96)}
      stroke={light}
      strokeWidth="2"
    />
  ));

  let motif: React.ReactNode;
  switch (art.motif) {
    case "mandala":
      motif = (
        <>
          {[90, 68, 46, 24].map((r, i) => (
            <circle key={r} cx="150" cy="200" r={r} fill={i % 2 ? dark : accent} stroke={light} strokeWidth="2" />
          ))}
          {rays}
          <circle cx="150" cy="200" r="10" fill={light} />
        </>
      );
      break;
    case "sun":
      motif = (
        <>
          {rays}
          <circle cx="150" cy="200" r="52" fill={accent} stroke={light} strokeWidth="3" />
          <circle cx="150" cy="200" r="30" fill={dark} />
          <circle cx="150" cy="200" r="12" fill={light} />
        </>
      );
      break;
    case "waves":
      motif = (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M30 ${130 + i * 28} q30 -26 60 0 t60 0 t60 0 t60 0`}
              fill="none"
              stroke={i % 2 ? accent : light}
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}
        </>
      );
      break;
    case "fish":
      motif = (
        <>
          <g transform="translate(150 160)">
            <ellipse rx="70" ry="32" fill={accent} stroke={light} strokeWidth="3" />
            <path d="M70 0 L108 -26 L108 26 Z" fill={accent} stroke={light} strokeWidth="3" />
            <circle cx="-42" cy="-6" r="6" fill={dark} />
          </g>
          <g transform="translate(150 250) scale(-1 1)">
            <ellipse rx="70" ry="32" fill={light} stroke={accent} strokeWidth="3" />
            <path d="M70 0 L108 -26 L108 26 Z" fill={light} stroke={accent} strokeWidth="3" />
            <circle cx="-42" cy="-6" r="6" fill={dark} />
          </g>
        </>
      );
      break;
    case "tree":
      motif = (
        <>
          <path d="M150 330 V190" stroke={light} strokeWidth="8" strokeLinecap="round" />
          {[-60, -30, 0, 30, 60].map((dx, i) => (
            <g key={dx}>
              <path
                d={`M150 ${250 - i * 4} Q${150 + dx} ${200 - i * 6} ${150 + dx * 1.6} ${150 + Math.abs(dx) * 0.3}`}
                stroke={light}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx={150 + dx * 1.6} cy={150 + Math.abs(dx) * 0.3} r="14" fill={accent} stroke={light} strokeWidth="2" />
            </g>
          ))}
          <circle cx="150" cy="130" r="18" fill={accent} stroke={light} strokeWidth="2" />
        </>
      );
      break;
    case "lotus":
      motif = (
        <>
          {[-70, -35, 0, 35, 70].map((rot) => (
            <ellipse
              key={rot}
              cx="150"
              cy="170"
              rx="22"
              ry="60"
              fill={rot % 2 ? accent : light}
              stroke={dark}
              strokeWidth="2"
              transform={`rotate(${rot} 150 230)`}
            />
          ))}
          <path d="M40 270 q55 -26 110 0 t110 0" stroke={light} strokeWidth="4" fill="none" />
          <path d="M60 300 q45 -20 90 0 t90 0" stroke={accent} strokeWidth="4" fill="none" />
        </>
      );
      break;
    case "peacock":
      motif = (
        <>
          {[-60, -40, -20, 0, 20, 40, 60].map((rot) => (
            <g key={rot} transform={`rotate(${rot} 150 270)`}>
              <ellipse cx="150" cy="150" rx="15" ry="52" fill={accent} stroke={light} strokeWidth="2" />
              <circle cx="150" cy="120" r="8" fill={dark} />
            </g>
          ))}
          <ellipse cx="150" cy="275" rx="20" ry="30" fill={light} stroke={dark} strokeWidth="3" />
        </>
      );
      break;
    default:
      motif = (
        <>
          {Array.from({ length: 5 }, (_, r) =>
            Array.from({ length: 4 }, (_, c) => (
              <rect
                key={`${r}${c}`}
                x={60 + c * 52}
                y={100 + r * 50}
                width="38"
                height="38"
                rx={(r + c) % 2 ? 19 : 4}
                fill={(r + c) % 2 ? accent : light}
                transform={`rotate(${(r + c) % 2 ? 0 : 45} ${79 + c * 52} ${119 + r * 50})`}
              />
            )),
          )}
        </>
      );
  }

  return (
    <svg viewBox="0 0 300 400" className={`h-full w-full ${className}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={dark} />
          <stop offset="1" stopColor={dark} stopOpacity="0.82" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill={`url(#${id})`} />
      <rect x="14" y="14" width="272" height="372" fill="none" stroke={accent} strokeWidth="1.5" />
      <rect x="22" y="22" width="256" height="356" fill="none" stroke={light} strokeOpacity=".45" strokeWidth="1" />
      {dots}
      {motif}
    </svg>
  );
}
