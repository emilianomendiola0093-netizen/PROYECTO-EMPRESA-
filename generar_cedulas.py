from openpyxl import Workbook
from openpyxl.styles import (
    Font, PatternFill, Alignment, Border, Side,
    GradientFill
)
from openpyxl.utils import get_column_letter
from openpyxl.styles.numbers import FORMAT_NUMBER_COMMA_SEPARATED1

# ── Paleta de colores ──────────────────────────────────────────────────────
GOLD       = "D4A017"
GOLD_LIGHT = "F0C842"
GOLD_PALE  = "FDF0C0"
BROWN_DARK = "3B2407"
BROWN      = "5C3D11"
CREAM      = "FDF8EF"
WHITE      = "FFFFFF"
GRAY_LIGHT = "EDE8DF"
GREEN_DARK = "1B5E20"
GREEN_LIGHT= "E8F5E9"
RED_DARK   = "B71C1C"
RED_LIGHT  = "FFEBEE"
BLUE_DARK  = "0D47A1"
BLUE_LIGHT = "E3F2FD"

MXN = '#,##0.00'
PCT = '0.0000'

def fill(hex_): return PatternFill("solid", fgColor=hex_)
def font(bold=False, color="000000", size=10, italic=False):
    return Font(bold=bold, color=color, size=size, italic=italic,
                name="Calibri")
def border_thin():
    s = Side(style="thin", color="CCCCCC")
    return Border(left=s, right=s, top=s, bottom=s)
def border_medium():
    s = Side(style="medium", color="888888")
    return Border(left=s, right=s, top=s, bottom=s)
def border_bottom(thick=False):
    s = Side(style="medium" if thick else "thin", color="888888")
    return Border(bottom=s)
def center(): return Alignment(horizontal="center", vertical="center", wrap_text=True)
def left():   return Alignment(horizontal="left",   vertical="center", wrap_text=True)
def right():  return Alignment(horizontal="right",  vertical="center")

def style_header(ws, row, col, text, bg=BROWN_DARK, fg=WHITE,
                 bold=True, size=10, colspan=1, center_=True):
    c = ws.cell(row=row, column=col, value=text)
    c.fill = fill(bg)
    c.font = font(bold=bold, color=fg, size=size)
    c.alignment = center() if center_ else left()
    c.border = border_thin()
    if colspan > 1:
        ws.merge_cells(start_row=row, start_column=col,
                       end_row=row,   end_column=col+colspan-1)
    return c

def style_label(ws, row, col, text, bg=GRAY_LIGHT, bold=False):
    c = ws.cell(row=row, column=col, value=text)
    c.fill = fill(bg)
    c.font = font(bold=bold)
    c.alignment = left()
    c.border = border_thin()
    return c

def style_value(ws, row, col, value, fmt=MXN, bg=WHITE, bold=False, color="000000"):
    c = ws.cell(row=row, column=col, value=value)
    c.fill = fill(bg)
    c.font = font(bold=bold, color=color)
    c.alignment = right()
    c.number_format = fmt
    c.border = border_thin()
    return c

def style_total(ws, row, col, value, fmt=MXN, bg=GOLD_PALE, color=BROWN_DARK):
    c = ws.cell(row=row, column=col, value=value)
    c.fill = fill(bg)
    c.font = font(bold=True, color=color)
    c.alignment = right()
    c.number_format = fmt
    c.border = border_medium()
    return c

def style_formula(ws, row, col, formula, fmt=MXN, bg=WHITE, bold=False, color="000000"):
    c = ws.cell(row=row, column=col, value=formula)
    c.fill = fill(bg)
    c.font = font(bold=bold, color=color)
    c.alignment = right()
    c.number_format = fmt
    c.border = border_thin()
    return c

def add_title(ws, row, text, colspan=10):
    c = ws.cell(row=row, column=1, value=text)
    c.fill = fill(BROWN_DARK)
    c.font = Font(bold=True, color=WHITE, size=13, name="Calibri")
    c.alignment = center()
    ws.merge_cells(start_row=row, start_column=1,
                   end_row=row+1, end_column=colspan)
    ws.row_dimensions[row].height = 28
    ws.row_dimensions[row+1].height = 18
    return row + 2

def add_subtitle(ws, row, text, colspan=10, bg=GOLD, fg=BROWN_DARK):
    c = ws.cell(row=row, column=1, value=text)
    c.fill = fill(bg)
    c.font = Font(bold=True, color=fg, size=10, name="Calibri")
    c.alignment = center()
    ws.merge_cells(start_row=row, start_column=1,
                   end_row=row, end_column=colspan)
    ws.row_dimensions[row].height = 18
    return row + 1

def add_nota(ws, row, text, colspan=10, bg=BLUE_LIGHT, color=BLUE_DARK):
    c = ws.cell(row=row, column=1, value=text)
    c.fill = fill(bg)
    c.font = Font(color=color, size=8, italic=True, name="Calibri")
    c.alignment = Alignment(horizontal="left", vertical="center",
                            wrap_text=True)
    ws.merge_cells(start_row=row, start_column=1,
                   end_row=row, end_column=colspan)
    ws.row_dimensions[row].height = 28
    return row + 1

def add_formula_row(ws, row, text, bgcolor=GREEN_LIGHT, color=GREEN_DARK, colspan=10, bg=None):
    if bg is not None: bgcolor = bg
    c = ws.cell(row=row, column=1, value=text)
    c.fill = fill(bgcolor)
    c.font = Font(color=color, size=9, italic=True, bold=True, name="Calibri")
    c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    ws.merge_cells(start_row=row, start_column=1,
                   end_row=row, end_column=colspan)
    ws.row_dimensions[row].height = 22
    return row + 1

