// @vitest-environment jsdom
import React from "react";
import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {act,cleanup,fireEvent,render,screen} from "@testing-library/react";
import ProjectMedia from "../src/components/portfolio/ProjectMedia";
import { setMotionPaused } from "../src/lib/motion/preference";
import previews from "../src/lib/project-previews.json";
vi.mock("next/image",()=>({default:({src,alt}:{src:string;alt:string})=>React.createElement("img",{src,alt})}));
let reduced=false;
let visibility:(entries:Partial<IntersectionObserverEntry>[])=>void;
const [projectId,preview]=Object.entries(previews)[0];
const props={projectId,image:preview.source,title:"Test projektu"};
beforeEach(()=>{
 reduced=false;
 vi.stubGlobal("matchMedia",()=>({matches:reduced,addEventListener:vi.fn(),removeEventListener:vi.fn()}));
 vi.stubGlobal("IntersectionObserver",class {constructor(callback:typeof visibility){visibility=callback;}observe(){}disconnect(){}});
 vi.spyOn(HTMLMediaElement.prototype,"play").mockResolvedValue();
 vi.spyOn(HTMLMediaElement.prototype,"pause").mockImplementation(()=>{});
});
afterEach(()=>{cleanup();setMotionPaused(false);vi.restoreAllMocks();vi.unstubAllGlobals();});
describe("project preview playback",()=>{
 it("does not load video when reduced motion is requested",()=>{
  reduced=true;const {container}=render(<ProjectMedia {...props}/>);
  act(()=>visibility([{isIntersecting:true}]));
  expect(container.querySelector("video")).toBeNull();
  expect(screen.getByAltText("Podgląd projektu Test projektu").getAttribute("src")).toBe(preview.poster);
 });
 it("plays only while visible and allows pausing and resuming",()=>{
  const {container}=render(<ProjectMedia {...props}/>);
  expect(container.querySelector("video")).toBeNull();
  act(()=>visibility([{isIntersecting:true}]));
  expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:"Zatrzymaj animację: Test projektu"}));
  expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:"Odtwórz animację: Test projektu"}));
  act(()=>visibility([{isIntersecting:false}]));
  expect(container.querySelector("video")).toBeNull();
 });
 it("uses the current screenshot if the project's image changed",()=>{
  const {container}=render(<ProjectMedia {...props} image="/projects/new-screen.png"/>);
  act(()=>visibility([{isIntersecting:true}]));
  expect(container.querySelector("video")).toBeNull();
  expect(screen.getByAltText("Podgląd projektu Test projektu").getAttribute("src")).toBe("/projects/new-screen.png");
 });
 it("shows the poster while site motion is paused and restores the preview when resumed", () => {
  const { container } = render(<ProjectMedia {...props} />);
  act(() => visibility([{ isIntersecting: true }]));
  expect(container.querySelector("video")).not.toBeNull();

  act(() => setMotionPaused(true));
  expect(container.querySelector("video")).toBeNull();
  expect(screen.getByAltText("Podgląd projektu Test projektu").getAttribute("src")).toBe(preview.poster);

  act(() => setMotionPaused(false));
  expect(container.querySelector("video")).not.toBeNull();
 });
});
