"""畫 Bagger（斗輪挖掘機）的構圖草圖，給 gen.py 以圖生圖用（init 圖），不會部署。

AI 不認識 Bagger 293，只用文字生成的比例都不對；直接拿網路上的照片以圖生圖又等於改作別人拍的照片。
所以這裡看著照片，用程式自己畫一張草圖：照實際機器的樣子安排轉輪、長吊臂、兩座高塔、拉索、機身、履帶、配重臂、卸料橋，
再讓 FLUX 照這個構圖畫成繪本風格（denoise 約 0.75，構圖才會留下來）。草圖畫得越細，結果越好。

usage: python sketch_bagger.py <輸出.png>
用 ComfyUI 的 venv 跑（Pillow）
"""
import math, sys
from PIL import Image, ImageDraw

W, H = 1792, 896
GREEN = (0, 255, 0)
STEEL, STEEL_D, STEEL_L = (150, 155, 162), (112, 117, 124), (186, 190, 196)
DARK = (74, 78, 86)
RUST, RUST_D, RUST_L = (146, 80, 42), (106, 56, 28), (176, 104, 60)
TRACK = (58, 60, 66)
CABLE = (66, 70, 77)
WIN = (78, 92, 108)

im = Image.new("RGB", (W, H), GREEN)
d = ImageDraw.Draw(im)


def truss(x0, y0, x1, y1, depth, n, w=7, rail=True):
    """桁架：上下兩條弦桿＋直桿＋斜撐（沿 (x0,y0)→(x1,y1)，往下 depth）；rail＝上面加走道欄杆"""
    dx, dy = x1 - x0, y1 - y0
    L = math.hypot(dx, dy)
    nx, ny = -dy / L * depth, dx / L * depth
    top = [(x0 + dx * i / n, y0 + dy * i / n) for i in range(n + 1)]
    bot = [(x + nx, y + ny) for x, y in top]
    for i in range(n):
        d.line([top[i], bot[i + 1]], fill=STEEL_D, width=w)
        d.line([bot[i], top[i + 1]], fill=STEEL_D, width=w - 2)
        d.line([top[i], bot[i]], fill=STEEL, width=w)
    d.line([top[n], bot[n]], fill=STEEL, width=w)
    d.line(top, fill=STEEL_L, width=w + 5)
    d.line(bot, fill=STEEL, width=w + 5)
    if rail:  # 走道欄杆
        rx, ry = -nx / depth * 16, -ny / depth * 16
        d.line([(x + rx, y + ry) for x, y in top], fill=STEEL_D, width=3)
        for i in range(0, n * 3 + 1):
            x, y = x0 + dx * i / (n * 3), y0 + dy * i / (n * 3)
            d.line([(x, y), (x + rx, y + ry)], fill=STEEL_D, width=3)


def lattice_tower(base, top, half_b, half_t, n, lean_light=True):
    """格子塔：base、top 是中心線兩端；half_b、half_t 是底部、頂部半寬"""
    (bx, by), (tx, ty) = base, top
    L = [(bx - half_b + (tx - half_t - bx + half_b) * i / n, by + (ty - by) * i / n) for i in range(n + 1)]
    R = [(bx + half_b + (tx + half_t - bx - half_b) * i / n, by + (ty - by) * i / n) for i in range(n + 1)]
    for i in range(n):
        d.line([L[i], R[i + 1]], fill=STEEL_D, width=6)
        d.line([R[i], L[i + 1]], fill=STEEL_D, width=5)
        d.line([L[i], R[i]], fill=STEEL, width=6)
    d.line(L, fill=STEEL_L, width=15)
    d.line(R, fill=STEEL_D, width=15)
    d.rectangle([tx - half_t - 14, ty - 22, tx + half_t + 14, ty + 6], fill=STEEL)   # 頂端的滑輪座
    d.ellipse([tx - 14, ty - 34, tx + 14, ty - 6], fill=DARK)
    return (tx, ty - 10)


def railing(x0, x1, y, h=18):
    d.line([(x0, y - h), (x1, y - h)], fill=STEEL_D, width=3)
    for x in range(int(x0), int(x1) + 1, 14):
        d.line([(x, y), (x, y - h)], fill=STEEL_D, width=2)


def cables(src, pts, n=2, gap=7):
    """一束平行的鋼索"""
    for k in range(n):
        o = (k - (n - 1) / 2) * gap
        for x, y in pts:
            d.line([(src[0] + o, src[1]), (x + o, y)], fill=CABLE, width=4)


# ---------- 右下：長長的卸料橋（在機身後面） ----------
truss(1290, 690, 1785, 640, 46, 8, rail=False)
d.rectangle([1700, 660, 1730, 760], fill=STEEL_D)              # 卸料橋的支腳

# ---------- 下部：好幾組履帶＋斜腳的底座 ----------
for x0 in (845, 1000, 1155):
    d.rounded_rectangle([x0, 800, x0 + 145, 856], 26, fill=TRACK)
    d.rounded_rectangle([x0 + 8, 806, x0 + 137, 820], 7, fill=(84, 87, 94))
    for k in range(5):
        d.ellipse([x0 + 14 + k * 25, 822, x0 + 36 + k * 25, 844], fill=(98, 101, 108))
    d.polygon([(x0 + 20, 800), (x0 + 125, 800), (x0 + 105, 760), (x0 + 40, 760)], fill=STEEL_D)  # 履帶上的斜腳
