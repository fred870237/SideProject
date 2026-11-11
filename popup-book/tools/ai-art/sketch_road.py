"""畫鋪馬路那一頁背景的構圖草圖（側面看的一條施工中的馬路），給 gen.py 以圖生圖用，不會部署。

只用文字生成的背景，馬路都會變成往遠方延伸的透視，所以先自己畫構圖：
上面白色天空＋遠方山坡和房子，中間一條草地和一排交通錐，下面的馬路分兩條：
後面那條（y 560～770）已經鋪好黑色柏油，前面那條（y 790～960）還是碎石路基（等鋪路機來鋪）
usage: python sketch_road.py <輸出.png>   （用 ComfyUI 的 venv 跑）
"""
import math, random, sys
from PIL import Image, ImageDraw

W, H = 1536, 960
random.seed(5)
im = Image.new("RGB", (W, H), (255, 255, 255))
d = ImageDraw.Draw(im)
# 遠方山坡（兩層）和房子、樹
for k, (y0, amp, col) in enumerate([(360, 60, (150, 205, 110)), (430, 40, (110, 185, 80))]):
    hill = [(x, y0 - amp * math.sin(x / W * math.pi * (2.2 + k) + k)) for x in range(0, W + 1, 16)]
    d.polygon(hill + [(W, 560), (0, 560)], fill=col)
for x in (220, 300, 980, 1060, 1300):
    y = 400 + random.randint(-10, 20)
    d.rectangle([x - 26, y - 34, x + 26, y], fill=(240, 236, 226))
    d.polygon([(x - 34, y - 34), (x, y - 64), (x + 34, y - 34)], fill=(220, 80, 60))
for x in (150, 420, 760, 1200, 1420):
    y = 440 + random.randint(-10, 10)
    d.rectangle([x - 5, y - 30, x + 5, y], fill=(110, 80, 50))
    d.ellipse([x - 26, y - 80, x + 26, y - 22], fill=(70, 150, 60))
# 草地
d.rectangle([0, 500, W, 545], fill=(120, 195, 70))
# 後面那條：已經鋪好的黑色柏油（上面有路緣）
d.rectangle([0, 540, W, 560], fill=(200, 200, 196))
d.rectangle([0, 560, W, 775], fill=(70, 72, 80))
# 中間的分隔（淺色水泥邊）
d.rectangle([0, 775, W, 792], fill=(190, 186, 176))
# 前面那條：碎石路基
d.rectangle([0, 792, W, H], fill=(196, 176, 146))
for _ in range(900):
    x, y = random.randint(0, W), random.randint(796, H)
    c = random.choice([(170, 150, 120), (215, 198, 170), (150, 132, 108)])
    d.ellipse([x - 3, y - 2, x + 3, y + 2], fill=c)
# 交通錐（沿著馬路後面的邊）
for x in range(60, W, 170):
    d.polygon([(x - 16, 556), (x, 506), (x + 16, 556)], fill=(245, 110, 40))
    d.rectangle([x - 9, 524, x + 9, 534], fill=(255, 255, 255))
    d.rectangle([x - 20, 554, x + 20, 560], fill=(245, 110, 40))
im.save(sys.argv[1])
print("sketch:", sys.argv[1])
