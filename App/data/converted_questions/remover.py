#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
from pathlib import Path

def cortar_lineas(
    input_path,
    output_path,
    inicio=2,
    fin=18457
):
    input_path = Path(input_path)
    output_path = Path(output_path)

    with input_path.open("r", encoding="utf-8") as f:
        lineas = f.readlines()

    resultado = [
        linea
        for i, linea in enumerate(lineas, start=1)
        if not (inicio <= i <= fin)
    ]

    with output_path.open("w", encoding="utf-8") as f:
        f.writelines(resultado)

    print(f"✔ Archivo generado: {output_path}")
    print(f"✂ Líneas eliminadas: {inicio}–{fin}")
    print(f"📏 Líneas finales: {len(resultado)}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python cortar.py <input> <output>")
        sys.exit(1)

    cortar_lineas(sys.argv[1], sys.argv[2])
