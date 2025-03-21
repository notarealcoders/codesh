import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const versions = await prisma.snippetVersion.findMany({
      where: { snippetId: id },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(versions);
  } catch (error) {
    console.error(`Error fetching versions for snippet ${params.id}:`, error);
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

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { code } = await request.json();
    const version = await prisma.snippetVersion.create({
      data: {
        snippetId: id,
        code,
      },
    });
    return Response.json(version);
  } catch (error) {
    console.error(`Error creating version for snippet ${params.id}:`, error);
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
