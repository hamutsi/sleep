#!/usr/bin/env python3
"""
בודק שכל מספר בטקסט העברי של ספריית "למה ככה?" (summary_he, hooks_he) מופיע במקורות של אותו נושא:
קודם ב-key_finding_en שנכתב לכל מקור, ואם חסר, בתקציר האמיתי (PubMed דרך E-utilities) או בטקסט של עמוד רשמי.
מספר שלא נמצא באף מקום מסומן "לבדיקה ידנית". זה לא מחליף קריאה אנושית, אבל תופס מספרים שנכתבו מהזיכרון.

שימוש:  python3 tools/verify_numbers.py evidence/part_L1_v1.json [עוד קבצים] [--fetch]
  בלי --fetch: בודק רק מול key_finding_en (מהיר, בלי רשת).
  עם --fetch: משלים מול PubMed ועמודים רשמיים לכל מה שלא נמצא.
"""
import html
import json
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15"
NUM = re.compile(r"\d[\d,]*(?:\.\d+)?")
_cache = {}


def norm(n):
    return n.replace(",", "").rstrip(".")


def numbers(text):
    out = []
    for m in NUM.finditer(text):
        n = norm(m.group())
        if n and n not in out:
            out.append(n)
    return out


def http(url, tries=2):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read()
        except Exception:
            time.sleep(1.5)
    return b""


def pubmed_abstract(pmid):
    if pmid in _cache:
        return _cache[pmid]
    time.sleep(0.4)
    raw = http(f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id={pmid}&retmode=xml").decode("utf8", "ignore")
    txt = re.sub(r"<[^>]+>", " ", raw)
    _cache[pmid] = re.sub(r"\s+", " ", html.unescape(txt))
    return _cache[pmid]


def page_text(url):
    if url in _cache:
        return _cache[url]
    raw = subprocess.run(["curl", "-sSL", "--max-time", "45", "-A", UA, url], capture_output=True).stdout
    if url.lower().endswith(".pdf"):
        p = subprocess.run(["pdftotext", "-layout", "-", "-"], input=raw, capture_output=True)
        txt = p.stdout.decode("utf8", "ignore")
    else:
        t = raw.decode("utf8", "ignore")
        t = re.sub(r"(?is)<(script|style).*?</\1>", "", t)
        txt = html.unescape(re.sub(r"<[^>]+>", " ", t))
    _cache[url] = re.sub(r"\s+", " ", txt)
    return _cache[url]


def source_text(s):
    u = s["url"]
    m = re.match(r"https://pubmed\.ncbi\.nlm\.nih\.gov/(\d+)/", u)
    if m:
        return pubmed_abstract(m.group(1))
    if u.startswith("https://doi.org/"):
        return ""     # תקצירי DOI בלבד: נשענים על key_finding_en, ובבדיקה ידנית אם חסר
    return page_text(u)


def main(paths, fetch):
    flagged = 0
    total = 0
    for p in paths:
        data = json.load(open(p, encoding="utf8"))
        for t in data["topics"]:
            texts = [("summary", t["summary_he"])] + [(f"hook{i}", h) for i, h in enumerate(t["hooks_he"])]
            kf = " ".join(s["key_finding_en"] for s in t["sources"])
            kf_nums = set(norm(x) for x in NUM.findall(kf))
            src_nums = None
            missing = []
            for label, tx in texts:
                for n in numbers(tx):
                    total += 1
                    if n in kf_nums:
                        continue
                    if fetch:
                        if src_nums is None:
                            joined = " ".join(source_text(s) for s in t["sources"])
                            src_nums = set(norm(x) for x in NUM.findall(joined))
                        if n in src_nums:
                            continue
                    missing.append((label, n, tx))
            if missing:
                flagged += len(missing)
                print(f"\n## {t['id']}: {len(missing)} מספרים שלא נמצאו במקורות")
                for label, n, tx in missing:
                    i = tx.find(n)
                    print(f"   [{label}] {n}  ...{tx[max(0, i - 40):i + len(n) + 40]}...")
    print(f"\nנבדקו {total} מספרים, {flagged} לבדיקה ידנית")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    main(args, "--fetch" in sys.argv)
