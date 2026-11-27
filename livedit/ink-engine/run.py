import sys, json, time
from shots import *
TL = json.load(open(f'{WK}/timeline.json'))
CAPS = chunks(TL)
def frames(i):
    a, b = round(BOUNDS[i] * FPS), round(BOUNDS[i + 1] * FPS)
    return a, b - a
def stills(ts=None):
    S = shots(); out = []
    for i, sh in enumerate(S):
        a, n = frames(i)
        fs = [n // 2] if ts is None else [min(n - 1, int(x * n)) for x in ts]
        out += [(i, f, fr) for f, fr in zip(fs, render_shot(sh, f'{SD}/x.mp4', a / FPS, n, CAPS, WHIP[i], WHIP[i + 1] if i + 1 < len(WHIP) else None, still_only=fs))]
        clear_cache()
    return out
if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'sheet':
        import cv2, numpy as np
        res = stills([float(x) for x in sys.argv[2].split(',')] if len(sys.argv) > 2 else None)
        th = [cv2.resize(fr, (270, 480), interpolation=cv2.INTER_AREA) for _, _, fr in res]
        cols = 8; rows = (len(th) + cols - 1) // cols
        G = np.full((rows * 500, cols * 280, 3), 30, np.uint8)
        for k, (im, (i, f, _)) in enumerate(zip(th, res)):
            r, c = divmod(k, cols)
            G[r * 500:r * 500 + 480, c * 280:c * 280 + 270] = im
            cv2.putText(G, f'{i + 1}', (c * 280 + 8, r * 500 + 496), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
        cv2.imwrite(f'{WK}/contact.jpg', G, [cv2.IMWRITE_JPEG_QUALITY, 90])
        for i, f, fr in res:
            cv2.imwrite(f'{WK}/still_{i + 1:02d}_{f:03d}.jpg', fr, [cv2.IMWRITE_JPEG_QUALITY, 92])
    elif cmd == 'render':
        w, nw = int(sys.argv[2]), int(sys.argv[3])
        S = shots()
        for i, sh in enumerate(S):
            if i % nw != w: continue
            a, n = frames(i); t = time.time()
            render_shot(sh, f'{SD}/s{i:02d}.mp4', a / FPS, n, CAPS, WHIP[i], WHIP[i + 1] if i + 1 < len(WHIP) else None)
            clear_cache(); print('shot', i + 1, n, 'frames', round(time.time() - t, 1), 's', flush=True)