d.rectangle([860, 730, 1300, 762], fill=STEEL)
d.rectangle([860, 752, 1300, 762], fill=STEEL_D)
d.polygon([(905, 730), (1255, 730), (1225, 668), (935, 668)], fill=STEEL)          # 轉台
d.rectangle([935, 690, 1225, 700], fill=STEEL_D)
railing(905, 1255, 730)

# ---------- 往左的斗輪臂（很長、水平） ----------
truss(360, 470, 930, 540, 72, 8)

# ---------- 機身：好幾層的機房＋平台 ----------
d.rectangle([890, 560, 1290, 668], fill=STEEL)
d.rectangle([890, 640, 1290, 668], fill=STEEL_D)
d.rectangle([960, 505, 1230, 560], fill=STEEL_L)                # 上層機房
d.rectangle([960, 545, 1230, 560], fill=STEEL)
for k in range(7):
    d.rectangle([905 + k * 54, 580, 935 + k * 54, 606], fill=WIN)
for k in range(5):
    d.rectangle([975 + k * 50, 515, 1000 + k * 50, 535], fill=WIN)
railing(890, 1290, 560)
railing(960, 1230, 505)
for x in (1240, 1268):  # 樓梯
    d.line([(x, 668), (x + 22, 560)], fill=STEEL_D, width=4)

# ---------- 右邊：往上斜的配重臂＋末端的機房和小吊車 ----------
truss(1280, 545, 1600, 455, 54, 5)
d.rectangle([1540, 385, 1720, 470], fill=STEEL)
d.rectangle([1540, 448, 1720, 470], fill=STEEL_D)
d.rectangle([1560, 400, 1600, 425], fill=WIN)
d.rectangle([1620, 400, 1660, 425], fill=WIN)
railing(1540, 1720, 385)
d.line([(1650, 385), (1690, 290), (1735, 330)], fill=STEEL_D, width=9)         # 小吊桿
d.line([(1735, 330), (1735, 372)], fill=CABLE, width=3)

# ---------- 兩座高塔：左邊往左斜的 A 字塔、右邊直直的最高塔 ----------
ta = lattice_tower((900, 560), (965, 115), 46, 22, 9)
tb = lattice_tower((1120, 505), (1120, 60), 34, 24, 10)

# ---------- 斗輪旁邊的機箱（轉輪後面） ----------
d.rectangle([300, 420, 430, 560], fill=STEEL)
d.rectangle([300, 520, 430, 560], fill=STEEL_D)
for k in range(4):
    d.line([(310, 435 + k * 22), (420, 435 + k * 22)], fill=STEEL_D, width=3)
d.rectangle([340, 395, 372, 420], fill=STEEL_D)                 # 機箱上的小煙囪

# ---------- 斗輪：鏽紅色的大輪子，一圈杯子形的鏟斗，鏟斗口有齒 ----------
cx, cy, R = 250, 495, 160
N = 18
for k in range(N):  # 鏟斗（畫在輪框後面一點點，杯子口朝外）
    a = 2 * math.pi * k / N - math.pi / 2
    ca, sa = math.cos(a), math.sin(a)
    def p(r, t):
        return (cx + ca * r - sa * t, cy + sa * r + ca * t)
    d.polygon([p(R - 22, -20), p(R + 34, -30), p(R + 40, 4), p(R + 30, 28), p(R - 22, 20)], fill=RUST)
    d.polygon([p(R + 6, -24), p(R + 34, -30), p(R + 40, 4), p(R + 16, 6)], fill=RUST_L)
    for t in (-26, -12, 2, 16):  # 鏟斗口的齒
        d.polygon([p(R + 36, t), p(R + 52, t + 4), p(R + 36, t + 9)], fill=STEEL_L)
d.ellipse([cx - R, cy - R, cx + R, cy + R], fill=RUST)
d.ellipse([cx - R + 22, cy - R + 22, cx + R - 22, cy + R - 22], fill=RUST_D)
for k in range(9):  # 輪輻
    a = 2 * math.pi * k / 9
    d.line([(cx, cy), (cx + math.cos(a) * (R - 26), cy + math.sin(a) * (R - 26))], fill=RUST, width=16)
d.ellipse([cx - 50, cy - 50, cx + 50, cy + 50], fill=STEEL)
d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=STEEL_D)

# ---------- 拉索：塔頂拉到斗輪臂、兩塔之間、配重臂 ----------
cables(ta, [(400, 470), (520, 485), (640, 500), (760, 514)])
cables(tb, [(470, 478), (700, 508)], n=2)
cables(tb, [(1380, 518), (1500, 482), (1590, 458)], n=2)
d.line([ta, tb], fill=CABLE, width=5)

im.save(sys.argv[1])
print("sketch:", sys.argv[1])
