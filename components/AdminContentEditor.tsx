"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteContent } from "@/lib/site-content";

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
  content: SiteContent;
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
  const [content, setContent] = useState<SiteContent | null>(null);
  const [draft, setDraft] = useState<unknown>(null);
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
    setDraft(content[selected]);
    setStatus("");
  }, [selected, content]);

  const selectedLabel = useMemo(
    () => sectionOptions.find((s) => s.value === selected)?.label ?? "",
    [selected]
  );

  function linesToList(value: string) {
    return value
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  function listToLines(value: string[]) {
    return value.join("\n");
  }

  function itemsToLines(items: { title: string; text: string; badge?: string }[]) {
    return items
      .map((x) => [x.title, x.text, x.badge || ""].join(" | "))
      .join("\n");
  }

  function linesToItems(lines: string) {
    return linesToList(lines).map((line) => {
      const [title = "", text = "", badge = ""] = line.split("|").map((x) => x.trim());
      return { title, text, badge: badge || undefined };
    });
  }

  function faqToLines(items: { q: string; a: string }[]) {
    return items.map((x) => `${x.q} | ${x.a}`).join("\n");
  }

  function linesToFaq(lines: string) {
    return linesToList(lines).map((line) => {
      const [q = "", a = ""] = line.split("|").map((x) => x.trim());
      return { q, a };
    });
  }

  function testimonialsToLines(items: { name: string; text: string }[]) {
    return items.map((x) => `${x.name} | ${x.text}`).join("\n");
  }

  function linesToTestimonials(lines: string) {
    return linesToList(lines).map((line) => {
      const [name = "", text = ""] = line.split("|").map((x) => x.trim());
      return { name, text };
    });
  }

  function publicationsToLines(items: SiteContent["publications"]["items"]) {
    return items
      .map((x) =>
        [x.title, String(x.year), x.journal, x.doi || "", x.doiUrl || "", x.pubmedUrl || ""].join(
          " | "
        )
      )
      .join("\n");
  }

  function linesToPublications(lines: string) {
    return linesToList(lines).map((line) => {
      const [title = "", yearRaw = "", journal = "", doi = "", doiUrl = "", pubmedUrl = ""] =
        line.split("|").map((x) => x.trim());
      const year = Number(yearRaw) || new Date().getFullYear();
      return {
        title,
        year,
        journal,
        doi: doi || undefined,
        doiUrl: doiUrl || undefined,
        pubmedUrl: pubmedUrl || undefined
      };
    });
  }

  function updateDraft(next: unknown) {
    setDraft(next);
  }

  async function onSave() {
    if (!content || !draft) {
      return;
    }
    setSaving(true);
    setStatus("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ section: selected, data: draft })
      });
      const data = (await res.json()) as ApiResult & { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "שגיאה בשמירה");
      }
      setContent(data.content);
      setStatus("נשמר בהצלחה");
    } catch (error: unknown) {
      if (error instanceof Error) {
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

      {selected === "shared" && draft ? (
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="font-medium">שם הרופא</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["shared"]).doctorName}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["shared"]),
                  doctorName: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">תת כותרת</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["shared"]).specialty}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["shared"]),
                  specialty: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">טלפון</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["shared"]).phone}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["shared"]),
                  phone: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">נייד</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["shared"]).mobile}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["shared"]),
                  mobile: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="font-medium">כתובת</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["shared"]).address}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["shared"]),
                  address: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="font-medium">אימייל</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["shared"]).email}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["shared"]),
                  email: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="font-medium">טקסט תחתון</span>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 p-2 min-h-20"
              value={(draft as SiteContent["shared"]).footerTagline}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["shared"]),
                  footerTagline: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="font-medium">דיסקליימר</span>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 p-2 min-h-20"
              value={(draft as SiteContent["shared"]).footerDisclaimer}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["shared"]),
                  footerDisclaimer: e.target.value
                })
              }
            />
          </label>
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold text-slate-900">עיצוב האתר</div>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              <label className="text-sm">
                <span className="font-medium">צבע ראשי</span>
                <input
                  type="color"
                  className="mt-1 h-10 w-full rounded-md border border-slate-200"
                  value={(draft as SiteContent["shared"]).theme.primaryColor}
                  onChange={(e) =>
                    updateDraft({
                      ...(draft as SiteContent["shared"]),
                      theme: {
                        ...(draft as SiteContent["shared"]).theme,
                        primaryColor: e.target.value
                      }
                    })
                  }
                />
              </label>
              <label className="text-sm">
                <span className="font-medium">צבע משני</span>
                <input
                  type="color"
                  className="mt-1 h-10 w-full rounded-md border border-slate-200"
                  value={(draft as SiteContent["shared"]).theme.accentColor}
                  onChange={(e) =>
                    updateDraft({
                      ...(draft as SiteContent["shared"]),
                      theme: {
                        ...(draft as SiteContent["shared"]).theme,
                        accentColor: e.target.value
                      }
                    })
                  }
                />
              </label>
              <label className="text-sm">
                <span className="font-medium">פונט</span>
                <select
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-2 bg-white"
                  value={(draft as SiteContent["shared"]).theme.fontFamily}
                  onChange={(e) =>
                    updateDraft({
                      ...(draft as SiteContent["shared"]),
                      theme: {
                        ...(draft as SiteContent["shared"]).theme,
                        fontFamily: e.target.value as SiteContent["shared"]["theme"]["fontFamily"]
                      }
                    })
                  }
                >
                  <option value="assistant">Assistant</option>
                  <option value="heebo">Heebo</option>
                  <option value="rubik">Rubik</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      ) : null}

      {selected === "home" && draft ? (
        <div className="mt-3 grid gap-4">
          {(
            [
              ["pill", "שורת פתיח עליונה"],
              ["heroTitle", "כותרת ראשית"],
              ["heroSubtitle", "תת כותרת"],
              ["primaryCta", "כפתור ראשי"],
              ["secondaryCta", "כפתור משני"],
              ["clinicalTitle", "כותרת תיבה צדדית"],
              ["professionalMessageTitle", "כותרת מסר מקצועי"],
              ["professionalMessage", "תוכן מסר מקצועי"],
              ["treatmentsTitle", "כותרת תחומי טיפול"],
              ["treatmentsSubtitle", "תת כותרת תחומי טיפול"],
              ["processTitle", "כותרת איך זה עובד"],
              ["processSubtitle", "תת כותרת איך זה עובד"],
              ["testimonialsTitle", "כותרת המלצות"],
              ["testimonialsSubtitle", "תת כותרת המלצות"],
              ["faqTitle", "כותרת FAQ"],
              ["faqSubtitle", "תת כותרת FAQ"],
              ["bottomCtaTitle", "כותרת CTA תחתון"],
              ["bottomCtaSubtitle", "תוכן CTA תחתון"],
              ["bottomCtaButton", "טקסט כפתור CTA תחתון"]
            ] as const
          ).map(([field, label]) => (
            <label key={field} className="text-sm">
              <span className="font-medium">{label}</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 p-2"
                value={(draft as SiteContent["home"])[field]}
                onChange={(e) =>
                  updateDraft({
                    ...(draft as SiteContent["home"]),
                    [field]: e.target.value
                  })
                }
              />
            </label>
          ))}
          <label className="text-sm">
            <span className="font-medium">כרטיסי ערכים (שורה: כותרת | טקסט)</span>
            <textarea
              className="mt-1 w-full min-h-28 rounded-xl border border-slate-200 p-2"
              value={itemsToLines((draft as SiteContent["home"]).valueCards)}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["home"]),
                  valueCards: linesToItems(e.target.value)
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">נקודות קליניות (שורה לכל נקודה)</span>
            <textarea
              className="mt-1 w-full min-h-24 rounded-xl border border-slate-200 p-2"
              value={listToLines((draft as SiteContent["home"]).clinicalBullets)}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["home"]),
                  clinicalBullets: linesToList(e.target.value)
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">כרטיסי תחומי טיפול (כותרת | טקסט | תג)</span>
            <textarea
              className="mt-1 w-full min-h-32 rounded-xl border border-slate-200 p-2"
              value={itemsToLines((draft as SiteContent["home"]).treatmentsCards)}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["home"]),
                  treatmentsCards: linesToItems(e.target.value)
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">שלבי תהליך (כותרת | טקסט)</span>
            <textarea
              className="mt-1 w-full min-h-28 rounded-xl border border-slate-200 p-2"
              value={itemsToLines((draft as SiteContent["home"]).processSteps)}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["home"]),
                  processSteps: linesToItems(e.target.value)
                })
              }
            />
          </label>
        </div>
      ) : null}

      {selected === "about" && draft ? (
        <div className="mt-3 grid gap-4">
          {(
            [
              ["title", "כותרת עמוד"],
              ["subtitle", "תת כותרת"],
              ["introTitle", "כותרת בלוק ראשון"],
              ["introText", "טקסט בלוק ראשון"],
              ["approachTitle", "כותרת גישה טיפולית"],
              ["approachText", "טקסט גישה טיפולית"],
              ["principlesTitle", "כותרת עקרונות עבודה"]
            ] as const
          ).map(([field, label]) => (
            <label key={field} className="text-sm">
              <span className="font-medium">{label}</span>
              {field.endsWith("Text") || field === "subtitle" ? (
                <textarea
                  className="mt-1 w-full min-h-20 rounded-xl border border-slate-200 p-2"
                  value={(draft as SiteContent["about"])[field]}
                  onChange={(e) =>
                    updateDraft({
                      ...(draft as SiteContent["about"]),
                      [field]: e.target.value
                    })
                  }
                />
              ) : (
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2"
                  value={(draft as SiteContent["about"])[field]}
                  onChange={(e) =>
                    updateDraft({
                      ...(draft as SiteContent["about"]),
                      [field]: e.target.value
                    })
                  }
                />
              )}
            </label>
          ))}
          <label className="text-sm">
            <span className="font-medium">נקודות פתיח (שורה לכל נקודה)</span>
            <textarea
              className="mt-1 w-full min-h-24 rounded-xl border border-slate-200 p-2"
              value={listToLines((draft as SiteContent["about"]).introBullets)}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["about"]),
                  introBullets: linesToList(e.target.value)
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">פריטי גישה טיפולית (כותרת | טקסט)</span>
            <textarea
              className="mt-1 w-full min-h-24 rounded-xl border border-slate-200 p-2"
              value={itemsToLines((draft as SiteContent["about"]).approachItems)}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["about"]),
                  approachItems: linesToItems(e.target.value)
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">עקרונות עבודה (כותרת | טקסט)</span>
            <textarea
              className="mt-1 w-full min-h-24 rounded-xl border border-slate-200 p-2"
              value={itemsToLines((draft as SiteContent["about"]).principles)}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["about"]),
                  principles: linesToItems(e.target.value)
                })
              }
            />
          </label>
        </div>
      ) : null}

      {selected === "treatments" && draft ? (
        <div className="mt-3 grid gap-4">
          <label className="text-sm">
            <span className="font-medium">כותרת</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["treatments"]).title}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["treatments"]),
                  title: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">תת כותרת</span>
            <textarea
              className="mt-1 w-full min-h-20 rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["treatments"]).subtitle}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["treatments"]),
                  subtitle: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">כרטיסי טיפולים (כותרת | טקסט | תג)</span>
            <textarea
              className="mt-1 w-full min-h-32 rounded-xl border border-slate-200 p-2"
              value={itemsToLines((draft as SiteContent["treatments"]).cards)}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["treatments"]),
                  cards: linesToItems(e.target.value)
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">כותרת "למי זה מתאים"</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["treatments"]).suitableTitle}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["treatments"]),
                  suitableTitle: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">טקסט "למי זה מתאים"</span>
            <textarea
              className="mt-1 w-full min-h-20 rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["treatments"]).suitableText}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["treatments"]),
                  suitableText: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">טקסט כפתור</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["treatments"]).ctaLabel}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["treatments"]),
                  ctaLabel: e.target.value
                })
              }
            />
          </label>
        </div>
      ) : null}

      {selected === "pricing" && draft ? (
        <div className="mt-3 grid gap-4">
          <label className="text-sm">
            <span className="font-medium">כותרת</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["pricing"]).title}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["pricing"]),
                  title: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">תת כותרת</span>
            <textarea
              className="mt-1 w-full min-h-20 rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["pricing"]).subtitle}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["pricing"]),
                  subtitle: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">גורמים לעלות (כותרת | טקסט)</span>
            <textarea
              className="mt-1 w-full min-h-28 rounded-xl border border-slate-200 p-2"
              value={itemsToLines((draft as SiteContent["pricing"]).factors)}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["pricing"]),
                  factors: linesToItems(e.target.value)
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">סיכום</span>
            <textarea
              className="mt-1 w-full min-h-20 rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["pricing"]).summary}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["pricing"]),
                  summary: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">טקסט כפתור</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["pricing"]).ctaLabel}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["pricing"]),
                  ctaLabel: e.target.value
                })
              }
            />
          </label>
        </div>
      ) : null}

      {selected === "contact" && draft ? (
        <div className="mt-3 grid gap-4">
          {(
            [
              ["title", "כותרת עמוד"],
              ["subtitle", "תת כותרת"],
              ["infoTitle", "כותרת פרטי קשר"],
              ["prepTitle", "כותרת לפני פגישת ייעוץ"]
            ] as const
          ).map(([field, label]) => (
            <label key={field} className="text-sm">
              <span className="font-medium">{label}</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 p-2"
                value={(draft as SiteContent["contact"])[field]}
                onChange={(e) =>
                  updateDraft({
                    ...(draft as SiteContent["contact"]),
                    [field]: e.target.value
                  })
                }
              />
            </label>
          ))}
          <label className="text-sm">
            <span className="font-medium">רשימת הכנה (שורה לכל פריט)</span>
            <textarea
              className="mt-1 w-full min-h-24 rounded-xl border border-slate-200 p-2"
              value={listToLines((draft as SiteContent["contact"]).prepItems)}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["contact"]),
                  prepItems: linesToList(e.target.value)
                })
              }
            />
          </label>
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <div className="font-semibold text-slate-900 mb-3">שדות טופס</div>
            <div className="grid gap-3 md:grid-cols-2">
              {(
                [
                  ["fullName", "שם מלא"],
                  ["phone", "טלפון"],
                  ["email", "אימייל"],
                  ["preferredTime", "מועד חזרה"],
                  ["message", "סיבת פנייה"],
                  ["submit", "טקסט כפתור"],
                  ["loading", "טקסט בזמן שליחה"],
                  ["fullNamePlaceholder", "פלייסהולדר שם"],
                  ["phonePlaceholder", "פלייסהולדר טלפון"],
                  ["emailPlaceholder", "פלייסהולדר אימייל"],
                  ["messagePlaceholder", "פלייסהולדר הודעה"]
                ] as const
              ).map(([field, label]) => (
                <label key={field} className="text-sm">
                  <span className="font-medium">{label}</span>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 bg-white"
                    value={(draft as SiteContent["contact"]).formLabels[field]}
                    onChange={(e) =>
                      updateDraft({
                        ...(draft as SiteContent["contact"]),
                        formLabels: {
                          ...(draft as SiteContent["contact"]).formLabels,
                          [field]: e.target.value
                        }
                      })
                    }
                  />
                </label>
              ))}
              <label className="text-sm md:col-span-2">
                <span className="font-medium">טקסט פרטיות / אזהרה</span>
                <textarea
                  className="mt-1 w-full min-h-20 rounded-xl border border-slate-200 p-2 bg-white"
                  value={(draft as SiteContent["contact"]).formLabels.privacy}
                  onChange={(e) =>
                    updateDraft({
                      ...(draft as SiteContent["contact"]),
                      formLabels: {
                        ...(draft as SiteContent["contact"]).formLabels,
                        privacy: e.target.value
                      }
                    })
                  }
                />
              </label>
            </div>
          </div>
        </div>
      ) : null}

      {selected === "faq" && draft ? (
        <label className="mt-3 block text-sm">
          <span className="font-medium">שאלות נפוצות (שורה: שאלה | תשובה)</span>
          <textarea
            className="mt-1 w-full min-h-44 rounded-xl border border-slate-200 p-2"
            value={faqToLines((draft as SiteContent["faq"]).items)}
            onChange={(e) =>
              updateDraft({
                ...(draft as SiteContent["faq"]),
                items: linesToFaq(e.target.value)
              })
            }
          />
        </label>
      ) : null}

      {selected === "testimonials" && draft ? (
        <div className="mt-3 grid gap-4">
          <label className="text-sm">
            <span className="font-medium">תווית קטנה בכרטיס</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["testimonials"]).badgeLabel}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["testimonials"]),
                  badgeLabel: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">המלצות (שורה: שם | טקסט)</span>
            <textarea
              className="mt-1 w-full min-h-36 rounded-xl border border-slate-200 p-2"
              value={testimonialsToLines((draft as SiteContent["testimonials"]).items)}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["testimonials"]),
                  items: linesToTestimonials(e.target.value)
                })
              }
            />
          </label>
        </div>
      ) : null}

      {selected === "publications" && draft ? (
        <div className="mt-3 grid gap-4">
          <label className="text-sm">
            <span className="font-medium">כותרת עמוד</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["publications"]).title}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["publications"]),
                  title: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">תת כותרת עמוד</span>
            <textarea
              className="mt-1 w-full min-h-20 rounded-xl border border-slate-200 p-2"
              value={(draft as SiteContent["publications"]).subtitle}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["publications"]),
                  subtitle: e.target.value
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">
              פרסומים (שורה: כותרת | שנה | כתב עת | DOI | קישור DOI | קישור PubMed)
            </span>
            <textarea
              className="mt-1 w-full min-h-44 rounded-xl border border-slate-200 p-2"
              value={publicationsToLines((draft as SiteContent["publications"]).items)}
              onChange={(e) =>
                updateDraft({
                  ...(draft as SiteContent["publications"]),
                  items: linesToPublications(e.target.value)
                })
              }
            />
          </label>
        </div>
      ) : null}

      {status ? (
        <p className="mt-3 text-sm text-slate-700">{status}</p>
      ) : (
        <p className="mt-3 text-xs text-slate-500">
          שינוי נשמר ישירות לאתר. אחרי שמירה בצע/י רענון כדי לראות את העדכון.
        </p>
      )}
    </div>
  );
}
