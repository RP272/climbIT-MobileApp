import type { WatchReel } from "@/src/types/watch";

const VIDEO_1 = require("./video1.mp4");
const VIDEO_2 = require("./video2.mp4");
const VIDEO_3 = require("./video3.mp4");

/** Seed data for mock API — remove when backend provides reels. */
export const WATCH_REELS_SEED: WatchReel[] = [
  {
    id: "reel-1",
    videoSource: VIDEO_1,
    title: "Czysty przejazd po zmroku",
    routeName: "Solar Flare 7a+",
    place: "Salt Mine Boulder · Kraków",
    authorName: "Ania K.",
    authorHandle: "ania.crimp",
    viewsLabel: "24.8k",
    likesLabel: "3.2k",
    dislikesLabel: "42",
    commentsLabel: "186",
    musicTrack: "Summit Echo",
    musicArtist: "Studio Ascend",
  },
  {
    id: "reel-2",
    videoSource: VIDEO_2,
    title: "Sesja na limestone — pierwszy flash",
    routeName: "North Ridge Direct 6c",
    place: "Turnia Oddziału · Zakopane",
    authorName: "Mikołaj",
    authorHandle: "miko.sloper",
    viewsLabel: "58.1k",
    likesLabel: "8.4k",
    dislikesLabel: "118",
    commentsLabel: "402",
    musicTrack: "Crimp City",
    musicArtist: "Tape & Chalk",
  },
  {
    id: "reel-3",
    videoSource: VIDEO_3,
    title: "Nowy problem z kompresją",
    routeName: "Blue Tiger V5",
    place: "Urban Boulder Lab · Wrocław",
    authorName: "Zosia W.",
    authorHandle: "zosia.walls",
    viewsLabel: "12.3k",
    likesLabel: "1.1k",
    dislikesLabel: "19",
    commentsLabel: "63",
    musicTrack: "Friction Nights",
    musicArtist: "Rubber Soul",
  },
];
