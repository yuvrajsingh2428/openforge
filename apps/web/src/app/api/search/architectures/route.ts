import { standardResponse } from "@/lib/api-helper";

const ARCHITECTURES = [
  "Monorepo",
  "Microservices",
  "MVC",
  "Clean Architecture",
  "CLI",
  "Library"
];

/**
 * @openapi
 * /api/search/architectures:
 *   get:
 *     summary: Retrieve list of supported architectural patterns
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET() {
  return standardResponse(ARCHITECTURES);
}
