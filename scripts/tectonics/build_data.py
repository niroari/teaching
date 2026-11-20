"""
build_data.py — turns the raw downloads in scripts/tectonics/raw/ into the small
files the atlas loads, in public/tectonics/data/.

Run from the project root:   python3 scripts/tectonics/build_data.py
Creates:    public/tectonics/data/boundaries.js, motion.js, plates.js,
            quakes.js, volcanoes.js

Each output is a tiny JavaScript file that sets one global variable
(window.DATA_...), so the page also works when opened straight from disk.
"""
import csv
import json
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
OUT = os.path.join(HERE, "..", "..", "public", "tectonics", "data")

# Bird (2002) step classes -> our 3 classroom types
CLASS_TO_TYPE = {
    "OSR": "div", "CRB": "div",              # spreading ridge, continental rift
    "SUB": "con", "OCB": "con", "CCB": "con",  # subduction, collision
    "OTF": "tra", "CTF": "tra",              # transform faults
}

R_KM = 6371.0
MOTION_SPACING_KM = 900     # one pair of motion markers about every 900 km
MOTION_OFFSET_KM = 230      # how far each marker sits from the boundary line
MIN_SPEED = 8               # mm/yr — skip very slow spots (they'd be invisible)


def write_js(name, var, obj):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(f"window.{var}=")
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    print(f"  {name}: {os.path.getsize(path) / 1024:.0f} KB")


def unwrap(lngs):
    """Make longitudes continuous so lines don't jump across the 180° line."""
    out = [lngs[0]]
    for x in lngs[1:]:
        prev = out[-1]
        while x - prev > 180:
            x -= 360
        while x - prev < -180:
            x += 360
        out.append(x)
    return out


def destination(lat, lng, bearing_deg, dist_km):
    """Point reached by going dist_km from (lat,lng) in a given compass direction."""
    p1, l1, b = math.radians(lat), math.radians(lng), math.radians(bearing_deg)
    d = dist_km / R_KM
    p2 = math.asin(math.sin(p1) * math.cos(d) + math.cos(p1) * math.sin(d) * math.cos(b))
    l2 = l1 + math.atan2(math.sin(b) * math.sin(d) * math.cos(p1),
                         math.cos(d) - math.sin(p1) * math.sin(p2))
    return math.degrees(p2), (math.degrees(l2) + 540) % 360 - 180


