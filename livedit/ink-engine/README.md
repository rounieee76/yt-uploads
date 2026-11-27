# Ink-cel shorts engine (hand-inked cartoon look, drawn fully in code)
First used for "He Sold the Eiffel Tower for Scrap. Twice." (Nov 27 2026, 33 s, 1080x1920).
- ink.py: variable-width dip-pen stroke (Catmull-Rom, pressure, tapered ends, wobble), fills, ticks, dash rows, sparkle; locked palette.
- chars.py: caricature heads (8 expressions: neutral blink angry smug joy shock doubt grief; real open mouths with teeth), padded hands, arm poses.
- cast.py: Lustig, Poisson, dealer, gendarme + RECURRING DUO **Leo** (tall, gold spiky hair, freckles) and **Mira** (short, black bob, round gold glasses).
  Owner wants Leo/Mira as the "you" characters in every new "born as" video (original designs; never draw game/film characters).
  Their colours come from each story's locked palette; change outfits per era, keep the silhouette (hair, build, glasses).
- bodies.py / sets.py: bodies, extras, layered sets (hotel, Paris night, train, police) and props.
- parts.py rasterises parts (rsvg) -> anim.py composites (rig, parallax camera, whips, particles, old-cartoon finish, captions) -> shots.py (per-story) -> run.py (sheet | render w n) -> mix.py.
- Fonts: Fredoka (captions, wght axis first: set_variation_by_axes([700,100])), Playfair, Oswald. Voice: kokoro am_michael speed 1.3 (~3.5 words/s).
Speed: ~0.45 s/frame per worker on 2 CPUs (a 33 s short renders in ~6 min).
