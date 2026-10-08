# Visible SVG / premature arrival investigation

Temporary 6-second playback was used and restored to 3.6 seconds only after verification.

## Observed SVG

`live-motion.json` measures the actual `[data-facing] > svg` bounding rectangle, not only wrapper styles. Exactly one visible SVG was found. Its rectangle matched the moving wrapper in all 287 moving samples. Normal 6-second playback entered crawling at 10971.8ms and arrived at 16988.8ms. The existing arrived CSS only affects gaze/label; it does not position the SVG independently.

[6-second diagnostic browser recording](visible-svg-six-seconds.webm)

## Reproduced fault

`scroll-before.json`: only 12px document scrolling caused `scrollY > 8` to call settle(). The Hero was still 888px visible. Within 104ms, state changed crawling → arrived, visible SVG jumped from approximately (967.7,194.4) to (596,776.5), and walking stopped. The same threshold also skipped travel when a small scroll occurred during the button-to-walk delay.

## Fix and retest

Both guards now check whether the Hero has completely left the viewport (`hero.getBoundingClientRect().bottom <= 0`), rather than an 8px document-scroll threshold. Actual departure cleanup and reduced-motion behavior remain.

`scroll-after.json`: at the same 12px scroll, state remained crawling, pose changed B → A, and SVG continued from (969.4,194.4) to (1002.2,182.4). The -12px viewport y offset matches document scrolling; it is not a final-position jump. Arrived was applied at the end of the 6-second journey. Duration was then restored to 3600ms.

This reproduces a concrete early-arrival cause. It does not establish that every previously reported visual stutter had that same cause. No new animation or path was introduced.
