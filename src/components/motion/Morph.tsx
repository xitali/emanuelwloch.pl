import * as React from "react";
import type { ViewTransitionProps } from "react";

/**
 * React's <ViewTransition> where the running React has it (Next's bundled canary does);
 * a plain fragment elsewhere, e.g. under the test runner's stable React.
 */
const Native = (React as unknown as { ViewTransition?: React.ComponentType<ViewTransitionProps> }).ViewTransition;

export default function Morph(props: ViewTransitionProps) {
  return Native ? <Native {...props} /> : <>{props.children}</>;
}
