import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const visualStudioLogo = `data:image/svg+xml;base64,${await readFile(join(process.cwd(), "public/icon.svg"), "base64")}`;

export const alt = "Naser Rouhi — Senior Software Engineer Portfolio Workbench";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#1f1f1f", color: "#f1f1f1", fontFamily: "sans-serif", border: "1px solid #3d3d42" }}>
      <div style={{ height: 70, display: "flex", alignItems: "center", gap: 22, padding: "0 42px", background: "#1c1c1c", borderBottom: "1px solid #3d3d42" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={visualStudioLogo} width={42} height={42} alt="" />
        <span style={{ fontSize: 24 }}>Portfolio Workbench</span>
        <div style={{ marginLeft: "auto", color: "#a6a6a6", fontSize: 18 }}>NaserRouhi.Portfolio</div>
      </div>
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "68px 78px" }}>
          <div style={{ color: "#78beff", fontSize: 23, marginBottom: 25 }}>namespace NaserRouhi.Portfolio;</div>
          <div style={{ fontSize: 67, fontWeight: 750, letterSpacing: -2 }}>Naser Rouhi</div>
          <div style={{ color: "#d7a0df", fontSize: 34, marginTop: 14 }}>Senior Software Engineer</div>
          <div style={{ color: "#a6a6a6", fontSize: 23, marginTop: 25 }}>.NET · Backend · DDD · React · Building things that scale.</div>
        </div>
        <div style={{ width: 330, display: "flex", flexDirection: "column", padding: "54px 35px", background: "#292929", borderLeft: "1px solid #3d3d42" }}>
          <div style={{ fontSize: 18, marginBottom: 28 }}>SOLUTION EXPLORER</div>
          {["AboutMe.cs", "Experience.cs", "Projects.cs", "Skills.cs", "Articles.cs"].map((name, index) => <div key={name} style={{ display: "flex", alignItems: "center", height: 45, padding: "0 12px", background: index === 2 ? "#353535" : "transparent", borderLeft: index === 2 ? "3px solid #a78bfa" : "3px solid transparent", color: index === 2 ? "#f1f1f1" : "#d4d4d4", fontSize: 19 }}><span style={{ marginRight: 8, color: "#69d5c5", fontSize: 13 }}>C#</span>{name}</div>)}
        </div>
      </div>
      <div style={{ height: 34, display: "flex", alignItems: "center", padding: "0 28px", background: "#151515", color: "#89d185", fontSize: 16 }}>● Ready</div>
    </div>,
    size,
  );
}