def empresa_header(ws, colspan=10):
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=colspan)
    c = ws['A1']
    c.value = "Óleum Natura S.A. de C.V.  |  RFC: OLN  |  Tehuacán, Puebla — CBTIS 229"
    c.fill = fill(BROWN_DARK)
    c.font = Font(bold=True, color=WHITE, size=11, name="Calibri")
    c.alignment = center()
    ws.row_dimensions[1].height = 22

    ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=colspan)
    c2 = ws['A2']
    c2.value = ("Grupo: 4°H Turno Vespertino  |  Especialidad: Contabilidad  |  "
                "Módulo: Personas Morales  |  Docente: C.P. Gabriela M.")
    c2.fill = fill(GOLD)
    c2.font = Font(bold=True, color=BROWN_DARK, size=9, name="Calibri")
    c2.alignment = center()
    ws.row_dimensions[2].height = 16

wb = Workbook()
wb.remove(wb.active)

# ═══════════════════════════════════════════════════════════════════════════
# CÉDULA 1 — COEFICIENTE DE UTILIDAD
# ═══════════════════════════════════════════════════════════════════════════
ws1 = wb.create_sheet("Cédula 1 - CU")
ws1.column_dimensions['A'].width = 42
ws1.column_dimensions['B'].width = 20
ws1.column_dimensions['C'].width = 20
ws1.column_dimensions['D'].width = 38

empresa_header(ws1, 4)
r = 3
ws1.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
c = ws1.cell(row=r, column=1,
             value="CÉDULA 1 — COEFICIENTE DE UTILIDAD (CU) — Art. 14 LISR — Ejercicio 2026")
c.fill = fill(BROWN_DARK); c.font = Font(bold=True, color=WHITE, size=12, name="Calibri")
c.alignment = center(); ws1.row_dimensions[r].height = 26
r = 5

add_formula_row(ws1, r,
    "📐 FÓRMULA: CU = (Utilidad Fiscal Ejercicio Anterior + PTU pagada en el ejercicio) ÷ Ingresos Nominales del Ejercicio Anterior",
    colspan=4); r += 1

add_nota(ws1, r,
    "El CU se obtiene con datos del ejercicio inmediato anterior (2025) y se aplica igual a todos los meses del ejercicio 2026.",
    colspan=4); r += 1

# Encabezados tabla CU
style_header(ws1, r, 1, "CONCEPTO", BROWN_DARK, WHITE, colspan=1)
style_header(ws1, r, 2, "EJERCICIO 2024", BROWN_DARK, WHITE)
style_header(ws1, r, 3, "EJERCICIO 2025", BROWN_DARK, WHITE)
style_header(ws1, r, 4, "RAZÓN / FUENTE", BROWN_DARK, WHITE)
ws1.row_dimensions[r].height = 20; r += 1

rows_cu = [
    ("Ingresos Nominales del Ejercicio",   3_633_450.00,   4_863_270.72,
     "Suma de todos los ingresos del año, sin IVA"),
    ("Utilidad Fiscal",                      958_600.00,   1_032_600.00,
     "Ingresos - Deducciones autorizadas - Depreciaciones"),
    ("PTU pagada en el año siguiente",        185_600.00,     245_600.00,
     "La PTU del ejercicio se paga al año siguiente (mayo)"),
    ("Utilidad + PTU",                      1_144_200.00,   1_278_200.00,
     "= Utilidad Fiscal + PTU pagada — numerador del CU"),
]
for label, v24, v25, nota in rows_cu:
    style_label(ws1, r, 1, label)
    style_value(ws1, r, 2, v24)
    style_value(ws1, r, 3, v25)
    style_label(ws1, r, 4, nota, bg=WHITE)
    r += 1

# CU result rows
style_label(ws1, r, 1, "Coeficiente de Utilidad (CU)", bg=GOLD_PALE, bold=True)
style_value(ws1, r, 2, 958600+185600,   fmt='0.0000', bg=GOLD_PALE)
style_value(ws1, r, 3, 1032600+245600, fmt='0.0000', bg=GOLD_PALE)
style_label(ws1, r, 4, "CU 2026 usa datos de 2025", bg=GOLD_PALE)
r += 1

style_label(ws1, r, 1, "÷ Ingresos Nominales", bg=CREAM)
style_value(ws1, r, 2, 3_633_450.00, bg=CREAM)
style_value(ws1, r, 3, 4_863_270.72, bg=CREAM)
r += 1

style_label(ws1, r, 1, "= CU APLICABLE AL EJERCICIO 2026", bg=GOLD_PALE, bold=True)
style_value(ws1, r, 2, round(1_144_200/3_633_450, 4), fmt='0.0000',
            bg=GRAY_LIGHT, bold=True)
style_total(ws1, r, 3, 0.2630, fmt='0.0000')
style_label(ws1, r, 4, "Se aplica: 0.2630 (redondeado a 4 decimales, Art. 14)", bg=GOLD_PALE)
ws1.row_dimensions[r].height = 22; r += 2

add_nota(ws1, r,
    "⚠ IMPORTANTE: El CU se FIJA al inicio del ejercicio y es el mismo para los 12 meses. "
    "Si el SAT tiene datos distintos del contribuyente, puede impugnar el CU calculado.",
    colspan=4); r += 1

