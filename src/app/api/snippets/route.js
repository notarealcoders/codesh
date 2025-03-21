import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const snippets = await prisma.codeSnippet.findMany();
    return Response.json(snippets);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const snippet = await prisma.codeSnippet.create({
      data: {
        title: data.title,
        code: data.code,
        language: data.language,
        liveCode: data.code,
      },
    });
    return Response.json(snippet);
  } catch (error) {
    console.error("Error creating snippet:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
