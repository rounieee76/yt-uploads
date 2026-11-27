import sys
from PIL import Image
import numpy as np
l,r,out=sys.argv[1:4]
L=Image.open(l).convert('RGB'); R=Image.open(r).convert('RGB')
h=min(L.height,R.height); L=L.resize((round(L.width*h/L.height),h)); R=R.resize((round(R.width*h/R.height),h))
W=Image.new('RGB',(L.width+R.width,h)); W.paste(L,(0,0)); W.paste(R,(L.width,0))
a=np.asarray(W).astype(int); col=a.sum(axis=(0,2)); nz=np.where(col>h*3*12)[0]; right=nz.max()+1
W=W.crop((0,0,right,h)); print(W.size, W.width/h)
W=W.resize((1280,720),Image.LANCZOS); W.save(out,quality=92)
