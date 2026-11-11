"""畫隧道工程那一頁背景的構圖草圖（山的剖面＋一條橫穿的隧道），給 gen.py 以圖生圖用，不會部署。

只用文字生成的背景都是隧道口的拱門，沒有「一條長長的橫向隧道」，所以先自己畫構圖：
上面白色天空＋山頂草地，下面一層一層的岩層，中間一條從左邊一直挖到右邊的隧道（剖開來看得到後牆和一段地面，前面有軌道），右端是還沒挖開的岩壁
usage: python sketch_tunnel.py <輸出.png>   （用 ComfyUI 的 venv 跑）
"""
import math, random, sys
from PIL import Image, ImageDraw

W, H = 1536, 960
random.seed(3)
im = Image.new("RGB", (W, H), (255, 255, 255))
d = ImageDraw.Draw(im)
# 山頂的草地（緩緩的弧線）
top = [(x, 175 + 40 * math.sin(x / W * math.pi * 1.3 + 0.6)) for x in range(0, W + 1, 16)]
d.polygon(top + [(W, H), (0, H)], fill=(160, 104, 62))
d.line(top, fill=(110, 180, 60), width=46)
for x in (240, 300, 1180, 1250):  # 幾棵樹
    y = 175 + 40 * math.sin(x / W * math.pi * 1.3 + 0.6) - 20
    d.rectangle([x - 6, y - 40, x + 6, y], fill=(110, 80, 50))
    d.ellipse([x - 34, y - 100, x + 34, y - 30], fill=(80, 160, 70))
# 岩層：幾條起伏的深淺色帶
for k, (y0, col) in enumerate([(300, (176, 118, 72)), (400, (150, 98, 60)), (900, (128, 84, 52))]):
    band = [(x, y0 + 18 * math.sin(x / 140 + k)) for x in range(0, W + 1, 16)]
    d.polygon(band + [(W, H), (0, H)], fill=col)
for _ in range(60):  # 岩石的裂縫
    x, y = random.randint(0, W), random.randint(260, H)
    d.line([(x, y), (x + random.randint(-60, 60), y + random.randint(10, 50))], fill=(110, 70, 40), width=3)
# 隧道：像剖開的房間，看得到後面的牆和一段地面（機具才可以排前後兩排）
# 牆從 y = 360 到 740，地面從 740 到 930（前面靠近我們的地方有軌道），右端 x = 1400 是還沒挖開的岩壁
TX1, TY0, TF, TY1 = 1400, 360, 740, 930
d.rectangle([0, TY0, TX1, TF], fill=(214, 214, 210))                # 後面的牆（已經做好的內襯）
d.rectangle([0, TY0, TX1, TY0 + 30], fill=(186, 186, 182))          # 頂部比較暗
for x in range(40, TX1 - 200, 120):                                 # 內襯一環一環
    d.line([(x, TY0), (x, TF)], fill=(196, 196, 192), width=6)
d.polygon([(0, TF), (TX1, TF), (TX1 + 20, TY1), (0, TY1)], fill=(172, 168, 158))  # 地面
d.line([(0, TF), (TX1, TF)], fill=(150, 146, 138), width=6)
for y in (TY1 - 40, TY1 - 22):                                      # 前面的軌道
    d.line([(0, y), (TX1 - 40, y)], fill=(90, 90, 96), width=5)
for x in range(0, TX1 - 40, 36):
    d.rectangle([x, TY1 - 44, x + 14, TY1 - 18], fill=(120, 90, 60))
# 右端還沒挖開的岩壁（凹凸的邊）
edge = [(TX1 + random.randint(-20, 20), y) for y in range(TY0, TY1 + 1, 40)]
d.polygon([(TX1 + 40, TY0)] + edge + [(TX1 + 40, TY1)], fill=(150, 98, 60))
d.line(edge, fill=(110, 70, 40), width=6)
im.save(sys.argv[1])
print("sketch:", sys.argv[1])
