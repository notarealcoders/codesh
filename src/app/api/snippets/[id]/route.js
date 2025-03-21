import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const awaitedParams = await params; // Await params
    const { id } = awaitedParams; // Access id safely
    console.log(`Fetching snippet with ID: ${id}`);
    const snippet = await prisma.codeSnippet.findUnique({
      where: { id },
    });
    if (!snippet) {
      console.log(`Snippet ${id} not found`);
      return new Response(JSON.stringify({ error: "Snippet not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log(`Snippet ${id} fetched successfully:`, snippet);
    return Response.json(snippet);
  } catch (error) {
    console.error(`Error fetching snippet ${params.id}:`, error); // Use awaited id in catch if needed
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const awaitedParams = await params; // Await params
    const { id } = awaitedParams; // Access id safely
    const { liveCode } = await request.json();
    console.log(`Updating snippet ${id} with liveCode:`, liveCode);

    const snippetExists = await prisma.codeSnippet.findUnique({
      where: { id },
    });
    if (!snippetExists) {
      console.log(`Snippet ${id} not found for update`);
      return new Response(JSON.stringify({ error: "Snippet not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const snippet = await prisma.codeSnippet.update({
      where: { id },
      data: { liveCode },
    });
    console.log(`Snippet ${id} updated successfully:`, snippet);
    return Response.json(snippet);
  } catch (error) {
    console.error(`Error updating snippet ${params.id}:`, error); // Use awaited id in catch if needed
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