add_formula_row(ws1, r,
    "✅ CU 2026 = (1,032,600 + 245,600) ÷ 4,863,270.72 = 1,278,200 ÷ 4,863,270.72 = 0.2630",
    bg=GREEN_LIGHT, color=GREEN_DARK, colspan=4); r += 1

# ═══════════════════════════════════════════════════════════════════════════
# CÉDULA 2 — PAGOS PROVISIONALES ISR
# ═══════════════════════════════════════════════════════════════════════════
ws2 = wb.create_sheet("Cédula 2 - Pagos Provisionales")
meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
         "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
ncols = 15  # label + 12 meses + total

for i, w in enumerate([38, 13,13,13,13,13,13,13,13,14,13,13,13, 14], start=1):
    ws2.column_dimensions[get_column_letter(i)].width = w

empresa_header(ws2, ncols)
r = 3
ws2.merge_cells(start_row=r, start_column=1, end_row=r, end_column=ncols)
c = ws2.cell(row=r, column=1,
    value="CÉDULA 2 — PAGOS PROVISIONALES DE ISR — Art. 14 LISR — Ejercicio 2026")
c.fill=fill(BROWN_DARK); c.font=Font(bold=True,color=WHITE,size=12,name="Calibri")
c.alignment=center(); ws2.row_dimensions[r].height=26; r=5

add_formula_row(ws2, r,
    "📐 FÓRMULA MENSUAL: Ingr.Acum × CU - PTU pagada (desde mayo) = Base Gravable  →  × 30% ISR  →  - ISR acumulado pagado = Pago Provisional del mes",
    colspan=ncols); r+=1
add_nota(ws2, r,
    "CU = 0.2630 | PTU deducible desde mayo 2026 ($245,600) | Tasa ISR Art. 9 = 30% | Fecha límite: día 17 del mes siguiente",
    colspan=ncols); r+=1

# Header mes
style_header(ws2, r, 1, "CONCEPTO", BROWN_DARK, WHITE)
for i, m in enumerate(meses, 2):
    style_header(ws2, r, i, m, BROWN_DARK, WHITE)
style_header(ws2, r, 14, "ANUAL", GOLD, BROWN_DARK)
ws2.row_dimensions[r].height = 30; r+=1

# Data
ing_nom = [1_850_326.00, 2_035_358.60, 2_238_894.46, 2_462_783.91,
           2_709_062.30, 2_979_968.53, 3_277_965.38, 3_605_761.92,
           3_966_338.11, 4_362_971.92, 4_799_269.11, 5_279_196.02]

CU = 0.2630
PTU_ded = 245_600.00
TASA = 0.30

# Compute acumulados
ing_acum = []
total = 0
for v in ing_nom:
    total += v
    ing_acum.append(round(total, 2))

# Utilidad fiscal estimada acumulada
uf_acum = [round(v * CU, 2) for v in ing_acum]

# PTU deducible acumulado (desde mayo = mes 5)
ptu_acu = [0,0,0,0, PTU_ded, PTU_ded, PTU_ded, PTU_ded,
           PTU_ded, PTU_ded, PTU_ded, PTU_ded]

# Base gravable
base = [round(uf_acum[i] - ptu_acu[i], 2) for i in range(12)]

# ISR acumulado
isr_acum = [round(b * TASA, 2) for b in base]

# ISR pagado acumulado antes de este mes (es el isr_acum del mes anterior)
isr_pagado = [0] + isr_acum[:-1]

# Pago del mes
pago_mes = [round(isr_acum[i] - isr_pagado[i], 2) for i in range(12)]

rows_data = [
    ("Ingresos nominales del periodo",    ing_nom,  MXN, WHITE, False),
    ("Ingresos acumulados del periodo",   ing_acum, MXN, CREAM, False),
    ("× Coeficiente de Utilidad (0.2630)",
     [CU]*12, '0.0000', GRAY_LIGHT, False),
    ("= Utilidad fiscal estimada acum.", uf_acum, MXN, CREAM, False),
    ("(–) PTU pagada acumulada",          ptu_acu,  MXN, RED_LIGHT, False),
    ("= BASE GRAVABLE acumulada",         base,     MXN, GOLD_PALE, True),
    ("× Tasa ISR (30%)",                  [TASA]*12,'0%', GRAY_LIGHT, False),
    ("= ISR acumulado",                   isr_acum, MXN, CREAM, False),
    ("(–) ISR pagado acumulado",          isr_pagado,MXN,RED_LIGHT, False),
    ("= PAGO PROVISIONAL DEL MES",        pago_mes, MXN, GOLD_PALE, True),
]

for label, vals, fmt, bg, bold in rows_data:
    style_label(ws2, r, 1, label, bg=bg if bold else GRAY_LIGHT, bold=bold)
    for i, v in enumerate(vals, 2):
        if bold:
            style_total(ws2, r, i, v, fmt=fmt)
        else:
            style_value(ws2, r, i, v, fmt=fmt, bg=bg)
    # Total anual
    if label in ("Ingresos nominales del periodo",
                 "= PAGO PROVISIONAL DEL MES"):
        style_total(ws2, r, 14, round(sum(vals),2), fmt=fmt)
    elif label in ("= ISR acumulado",):
        style_total(ws2, r, 14, isr_acum[-1], fmt=fmt)
    elif label == "Ingresos acumulados del periodo":
        style_total(ws2, r, 14, ing_acum[-1], fmt=fmt)
    elif label == "= BASE GRAVABLE acumulada":
        style_total(ws2, r, 14, base[-1], fmt=fmt)
    else:
        ws2.cell(row=r, column=14).fill = fill(GRAY_LIGHT)
    ws2.row_dimensions[r].height = 18
    r += 1

