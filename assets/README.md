## SVGs for Projects

Make one compound path (Command + 8 in Illustrator) and name it as `*-animated-svg`.
The suffix is used by the JS to match elements.

Paths in each compound path share one color.
If two opacities are needed, make two compound paths.

When saving SVG, choose "Presentation Attribute" for "CSS Properties" so that no extra `style` is created.

Stroke width: 2px

Stroke color: 1CABC4

After adding the svg, define the maximum path length in [src/scss/components/_svgs.scss](../src/scss/components/_svgs.scss).

To see path lengths, in Illustrator, Windows - Document Info - Collapse Menu Icon on the Top-Right - Object.
Select a path and the length is shown.

If a few long paths raise the maximum length, it's not good for presentation.
Other paths are quickly completed and waiting for only a few long paths.
In this case, use the scissor tool to divide the long paths.