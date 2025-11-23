import { defineConfig } from "vite";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Plugin to rebuild on source changes
function rebuildPlugin() {
	return {
		name: "rebuild-on-source-change",
		async handleHotUpdate({ file, server }) {
			if (file.includes("src\\") && (file.endsWith(".njk") || file.endsWith(".css") || file.endsWith(".yaml"))) {
				console.log(`\n🔨 Rebuilding due to: ${file.split("src\\")[1]}`);
				try {
					await execAsync("node scripts/build.js");
					console.log("✅ Build complete");
					// Force full reload
					server.ws.send({ type: "full-reload" });
				} catch (error) {
					console.error("❌ Build failed:", error.message);
				}
			}
		},
	};
}

export default defineConfig({
	root: ".tmp",
	server: {
		port: 8080,
		open: true,
	},
	plugins: [rebuildPlugin()],
});
