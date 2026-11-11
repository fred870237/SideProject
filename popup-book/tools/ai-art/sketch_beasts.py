"""畫遠古巨獸裡兩隻動物的輪廓草圖（洋紅色背景），給 gen.py 以圖生圖用，不會部署。

只用文字生成的話，巨犀一定會長出犀牛角、恐象的象牙一定往上翹（AI 只會畫成現代的犀牛和大象），
所以先自己畫出牠們特別的地方：巨犀沒有角、脖子很長、腳很長；恐象的象牙長在下巴、往下往後彎
FLUX schnell 只跑 4 步，denoise 0.7 只會重畫最後 3 步，細節幾乎都照草圖，所以草圖要畫出腳趾、皺紋、深淺兩色
（denoise 再高一點就變成整張重畫，又變回普通的犀牛和大象）
usage: python sketch_beasts.py <輸出資料夾>   （用 ComfyUI 的 venv 跑）
輸出 paraceratherium-sketch.png、deinotherium-sketch.png（1024×768）
"""
import sys, pathlib
from PIL import Image, ImageDraw

out = pathlib.Path(sys.argv[1])
MAG = (255, 0, 255)
GREY, SHADE, DARK, LINE = (158, 160, 166), (132, 134, 142), (112, 114, 122), (120, 122, 130)
NAIL, TUSK, EYE, MOUTH = (236, 232, 222), (246, 240, 220), (30, 30, 34), (90, 80, 85)


def leg(d, x, top, bottom, w0, w1, col):
    """上粗下細一點的腳，腳底有三片腳指甲"""
    d.polygon([(x - w0, top), (x + w0, top), (x + w1, bottom), (x - w1, bottom)], fill=col)
    d.rounded_rectangle([x - w1 - 4, bottom - 16, x + w1 + 4, bottom], 8, fill=col)
    for k in (-1, 0, 1):
        d.ellipse([x + k * w1 * 0.6 - 8, bottom - 10, x + k * w1 * 0.6 + 8, bottom + 2], fill=NAIL)
    for y in range(top + 40, bottom - 40, 34):  # 膝蓋和皺紋
        d.arc([x - w0 + 6, y, x + w0 - 6, y + 18], 200, 340, fill=LINE, width=3)


def wrinkles(d, x0, x1, y0, y1, step=46):
    for x in range(x0, x1, step):
        d.arc([x, y0, x + 40, y1], 250, 290, fill=LINE, width=3)


# ---------- 巨犀：沒有角、長脖子往上舉、長長的腳 ----------
im = Image.new("RGB", (1024, 768), MAG)
d = ImageDraw.Draw(im)
leg(d, 360, 430, 700, 30, 22, DARK)  # 後面兩隻（遠的那一側，比較暗）
leg(d, 660, 430, 700, 30, 22, DARK)
d.polygon([(232, 330), (186, 470), (204, 476), (250, 360)], fill=DARK)          # 尾巴
d.ellipse([196, 476, 216, 506], fill=DARK)
d.ellipse([220, 260, 720, 500], fill=GREY)                                      # 身體
d.chord([220, 260, 720, 500], 20, 160, fill=SHADE)                              # 肚子比較暗
d.polygon([(630, 330), (700, 250), (770, 130), (850, 150), (770, 330), (710, 430)], fill=GREY)  # 長脖子
d.line([(700, 300), (790, 170)], fill=LINE, width=3)
leg(d, 300, 430, 700, 34, 24, GREY)  # 前面兩隻
leg(d, 610, 430, 700, 34, 24, GREY)
d.rounded_rectangle([760, 108, 960, 200], 44, fill=GREY)                       # 長長的頭，鼻子是圓的（沒有角）
d.chord([760, 140, 960, 200], 0, 180, fill=SHADE)
d.polygon([(800, 116), (790, 70), (830, 108)], fill=SHADE)                      # 耳朵
d.ellipse([872, 130, 890, 148], fill=EYE)
d.arc([900, 160, 950, 186], 20, 160, fill=MOUTH, width=4)                       # 微笑的嘴
d.ellipse([936, 136, 948, 148], fill=DARK)                                      # 鼻孔
wrinkles(d, 300, 640, 280, 330)
im.save(out / "paraceratherium-sketch.png")

# ---------- 恐象：大象的身體，短鼻子，象牙長在下巴、往下往後彎 ----------
im = Image.new("RGB", (1024, 768), MAG)
d = ImageDraw.Draw(im)
leg(d, 380, 440, 690, 44, 38, DARK)
leg(d, 680, 440, 690, 44, 38, DARK)
d.polygon([(222, 320), (172, 470), (194, 476), (242, 350)], fill=DARK)
d.ellipse([184, 470, 206, 500], fill=DARK)
d.ellipse([210, 230, 740, 520], fill=GREY)
d.chord([210, 230, 740, 520], 20, 160, fill=SHADE)
leg(d, 300, 440, 690, 46, 40, GREY)
leg(d, 610, 440, 690, 46, 40, GREY)
d.ellipse([620, 170, 860, 400], fill=GREY)                                      # 頭
d.polygon([(820, 300), (880, 320), (890, 440), (870, 470), (850, 455), (836, 340)], fill=GREY)  # 短鼻子
for y in range(340, 450, 22):
    d.line([(842, y), (884, y + 4)], fill=LINE, width=3)
d.ellipse([600, 190, 740, 390], fill=SHADE)                                     # 大耳朵
d.ellipse([620, 210, 724, 370], outline=LINE, width=3)
d.ellipse([764, 244, 782, 262], fill=EYE)
# 象牙：從下巴往下伸，再往後（往左）彎成鉤子
d.line([(800, 392), (812, 470), (792, 530), (742, 548)], fill=TUSK, width=28, joint="curve")
d.ellipse([728, 534, 756, 562], fill=TUSK)
wrinkles(d, 280, 640, 260, 310)
im.save(out / "deinotherium-sketch.png")
print("sketches:", out)