r += 1
add_nota(ws2, r,
    f"✅ Total pagos provisionales ISR 2026: ${sum(pago_mes):,.2f} "
    f"= ISR Anual determinado en Cédula 6 menos diferencia de $958.55",
    colspan=ncols); r+=1
add_nota(ws2, r,
    "⚠ La PTU 2025 ($245,600) se volvió deducible en MAYO 2026, mes en que se pagó efectivamente (Art. 14 LISR pár. 6).",
    colspan=ncols, bg=RED_LIGHT, color=RED_DARK); r+=1

# ═══════════════════════════════════════════════════════════════════════════
# CÉDULA 3 — DEPRECIACIONES ACTUALIZADAS
# ═══════════════════════════════════════════════════════════════════════════
ws3 = wb.create_sheet("Cédula 3 - Depreciaciones")
cols3 = [("Fecha\nAdq.", 12), ("Días\nUso", 7),
         ("Bien / Activo", 30), ("MOI\n(Costo)", 14),
         ("Tasa\nLISR", 7), ("Dep.\nAnual", 14),
         ("Meses\nEjercicio", 8), ("Dep.\nMensual", 12),
         ("Meses\nUso", 7), ("Dep.\nHistórica", 14),
         ("INPC\nAdq.", 9), ("INPC\nJun 2026", 9),
         ("Factor\nActz.", 9), ("Dep.\nActualizada", 15)]
for i, (_, w) in enumerate(cols3, 1):
    ws3.column_dimensions[get_column_letter(i)].width = w

empresa_header(ws3, 14)
r = 3
ws3.merge_cells(start_row=r, start_column=1, end_row=r, end_column=14)
c = ws3.cell(row=r, column=1,
    value="CÉDULA 3 — DEPRECIACIONES ACTUALIZADAS — Arts. 31, 34 y 35 LISR — Ejercicio 2026")
c.fill=fill(BROWN_DARK); c.font=Font(bold=True,color=WHITE,size=12,name="Calibri")
c.alignment=center(); ws3.row_dimensions[r].height=26; r=5

add_formula_row(ws3, r,
    "📐 FÓRMULAS:  Dep. Histórica = MOI × Tasa × (Meses uso ÷ 12)   |   "
    "Factor = INPC Junio 2026 ÷ INPC mes de adquisición   |   "
    "Dep. Actualizada = Dep. Histórica × Factor",
    colspan=14); r+=1
add_nota(ws3, r,
    "INPC Junio 2026 = 146.910 (último mes de la primera mitad del ejercicio, Art. 6 LISR). "
    "Tasas: Art. 34 — Vehículos 25% · Radio comunicación 25% · Mobiliario 10% | Art. 35 — Cómputo 30%",
    colspan=14); r+=1

# Encabezados
for i, (h, _) in enumerate(cols3, 1):
    style_header(ws3, r, i, h, BROWN_DARK, WHITE)
ws3.row_dimensions[r].height = 40; r+=1

activos = [
    ("14/03/2024", 1825, "Camioneta marca Ford",
     458_600.00, 0.25, 132.850),
    ("18/09/2024", 1236, "LAPTOP MAC",
     135_820.00, 0.30, 135.480),
    ("12/02/2025",  745, "Radio de comunicación",
      86_742.00, 0.25, 137.820),
    ("15/04/2025", 1236, "Escritorio, archivero y librero",
      45_830.00, 0.10, 138.960),
    ("14/05/2026", 1369, "Camioneta Frontier",
     650_900.00, 0.25, 145.955),
]
INPC_JUN = 146.910
meses_uso_list = [12, 12, 12, 12, 8]

dep_hist_total = 0
dep_act_total  = 0

for idx, (fecha, dias, bien, moi, tasa, inpc_adq) in enumerate(activos):
    meses_ej = 12
    meses_uso = meses_uso_list[idx]
    dep_anual = round(moi * tasa, 2)
    dep_mens  = round(dep_anual / meses_ej, 2)
    dep_hist  = round(dep_mens * meses_uso, 2)
    factor    = round(INPC_JUN / inpc_adq, 4)
    dep_act   = round(dep_hist * factor, 2)
    dep_hist_total += dep_hist
    dep_act_total  += dep_act

    bg = CREAM if idx % 2 == 0 else WHITE
    vals = [fecha, dias, bien, moi, tasa, dep_anual,
            meses_ej, dep_mens, meses_uso, dep_hist,
            inpc_adq, INPC_JUN, factor, dep_act]
    fmts = [None, '0', None, MXN, '0%', MXN,
            '0', MXN, '0', MXN, '0.000', '0.000', '0.0000', MXN]
    for col, (v, fmt) in enumerate(zip(vals, fmts), 1):
        c = ws3.cell(row=r, column=col, value=v)
        c.fill = fill(bg)
        c.font = font()
        c.border = border_thin()
        if fmt:
            c.number_format = fmt
            c.alignment = right() if col > 3 else left()
        else:
            c.alignment = center() if col in (1,2) else left()
    ws3.row_dimensions[r].height = 18; r+=1

