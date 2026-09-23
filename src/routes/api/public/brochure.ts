import { createFileRoute } from "@tanstack/react-router";

const BROCHURE_URL =
  "https://id-preview--1496482b-f215-415f-8c3e-1502f7cbb8ed.lovable.app/__l5e/assets-v1/1f0afd9c-484e-4ed6-afc7-e170ede1ee7a/mysmallthings-brochure.pdf";

export const Route = createFileRoute("/api/public/brochure")({
  server: {
    handlers: {
      GET: async () => {
        const brochure = await fetch(BROCHURE_URL);

        if (!brochure.ok || !brochure.body) {
          return new Response("Brochure is temporarily unavailable", { status: 502 });
        }

        return new Response(brochure.body, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="mysmallthings-brochure.pdf"',
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});