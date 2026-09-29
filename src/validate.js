// אימות קלט קפדני. כל שדה שלא עובר בדיקה מחזיר 400 עם שם השדה.
export class BadInput extends Error {
  constructor(field) { super('bad_input'); this.field = field; this.status = 400; }
}

export const V = {
  str(v, max, field, { required = false } = {}) {
    if (v == null || v === '') { if (required) throw new BadInput(field); return null; }
    if (typeof v !== 'string') throw new BadInput(field);
    const t = v.trim();
    if (required && !t) throw new BadInput(field);
    if (t.length > max) throw new BadInput(field);
    return t || null;
  },
  num(v, min, max, field, { int = false, required = false } = {}) {
    if (v == null || v === '') { if (required) throw new BadInput(field); return null; }
    const n = Number(v);
    if (!Number.isFinite(n) || n < min || n > max) throw new BadInput(field);
    return int ? Math.round(n) : Math.round(n * 100) / 100;
  },
  date(v, field, { required = true } = {}) {
    if (v == null || v === '') { if (required) throw new BadInput(field); return null; }
    if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new BadInput(field);
    const [y, m, d] = v.split('-').map(Number);
    const t = new Date(Date.UTC(y, m - 1, d));
    if (t.getUTCFullYear() !== y || t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d) throw new BadInput(field);
    return v;
  },
  time(v, field, { required = true } = {}) {
    if (v == null || v === '') { if (required) throw new BadInput(field); return null; }
    if (typeof v !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(v)) throw new BadInput(field);
    return v;
  },
  oneOf(v, list, field, { required = true } = {}) {
    if (v == null || v === '') { if (required) throw new BadInput(field); return null; }
    if (!list.includes(v)) throw new BadInput(field);
    return v;
  },
};
