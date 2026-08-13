import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type VisualStudioIconProps = {
  className?: string;
};

function TreeIcon({
  children,
  className,
}: VisualStudioIconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("vs-tree-icon", className)}
      focusable="false"
      shapeRendering="geometricPrecision"
      viewBox="0 0 16 16"
    >
      {children}
    </svg>
  );
}

function CSharpGlyph({ project = false }: { project?: boolean }) {
  return (
    <g
      className="vs-icon-csharp"
      shapeRendering="crispEdges"
      transform={project ? "translate(1 2) scale(.82)" : undefined}
    >
      <path d="M5 4H2v1H1v6h1v1h3v-1h1V9H5v1H4v1H2V5h2v1h2V5H5V4Z" />
      <path
        clipRule="evenodd"
        d="M9 4h1v2h2V4h1v2h2v1h-2v2h2v1h-2v2h-1v-2h-2v2H9v-2H7V9h2V7H7V6h2V4Zm1 3v2h2V7h-2Z"
        fillRule="evenodd"
      />
    </g>
  );
}

export function VisualStudioLogo({ className }: VisualStudioIconProps) {
  return (
    <Image
      src="/icon.svg"
      width={20}
      height={20}
      alt=""
      aria-hidden="true"
      className={className}
      priority
    />
  );
}

export function VisualStudioSolutionIcon({ className }: VisualStudioIconProps) {
  return (
    <TreeIcon className={cn("vs-solution-icon", className)}>
      <path className="vs-icon-window" d="M2.5 2.5h11v11H8.8M2.5 5.5h11" />
      <path className="vs-icon-window-dot" d="M4 4h1M6 4h1" />
      <path className="vs-icon-solution-mark" d="m.5 9.5 2.1-1.1 2.2 1.7L8 8v6.4l-3.2-2.1-2.2 1.6-2.1-1.1V9.5Zm2.2.5v2.2l1.3-.9L2.7 10Zm2.7.4v1.5l1.2.8v-3.1l-1.2.8Z" />
    </TreeIcon>
  );
}

export function VisualStudioProjectIcon({ className }: VisualStudioIconProps) {
  return (
    <TreeIcon className={cn("vs-project-icon", className)}>
      <rect className="vs-icon-project-frame" x=".5" y="2.5" width="15" height="11" rx=".75" />
      <CSharpGlyph project />
    </TreeIcon>
  );
}

export function VisualStudioCSharpFileIcon({ className }: VisualStudioIconProps) {
  return (
    <TreeIcon className={cn("vs-csharp-file-icon", className)}>
      <CSharpGlyph />
    </TreeIcon>
  );
}

export function VisualStudioFolderIcon({ className }: VisualStudioIconProps) {
  return (
    <TreeIcon className={cn("vs-folder-icon", className)}>
      <path className="vs-icon-folder" d="M1.5 3h5l1.7 2h6.3v8.5h-13V3Z" />
      <path className="vs-icon-folder-highlight" d="M2.5 4h3.6l.85 1H2.5V4Z" />
    </TreeIcon>
  );
}

export function VisualStudioJsonFileIcon({ className }: VisualStudioIconProps) {
  return (
    <TreeIcon className={cn("vs-json-file-icon", className)}>
      <path className="vs-icon-file" d="M3.5 1.5h6.25l2.75 2.75V14.5h-9V1.5Z" />
      <path className="vs-icon-file-fold" d="M9.5 1.75V4.5h2.75" />
      <path className="vs-icon-json" d="M7 6.25H5.9c-.55 0-.75.3-.75.8v.8c0 .55-.2.8-.65.8.45 0 .65.25.65.8v.8c0 .5.2.8.75.8H7M9 6.25h1.1c.55 0 .75.3.75.8v.8c0 .55.2.8.65.8-.45 0-.65.25-.65.8v.8c0 .5-.2.8-.75.8H9" />
    </TreeIcon>
  );
}

export function VisualStudioDockerfileIcon({ className }: VisualStudioIconProps) {
  return (
    <TreeIcon className={cn("vs-dockerfile-icon", className)}>
      <path className="vs-icon-docker" d="M1 8.1h11.1c.1-.8.55-1.45 1.25-1.9.2.55.25 1.05.15 1.5.65-.05 1.2.05 1.6.25-.6.9-1.45 1.35-2.55 1.35C12 12.05 9.85 13.5 6.7 13.5 3.6 13.5 1.7 11.7 1 8.1Zm1.2-2.2h2v1.8h-2V5.9Zm2.3 0h2v1.8h-2V5.9Zm2.3 0h2v1.8h-2V5.9Zm2.3 0h2v1.8h-2V5.9ZM4.5 3.7h2v1.8h-2V3.7Zm2.3 0h2v1.8h-2V3.7Zm0-2.2h2v1.8h-2V1.5Z" />
      <circle className="vs-icon-docker-eye" cx="3.05" cy="9.55" r=".5" />
    </TreeIcon>
  );
}
