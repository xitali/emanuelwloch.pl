import Image from "next/image";

export type Frame = { src: string; label: string; kind: "browser" | "window"; alt?: string };

/** A real screenshot inside a browser or Windows window chrome. */
export default function ScreenFrame({ frame, className = "", eager = false, sizes = "(max-width: 1023px) 86vw, 44vw" }: { frame: Frame; className?: string; eager?: boolean; sizes?: string }) {
  return <figure className={`stage-frame stage-frame--${frame.kind} ${className}`.trim()}>
    <figcaption className="stage-frame-bar">
      {frame.kind === "browser" ? <span className="stage-frame-dots" aria-hidden="true"><i /><i /><i /></span> : <span className="stage-frame-app" aria-hidden="true" />}
      <span className="stage-frame-label">{frame.label}</span>
      {frame.kind === "window" && <span className="stage-frame-controls" aria-hidden="true"><i /><i /><i /></span>}
    </figcaption>
    <div className="stage-frame-screen">
      <Image src={frame.src} alt={frame.alt ?? ""} fill sizes={sizes} loading={eager ? "eager" : "lazy"} priority={eager} className="stage-frame-image" />
    </div>
  </figure>;
}
