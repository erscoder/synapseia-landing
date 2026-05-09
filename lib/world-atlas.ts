// Hand-trimmed low-poly world continents path for the landing
// `WorldMap`. Coordinates are in the equirectangular (plate carrée)
// projection mapped to a 1000×500 viewBox where:
//   x = ((lon + 180) / 360) * 1000
//   y = ((90 - lat) / 180) * 500
//
// This is a stylized basemap — every continent is rendered as a
// coarse polygon meant to be readable at marketing-card size, not
// cartographically precise. Total < 4 KB raw.
//
// We avoid `world-atlas` / `d3-geo` runtime deps so the static
// export ships zero JS for the basemap; the path string below is
// inlined into the HTML at build time.
//
// Origin: hand-drawn in equirect from public-domain country shapes,
// then simplified to ~25 vertices per continent. Released into the
// public domain alongside the rest of the landing.
export const WORLD_PATH: string = [
  // North America
  'M 130 95 L 175 88 L 215 92 L 250 105 L 275 120 L 285 135 L 310 145 ',
  'L 320 165 L 305 180 L 285 195 L 265 215 L 240 230 L 215 245 L 200 230 ',
  'L 195 215 L 175 195 L 165 175 L 155 155 L 150 135 L 140 115 Z ',
  // Central America + Caribbean stub
  'M 245 240 L 265 250 L 280 265 L 295 285 L 285 295 L 270 285 L 260 270 L 250 255 Z ',
  // South America
  'M 290 295 L 310 285 L 330 295 L 345 315 L 355 345 L 360 380 L 350 410 L 335 435 ',
  'L 320 445 L 305 440 L 295 420 L 290 395 L 285 365 L 280 335 L 285 310 Z ',
  // Greenland stub
  'M 405 70 L 435 60 L 460 70 L 470 90 L 460 110 L 435 115 L 415 105 L 405 90 Z ',
  // Europe
  'M 480 100 L 510 95 L 540 92 L 565 100 L 560 115 L 545 130 L 535 145 L 525 155 ',
  'L 510 160 L 495 155 L 485 145 L 480 130 L 478 115 Z ',
  // Africa
  'M 510 170 L 540 165 L 565 170 L 590 185 L 605 210 L 615 240 L 625 275 L 620 305 ',
  'L 605 335 L 580 360 L 555 370 L 535 360 L 520 340 L 510 315 L 505 285 L 500 250 ',
  'L 502 220 L 506 195 Z ',
  // Middle East / Arabian peninsula
  'M 590 195 L 615 195 L 635 205 L 645 225 L 635 245 L 620 250 L 605 240 L 595 220 Z ',
  // Asia (large landmass — Russia + China + India + SE Asia)
  'M 565 95 L 615 85 L 670 80 L 730 80 L 790 85 L 845 95 L 880 110 L 895 130 L 890 150 ',
  'L 870 165 L 845 175 L 815 180 L 790 195 L 770 215 L 760 235 L 770 250 L 785 260 ',
  'L 800 275 L 805 295 L 795 305 L 775 305 L 755 295 L 740 275 L 720 255 L 700 240 ',
  'L 680 230 L 660 215 L 645 195 L 630 175 L 615 160 L 605 145 L 590 130 L 575 115 Z ',
  // India peninsula
  'M 695 215 L 715 220 L 725 240 L 720 265 L 705 270 L 695 255 L 690 235 Z ',
  // SE Asia / Indonesia stubs
  'M 790 270 L 815 275 L 835 285 L 845 300 L 830 305 L 810 300 L 795 290 Z ',
  // Australia
  'M 820 350 L 855 345 L 890 350 L 910 365 L 905 385 L 880 395 L 850 395 L 825 385 ',
  'L 815 370 Z ',
  // New Zealand stub
  'M 925 400 L 940 395 L 945 410 L 935 420 L 925 415 Z ',
  // Japan stub
  'M 855 175 L 870 170 L 875 185 L 868 200 L 858 200 L 853 188 Z ',
  // British Isles
  'M 470 115 L 482 112 L 485 125 L 478 135 L 468 132 L 465 122 Z ',
  // Madagascar
  'M 625 320 L 635 318 L 640 335 L 633 348 L 625 345 L 622 332 Z ',
].join('');
