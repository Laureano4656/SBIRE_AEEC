import sys
import json
from pathlib import Path


def normalize(name: str) -> str:
    return name.strip().lower()


def usage() -> None:
    print("Uso: python db/generate_plan_sql.py <carrera_id> [anio_vigencia]")
    print("  carrera_id   - ID de la carrera (obligatorio)")
    print("  anio_vigencia - Año de vigencia del plan (opcional, default: 2024)")
    sys.exit(1)


def main() -> None:
    if len(sys.argv) < 2:
        usage()

    try:
        carrera_id = int(sys.argv[1])
    except ValueError:
        print("Error: carrera_id debe ser un número entero.")
        usage()

    anio_vigencia = int(sys.argv[2]) if len(sys.argv) > 2 else 2024

    base_dir = Path(__file__).resolve().parent
    json_path = base_dir / "plan_estudios24.json"

    if not json_path.exists():
        print(f"Error: no se encontró el archivo {json_path}")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for d in data:
        if d.get("codigo") is None:
            d["codigo"] = "SYN_" + d["materia"].replace(" ", "_").upper()

    name_to_codigo = {normalize(d["materia"]): d["codigo"] for d in data}

    out_name = base_dir / f"seed_materias_plan{anio_vigencia}_carrera_{carrera_id}.sql"

    with open(out_name, "w", encoding="utf-8") as f:
        f.write(f"-- Carga de Materias y Correlativas para Plan {anio_vigencia} - Carrera {carrera_id}\n")
        f.write("-- Generado por generate_plan_sql.py\n\n")
        f.write("DO $$\n")
        f.write("DECLARE\n")
        f.write("    v_plan_id int;\n")

        for d in data:
            var_name = d["codigo"].replace("-", "_").replace(" ", "_").replace("ó", "o")
            f.write(f"    v_{var_name} int;\n")

        f.write("\nBEGIN\n")
        f.write(f"    -- 1. Buscar o crear Plan de Estudios para carrera {carrera_id}\n")
        f.write(f"    SELECT id INTO v_plan_id FROM plan_estudios\n")
        f.write(f"    WHERE carrera_id = {carrera_id} AND anio_vigencia = {anio_vigencia} LIMIT 1;\n")
        f.write(f"    IF v_plan_id IS NULL THEN\n")
        f.write(f"        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)\n")
        f.write(f"        VALUES ({carrera_id}, 'Plan {anio_vigencia}', {anio_vigencia}, true)\n")
        f.write(f"        RETURNING id INTO v_plan_id;\n")
        f.write(f"    END IF;\n\n")

        f.write(f"    -- 2. Insertar o reutilizar Materias (identificadas por codigo)\n")
        for d in data:
            nombre = d["materia"].replace("'", "''")
            codigo = d["codigo"]
            var_name = codigo.replace("-", "_").replace(" ", "_").replace("ó", "o")

            f.write(f"    SELECT id INTO v_{var_name} FROM materias WHERE codigo = '{codigo}';\n")
            f.write(f"    IF v_{var_name} IS NULL THEN\n")
            f.write(f"        INSERT INTO materias (nombre, codigo, es_basica_critica)\n")
            f.write(f"        VALUES ('{nombre}', '{codigo}', false)\n")
            f.write(f"        RETURNING id INTO v_{var_name};\n")
            f.write(f"    END IF;\n\n")

        f.write(f"    -- 3. Vincular materias al plan (plan_materia)\n")
        for d in data:
            codigo = d["codigo"]
            var_name = codigo.replace("-", "_").replace(" ", "_").replace("ó", "o")
            cuat_sug = d.get("cuatrimestre", 1)
            f.write(f"    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)\n")
            f.write(f"    VALUES (v_plan_id, v_{var_name}, {cuat_sug})\n")
            f.write(f"    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;\n")
        f.write("\n")

        f.write(f"    -- 4. Insertar Correlativas\n")
        for d in data:
            var_name = d["codigo"].replace("-", "_").replace(" ", "_").replace("ó", "o")
            for corr in d.get("correlativas", []):
                if normalize(corr) in name_to_codigo:
                    corr_codigo = name_to_codigo[normalize(corr)]
                    corr_var_name = corr_codigo.replace("-", "_").replace(" ", "_").replace("ó", "o")
                    f.write(f"    INSERT INTO correlativas (materia_id, requiere_materia_id)\n")
                    f.write(f"    VALUES (v_{var_name}, v_{corr_var_name})\n")
                    f.write(f"    ON CONFLICT DO NOTHING;\n")
                else:
                    f.write(f"    -- No se encontró correlativa en la lista (se ignora): {corr}\n")

        f.write("END $$;\n")

    print(f"Archivo generado: {out_name}")


if __name__ == "__main__":
    main()
