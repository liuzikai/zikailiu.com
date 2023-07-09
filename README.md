My Personal Portfolio
=====================

=> [zikailiu.com](https://zikailiu.com), or equivalently [liuzik.ai](https://liuzik.ai)

PS: This work is mainly about practicing frontend development and design. As for the content, do not take them too
seriously :P

PPS: There is nothing to do with AI...

## Design

For a website, design probably goes before technology.
I am not a professional. But I am happy to play around with various things.
Here are some pieces in my mind.

### Masthead Images Rendered with Blender

It's my first experience with 3D modeling.
The work is inspired by [Testify](https://www.youtube.com/watch?v=xkUN_9HFNPg) from Arcaea, as well
as [this Bilibili video](https://www.bilibili.com/video/BV1TS4y1W7sX).
Thank [@落琳雪泪](https://space.bilibili.com/36263054) for sharing the 2D masks of gears!

All three masthead images of page Home, Projects and Photography are of the same model, with different materials
and lighting.
The one for Projects is in the wireframe style.
The one for Photography is a gradient mapping material using the global coordinates in camera (rather than gradients
on each component's scale).

### SVG with Adobe Illustrator

Specifically, about the vector graph animation on the projects page.
Initially, I was looking for a way to present an image per project, while the work to prepare those images needed to be
within my capability.
It ended up with the current design: SVG animation on scroll.

Each image displays 100% as the project section scroll to the center of the viewpoint, or when the image reaches the top
(for small devices where the whole section cannot be completely shown in the view).
I think this helps locate the scrolling position to read the text, without interrupting the scrolling process
(the website never scrolls for the user automatically).
I made those SVGs myself. See [reference.md](REFERENCE.md) for some references and inspirations.

The scrolling animation is driven by [scripts.js](src/js/scripts.js). The main idea is to:

* Find all SVG containers and the corresponding wrapper project containers after DOM loads.
* On scroll, for each SVG, get the position of the project container in the viewpoint.
* Compute the SVG loading percentage with ease.
* Apply the style `stroke-dashoffset` to the SVG.

The SVGs are lazily loaded as inline HTML (`img` does not work).
The stroke size of the longest path in each SVG is defined
in [src/scss/components/_svgs.scss](src/scss/components/_svgs.scss).

### General Layout

I used [Start Bootstrap - Grayscale](https://github.com/StartBootstrap/startbootstrap-grayscale) as the starting
template and ended up changing almost everything.

## Technology

This is a static website. Bootstrap is used for its responsive design. A bit of detail:

* Use EJS to render HTML (instead of PUG used in the Bootstrap template).
* Use SCSS to generate CSS (same as the Bootstrap template).
* CSS is post-processed
  with [autoprefixer](https://github.com/postcss/autoprefixer) ([render-scss.js](scripts/render-scss.js))
  so that there is no need to add prefixes manually. Currently, the target compatibility is set
  to `cover 99.5%` ([browserslist](https://github.com/browserslist/browserslist)).
* Favicon assets generated with [RealFaviconGenerator](https://realfavicongenerator.net/#).
* Animations with [GSAP](https://greensock.com/gsap/).

Specifically, about performance optimizations:

* One CSS and one JS (including Bootstrap) for all pages.
* Include only the necessary Bootstrap JS script. Minify JS using terser. Minify CSS using PurgeCSS.
* Vanilla JS. No JQuery.
* Self-host fonts (only three weights of Nunito Sans). No Google Fonts.
* Inline SVG icons from [Bootstrap Icons](https://icons.getbootstrap.com). No CDN-delivered FontAwesome.
* ~~Lossy WEBP for images. Targeting Fast 3G loading speed.~~ JPEG images for backward compatibility. WEBP saves up to ~
  50% for normal size images (e.g. photos in Projects page), but not that much for large masthead images (~10%-20%),
  which are the real bottlenecks.
* GZIP encoding (less important after deploying the CDN).
* Preload CSS, fonts, JS and the masthead background.
* Customized images/video lazy loading on the Project page.
* CDN.

## TODOs and Known Issues

- [ ] Maybe organize photos into topics some day...
- [ ] Optimize photo page loading. Simple lazy loading prevents GSAP from calculating the correct heights.
- [ ] `.slide-in-text` is also triggered when scrolling upward, which is ugly. Maybe replace it with GSAP ScrollTrigger
  some day.

## Reference

I get inspiration from a lot of great websites. The outstanding ones in my mind include the starting template,
[quokecola.com](https://github.com/QuokeCola/QuokeCola.github.io), [Gulia Gatner](https://www.giuligartner.com/), Apple's
website, as well as a bunch of
awesome websites from [Awwwards](https://www.awwwards.com). This site is of nothing compared with those masterpieces.

For a more complete list of references, please refer to [REFERENCE.md](REFERENCE.md).

## Feedback

Any feedback is appreciated! If you know me well, just shoot a message to me :)

## License

All source code (HTML, JS, CSS) is available under the MIT open source license. Texts and images remain copyrighted
unless originated from somewhere else ([REFERENCE.md](REFERENCE.md)).