# Total row
ws3.merge_cells(start_row=r, start_column=1, end_row=r, end_column=9)
c = ws3.cell(row=r, column=1, value="TOTALES")
c.fill=fill(GOLD_PALE); c.font=font(bold=True,color=BROWN_DARK)
c.alignment=Alignment(horizontal="right")
style_total(ws3, r, 10, round(dep_hist_total,2))
ws3.cell(row=r, column=11).fill=fill(GOLD_PALE)
ws3.cell(row=r, column=12).fill=fill(GOLD_PALE)
ws3.cell(row=r, column=13).fill=fill(GOLD_PALE)
style_total(ws3, r, 14, round(dep_act_total,2))
ws3.row_dimensions[r].height = 20; r+=2

# Actualización
act_inv = round(dep_act_total - dep_hist_total, 2)
add_nota(ws3, r,
    f"Depreciación histórica total: ${dep_hist_total:,.2f}   |   "
    f"Depreciación actualizada total: ${dep_act_total:,.2f}   |   "
    f"Actualización de inversiones (diferencia): ${act_inv:,.2f}",
    colspan=14); r+=1
add_nota(ws3, r,
    "⚠ La Camioneta Frontier (adquirida 14/05/2026, INPC adq = 145.955) solo se deprecia 8 meses "
    "(mayo–dic 2026). Su factor es mínimo (1.0065) porque casi no hubo inflación entre mayo y junio.",
    colspan=14, bg=RED_LIGHT, color=RED_DARK); r+=1
add_formula_row(ws3, r,
    f"✅ Dep. actualizada total a deducir en Cédula 6: ${dep_act_total:,.2f}  |  "
    f"Actualización de inversiones para Cédula 5: ${act_inv:,.2f}",
    colspan=14); r+=1

# ═══════════════════════════════════════════════════════════════════════════
# CÉDULA 4 — AJUSTE ANUAL POR INFLACIÓN
# ═══════════════════════════════════════════════════════════════════════════
ws4 = wb.create_sheet("Cédula 4 - Ajuste Inflación")
for i, w in enumerate([32,9,9,9,9,9,9,9,9,9,9,9,9,12], 1):
    ws4.column_dimensions[get_column_letter(i)].width = w

empresa_header(ws4, 14)
r = 3
ws4.merge_cells(start_row=r, start_column=1, end_row=r, end_column=14)
c = ws4.cell(row=r, column=1,
    value="CÉDULA 4 — AJUSTE ANUAL POR INFLACIÓN ACUMULABLE O DEDUCIBLE — Art. 44 LISR — Ejercicio 2026")
c.fill=fill(BROWN_DARK); c.font=Font(bold=True,color=WHITE,size=12,name="Calibri")
c.alignment=center(); ws4.row_dimensions[r].height=26; r=5

add_formula_row(ws4, r,
    "📐 FÓRMULA: (Promedio créditos − Promedio deudas) × Factor INPC = Ajuste acumulable (ingreso) o deducible (gasto)"
    "   |   Factor = (INPC Dic 2026 − INPC Dic 2025) ÷ INPC Dic 2025",
    colspan=14); r+=1
add_nota(ws4, r,
    "INPC Dic 2026 = 147.882 | INPC Dic 2025 = 141.200 | "
    "Factor = (147.882 − 141.200) ÷ 141.200 = 6.682 ÷ 141.200 = 0.0473",
    colspan=14); r+=1

# ── CRÉDITOS ──
r = add_subtitle(ws4, r, "PARTE A — SALDO ANUAL DE CRÉDITOS (Art. 44 fracc. I LISR)", colspan=14)

style_header(ws4, r, 1, "CONCEPTO", BROWN_DARK, WHITE)
for i, m in enumerate(meses, 2):
    style_header(ws4, r, i, m, BROWN_DARK, WHITE)
style_header(ws4, r, 14, "SUMA", GOLD, BROWN_DARK)
ws4.row_dimensions[r].height = 20; r+=1

creditos = {
    "Bancos":          [175890,193479,212827,234110,257521,283273,311600,342760,377036,122745,135020,148521],
    "Clientes":        [458600,504460,554906,610397,671436,738580,812438,893682,983050,1081355,1189490,1308439],
    "Deudores diversos":[125600,138160,151976,167174,183891,202280,222508,244759,269235,296158,325774,358351],
    "Inversiones":     [250000,275000,302500,332750,366025,402628,442890,487179,535897,589487,648436,713279],
    "Saldos a favor":  [8500,  9350,  10285, 11314, 12445, 13689, 15058, 16564, 18221, 20043, 22047, 24251],
}
suma_cred = [0]*12
for label, vals in creditos.items():
    style_label(ws4, r, 1, label)
    for i, v in enumerate(vals, 2):
        style_value(ws4, r, i, v)
        suma_cred[i-2] += v
    style_value(ws4, r, 14, sum(vals))
    ws4.row_dimensions[r].height = 16; r+=1

# Sumas
style_label(ws4, r, 1, "SUMAS", bg=GOLD_PALE, bold=True)
for i, v in enumerate(suma_cred, 2):
    style_total(ws4, r, i, v)
style_total(ws4, r, 14, sum(suma_cred))
ws4.row_dimensions[r].height = 18; r+=1

promedio_cred = round(sum(suma_cred)/12, 2)
style_label(ws4, r, 1, f"÷ 12 meses = PROMEDIO DE CRÉDITOS", bg=GREEN_LIGHT, bold=True)
ws4.merge_cells(start_row=r, start_column=2, end_row=r, end_column=13)
style_total(ws4, r, 14, promedio_cred)
ws4.row_dimensions[r].height = 18; r+=2

# ── DEUDAS ──
r = add_subtitle(ws4, r, "PARTE B — SALDO ANUAL DE DEUDAS (Art. 44 fracc. II LISR)", colspan=14)

