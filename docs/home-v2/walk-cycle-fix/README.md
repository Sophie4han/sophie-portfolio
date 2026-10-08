# Chooni walking visibility fix

Only ChooniGuide.tsx and chooni-guide.module.css changed. No dependency, Hero layout, route, timer or navigation changes.

Previous issue: a 660ms cycle spent roughly half its time neutral; ±2 SVG-unit translation became only ±1 screen pixel on desktop and less on mobile. Earlier QA captured a neutral pose and did not establish a visibly alternating walk.

Four independent groups now explicitly identify front-left, front-right, rear-left, rear-right. Front-left + rear-right share pose A; the other diagonal pair shares B. A uses translate(8,-2) SVG units and -9° rotation; B uses translate(-8,0) and +9°. At desktop scale the translation is +4/-4 screen pixels. Poses swap halfway through each 400ms cycle, five cycles over the existing 2s movement. Neutral is restored only after arrival. Body bob/±0.5° rotation and ±2° tail sway are subordinate to the leg poses.

Live browser verification (motion.json): 121 animation-frame samples over 1996.7ms; ten alternating A/B intervals (five complete cycles), concurrent changes to whole-character position, final arrived state, four neutral limb transforms, zero running animations and no runtime errors. Animation was not slowed or paused for this measurement.

Screenshots frame-1/2/3.png capture live playback. For clear inspection, pose-1/2/3.png are staged in empty Hero space for leg inspection and captured as 6× browser screenshots paused at 100/300/500ms of the same animation (A/B/A); they are not evidence of playback speed. No generated illustration was substituted.

Lint, TypeScript and production build passed. Chrome emulation used; physical Safari/iOS not tested.

The additional multi-viewport rerun was interrupted after browser automation stalled; its flow-qa.json is not an all-pass report. The single foreground live walk measurement above completed successfully.
