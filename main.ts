import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "",
  version: "",
});

server.tool(
  "fetch weather",
  "Fetch weather",
  {
    city: z.string().describe("City name"),
  },
  async ({ city }) => {
    const api =  `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`;
    const response = await fetch(api);
    const data = await response.json();
    const latitude = data.results[0].latitude;
    const longitude = data.results[0].longitude;
    return {
      content: [
        {
          type: "text",
            text: `The latitude and longitude of ${city} are ${latitude} and ${longitude}, respectively.`,
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
