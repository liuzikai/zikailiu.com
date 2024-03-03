My Personal Portfolio
=====================

=> [zikailiu.com](https://zikailiu.com)

## Design

I do all the design by myself with manually crafted HTML/CSS/JS, without using website generators.
I get inspiration from a lot of great websites.
This site is of nothing compared with those masterpieces.

The [About](https://zikailiu.com/about) page is designed separately for professional use.
The design goal is to maximize readability and conciseness.

### General Layout

I use [Start Bootstrap - Grayscale](https://github.com/StartBootstrap/startbootstrap-grayscale) as the starting template
but end up changing almost everything.

### Masthead Images

As you may already notice, masthead images for [Home](https://zikailiu.com), [Projects](https://zikailiu.com/projects),
[Photography](https://zikailiu.com/photography), and the [404 page](https://zikailiu.com/whatever)
(try if you haven't seen it!) are of the same 3D model but rendered in different styles. I create them with Blender.

The work is inspired by [Testify](https://www.youtube.com/watch?v=xkUN_9HFNPg) from Arcaea, as well
as [this Bilibili video](https://www.bilibili.com/video/BV1TS4y1W7sX).
Many thanks to [@落琳雪泪](https://space.bilibili.com/36263054) for sharing the 2D masks of gears.

### Vector Graphs

Vector graphs are widely used in the website. Icons are mostly taken from
[Bootstrap Icons](https://icons.getbootstrap.com) and [Noun Project](https://thenounproject.com/).

Large vector graphs are used in [Projects](https://zikailiu.com/projects).
As you may already notice, they draw as you scroll!
They act not only as icons for projects, but also as the scroll indicator: an icon completely display when the project
scrolls to the center of the viewpoint (or when reaching the top, for small screens).
I made those SVGs myself, mostly using Adobe Illustrator.
See [REFERENCE.md](REFERENCE.md) for references and inspirations.

### Photo Gallery

The [Photography](https://zikailiu.com/photography) page employs a modified version
of [baguetteBox.js](https://github.com/feimosi/baguetteBox.js).
Each collection has a header image displayed in the grid, while other photos can be viewed by opening the collection.
When reaching the end of a collection, the viewer continues into the next collection
so that the user doesn't need to return to the grid view.

## Technology

This is a static website. Bootstrap is used for its responsive design. A bit of details:

* Use EJS to generate HTML (instead of PUG used in the Bootstrap template).
* Use SCSS to generate CSS (same as the Bootstrap template).
* CSS is post-processed
  with [autoprefixer](https://github.com/postcss/autoprefixer) ([render-scss.js](scripts/render-scss.js))
  so there is no need to add prefixes manually. Currently, the target compatibility is set
  to `cover 99.5%` ([browserslist](https://github.com/browserslist/browserslist)).
* Favicon assets are generated with [RealFaviconGenerator](https://realfavicongenerator.net/#).
* Animations with [GSAP](https://greensock.com/gsap/).

Specifically, about performance optimizations:

* One CSS and one JS (including Bootstrap, baguetteBox, and GSAP) for all pages.
* Include only the necessary Bootstrap scripts. Minify JS using terser. Minify CSS using PurgeCSS.
* Vanilla JS. No JQuery.
* Self-host fonts (only three weights of Nunito Sans). No Google Fonts.
* Inline SVG icons. No CDN-delivered FontAwesome.
* ~~Lossy WEBP for images. Targeting Fast 3G loading speed.~~ JPEG images for backward compatibility. WEBP saves up to ~
  50% for normal size images (e.g. photos in Projects), but not that much for large masthead images (~10%-20%),
  which are the real bottlenecks.
* GZIP encoding (less important after deploying the CDN).
* Preload CSS, fonts, JS and the masthead background.
* Customized images/video lazy loading on Projects.
* CDN.

In [Projects](https://zikailiu.com/projects), the SVG scrolling animation is driven by [scripts.js](src/js/scripts.js).
The main idea:

* Find all SVG containers and the corresponding wrapper project containers after DOM loads.
* On scroll, for each SVG, get the position of the project container in the viewpoint.
* Compute the SVG loading percentage with ease.
* Apply the style `stroke-dashoffset` to the SVG.

The SVGs are lazily loaded as inline HTML (`img` does not work).
The stroke size of the longest path in each SVG is defined
in [src/scss/components/_svgs.scss](src/scss/components/_svgs.scss).

The [About](https://zikailiu.com/about) page is implemented separately as a standalone HTML.
The goal is to maximize compatibility.

## TODOs and Known Issues

## Reference

[REFERENCE.md](REFERENCE.md)

## Feedback

Any feedback is appreciated! If you know me, just drop me a message to :)

## License

All source code (HTML, JS, CSS) is released under the MIT open source license. Texts and images remain copyrighted
unless originated from somewhere else ([REFERENCE.md](REFERENCE.md)).