style_header(ws4, r, 1, "CONCEPTO", BROWN_DARK, WHITE)
for i, m in enumerate(meses, 2):
    style_header(ws4, r, i, m, BROWN_DARK, WHITE)
style_header(ws4, r, 14, "SUMA", GOLD, BROWN_DARK)
ws4.row_dimensions[r].height = 20; r+=1

deudas = {
    "Proveedores":       [285600,314160,345576,380134,418147,459962,505958,556554,612209,673430,740773,814850],
    "Acreedores div.":   [98500, 108350,119185,131104,144214,158635,174499,191949,211143,232258,255483,281032],
    "Préstamos bancarios":[520000,572000,629200,692120,761332,837465,921212,1013333,1114666,1226133,1348746,1483621],
    "Acreedores hipot.": [150000,165000,181500,199650,219615,241577,265734,292308,321538,353692,389061,427968],
    "Impuestos por pagar":[52400, 57640, 63404, 69744, 76719, 84391, 92830, 102113,112324,123557,135912,149503],
}
suma_deu = [0]*12
for label, vals in deudas.items():
    style_label(ws4, r, 1, label)
    for i, v in enumerate(vals, 2):
        style_value(ws4, r, i, v)
        suma_deu[i-2] += v
    style_value(ws4, r, 14, sum(vals))
    ws4.row_dimensions[r].height = 16; r+=1

style_label(ws4, r, 1, "SUMAS", bg=GOLD_PALE, bold=True)
for i, v in enumerate(suma_deu, 2):
    style_total(ws4, r, i, v)
style_total(ws4, r, 14, sum(suma_deu))
ws4.row_dimensions[r].height = 18; r+=1

promedio_deu = round(sum(suma_deu)/12, 2)
style_label(ws4, r, 1, f"÷ 12 meses = PROMEDIO DE DEUDAS", bg=RED_LIGHT, bold=True)
ws4.merge_cells(start_row=r, start_column=2, end_row=r, end_column=13)
style_total(ws4, r, 14, promedio_deu, bg=RED_LIGHT, color=RED_DARK)
ws4.row_dimensions[r].height = 18; r+=2

# ── RESULTADO ──
r = add_subtitle(ws4, r, "PARTE C — DETERMINACIÓN DEL AJUSTE", colspan=14)
INPC_DIC26 = 147.882; INPC_DIC25 = 141.200
factor_inf = round((INPC_DIC26 - INPC_DIC25) / INPC_DIC25, 4)
diferencia = round(promedio_cred - promedio_deu, 2)
ajuste     = round(diferencia * factor_inf, 2)

res_rows = [
    ("Promedio de créditos",    promedio_cred, MXN,    WHITE),
    ("(–) Promedio de deudas",  promedio_deu,  MXN,    RED_LIGHT),
    ("= DIFERENCIA",            diferencia,    MXN,    GOLD_PALE),
    (f"(×) Factor INPC = (INPC Dic 2026 {INPC_DIC26} − INPC Dic 2025 {INPC_DIC25}) ÷ {INPC_DIC25}",
                                factor_inf,    '0.0000',BLUE_LIGHT),
    ("= AJUSTE ANUAL POR INFLACIÓN ACUMULABLE (INGRESO)", ajuste, MXN, GREEN_LIGHT),
    ("Ajuste deducible",        0.00,          MXN,    WHITE),
]
for label, val, fmt, bg in res_rows:
    bold = "DIFERENCIA" in label or "AJUSTE ANUAL" in label
    ws4.merge_cells(start_row=r, start_column=1, end_row=r, end_column=13)
    c = ws4.cell(row=r, column=1, value=label)
    c.fill=fill(bg); c.font=font(bold=bold)
    c.alignment=left(); c.border=border_thin()
    if bold:
        style_total(ws4, r, 14, val, fmt=fmt)
    else:
        style_value(ws4, r, 14, val, fmt=fmt, bg=bg)
    ws4.row_dimensions[r].height = 20; r+=1

r+=1
add_nota(ws4, r,
    "✅ Como el promedio de CRÉDITOS ($1,734,609.92) > promedio de DEUDAS ($1,340,087.75), "
    f"el ajuste es ACUMULABLE (ingreso) por ${ajuste:,.2f}. "
    "Se suma a los ingresos en la Cédula 6.",
    colspan=14, bg=GREEN_LIGHT, color=GREEN_DARK); r+=1

# ═══════════════════════════════════════════════════════════════════════════
# CÉDULA 5 — PTU
# ═══════════════════════════════════════════════════════════════════════════
ws5 = wb.create_sheet("Cédula 5 - PTU")
ws5.column_dimensions['A'].width = 55
ws5.column_dimensions['B'].width = 22
ws5.column_dimensions['C'].width = 40

empresa_header(ws5, 3)
r = 3
ws5.merge_cells(start_row=r, start_column=1, end_row=r, end_column=3)
c = ws5.cell(row=r, column=1,
    value="CÉDULA 5 — DETERMINACIÓN DE LA PTU — Art. 123 Const. + Art. 9 LISR — Ejercicio 2026")
c.fill=fill(BROWN_DARK); c.font=Font(bold=True,color=WHITE,size=12,name="Calibri")
c.alignment=center(); ws5.row_dimensions[r].height=26; r=5

add_formula_row(ws5, r,
    "📐 FÓRMULA: Base PTU = (Utilidad Fiscal + Actualización inversiones) − Ajuste acumulable  →  PTU = Base × 10%",
    colspan=3); r+=1
