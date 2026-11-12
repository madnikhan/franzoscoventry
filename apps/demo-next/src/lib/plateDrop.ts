/** Shared camera-matched peri plate layers for hero + Build the Plate. */

export const PLATE_DROP_LAYERS = [
  {
    order: "01",
    part: "plate",
    label: "Base heat",
    copy: "Ceramic plate hits the pass — flame-ready foundation.",
    src: "/media/hero/plate-drop/01-plate.png",
    settleY: 8,
  },
  {
    order: "02",
    part: "fries",
    label: "Mid stack",
    copy: "Thick-cut fries settle onto the plate.",
    src: "/media/hero/plate-drop/02-fries.png",
    settleY: 0,
  },
  {
    order: "03",
    part: "chicken",
    label: "Crown it",
    copy: "Peri peri chicken stacks on the fries.",
    src: "/media/hero/plate-drop/03-chicken.png",
    settleY: -6,
  },
  {
    order: "04",
    part: "salad",
    label: "Serve dark",
    copy: "Fresh garnish locks the Franzos finish.",
    src: "/media/hero/plate-drop/04-salad.png",
    settleY: -10,
  },
] as const;

export const PLATE_LOADER_SRC = "/media/loader/peri-plate.png";
