import { defineConfig } from "vite";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

function rebuildPlugin() {
	let isBuilding = false;
	
	return {
		name: "rebuild-on-source-change",
		configureServer(server) {
			server.watcher.add(path.resolve(__dirname, "src"));
			
			server.watcher.on("change", async (file) => {
				const isSourceFile = file.includes("/src/") || file.includes("\\src\\");
				const isRelevant = /\.(njk|yaml|css)$/.test(file);
				
				if (isSourceFile && isRelevant && !isBuilding) {
					isBuilding = true;
					console.log(`\n🔨 Rebuilding: ${path.basename(file)}`);
					
					try {
						await execAsync("node scripts/build.js");
						console.log("✅ Build complete");
						server.ws.send({ type: "full-reload", path: "*" });
					} catch (error) {
						console.error("❌ Build failed:", error.message);
					} finally {
						isBuilding = false;
					}
				}
			});
		},
	};
}

export default defineConfig({
	root: ".tmp",
	server: { port: 8080, open: true },
	plugins: [rebuildPlugin()],
});
