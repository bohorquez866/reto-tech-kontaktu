# Ficha de contactos — Miralvento / Kontaktu

Reto de selección (~2 h). Next.js App Router. El JSON se sirve por API; la UI solo ve un view-model.

```bash
npm i
npm test
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 1. Qué prioricé y por qué

Tres historias que comparten el mismo núcleo (normalizar identidad) y cubren casos plantados en `contactos.json`:

1. **Teléfonos siempre bien** — seis formatos en el dataset; `libphonenumber-js` a E.164 + display; acciones `tel:` y `wa.me`.
2. **Posibles duplicados** — Carmen `c-001` y `c-009` son la misma persona (mismo teléfono). Señal + propuesta de fusión; sin merge real.
3. **Cumplimiento** — Sofía `c-013` (`no-llamar`): banner y bloqueo de llamada/WhatsApp; el email sigue abierto.

**Descartado:** matching/LLM/LiveKit (tiempo y dependencias), búsqueda (el listado es auxiliar), editar hechos (el `manual` de Roberto ya se respeta en lectura), siguiente acción (solaparía con cumplimiento), salud del dato (útil, pero las tres elegidas prueban más criterio).

## 2. Decisiones con datos sucios

Normalizo **en servidor**. La UI no consume el JSON crudo.

- `qualification_data` string (`c-003`): `JSON.parse` seguro; si falla, cualificación vacía.
- Claves desconocidas (`floor_pref`, `accesibilidad_movilidad_reducida`, `net_income` en raíz): render dinámico. `sale` / `rental` / `shared` agrupan; el resto va a **Otros**.
- `source: "manual"` vs `"explicit"`: gana el valor almacenado. UI: «Editado por agente» vs «Dicho por el cliente».
- Fechas ISO, `11/07/2026`, `11/07/2026 18:42` y unix `1782259200`: parser único. Se muestran en `Europe/Madrid`. Inválidas al final del timeline: «Fecha desconocida».
- Nombre ALL CAPS / minúsculas / `null`: title case ES; fallback teléfono → email → «Contacto sin identificar».
- `lead_source` heterogéneo → Llamada / WhatsApp / Web / Meta / Importación / CRM / Desconocido.
- `c-010` y `c-011` (`ORG-0047`): se listan con badge «Otra organización».
- `c-014` `is_test`: badge «Prueba»; no se oculta.
- `c-016` `ai_handoff`: banner; no bloquea llamadas.
- Email `mdolores@@gmail.com`: se muestra + aviso «email no válido».

**Guía de diseño:** no venía en el repo (`guia-diseno-kontaktu.md` ausente). Tokens inferidos: canvas `#F7F6F3`, ink `#1C1917`, muted `#78716C`, acento `#0F6E56`, danger `#B42318`, warning `#B54708`. Tipo: Source Serif 4 en el nombre, IBM Plex Sans en UI, IBM Plex Mono en datos. Si aparece la guía, se cambian tokens, no la arquitectura.

## 3. Qué le pedí a la IA

El plan en `.cursor/plans/` como spec: view-model, casos plantados, tres stories, corte de LiveKit. No «hazme un CRM».

## 4. Cómo lo verifiqué

```bash
npm test
```

Vitest sobre `lib/` y el JSON real, no mocks: teléfonos E.164, fechas DD/MM + unix, `c-003` string, presupuesto `manual` de Roberto, `canCall === false` en Sofía, duplicado Carmen.

Browser (comportamiento, no captura): listado → Carmen `c-001` (rica + duplicado) → `c-012` (vacía, mismas secciones) → Sofía `c-013` (Llamar/WhatsApp disabled, Email `mailto:`) → `c-009` (title case + mismo E.164) → Roberto `c-008` (350.000 €, editado por agente) → Antonio `c-003` (alquiler desde JSON string) → Lucía `c-005` (solo email). Un viewport móvil de la ficha.

## 5. Dónde se equivocó la IA

- Trató `11/07/2026` como fecha anglosajona (MM/DD). Hay que forzar **DD/MM** y pintar en `Europe/Madrid`; si no, Carmen «11:05Z» sale a las 07:05 en un portátil de América.
- Un `new Date(año, mes, día, 18, 42)` usa la zona de la máquina: los tests de hora deben leer partes con `timeZone: "Europe/Madrid"`.
- `qualification_data` string tumba un `.qualification.sale` ingenuo. Hay que coerce-parse.
- Sin reset de estado al cambiar `[id]`, la ficha muestra el contacto anterior mientras llega el fetch (450 ms de latencia simulada).
- `!canCall` no es «no llamar»: Lucía no tiene teléfono. El bloqueo de cumplimiento es un flag aparte (`blocked` / tag `no-llamar`).
- `canEmail: Boolean(email)` daría por válido `mdolores@@gmail.com`.

## 6. Qué haría con un día más

Matching con `kb-propiedades-voz.json` + indicador de salud del dato. Merge real de duplicados. Si aparece la guía, retocar tokens.

## 7. Cómo correrlo

```bash
npm i && npm run dev
```

`GET /api/contactos` y `GET /api/contactos/[id]` leen `contactos.json` con ~450 ms de latencia. LiveKit/LLM no entran.
