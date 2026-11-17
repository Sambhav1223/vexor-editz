export interface Tool {
  name: string;
  role: string;
  badge: "ae" | "pr" | "topaz" | "flowframes";
}

export const tools: Tool[] = [
  { name: "Adobe After Effects 2024", role: "Motion graphics and compositing", badge: "ae" },
  { name: "Adobe Premiere Pro 2024", role: "Editing and sequencing", badge: "pr" },
  { name: "Topaz Video AI", role: "Upscaling and enhancement", badge: "topaz" },
  { name: "Flowframes", role: "Frame interpolation", badge: "flowframes" },
];
