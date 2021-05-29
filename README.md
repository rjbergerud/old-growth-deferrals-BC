# Old Growth Deferral area analysis
Data is taken from [BC Data Catalogue](https://catalogue.data.gov.bc.ca/dataset/fadm-designated-areas#edc-pow)

You can read the accompianying announcement [here](https://news.gov.bc.ca/releases/2020FLNR0058-001711), along with the [order in council](https://www.bclaws.gov.bc.ca/civix/document/id/bcgaz2/bcgaz2/v63n18_228-2020).

The goal is to analyze how much of the deferral are is actually unprotected old growth.  According to the accompianying announcement
> This [the deferral areas] will include the protection of nine areas throughout the province, totalling almost 353,000 hectares.

### Setup

Install rollup `npm i rollup --global`, and package dependencies through `npm install`.  

To build and serve, run `npm run build` or `npm run watch`

### Method
Deferral areas are taken from GeoBC [here](https://catalogue.data.gov.bc.ca/dataset/fadm-designated-areas).  We select only areas that are listed under Order-in-Council 500/2020.  However, the area over the Walbran was later removed from the deferrals, see [Ministerial Order 338](https://www.bclaws.gov.bc.ca/civix/document/id/mo/mo/m0338_2020) section 3.e.

Layers for which to consider already protected are listed in Appendix 2 of [Daust, Price, Holt 2021](https://veridianecological.files.wordpress.com/2021/05/og_deferral_technical-and-summary_may14_2021_final-3.pdf).

VRI_R1_PLY is a layer that separates land area into polygons, and to each polygon lists values for attributes such as age, site index ([how fast and ultimately big trees can grow](https://www2.gov.bc.ca/assets/gov/environment/plants-animals-and-ecosystems/ecosystems/sibecbackgrounder_jan2015.pdf), species, harvest date if logged, etc.

To determine how much second-growth forest was in the deferral areas, union the consolidated cutblocks data together with sites that have tree age less than would be expected from the given site-index.  This is because the consolidate cutblock data is incomplete, and is missing data on cuts pre-1985.

Areas with site-index less than 5 are considered too stunted to be of interest to logging, and so are excluded.




### Tips for opening files in QGIS

- For layers such as VEG_R1_PLY_polygon, there are many attributes on which to colour-code polygons.  You can change them by using `Properties > Styles > Categorized`.  Some attributes to try include `SITE_INDEX.
- Install the QuickMapServices plugin for esri basemaps.


### FAQ
Q: Where do I find information about the attributes on the VRI_R1_PLY layer?
A: Visit [this page](https://catalogue.data.gov.bc.ca/dataset/vri-2020-forest-vegetation-composite-layers-all-layers-)  and scroll down to the object description


### More resources
Independent mapping of suggested deferral areas by Daust, Holt, and Price [image](https://veridianecological.files.wordpress.com/2021/05/candidate-deferral_plusharvest_may14_large.jpg).
