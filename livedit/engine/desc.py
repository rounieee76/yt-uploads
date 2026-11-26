#!/usr/bin/env python3
"""desc.py PROJECT "<hook line>" -> writes out/description.txt with chapter timestamps."""
import json, sys
P = sys.argv[1]; hook = sys.argv[2]
nar = json.load(open(f'{P}/script/narration.json')); tl = json.load(open(f'{P}/work/timeline.json'))
sen = tl['sentences']; lines = []
def fmt(t): t = int(t); return f'{t // 60}:{t % 60:02d}'
for sec in nar['sections']:
    if sec.get('chapter'):
        first = sec['paras'][0][0]
        t = 0 if sec['id'] == 'prologue' else next(s['start'] for s in sen if s['text'] == first)
        lines.append(f"{fmt(t)} {sec['chapter'].replace('·', '–')}")
out = f"""{hook}

This is the whole life of {sys.argv[3]}, from birth to the very end, told as if it were yours.

Chapters
{chr(10).join(lines)}

Who should live next? Drop a name in the comments.
New lives every day: subscribe to Lived It.

Facts come from historical sources; where they disagree or a story is a legend, the video says so.
All illustrations and animation are made by Lived It.
Music: Tanner Helland, free-music (CC BY 4.0) — github.com/tannerhelland/free-music
Sound effects: SFX Kit by Wyzowl (CC0)
"""
open(f'{P}/out/description.txt', 'w').write(out); print(out)
