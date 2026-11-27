import json, numpy as np, soundfile as sf, subprocess, os
from shots import SFX
SR=48000; W='/home/claude/eiffel/work'; K='/home/claude/dl/sfx-kit'
idx={s['id']:s for s in json.load(open(K+'/sounds.json'))['sounds']}
def load(p):
    a=subprocess.run(['ffmpeg','-v','error','-i',p,'-f','f32le','-ac','2','-ar',str(SR),'-'],capture_output=True).stdout
    return np.frombuffer(a,np.float32).reshape(-1,2).copy()
dur=33.4; N=int(dur*SR)
v=load(W+'/voice.wav'); voice=np.zeros((N,2),np.float32); voice[:min(N,len(v))]=v[:N]
fx=np.zeros((N,2),np.float32)
for t,i,g in SFX:
    s=idx[i]; a=load(K+'/'+s['file'])*10**(g/20)
    st=int((t-s['sync']['at'])*SR) if 'sync' in s else int(t*SR); st=max(0,st)
    e=min(N,st+len(a)); fx[st:e]+=a[:e-st]
m=load('/home/claude/dl/free-music/mp3/Clowns.mp3')[int(4*SR):int(4*SR)+N]
mus=np.zeros((N,2),np.float32); mus[:len(m)]=m
env=np.ones(N,np.float32); fo=int(1.2*SR); env[-fo:]=np.linspace(1,0,fo)
def rms(x): return np.sqrt(np.mean(x**2)+1e-12)
mus=mus/rms(mus)*rms(voice)*0.16*env[:,None]
mix=voice+fx+mus
sf.write(W+'/mix_raw.wav',mix,SR)
subprocess.run(['ffmpeg','-v','error','-y','-i',W+'/mix_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000',W+'/mix.wav'],check=True)
print(subprocess.run(['ffmpeg','-hide_banner','-i',W+'/mix.wav','-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr.split('Summary')[-1][:200])