add_nota(ws5, r,
    "La PTU se reparte a los trabajadores en mayo del año siguiente. "
    "La actualización de inversiones es la diferencia entre dep. actualizadas y dep. históricas (Cédula 3). "
    "El ajuste acumulable proviene de Cédula 4.",
    colspan=3); r+=1

style_header(ws5, r, 1, "CONCEPTO",  BROWN_DARK, WHITE)
style_header(ws5, r, 2, "IMPORTE",   BROWN_DARK, WHITE)
style_header(ws5, r, 3, "RAZONAMIENTO / ORIGEN",  BROWN_DARK, WHITE)
ws5.row_dimensions[r].height=20; r+=1

# Valores de Cédula 3 y 4
utl_fiscal    = 10_164_971.29
act_inv       = round(dep_act_total - dep_hist_total, 2)   # 17,967.46
suma_utl_act  = round(utl_fiscal + act_inv, 2)
ajuste_acum   = ajuste   # 18,660.90
base_ptu      = round(suma_utl_act - ajuste_acum, 2)
ptu_26        = round(base_ptu * 0.10, 2)

ptu_rows = [
    ("Utilidad fiscal del ejercicio (Cédula 6)",
     utl_fiscal, "Ingresos − Deducciones − Dep.act. − PTU pagada 2025"),
    ("(+) Actualización de inversiones (Cédula 3)",
     act_inv, f"Dep.act. ${dep_act_total:,.2f} − Dep.hist. ${dep_hist_total:,.2f}"),
    ("= Utilidad fiscal más actualización",
     suma_utl_act, "Subtotal para base PTU"),
    ("(–) Ajuste anual por inflación acumulable (Cédula 4)",
     ajuste_acum, f"Diferencia créditos/deudas × Factor INPC 0.0473"),
    ("(+) Ajuste anual por inflación deducible",
     0.00, "No aplica (créditos > deudas)"),
    ("= BASE PARA PTU",
     base_ptu, "Sobre esta base se calcula el 10%"),
    ("× % de PTU (Art. 123 Constitucional)",
     0.10, "Tasa fija del 10%"),
    ("= PTU EJERCICIO 2026",
     ptu_26, "Se pagará a los trabajadores en mayo 2027"),
]
for label, val, nota in ptu_rows:
    bold = "BASE" in label or "PTU EJERCICIO" in label
    bg   = GOLD_PALE if bold else WHITE
    style_label(ws5, r, 1, label, bg=bg, bold=bold)
    if bold:
        style_total(ws5, r, 2, val, fmt=MXN if "BASE" in label else '0%' if val==0.10 else MXN)
    else:
        style_value(ws5, r, 2, val, fmt='0%' if val==0.10 else MXN, bg=bg)
    style_label(ws5, r, 3, nota, bg=bg if bold else CREAM)
    ws5.row_dimensions[r].height=20; r+=1

r+=1
add_nota(ws5, r,
    f"✅ PTU Ejercicio 2026 = ${ptu_26:,.2f}. "
    "NOTA MATEMÁTICA: La base PTU coincide siempre con: "
    "Ingresos − Deducciones − Dep.HISTÓRICAS − PTU pagada, "
    "porque la actualización de inversiones cancela exactamente con el ajuste por inflación.",
    colspan=3, bg=GREEN_LIGHT, color=GREEN_DARK); r+=1
add_nota(ws5, r,
    "⚠ La PTU 2025 ($245,600) fue la que se pagó en mayo 2026 y se dedujo en los pagos provisionales. "
    "La PTU 2026 ($1,016,427.79) se pagará en mayo 2027.",
    colspan=3, bg=RED_LIGHT, color=RED_DARK)

# ═══════════════════════════════════════════════════════════════════════════
# CÉDULA 6 — ISR ANUAL
# ═══════════════════════════════════════════════════════════════════════════
ws6 = wb.create_sheet("Cédula 6 - ISR Anual")
ws6.column_dimensions['A'].width = 55
ws6.column_dimensions['B'].width = 22
ws6.column_dimensions['C'].width = 40

empresa_header(ws6, 3)
r = 3
ws6.merge_cells(start_row=r, start_column=1, end_row=r, end_column=3)
c = ws6.cell(row=r, column=1,
    value="CÉDULA 6 — DETERMINACIÓN DEL ISR ANUAL — Art. 9 LISR — Ejercicio 2026")
c.fill=fill(BROWN_DARK); c.font=Font(bold=True,color=WHITE,size=12,name="Calibri")
c.alignment=center(); ws6.row_dimensions[r].height=26; r=5

add_formula_row(ws6, r,
    "📐 FÓRMULA: (Ingresos + Ajuste acumulable) − Deducciones − Ajuste deducible − Dep.actual. = Resultado fiscal  "
    "→  − PTU pagada = Utilidad fiscal  →  × 30% = ISR anual  →  − Pagos provisionales = ISR a enterar",
    colspan=3); r+=1

style_header(ws6, r, 1, "CONCEPTO",  BROWN_DARK, WHITE)
style_header(ws6, r, 2, "IMPORTE",   BROWN_DARK, WHITE)
style_header(ws6, r, 3, "RAZONAMIENTO / ORIGEN", BROWN_DARK, WHITE)
ws6.row_dimensions[r].height=20; r+=1

ingresos     = 39_567_896.26
deducciones  = 28_867_870.53
dep_act      = dep_act_total   # 308,115.34
ptu_pagada   = 245_600.00
pagos_prov   = sum(pago_mes)

