"use client";

import { useEffect, useMemo, useState } from "react";

const sectionOptions = [
  { value: "shared", label: "מיתוג ופרטי קשר" },
  { value: "home", label: "עמוד בית" },
  { value: "about", label: "עמוד אודות" },
  { value: "treatments", label: "עמוד תחומי טיפול" },
  { value: "pricing", label: "עמוד עלויות" },
  { value: "contact", label: "עמוד צור קשר + טופס" },
  { value: "faq", label: "שאלות נפוצות" },
  { value: "testimonials", label: "המלצות" },
  { value: "publications", label: "אקדמיה/פרסומים" }
] as const;

type SectionValue = (typeof sectionOptions)[number]["value"];

type ApiResult = {
  ok: boolean;
  content: Record<string, unknown>;
};

function isSectionValue(value: string): value is SectionValue {
  return sectionOptions.some((opt) => opt.value === value);
}

export default function AdminContentEditor({
  initialSection
}: {
  initialSection?: string;
}) {
  const [selected, setSelected] = useState<SectionValue>(() =>
    isSectionValue(initialSection || "") ? (initialSection as SectionValue) : "home"
  );
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/content", { cache: "no-store" });
        const data = (await res.json()) as ApiResult;
        setContent(data.content);
      } catch {
        setStatus("שגיאה בטעינת תוכן");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  useEffect(() => {
    if (!content) {
      return;
    }
    const sectionData = content[selected] ?? {};
    setText(JSON.stringify(sectionData, null, 2));
    setStatus("");
  }, [selected, content]);

  const selectedLabel = useMemo(
    () => sectionOptions.find((s) => s.value === selected)?.label ?? "",
    [selected]
  );

  async function onSave() {
    if (!content) {
      return;
    }
    setSaving(true);
    setStatus("");

    try {
      const parsed = JSON.parse(text);
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ section: selected, data: parsed })
      });
      const data = (await res.json()) as ApiResult & { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "שגיאה בשמירה");
      }
      setContent(data.content);
      setStatus("נשמר בהצלחה");
    } catch (error: unknown) {
      if (error instanceof SyntaxError) {
        setStatus("JSON לא תקין. בדוק סוגריים/פסיקים ונסה שוב.");
      } else if (error instanceof Error) {
        setStatus(error.message);
      } else {
        setStatus("שמירה נכשלה");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="surface-card p-6">
        <p className="text-slate-600">טוען תוכן...</p>
      </div>
    );
  }

  return (
    <div className="surface-card p-6">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-full md:w-auto">
          <label className="text-sm font-medium text-slate-700">בחירת סקשן</label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value as SectionValue)}
            className="mt-1 w-full md:w-[280px] rounded-xl border border-slate-200 px-3 py-2 bg-white"
          >
            {sectionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button type="button" onClick={onSave} disabled={saving} className="btn-primary">
          {saving ? "שומר..." : "שמירת שינויים"}
        </button>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        עריכת תוכן: <span className="font-semibold text-slate-900">{selectedLabel}</span>
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mt-3 w-full min-h-[420px] rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm"
        spellCheck={false}
      />

      {status ? (
        <p className="mt-3 text-sm text-slate-700">{status}</p>
      ) : (
        <p className="mt-3 text-xs text-slate-500">
          טיפ: שומרים רק JSON תקין. שינוי יופיע מיידית באתר לאחר רענון.
        </p>
      )}
    </div>
  );
}
