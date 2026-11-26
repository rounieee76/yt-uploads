"""Music bed from two CC BY 4.0 tracks by Tanner Helland (github.com/tannerhelland/free-music), looped with crossfades."""
import json, subprocess, numpy as np, soundfile as sf
ROOT='/home/claude/lived/capone'; M='/home/claude/dl/free-music/mp3'; SR=48000
TL=json.load(open(f'{ROOT}/work/timeline.json')); dur=TL['duration']
first={}
for s in TL['sentences']: first.setdefault(s['sec'], s['start'])
def load(name):
    raw=subprocess.run(['ffmpeg','-loglevel','error','-i',f'{M}/{name}.mp3','-f','f32le','-ac','2','-ar',str(SR),'-'],capture_output=True).stdout
    return np.frombuffer(raw,'float32').reshape(-1,2).copy()
def loop(a, n, xf=3.0):
    x=int(xf*SR); out=a.copy()
    while len(out)<n:
        r=np.linspace(0,1,x)[:,None]; out[-x:]=out[-x:]*(1-r)+a[:x]*r; out=np.concatenate([out,a[x:]])
    return out[:n]
import os
secs=list(first)
sw=os.environ.get('MUSIC_SWITCH_SECTION', secs[2] if len(secs)>2 else secs[-1])
switch=first[sw]-1.0   # change track where that section starts
A=loop(load(os.environ.get('MUSIC_A','Surreptitious')), int((switch+3)*SR)); B=loop(load(os.environ.get('MUSIC_B','Syntheticity')), int((dur-switch+3)*SR))
def lufs_norm(a, target):
    # simple RMS-based normalisation (K-weighting skipped; fine for a bed)
    rms=np.sqrt(np.mean(a**2))+1e-9; return a*(10**(target/20)/rms)
A=lufs_norm(A,-30); B=lufs_norm(B,-30)
n=int(dur*SR); bed=np.zeros((n,2),'float32'); s0=int(switch*SR); x=3*SR
bed[:s0+x]=A[:s0+x]
fade=np.linspace(0,1,x)[:,None]; bed[s0:s0+x]=A[s0:s0+x]*(1-fade)+B[:x]*fade
bed[s0+x:]=B[x:x+n-s0-x]
t=np.arange(n)/SR; env=np.minimum(1,t/2)*np.minimum(1,(dur-t)/5)
# drop the bed under the logo sting so the sting reads clearly
st=[s for s in TL['sentences'] if s['sec']=='prologue'][-1]['end']+.35
env*=np.where((t>st-.2)&(t<st+2.4),0.35,1.0)
bed=(bed*env[:,None]).astype('float32'); sf.write(f'{ROOT}/audio/music_bed.wav',bed,SR)
print('switch at',round(switch,1),'s; peak',round(20*np.log10(np.max(np.abs(bed))),1),'dBFS')