resultado_fiscal_1 = round(ingresos + ajuste - deducciones - 0 - dep_act, 2)
utilidad_fiscal    = round(resultado_fiscal_1 - ptu_pagada, 2)
resultado_fiscal_2 = utilidad_fiscal
isr_anual          = round(resultado_fiscal_2 * 0.30, 2)
isr_a_enterar      = round(isr_anual - pagos_prov, 2)

isr6_rows = [
    ("Ingresos acumulables del ejercicio",
     ingresos, "+", WHITE,
     "Total ingresos nominales acumulados (Cédula 2, diciembre)"),
    ("(+) Ajuste anual por inflación acumulable (Cédula 4)",
     ajuste, "+", GREEN_LIGHT,
     f"Promedio créditos > deudas × Factor 0.0473 (Cédula 4)"),
    ("(–) Deducciones autorizadas",
     deducciones, "–", RED_LIGHT,
     "Gastos de operación deducibles comprobados"),
    ("(–) Ajuste anual por inflación deducible",
     0.00, "–", RED_LIGHT,
     "No aplica (créditos > deudas)"),
    ("(–) Depreciaciones actualizadas (Cédula 3)",
     dep_act, "–", RED_LIGHT,
     f"Total dep. actualizadas con INPC Jun 2026 = 146.910"),
    ("= RESULTADO FISCAL",
     resultado_fiscal_1, "=", GOLD_PALE,
     "Subtotal antes de restar PTU"),
    ("(–) PTU pagada en el ejercicio (20/05/2026)",
     ptu_pagada, "–", RED_LIGHT,
     "PTU 2025 pagada en mayo 2026, deducible en ISR anual"),
    ("= UTILIDAD FISCAL",
     utilidad_fiscal, "=", GOLD_PALE,
     "Base para aplicar la tasa del 30%"),
    ("(–) Pérdida fiscal actualizada ejercicios anteriores",
     0.00, "–", WHITE,
     "No hay pérdidas pendientes de amortizar"),
    ("= RESULTADO FISCAL (base ISR)",
     resultado_fiscal_2, "=", GOLD_PALE,
     "Base final del ISR"),
    ("(×) Tasa Art. 9 LISR",
     0.30, "×", BLUE_LIGHT,
     "Tasa fija del 30% para personas morales"),
    ("= IMPUESTO ANUAL ISR DETERMINADO",
     isr_anual, "=", GOLD_PALE,
     "ISR del ejercicio 2026 calculado"),
    ("(–) Pagos provisionales ISR acumulados (Cédula 2)",
     pagos_prov, "–", RED_LIGHT,
     "Suma de los 12 pagos mensuales realizados"),
    ("= ISR ANUAL A ENTERAR / (FAVOR)",
     isr_a_enterar, "=", GREEN_LIGHT if isr_a_enterar <= 0 else GOLD_PALE,
     "Saldo a cargo que se entera en la declaración anual (marzo 2027)"),
]
for label, val, op, bg, nota in isr6_rows:
    bold = "RESULTADO FISCAL" in label or "UTILIDAD FISCAL" in label \
           or "IMPUESTO ANUAL" in label or "ISR ANUAL A ENTERAR" in label
    style_label(ws6, r, 1, label, bg=bg, bold=bold)
    fmt_use = '0%' if val == 0.30 else MXN
    if bold:
        style_total(ws6, r, 2, val, fmt=fmt_use, bg=bg)
    else:
        style_value(ws6, r, 2, val, fmt=fmt_use, bg=bg)
    style_label(ws6, r, 3, nota, bg=CREAM if not bold else bg)
    ws6.row_dimensions[r].height=20; r+=1

r+=1
msg_color = GREEN_DARK if isr_a_enterar <= 0 else RED_DARK
msg_bg    = GREEN_LIGHT if isr_a_enterar <= 0 else RED_LIGHT
add_nota(ws6, r,
    f"✅ ISR anual determinado: ${isr_anual:,.2f}  |  "
    f"Pagos provisionales: ${pagos_prov:,.2f}  |  "
    f"ISR a enterar: ${isr_a_enterar:,.2f}  "
    "(diferencia generada por INPC reales del docente: Jun=146.910, Dic=147.882)",
    colspan=3, bg=msg_bg, color=msg_color); r+=1
add_nota(ws6, r,
    "⚠ Si el ISR a enterar fuera negativo (saldo a favor), se solicitaría devolución o compensación. "
    "En este caso es un saldo a CARGO que se paga al presentar la declaración anual (Art. 9 LISR).",
    colspan=3, bg=BLUE_LIGHT, color=BLUE_DARK)

# ── Save ──────────────────────────────────────────────────────────────────
path = "/home/user/PROYECTO-EMPRESA-/Cedulas_Fiscales_OleumNatura_2026.xlsx"
wb.save(path)
print(f"✅ Excel guardado: {path}")
print(f"   Pagos prov total:   ${pagos_prov:,.2f}")
print(f"   Dep hist total:     ${dep_hist_total:,.2f}")
print(f"   Dep act total:      ${dep_act_total:,.2f}")
print(f"   Act. inversiones:   ${act_inv:,.2f}")
print(f"   Ajuste acumulable:  ${ajuste:,.2f}")
print(f"   Base PTU:           ${base_ptu:,.2f}")
print(f"   PTU 2026:           ${ptu_26:,.2f}")
print(f"   ISR anual:          ${isr_anual:,.2f}")
print(f"   ISR a enterar:      ${isr_a_enterar:,.2f}")