def build_boundaries_and_motion():
    steps = list(csv.DictReader(open(os.path.join(RAW, "PB2002_steps.csv"), encoding="utf-8")))

    # 1) Chain consecutive steps with the same boundary + same type into lines
    runs, cur = [], None
    for s in steps:
        typ = CLASS_TO_TYPE[s["StepClass"].strip()]
        bid = s["PlateBoundIdentifer"].strip()
        p0 = (float(s["StartLat"]), float(s["StartLong"]))
        p1 = (float(s["FinalLat"]), float(s["FinalLong"]))
        joined = (cur and cur["id"] == bid and cur["t"] == typ
                  and s["PlateBoundContinuity"] == "TRUE")
        if not joined:
            cur = {"id": bid, "t": typ, "pts": [p0], "v": [], "len": 0.0}
            runs.append(cur)
        cur["pts"].append(p1)
        cur["v"].append(float(s["VelocityLeft"]))
        cur["len"] += float(s["StepLength(km)"])

    boundaries = []
    for r in runs:
        lats = [p[0] for p in r["pts"]]
        lngs = unwrap([p[1] for p in r["pts"]])
        a, b = r["id"].replace("\\", "-").replace("/", "-").split("-")[:2]
        boundaries.append({
            "t": r["t"],
            "a": a, "b": b,
            "v": round(sum(r["v"]) / len(r["v"])),          # average speed mm/yr
            "p": [[round(la, 2), round(lo, 2)] for la, lo in zip(lats, lngs)],
        })

    # 2) Motion markers: every ~900 km, a pair of short arrows, one on each side,
    #    showing how the two plates move relative to each other at that spot.
    motion, since_last = [], MOTION_SPACING_KM / 2
    for s in steps:
        since_last += float(s["StepLength(km)"])
        if since_last < MOTION_SPACING_KM:
            continue
        v = float(s["VelocityLeft"])
        if v < MIN_SPEED:
            continue
        since_last = 0
        lat = (float(s["StartLat"]) + float(s["FinalLat"])) / 2
        lng0, lng1 = unwrap([float(s["StartLong"]), float(s["FinalLong"])])
        lng = ((lng0 + lng1) / 2 + 540) % 360 - 180
        step_az = float(s["AzimuthCenter"])
        vel_az = float(s["VelocityAzimuth"])        # left plate relative to right plate
        arrow_km = 260 + 7 * min(v, 100)           # faster plates -> longer arrows
        typ = CLASS_TO_TYPE[s["StepClass"].strip()]
        for side_bearing, move_bearing in ((step_az - 90, vel_az), (step_az + 90, vel_az + 180)):
            c_lat, c_lng = destination(lat, lng, side_bearing, MOTION_OFFSET_KM)
            s_lat, s_lng = destination(c_lat, c_lng, move_bearing + 180, arrow_km / 2)
            e_lat, e_lng = destination(c_lat, c_lng, move_bearing, arrow_km / 2)
            e_lng = unwrap([s_lng, e_lng])[1]
            motion.append({"t": typ, "v": round(v),
                           "p": [[round(s_lat, 2), round(s_lng, 2)], [round(e_lat, 2), round(e_lng, 2)]]})

    write_js("boundaries.js", "DATA_BOUNDARIES", boundaries)
    write_js("motion.js", "DATA_MOTION", motion)
    print(f"    {len(boundaries)} boundary lines, {len(motion)} motion markers")


def build_plates():
    """Plate outlines (simplified) — used to tell which plate a click landed on."""
    src = json.load(open(os.path.join(RAW, "PB2002_plates.json"), encoding="utf-8"))
    plates = []
    for f in src["features"]:
        g = f["geometry"]
        polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        rings = []
        for poly in polys:
            ring = poly[0]
            lngs = unwrap([c[0] for c in ring])
            pts = [[round(lo, 2), round(c[1], 2)] for lo, c in zip(lngs, ring)]
            # A plate that covers a pole (Antarctica, North America) wraps all the way
            # around the Earth, so its outline doesn't close. Close it through the pole.
            if abs(pts[-1][0] - pts[0][0]) > 180:
                pole = -90 if sum(p[1] for p in pts) < 0 else 90
                pts += [[pts[-1][0], pole], [pts[0][0], pole]]
            rings.append(pts)
        plates.append({"c": f["properties"]["Code"], "n": f["properties"]["PlateName"], "r": rings})
    write_js("plates.js", "DATA_PLATES", plates)


def build_quakes():
    rows = csv.DictReader(open(os.path.join(RAW, "quakes_m7.csv"), encoding="utf-8"))
    quakes = [[round(float(r["latitude"]), 2), round(float(r["longitude"]), 2),
               round(float(r["mag"]), 1), int(r["time"][:4]), round(float(r["depth"] or 0)),
               r["place"]] for r in rows]
    write_js("quakes.js", "DATA_QUAKES", quakes)
    print(f"    {len(quakes)} earthquakes")


def build_volcanoes():
    src = json.load(open(os.path.join(RAW, "volcanoes.json"), encoding="utf-8"))
    vols = []
    for f in src["features"]:
        p = f["properties"]
        vols.append([round(p["Latitude"], 2), round(p["Longitude"], 2), p["Volcano_Name"],
                     p["Country"], p["Last_Eruption_Year"], p["Elevation"]])
    write_js("volcanoes.js", "DATA_VOLCANOES", vols)
    print(f"    {len(vols)} volcanoes")


if __name__ == "__main__":
    print("Building data files…")
    build_boundaries_and_motion()
    build_plates()
    build_quakes()
    build_volcanoes()
    print("Done.")
