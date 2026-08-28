# Raw geographic inputs

`us-states-10m.json` and `us-counties-10m.json` are the 1:10,000,000 TopoJSON
boundary files published by the **us-atlas** project (Mike Bostock), derived
from the U.S. Census Bureau's cartographic boundary files.

- Source: https://github.com/topojson/us-atlas (npm: `us-atlas@3`)
- Underlying authority: U.S. Census Bureau TIGER/Line cartographic boundaries
- Licence: ISC (us-atlas); Census source data is public domain

They are committed here so `node tools/build-geo.js` is reproducible offline.
The generator decodes them, projects them through the Albers USA composite in
`src/js/albers.js`, simplifies, and emits `src/data/geo.js`. Nothing in the
running application reads these files.
