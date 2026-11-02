"""把壓路機滾筒側面原本畫的四顆螺栓抹掉（用周圍一圈的平均顏色補），之後由 SVG 畫會轉的螺栓"""
import sys, math
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGBA')
px = im.load()
for bx, by in [(557, 440), (584, 481), (560, 537), (505, 502)]:
    ring = []
    for a in range(0, 360, 10):
        for rr in (11, 13):
            x, y = int(bx + rr * math.cos(math.radians(a))), int(by + rr * math.sin(math.radians(a)))
            ring.append(px[x, y])
    avg = tuple(sum(c[i] for c in ring) // len(ring) for i in range(4))
    for y in range(by - 9, by + 10):
        for x in range(bx - 9, bx + 10):
            d = math.hypot(x - bx, y - by)
            if d <= 8.5:
                px[x, y] = avg
            elif d <= 10:  # 邊緣跟原圖混一半，比較不會看出補過
                o = px[x, y]
                px[x, y] = tuple((o[i] + avg[i]) // 2 for i in range(4))
im.save(sys.argv[2], quality=85, method=6)
