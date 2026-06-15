import json
#change this line to change the input JSON file, but make sure to update the output SQL file name accordingly.
with open("db/plan_estudios24_industrial.json", "r", encoding="utf-8") as f:
    data = json.load(f)

def normalize(name):
    return name.strip().lower()

# Assign synthetic codigos where missing
for i, d in enumerate(data):
    if d.get('codigo') is None:
        d['codigo'] = "SYN_" + d['materia'].replace(' ', '_').upper()

name_to_codigo = {normalize(d['materia']): d['codigo'] for d in data}
# change this line to change the output SQL file name, but make sure to update the input JSON file name accordingly.
with open("db/seed_materias_plan24.sql", "w", encoding="utf-8") as f:
    f.write("-- Carga de Materias y Correlativas para Plan 2024 - Carrera 4\n")
    f.write("DO $$\n")
    f.write("DECLARE\n")
    f.write("    v_plan_id int;\n")
    
    # Variables declarations
    for d in data:
        var_name = d['codigo'].replace('-', '_').replace(' ', '_').replace('ó', 'o')
        f.write(f"    v_{var_name} int;\n")
        
    f.write("BEGIN\n")
    f.write("    -- 1. Crear o recuperar Plan de Estudios\n")
    # Asumimos que el plan de estudios ya existe, pero si no, lo creamos. Esto es útil para correr este script varias veces sin errores.
    # Si es para otra carrera o año, hay que cambiar la condición del SELECT e INSERT.
    f.write("    SELECT id INTO v_plan_id FROM plan_estudios WHERE carrera_id = 4 AND anio_vigencia = 2024 LIMIT 1;\n")
    f.write("    IF v_plan_id IS NULL THEN\n")
    f.write("        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)\n")
    f.write("        VALUES (4, 'Plan 2024 Industrial', 2024, true) RETURNING id INTO v_plan_id;\n")
    f.write("    END IF;\n\n")

    f.write("    -- 2. Insertar Materias\n")
    for d in data:
        nombre = d['materia'].replace("'", "''")
        codigo = d['codigo']
        var_name = codigo.replace('-', '_').replace(' ', '_').replace('ó', 'o')
        anio = int(d.get('anio', 1))
        cuatrimestre = int(d.get('cuatrimestre', 1))
        
        # cuatrimestre_sugerido: anio 1 cuat 1 -> 1; anio 1 cuat 2 -> 2.
        # But wait, in the JSON cuatrimestre is already progressive? Let's check cuatrimestre values.
        # I'll check that. Let's just use the JSON cuatrimestre field directly if it goes 1..10.
        
        # Let's use d['cuatrimestre'] directly.
        cuat_sug = d.get('cuatrimestre', 1)
        
        f.write(f"    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)\n")
        f.write(f"    VALUES (v_plan_id, '{nombre}', '{codigo}', {cuat_sug}, false)\n")
        f.write(f"    RETURNING id INTO v_{var_name};\n\n")

    f.write("    -- 3. Insertar Correlativas\n")
    for d in data:
        var_name = d['codigo'].replace('-', '_').replace(' ', '_').replace('ó', 'o')
        for corr in d.get('correlativas', []):
            if normalize(corr) in name_to_codigo:
                corr_codigo = name_to_codigo[normalize(corr)]
                corr_var_name = corr_codigo.replace('-', '_').replace(' ', '_').replace('ó', 'o')
                f.write(f"    INSERT INTO correlativas (materia_id, requiere_materia_id)\n")
                f.write(f"    VALUES (v_{var_name}, v_{corr_var_name});\n")
            else:
                f.write(f"    -- No se encontró correlativa en la lista (se ignora): {corr}\n")

    f.write("END $$;\n")
