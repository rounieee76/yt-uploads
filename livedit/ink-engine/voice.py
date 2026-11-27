import json, os, hashlib, numpy as np, soundfile as sf, sys
from kokoro_onnx import Kokoro
W='/home/claude/eiffel/work'
CL=["A con man is selling the Eiffel Tower,","and the buyer is about to say yes.","Paris, nineteen twenty-five.","The tower is rusting,",
"and newspapers say it costs too much to fix.","Victor Lustig forges government letters","and invites the city's top scrap dealers to a luxury hotel.",
"He tells them, in secret:","the city will sell over seven thousand tons of iron.","One dealer, André Poisson, has doubts.",
"So Lustig asks him for a bribe.","And that's what convinces him. Only a real official would want a bribe.","Poisson pays.",
"Lustig escapes to Austria with the money.","Poisson is too embarrassed to call the police.","So Lustig comes back to Paris","and does it all again."]
SHOW=[c.replace("nineteen twenty-five","1925") for c in CL]
SAY=[c.replace("André Poisson","Ahndray Pwahsohn").replace("Poisson","Pwahsohn").replace("Lustig","Lustig") for c in CL]
SPEED=float(os.environ.get('SPEED','1.12'))
k=Kokoro('/home/claude/lived/models/kokoro-v1.0.onnx','/home/claude/lived/models/voices-v1.0.bin')
out=[];tl=[];t=0.0;SR=24000
for i,(s,show) in enumerate(zip(SAY,SHOW)):
    fn=f'{W}/vo/c{i:02d}_{hashlib.md5((s+str(SPEED)).encode()).hexdigest()[:8]}.wav'
    if not os.path.exists(fn):
        a,sr=k.create(s,voice='am_michael',speed=SPEED,lang='en-us'); sf.write(fn,a,sr)
    a,sr=sf.read(fn,dtype='float32')
    nz=np.where(np.abs(a)>0.012)[0]; a=a[max(0,nz[0]-240):nz[-1]+480]
    gap=0.06 if not show.endswith(('.',':')) else 0.14
    # word times spread by length
    words=show.split(); L=sum(len(w)+1 for w in words); d=len(a)/SR; acc=0; wt=[]
    for w in words:
        dur=d*(len(w)+1)/L; wt.append([w,round(t+acc,3),round(t+acc+dur,3)]); acc+=dur
    tl.append(dict(i=i,text=show,start=round(t,3),end=round(t+d,3),words=wt))
    out.append(a); out.append(np.zeros(int(gap*SR),np.float32)); t+=d+gap
v=np.concatenate(out+[np.zeros(int(0.6*SR),np.float32)]); sf.write(f'{W}/voice.wav',v,SR)
json.dump(tl,open(f'{W}/timeline.json','w'),indent=1); print(round(t,2),'s')
